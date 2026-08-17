"""Validate editorial learning cards against the extracted official corpus."""

from __future__ import annotations

import json
import re
import itertools
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CORPUS = ROOT / "data" / "articles.it.json"
EDITORIAL_DIR = ROOT / "data" / "editorial"
CASES = ROOT / "data" / "cases.it.json"
GLOSSARY = ROOT / "data" / "glossary.it.json"
CROSS_REFERENCES = ROOT / "data" / "cross_references.it.json"
I18N_DIR = ROOT / "data" / "i18n"
LANGUAGE_MANIFEST = I18N_DIR / "languages.json"
TERMINOLOGY_SOURCES = I18N_DIR / "terminology-sources.json"
EDITORIAL_NAME = re.compile(r"articles\.(\d{2})-(\d{2})\.it\.json$")


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> None:
    corpus = load_json(CORPUS)
    cases = load_json(CASES)
    glossary = load_json(GLOSSARY)
    cross_references = load_json(CROSS_REFERENCES)
    language_manifest = load_json(LANGUAGE_MANIFEST)
    terminology_sources = load_json(TERMINOLOGY_SOURCES)
    editorial_files = sorted(EDITORIAL_DIR.glob("articles.*.it.json"))
    assert editorial_files, "No editorial datasets found"

    official_by_number = {
        article["number"]: article["official_text"]
        for article in corpus["articles"]
    }
    case_ids = {case["id"] for case in cases["cases"]}

    unit_ids: set[str] = set()
    flashcard_ids: set[str] = set()
    article_numbers: set[int] = set()
    article_count = 0
    case_link_count = 0
    source_definitions: dict[str, tuple[object, ...]] = {}
    allowed_case_roles = {
        "violazione_accertata",
        "violazione_accertata_con_altri_profili",
        "collegamento_giurisprudenziale",
        "controesempio",
        "caso_adiacente",
        "esito_processuale_non_di_merito",
        "limite_probatorio",
    }
    expected_flashcard_types = {
        "richiamo",
        "scenario",
        "discriminazione",
        "collegamento",
    }

    for editorial_file in editorial_files:
        match = EDITORIAL_NAME.fullmatch(editorial_file.name)
        assert match, f"Unexpected editorial filename: {editorial_file.name}"
        first, last = map(int, match.groups())
        editorial = load_json(editorial_file)
        source_ids = {source["id"] for source in editorial["source_catalog"]}
        cards = editorial["articles"]
        expected_numbers = list(range(first, last + 1))

        assert [card["number"] for card in cards] == expected_numbers, (
            f"{editorial_file.name}: article range does not match filename"
        )
        assert not any("_append_marker" in card for card in cards)

        for source in editorial["source_catalog"]:
            source_core = tuple(
                source.get(field)
                for field in ("authority", "title", "url", "local_file", "kind")
            )
            previous = source_definitions.setdefault(source["id"], source_core)
            assert previous == source_core, (
                f"Source {source['id']}: inconsistent catalog definition in "
                f"{editorial_file.name}"
            )
            if local_file := source.get("local_file"):
                assert (ROOT / local_file).is_file(), (
                    f"{editorial_file.name}: missing local source {local_file}"
                )

        for card in cards:
            number = card["number"]
            assert number not in article_numbers, (
                f"Article {number}: duplicated across editorial datasets"
            )
            article_numbers.add(number)
            article_count += 1
            official_text = official_by_number[number]
            assert card["official_text"] == official_text, (
                f"Article {number}: editorial official_text differs from corpus"
            )
            assert card["title_is_official"] is False
            assert card["review"]["status"] == "draft"

            cursor = 0
            uncovered = []
            for unit in card["meaning_units"]:
                assert unit["id"] not in unit_ids
                unit_ids.add(unit["id"])
                fragment = unit["official_fragment"]
                position = official_text.find(fragment, cursor)
                assert position >= 0, (
                    f"Article {number}: fragment {unit['id']} is not verbatim"
                )
                uncovered.append(official_text[cursor:position])
                cursor = position + len(fragment)
            uncovered.append(official_text[cursor:])
            uncovered_substance = re.sub(
                r"[\s,;.:]+", "", "".join(uncovered)
            )
            assert not uncovered_substance, (
                f"Article {number}: units leave substantive text uncovered: "
                f"{uncovered_substance!r}"
            )

            for source_id in card["source_ids"]:
                assert source_id in source_ids, (
                    f"Article {number}: unknown source {source_id}"
                )
            for connection in card["legal_connections"]:
                assert connection["source_id"] in source_ids
            for case_link in card["real_case_links"]:
                assert case_link["case_id"] in case_ids, (
                    f"Article {number}: unknown case {case_link['case_id']}"
                )
                assert case_link["role"] in allowed_case_roles, (
                    f"Article {number}: unsupported case role "
                    f"{case_link['role']}"
                )
                if case_link["role"].startswith("violazione_accertata"):
                    case = next(
                        item for item in cases["cases"]
                        if item["id"] == case_link["case_id"]
                    )
                    assert number in case.get("articles_found_violated", []), (
                        f"Article {number}: case {case_link['case_id']} is marked "
                        "as an established violation but the case record does not "
                        "list that article"
                    )
                case_link_count += 1

            flashcards = card["flashcards"]
            assert len(flashcards) == 4
            assert {
                item["type"] for item in flashcards
            } == expected_flashcard_types
            for flashcard in flashcards:
                assert flashcard["id"] not in flashcard_ids
                flashcard_ids.add(flashcard["id"])

    missing_articles = set(official_by_number) - article_numbers
    extra_articles = article_numbers - set(official_by_number)
    assert not missing_articles, (
        f"Editorial coverage is incomplete; missing articles: "
        f"{sorted(missing_articles)}"
    )
    assert not extra_articles, (
        f"Editorial datasets contain unknown articles: {sorted(extra_articles)}"
    )
    editorial_by_number = {
        card["number"]: card
        for editorial_file in editorial_files
        for card in load_json(editorial_file)["articles"]
    }

    category_ids = [item["id"] for item in glossary["categories"]]
    assert len(category_ids) == len(set(category_ids)), (
        "Glossary category IDs are not unique"
    )
    entry_ids = [item["id"] for item in glossary["entries"]]
    assert len(entry_ids) == len(set(entry_ids)), "Glossary entry IDs are not unique"
    entries_by_id = {item["id"]: item for item in glossary["entries"]}
    for entry in glossary["entries"]:
        assert entry["category"] in category_ids, (
            f"Glossary {entry['id']}: unknown category {entry['category']}"
        )
        assert entry["definition_it"].strip()
        assert entry["translation_note"].strip()
        assert set(entry["related_articles"]) <= set(official_by_number), (
            f"Glossary {entry['id']}: unknown related article"
        )

    annotation_blocks = glossary["article_annotations"]
    assert [item["article"] for item in annotation_blocks] == sorted(
        official_by_number
    ), "Glossary annotations must cover articles 1-42 exactly once and in order"
    annotation_count = 0
    used_entry_ids: set[str] = set()
    for block in annotation_blocks:
        number = block["article"]
        official_text = official_by_number[number]
        seen_annotations: set[tuple[str, str]] = set()
        assert block["annotations"], (
            f"Article {number}: at least one glossary annotation is required"
        )
        for annotation in block["annotations"]:
            glossary_id = annotation["glossary_id"]
            surface = annotation["surface"]
            assert glossary_id in entries_by_id, (
                f"Article {number}: unknown glossary entry {glossary_id}"
            )
            assert surface and surface in official_text, (
                f"Article {number}: glossary surface is not verbatim: {surface!r}"
            )
            key = (glossary_id, surface)
            assert key not in seen_annotations, (
                f"Article {number}: duplicate glossary annotation {key}"
            )
            seen_annotations.add(key)
            assert number in entries_by_id[glossary_id]["related_articles"], (
                f"Glossary {glossary_id}: article {number} is annotated but not "
                "listed in related_articles"
            )
            used_entry_ids.add(glossary_id)
            annotation_count += 1
    assert used_entry_ids == set(entry_ids), (
        "Glossary contains entries that are not anchored in official text: "
        f"{sorted(set(entry_ids) - used_entry_ids)}"
    )

    cluster_ids = [item["id"] for item in cross_references["clusters"]]
    assert len(cluster_ids) == len(set(cluster_ids)), (
        "Cross-reference cluster IDs are not unique"
    )
    cross_reference_coverage: set[int] = set()
    for cluster in cross_references["clusters"]:
        articles = cluster["articles"]
        assert len(articles) >= 2
        assert len(articles) == len(set(articles)), (
            f"Cross-reference {cluster['id']}: duplicate article"
        )
        assert set(articles) <= set(official_by_number), (
            f"Cross-reference {cluster['id']}: unknown article"
        )
        assert cluster["consistency_rule"].strip()
        assert len(cluster["distinctions"]) >= 2
        assert all(item.strip() for item in cluster["distinctions"])
        cross_reference_coverage.update(articles)
    assert cross_reference_coverage == set(official_by_number), (
        "Cross-reference clusters do not cover all official articles; missing: "
        f"{sorted(set(official_by_number) - cross_reference_coverage)}"
    )

    direct_links = cross_references["direct_links"]
    direct_link_ids = [item["id"] for item in direct_links]
    assert len(direct_link_ids) == len(set(direct_link_ids)), (
        "Direct cross-link IDs are not unique"
    )
    for direct_link in direct_links:
        articles = direct_link["articles"]
        assert len(articles) >= 2
        assert len(articles) == len(set(articles)), (
            f"Direct link {direct_link['id']}: duplicate article"
        )
        assert set(articles) <= set(official_by_number), (
            f"Direct link {direct_link['id']}: unknown article"
        )
        assert direct_link["relation"].strip()

    expected_languages = {"it", "en", "es", "ro", "sq", "ar", "fa"}
    manifest_languages = {item["code"] for item in language_manifest["languages"]}
    assert manifest_languages == expected_languages
    assert language_manifest["default_language"] == "it"
    assert {
        item["code"]: item["direction"]
        for item in language_manifest["languages"]
        if item["code"] != "it"
    } == {
        "en": "ltr", "es": "ltr", "ro": "ltr", "sq": "ltr",
        "ar": "rtl", "fa": "rtl",
    }
    terminology_language_coverage = {
        language
        for source in terminology_sources["sources"]
        for language in source["languages"]
    }
    assert expected_languages <= terminology_language_coverage

    localized_annotation_count = 0
    resolved_annotation_count = 0
    unresolved_by_language: dict[str, int] = {}
    for language in sorted(expected_languages - {"it"}):
        articles_path = I18N_DIR / language / f"articles.{language}.json"
        glossary_path = I18N_DIR / language / f"glossary.{language}.json"
        cases_path = I18N_DIR / language / f"cases.{language}.json"
        localized = load_json(articles_path)
        localized_glossary = load_json(glossary_path)
        localized_cases = load_json(cases_path)
        assert localized["language"] == language
        assert localized_glossary["language"] == language
        assert localized_cases["language"] == language
        expected_direction = "rtl" if language in {"ar", "fa"} else "ltr"
        assert localized["direction"] == expected_direction
        assert localized_glossary["direction"] == expected_direction
        assert localized["translation_status"] in {
            "machine_draft_needs_native_legal_review",
            "partial_editorial_translation",
            "editorial_translation",
        }
        assert [item["number"] for item in localized["articles"]] == list(range(1, 43))
        localized_entries = {
            item["id"]: item for item in localized_glossary["entries"]
        }
        assert set(localized_entries) == set(entry_ids)
        assert all(item["term"].strip() for item in localized_entries.values())
        assert all(len(item["term"]) <= 120 for item in localized_entries.values())
        unresolved = 0
        assert [item["id"] for item in localized_cases["cases"]] == [
            item["id"] for item in cases["cases"]
        ]
        assert sum(
            len(item["localized_article_notes"])
            for item in localized_cases["cases"]
        ) == case_link_count
        for localized_case, italian_case in zip(
            localized_cases["cases"], cases["cases"], strict=True
        ):
            source = localized_case["italian_source"]
            assert source["summary"] == italian_case["summary"]
            assert source["outcome"] == italian_case["outcome"]
            assert source["source"] == italian_case["source"]
        for item in localized["articles"]:
            number = item["number"]
            assert item["italian_source"]["official_text"] == official_by_number[number]
            assert item["italian_source"]["display_position"] == "always_first"
            local = item["localized"]
            assert local["article_text"].strip()
            assert "\ufffd" not in local["article_text"]
            repeated_run = max(
                (
                    sum(1 for _ in group)
                    for _, group in itertools.groupby(
                        re.findall(r"\w+", local["article_text"].casefold())
                    )
                ),
                default=0,
            )
            assert repeated_run < 6, (
                f"{language} article {number}: suspicious repeated-word run"
            )
            assert local["core_message"].strip()
            assert len(local["meaning_units"]) == len(
                editorial_by_number[number]["meaning_units"]
            )
            assert len(local["flashcards"]) == 4
            for flashcard in local["flashcards"]:
                assert flashcard["front"].strip() and flashcard["back"].strip()
                assert flashcard["italian_official_anchor"].strip()
            for annotation in local["glossary_annotations"]:
                localized_annotation_count += 1
                assert annotation["glossary_id"] in localized_entries
                assert annotation["italian_surface"] in official_by_number[number]
                assert annotation["popup_mode"] == "show_italian_term"
                if annotation["match_status"] in {
                    "exact_in_localized_article",
                    "terminology_enforced_exact_in_localized_article",
                }:
                    assert annotation["surface"] in local["article_text"]
                    assert annotation["occurrences"] >= 1
                    resolved_annotation_count += 1
                else:
                    assert annotation["match_status"] == (
                        "unresolved_needs_language_review"
                    )
                    assert annotation["surface"] is None
                    assert annotation["localized_term"].strip()
                    unresolved += 1
        unresolved_by_language[language] = unresolved

    print(
        "validated: "
        f"{len(editorial_files)} files, {article_count} articles, "
        f"{len(unit_ids)} meaning units, "
        f"{len(flashcard_ids)} flashcards, "
        f"{case_link_count} case links, "
        f"{len(entry_ids)} glossary entries, "
        f"{annotation_count} glossary annotations, "
        f"{len(cluster_ids)} cross-reference clusters, "
        f"{len(direct_links)} direct links, "
        f"6 localized article sets, "
        f"{resolved_annotation_count}/{localized_annotation_count} localized "
        f"popup anchors resolved; unresolved {unresolved_by_language}"
    )


if __name__ == "__main__":
    main()
