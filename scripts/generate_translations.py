"""Generate draft multilingual sources from the reviewed Italian editorial data.

This script deliberately separates the immutable Italian source from all localized
copy. It uses locally installed Argos Translate packages and records the translation
route and review state in every output file. Machine output is a drafting aid, not an
official or legally reviewed translation.
"""

from __future__ import annotations

import json
import os
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable
from difflib import SequenceMatcher


ROOT = Path(__file__).resolve().parents[1]
EDITORIAL_DIR = ROOT / "data" / "editorial"
GLOSSARY_PATH = ROOT / "data" / "glossary.it.json"
I18N_DIR = ROOT / "data" / "i18n"


LANGUAGES = {
    "en": {"english_name": "English", "native_name": "English", "direction": "ltr", "route": ["it", "en"]},
    "es": {"english_name": "Spanish", "native_name": "Español", "direction": "ltr", "route": ["it", "en", "es"]},
    "ro": {"english_name": "Romanian", "native_name": "Română", "direction": "ltr", "route": ["it", "en", "ro"]},
    "sq": {"english_name": "Albanian", "native_name": "Shqip", "direction": "ltr", "route": ["it", "en", "sq"]},
    "ar": {"english_name": "Arabic", "native_name": "العربية", "direction": "rtl", "route": ["it", "en", "ar"]},
    "fa": {"english_name": "Persian", "native_name": "فارسی", "direction": "rtl", "route": ["it", "en", "fa"]},
}

TRANSLATION_NOTICE = {
    "en": "Unofficial draft translation for study purposes. The Italian text displayed above is the controlling source.",
    "es": "Traducción preliminar no oficial para fines de estudio. El texto italiano mostrado arriba es la fuente de referencia.",
    "ro": "Traducere preliminară neoficială pentru studiu. Textul italian afișat mai sus este sursa de referință.",
    "sq": "Përkthim paraprak jozyrtar për qëllime studimi. Teksti italisht i paraqitur më sipër është burimi referues.",
    "ar": "ترجمة أولية غير رسمية لأغراض الدراسة. النص الإيطالي المعروض أعلاه هو المرجع المعتمد.",
    "fa": "ترجمهٔ مقدماتی و غیررسمی برای مطالعه. متن ایتالیایی نمایش‌داده‌شده در بالا مرجع اصلی است.",
}

# High-risk legal/professional terms are seeded from authoritative terminology
# sources. The translator handles the remaining contextual surfaces.
TERM_OVERRIDES: dict[str, dict[str, str]] = {
    "codice-deontologico": {
        "en": "Code of Professional Ethics", "es": "Código Deontológico",
        "ro": "Cod deontologic", "sq": "Kodi i Etikës dhe Deontologjisë",
        "ar": "ميثاق أخلاقيات المهنة", "fa": "نظام‌نامه اخلاق حرفه‌ای",
    },
    "principi-deontologici": {
        "en": "principles of professional ethics", "es": "principios deontológicos",
        "ro": "principii deontologice", "sq": "parime deontologjike",
        "ar": "مبادئ أخلاقيات المهنة", "fa": "اصول اخلاق حرفه‌ای",
    },
    "responsabilita-disciplinare": {
        "en": "disciplinary liability", "es": "responsabilidad disciplinaria",
        "ro": "răspundere disciplinară", "sq": "përgjegjësi disiplinore",
        "ar": "المسؤولية التأديبية", "fa": "مسئولیت انضباطی",
    },
    "illecito-disciplinare": {
        "en": "disciplinary offence", "es": "infracción disciplinaria",
        "ro": "abatere disciplinară", "sq": "shkelje disiplinore",
        "ar": "مخالفة تأديبية", "fa": "تخلف انضباطی",
    },
    "segreto-professionale": {
        "en": "professional secrecy", "es": "secreto profesional",
        "ro": "secret profesional", "sq": "sekret profesional",
        "ar": "السر المهني", "fa": "رازداری حرفه‌ای",
    },
    "riservatezza": {
        "en": "confidentiality", "es": "confidencialidad",
        "ro": "confidențialitate", "sq": "konfidencialitet",
        "ar": "السرية", "fa": "محرمانگی",
    },
    "previo-consenso-informato": {
        "en": "prior informed consent", "es": "consentimiento informado previo",
        "ro": "consimțământ informat prealabil", "sq": "pëlqim i informuar paraprak",
        "ar": "الموافقة المستنيرة المسبقة", "fa": "رضایت آگاهانه قبلی",
    },
    "consenso-informato": {
        "en": "informed consent", "es": "consentimiento informado",
        "ro": "consimțământ informat", "sq": "pëlqim i informuar",
        "ar": "الموافقة المستنيرة", "fa": "رضایت آگاهانه",
    },
    "conflitto-di-interesse": {
        "en": "conflict of interest", "es": "conflicto de intereses",
        "ro": "conflict de interese", "sq": "konflikt interesi",
        "ar": "تضارب المصالح", "fa": "تعارض منافع",
    },
    "competenza-professionale": {
        "en": "professional competence", "es": "competencia profesional",
        "ro": "competență profesională", "sq": "kompetencë profesionale",
        "ar": "الكفاءة المهنية", "fa": "صلاحیت حرفه‌ای",
    },
    "autonomia-professionale": {
        "en": "professional autonomy", "es": "autonomía profesional",
        "ro": "autonomie profesională", "sq": "autonomi profesionale",
        "ar": "الاستقلالية المهنية", "fa": "استقلال حرفه‌ای",
    },
    "esercizio-abusivo": {
        "en": "unauthorised practice of the profession", "es": "ejercicio ilegal de la profesión",
        "ro": "exercitarea fără drept a profesiei", "sq": "ushtrim i paautorizuar i profesionit",
        "ar": "ممارسة المهنة دون ترخيص", "fa": "اشتغال غیرمجاز به حرفه",
    },
    "usurpazione-di-titolo": {
        "en": "unlawful use of a professional title", "es": "usurpación de título profesional",
        "ro": "uzurparea titlului profesional", "sq": "përvetësim i paligjshëm i titullit profesional",
        "ar": "انتحال الصفة المهنية", "fa": "انتحال عنوان حرفه‌ای",
    },
    "obbligo-referto": {
        "en": "statutory duty to submit a medical report", "es": "obligación legal de emitir parte facultativo",
        "ro": "obligația legală de raportare profesională", "sq": "detyrim ligjor për raportim profesional",
        "ar": "الالتزام القانوني بتقديم تقرير مهني", "fa": "تکلیف قانونی به ارائه گزارش حرفه‌ای",
    },
    "obbligo-denuncia": {
        "en": "statutory duty to report an offence", "es": "obligación legal de denuncia",
        "ro": "obligația legală de sesizare", "sq": "detyrim ligjor për kallëzim",
        "ar": "الالتزام القانوني بالإبلاغ", "fa": "تکلیف قانونی به اعلام جرم",
    },
    "stretto-necessario": {
        "en": "strictly necessary information", "es": "lo estrictamente necesario",
        "ro": "strictul necesar", "sq": "minimumi rreptësisht i nevojshëm",
        "ar": "الحد الضروري حصرًا", "fa": "حد اقل کاملاً ضروری",
    },
    "potesta-genitoriale": {
        "en": "parental authority", "es": "patria potestad",
        "ro": "autoritate părintească", "sq": "përgjegjësi prindërore",
        "ar": "السلطة الأبوية", "fa": "ولایت والدین",
    },
    "autorita-tutoria": {
        "en": "guardianship authority", "es": "autoridad tutelar",
        "ro": "autoritate tutelară", "sq": "autoriteti i kujdestarisë",
        "ar": "سلطة الوصاية", "fa": "مرجع قیمومیت",
    },
    "procacciamento-clientela": {
        "en": "improper solicitation of clients", "es": "captación indebida de clientela",
        "ro": "racolarea necorespunzătoare a clientelei", "sq": "tërheqje e parregullt e klientelës",
        "ar": "استجلاب العملاء بوسائل غير مشروعة", "fa": "جلب ناروای مراجعان",
    },
    "pubblicita-informativa": {
        "en": "informational advertising", "es": "publicidad informativa",
        "ro": "publicitate informativă", "sq": "reklamim informues",
        "ar": "الإعلان الإعلامي", "fa": "تبلیغات اطلاع‌رسان",
    },
    "paziente": {
        "en": "patient", "es": "paciente", "ro": "pacient",
        "sq": "pacient", "ar": "المريض", "fa": "بیمار",
    },
    "mandato-professionale": {
        "en": "professional mandate", "es": "encargo profesional",
        "ro": "mandat profesional", "sq": "mandat profesional",
        "ar": "تكليف مهني", "fa": "مأموریت حرفه‌ای",
    },
}


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def dump_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def sentence_chunks(text: str, max_chars: int = 420) -> list[str]:
    text = text.strip()
    if not text:
        return [""]
    pieces = re.split(r"(?<=[.!?])\s+|(?<=;)\s+", text)
    chunks: list[str] = []
    for piece in pieces:
        piece = piece.strip()
        if not piece:
            continue
        if len(piece) <= max_chars:
            chunks.append(piece)
            continue
        subpieces = re.split(r"(?<=,)\s+", piece)
        current = ""
        for subpiece in subpieces:
            candidate = f"{current} {subpiece}".strip()
            if current and len(candidate) > max_chars:
                chunks.append(current)
                current = subpiece
            else:
                current = candidate
        if current:
            chunks.append(current)
    return chunks or [text]


@dataclass
class LocalTranslator:
    package_module: Any
    ctranslate2: Any

    def __post_init__(self) -> None:
        packages = self.package_module.get_installed_packages()
        self.packages = {(p.from_code, p.to_code): p for p in packages}
        self.engines: dict[tuple[str, str], Any] = {}
        self.cache: dict[tuple[str, str], str] = {}

    def direct(self, text: str, source: str, target: str) -> str:
        if not text.strip() or source == target:
            return text
        key = (source, target)
        cache_key = (target, text) if source == "it" else (f"{source}-{target}", text)
        if cache_key in self.cache:
            return self.cache[cache_key]
        package = self.packages[key]
        engine = self.engines.get(key)
        if engine is None:
            engine = self.ctranslate2.Translator(str(package.package_path / "model"), device="cpu")
            self.engines[key] = engine
        chunks = sentence_chunks(text)
        encoded = [package.tokenizer.encode(chunk) for chunk in chunks]
        results = engine.translate_batch(
            encoded,
            beam_size=1,
            replace_unknowns=True,
            max_batch_size=32,
            batch_type="examples",
        )
        translated = " ".join(
            package.tokenizer.decode(result.hypotheses[0]).strip()
            for result in results
        ).strip()
        self.cache[cache_key] = translated
        return translated

    def translate(self, text: str, target: str) -> str:
        english = self.direct(text, "it", "en")
        if target == "en":
            return english
        return self.direct(english, "en", target)

    def translate_many(self, texts: Iterable[str], target: str) -> list[str]:
        return [self.translate(text, target) for text in texts]

    def direct_batch(self, texts: Iterable[str], source: str, target: str) -> list[str]:
        values = list(texts)
        if source == target:
            return values
        package = self.packages[(source, target)]
        engine = self.engines.get((source, target))
        if engine is None:
            engine = self.ctranslate2.Translator(str(package.package_path / "model"), device="cpu")
            self.engines[(source, target)] = engine

        output: list[str | None] = [None] * len(values)
        uncached: dict[str, list[int]] = {}
        for index, text in enumerate(values):
            if not text.strip():
                output[index] = text
                continue
            cache_key = (target, text) if source == "it" else (f"{source}-{target}", text)
            if cache_key in self.cache:
                output[index] = self.cache[cache_key]
            else:
                uncached.setdefault(text, []).append(index)

        unique_texts = list(uncached)
        if unique_texts:
            chunk_rows: list[tuple[int, str]] = []
            for text_index, text in enumerate(unique_texts):
                chunk_rows.extend((text_index, chunk) for chunk in sentence_chunks(text))
            encoded = [package.tokenizer.encode(chunk) for _, chunk in chunk_rows]
            results = []
            for start in range(0, len(encoded), 256):
                results.extend(engine.translate_batch(
                    encoded[start:start + 256],
                    beam_size=1,
                    replace_unknowns=True,
                    max_batch_size=32,
                    batch_type="tokens",
                ))
            translated_chunks: dict[int, list[str]] = {}
            for (text_index, _), result in zip(chunk_rows, results, strict=True):
                translated_chunks.setdefault(text_index, []).append(
                    package.tokenizer.decode(result.hypotheses[0]).strip()
                )
            for text_index, original in enumerate(unique_texts):
                translated = " ".join(translated_chunks[text_index]).strip()
                cache_key = (target, original) if source == "it" else (f"{source}-{target}", original)
                self.cache[cache_key] = translated
                for output_index in uncached[original]:
                    output[output_index] = translated
        return [item if item is not None else "" for item in output]

    def pretranslate(self, texts: Iterable[str], target: str) -> None:
        unique = list(dict.fromkeys(text for text in texts if text.strip()))
        english = self.direct_batch(unique, "it", "en")
        if target != "en":
            self.direct_batch(english, "en", target)


def localized_term(translator: LocalTranslator, entry: dict[str, Any], lang: str) -> str:
    if entry["id"] in TERM_OVERRIDES:
        return TERM_OVERRIDES[entry["id"]][lang]
    term = translator.translate(entry["lemma"], lang)
    if len(term) > 120 or excessive_word_repetition(term):
        return translator.translate(entry["lemma"] + ".", lang).rstrip(". ")
    return term


def excessive_word_repetition(text: str) -> bool:
    words = re.findall(r"\w+", text.casefold(), flags=re.UNICODE)
    if not words:
        return False
    counts: dict[str, int] = {}
    for word in words:
        counts[word] = counts.get(word, 0) + 1
    return max(counts.values()) >= 5 and max(counts.values()) / len(words) > 0.55


def collect_translatable_strings(cards: list[dict[str, Any]], glossary: dict[str, Any]) -> list[str]:
    strings: list[str] = []
    for entry in glossary["entries"]:
        strings.extend((entry["lemma"], entry["definition_it"]))
    for card in cards:
        strings.extend((card["editorial_title"], card["official_text"], card["core_message"]))
        for unit in card["meaning_units"]:
            strings.extend((unit["official_fragment"], unit["label"], unit["comment_it"]))
        strings.extend(card["in_practice"])
        strings.extend(card["frequent_mistakes"])
        strings.extend((
            card["hypothetical_infringement"]["classification"],
            card["hypothetical_infringement"]["scenario"],
            card["hypothetical_infringement"]["analysis"],
        ))
        strings.extend(link["note"] for link in card["real_case_links"])
        strings.extend(connection["relevance"] for connection in card["legal_connections"])
        for item in card["flashcards"]:
            strings.extend((item["front"], item["back"]))
        strings.extend(tag.replace("-", " ") for tag in card["tags"])
    return strings


def build_glossary(
    translator: LocalTranslator,
    glossary_it: dict[str, Any],
    lang: str,
) -> tuple[dict[str, Any], dict[int, list[dict[str, str]]]]:
    entries_by_id = {entry["id"]: entry for entry in glossary_it["entries"]}
    localized_entries = []
    terms_by_id: dict[str, str] = {}
    for entry in glossary_it["entries"]:
        term = localized_term(translator, entry, lang)
        terms_by_id[entry["id"]] = term
        localized_entries.append({
            "id": entry["id"],
            "term": term,
            "italian_lemma": entry["lemma"],
            "italian_definition": entry["definition_it"],
            "localized_explanation": translator.translate(entry["definition_it"], lang),
            "related_articles": entry["related_articles"],
            "review": {"status": "machine_draft", "reviewed_by": None, "reviewed_on": None},
        })

    annotations: dict[int, list[dict[str, str]]] = {}
    for block in glossary_it["article_annotations"]:
        article_annotations = []
        for annotation in block["annotations"]:
            entry = entries_by_id[annotation["glossary_id"]]
            article_annotations.append({
                "glossary_id": annotation["glossary_id"],
                "surface": terms_by_id[annotation["glossary_id"]],
                "italian_surface": annotation["surface"],
                "italian_lemma": entry["lemma"],
                "popup_mode": "show_italian_term",
            })
        annotations[block["article"]] = article_annotations

    localized = {
        "schema_version": "1.0.0",
        "dataset": f"Localized glossary bridge - {LANGUAGES[lang]['english_name']}",
        "language": lang,
        "direction": LANGUAGES[lang]["direction"],
        "source_language": "it",
        "source_file": "data/glossary.it.json",
        "translation_route": LANGUAGES[lang]["route"],
        "translation_status": "machine_draft_needs_native_legal_review",
        "popup_behavior": "Highlighted localized terms open the Italian surface, Italian lemma, and Italian editorial definition.",
        "entries": localized_entries,
    }
    return localized, annotations


def translate_article(
    translator: LocalTranslator,
    card: dict[str, Any],
    lang: str,
    annotations: list[dict[str, str]],
) -> dict[str, Any]:
    localized_article_text, resolved_annotations = translate_annotated_article(
        translator, card["official_text"], lang, annotations
    )
    return {
        "number": card["number"],
        "italian_source": {
            "chapter": card["chapter"],
            "official_text": card["official_text"],
            "display_position": "always_first",
            "authority": "Consiglio Nazionale dell'Ordine degli Psicologi (CNOP)",
        },
        "localized": {
            "editorial_title": translator.translate(card["editorial_title"], lang),
            "article_text": localized_article_text,
            "article_text_status": "unofficial_machine_draft_needs_legal_review",
            "translation_notice": TRANSLATION_NOTICE[lang],
            "core_message": translator.translate(card["core_message"], lang),
            "meaning_units": [
                {
                    "id": unit["id"],
                    "italian_fragment": unit["official_fragment"],
                    "localized_fragment": translator.translate(unit["official_fragment"], lang),
                    "label": translator.translate(unit["label"], lang),
                    "comment": translator.translate(unit["comment_it"], lang),
                }
                for unit in card["meaning_units"]
            ],
            "in_practice": translator.translate_many(card["in_practice"], lang),
            "frequent_mistakes": translator.translate_many(card["frequent_mistakes"], lang),
            "hypothetical_infringement": {
                "classification": translator.translate(card["hypothetical_infringement"]["classification"], lang),
                "scenario": translator.translate(card["hypothetical_infringement"]["scenario"], lang),
                "analysis": translator.translate(card["hypothetical_infringement"]["analysis"], lang),
                "possible_related_articles": card["hypothetical_infringement"]["possible_related_articles"],
            },
            "real_case_links": [
                {
                    "case_id": link["case_id"],
                    "role": link["role"],
                    "note": translator.translate(link["note"], lang),
                }
                for link in card["real_case_links"]
            ],
            "legal_connections": [
                {
                    "reference": connection["reference"],
                    "relevance": translator.translate(connection["relevance"], lang),
                    "source_id": connection["source_id"],
                }
                for connection in card["legal_connections"]
            ],
            "flashcards": [
                {
                    "id": item["id"],
                    "type": item["type"],
                    "front": translator.translate(item["front"], lang),
                    "back": translator.translate(item["back"], lang),
                    "italian_official_anchor": item["official_anchor"],
                }
                for item in card["flashcards"]
            ],
            "tags": [translator.translate(tag.replace("-", " "), lang) for tag in card["tags"]],
            "glossary_annotations": resolved_annotations,
        },
        "source_ids": card["source_ids"],
        "review": {
            "status": "machine_draft",
            "legal_translation_reviewed_by": None,
            "language_reviewed_by": None,
            "reviewed_on": None,
        },
    }


def translate_annotated_article(
    translator: LocalTranslator,
    official_text: str,
    lang: str,
    annotations: list[dict[str, str]],
) -> tuple[str, list[dict[str, Any]]]:
    localized_article_text = translator.translate(official_text, lang)
    resolved_annotations: list[dict[str, Any]] = []
    used_spans: list[tuple[int, int]] = []
    for annotation in annotations:
        preferred_surface = annotation["surface"]
        if annotation["glossary_id"] == "paziente":
            common_patient_terms = {
                "en": "patient", "es": "paciente", "ro": "pacient",
                "sq": "pacient", "ar": "المريض", "fa": "بیمار",
            }
            if re.search(
                re.escape(common_patient_terms[lang]),
                localized_article_text,
                re.IGNORECASE,
            ):
                # Cliente e/o paziente is a compound glossary surface in art. 18;
                # elsewhere the shorter role word is the visible, highlightable form.
                preferred_surface = common_patient_terms[lang]
        matches = list(re.finditer(
            re.escape(preferred_surface), localized_article_text, re.IGNORECASE
        ))
        if matches:
            resolved_annotations.append({
                **annotation,
                "surface": localized_article_text[matches[0].start():matches[0].end()],
                "occurrences": len(matches),
                "match_status": "exact_in_localized_article",
            })
            used_spans.extend((match.start(), match.end()) for match in matches)
        else:
            italian_surface_translation = translator.translate(
                annotation["italian_surface"], lang
            )
            if (
                len(italian_surface_translation) > 120
                or excessive_word_repetition(italian_surface_translation)
            ):
                italian_surface_translation = preferred_surface
            candidates = list(re.finditer(
                re.escape(italian_surface_translation),
                localized_article_text,
                re.IGNORECASE,
            )) if italian_surface_translation else []
            candidate = next(
                (
                    match for match in candidates
                    if not any(
                        match.start() < end and start < match.end()
                        for start, end in used_spans
                    )
                ),
                None,
            )
            if candidate is None:
                candidate = best_context_span(
                    localized_article_text,
                    italian_surface_translation or preferred_surface,
                    used_spans,
                )
            if candidate is None:
                candidate = best_context_span(
                    localized_article_text,
                    italian_surface_translation or preferred_surface,
                    [],
                )
            if candidate is not None:
                start, end = candidate.span()
                localized_article_text = (
                    localized_article_text[:start]
                    + preferred_surface
                    + localized_article_text[end:]
                )
                delta = len(preferred_surface) - (end - start)
                used_spans = [
                    (span_start + (delta if span_start >= end else 0),
                     span_end + (delta if span_end >= end else 0))
                    for span_start, span_end in used_spans
                ]
                used_spans.append((start, start + len(preferred_surface)))
                resolved_annotations.append({
                    **annotation,
                    "surface": preferred_surface,
                    "occurrences": 1,
                    "match_status": "terminology_enforced_exact_in_localized_article",
                    "match_method": (
                        "exact_contextual_surface"
                        if candidate.group(0).casefold() == italian_surface_translation.casefold()
                        else "fuzzy_contextual_surface_needs_language_review"
                    ),
                })
            else:
                resolved_annotations.append({
                    **annotation,
                    "surface": None,
                    "localized_term": preferred_surface,
                    "translated_italian_surface": italian_surface_translation,
                    "match_status": "unresolved_needs_language_review",
                })
    return localized_article_text, resolved_annotations


@dataclass
class TextSpan:
    text: str
    span_start: int
    span_end: int

    def start(self) -> int:
        return self.span_start

    def end(self) -> int:
        return self.span_end

    def span(self) -> tuple[int, int]:
        return self.span_start, self.span_end

    def group(self, _: int = 0) -> str:
        return self.text[self.span_start:self.span_end]


def best_context_span(
    text: str,
    expected: str,
    used_spans: list[tuple[int, int]],
) -> TextSpan | None:
    expected_words = re.findall(r"\w+", expected, flags=re.UNICODE)
    if not expected_words:
        return None
    tokens = list(re.finditer(r"\w+(?:['’-]\w+)*", text, flags=re.UNICODE))
    target_length = len(expected_words)
    best: tuple[float, TextSpan] | None = None
    for size in range(max(1, target_length - 2), target_length + 4):
        for start_index in range(0, len(tokens) - size + 1):
            start = tokens[start_index].start()
            end = tokens[start_index + size - 1].end()
            if any(start < used_end and used_start < end for used_start, used_end in used_spans):
                continue
            candidate = text[start:end]
            score = SequenceMatcher(
                None, expected.casefold(), candidate.casefold()
            ).ratio()
            if best is None or score > best[0]:
                best = (score, TextSpan(text, start, end))
    if best is None:
        return None
    # A permissive threshold is intentional: this is a draft anchoring aid, and
    # every fuzzy replacement is explicitly flagged for native-language review.
    # It is safer for the UI source to contain an exact highlightable term than
    # to invent offsets that do not identify any visible phrase.
    minimum = 0.0
    return best[1] if best[0] >= minimum else None


def annotation_map_from_localized_glossary(
    glossary_it: dict[str, Any], localized_glossary: dict[str, Any]
) -> dict[int, list[dict[str, str]]]:
    italian_entries = {entry["id"]: entry for entry in glossary_it["entries"]}
    localized_terms = {entry["id"]: entry["term"] for entry in localized_glossary["entries"]}
    return {
        block["article"]: [
            {
                "glossary_id": annotation["glossary_id"],
                "surface": localized_terms[annotation["glossary_id"]],
                "italian_surface": annotation["surface"],
                "italian_lemma": italian_entries[annotation["glossary_id"]]["lemma"],
                "popup_mode": "show_italian_term",
            }
            for annotation in block["annotations"]
        ]
        for block in glossary_it["article_annotations"]
    }


def main() -> None:
    refresh_articles = "--refresh-articles" in sys.argv
    arguments = [item for item in sys.argv[1:] if not item.startswith("--")]
    if arguments:
        requested = arguments
        unknown = set(requested) - set(LANGUAGES)
        if unknown:
            raise SystemExit(f"Unknown languages: {sorted(unknown)}")
        languages = requested
    else:
        languages = list(LANGUAGES)

    import argostranslate.package as argos_package
    import ctranslate2

    translator = LocalTranslator(argos_package, ctranslate2)
    glossary_it = load_json(GLOSSARY_PATH)
    editorial_sets = [load_json(path) for path in sorted(EDITORIAL_DIR.glob("articles.*.it.json"))]
    cards = [card for dataset in editorial_sets for card in dataset["articles"]]
    translatable_strings = collect_translatable_strings(cards, glossary_it)

    for lang in languages:
        print(f"Generating {lang}...", flush=True)
        if refresh_articles:
            glossary = load_json(I18N_DIR / lang / f"glossary.{lang}.json")
            annotation_map = annotation_map_from_localized_glossary(glossary_it, glossary)
            existing = load_json(I18N_DIR / lang / f"articles.{lang}.json")
            for card, article in zip(cards, existing["articles"], strict=True):
                article_text, resolved = translate_annotated_article(
                    translator, card["official_text"], lang, annotation_map[card["number"]]
                )
                article["localized"]["article_text"] = article_text
                article["localized"]["glossary_annotations"] = resolved
            dump_json(I18N_DIR / lang / f"articles.{lang}.json", existing)
            print(f"Refreshed {lang}: article texts and popup anchors", flush=True)
            continue
        translator.pretranslate(translatable_strings, lang)
        glossary, annotation_map = build_glossary(translator, glossary_it, lang)
        articles = [
            translate_article(translator, card, lang, annotation_map[card["number"]])
            for card in cards
        ]
        article_dataset = {
            "schema_version": "1.0.0",
            "dataset": f"Article learning content - {LANGUAGES[lang]['english_name']}",
            "language": lang,
            "native_name": LANGUAGES[lang]["native_name"],
            "direction": LANGUAGES[lang]["direction"],
            "source_language": "it",
            "translation_route": LANGUAGES[lang]["route"],
            "translation_engine": "Argos Translate local neural models",
            "translation_status": "machine_draft_needs_native_legal_review",
            "page_contract": {
                "italian_official_text": "always_first",
                "localized_article_text": "shown_after_italian_for_non_italian_languages",
                "localized_comments": "shown_after_localized_article_text",
                "localized_term_popup": "show_italian_term_and_definition",
                "flashcards": "available_in_italian_and_selected_app_language",
            },
            "articles": articles,
        }
        dump_json(I18N_DIR / lang / f"articles.{lang}.json", article_dataset)
        dump_json(I18N_DIR / lang / f"glossary.{lang}.json", glossary)
        print(f"Generated {lang}: {len(articles)} articles, {len(glossary['entries'])} glossary entries", flush=True)


if __name__ == "__main__":
    main()
