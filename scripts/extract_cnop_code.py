"""Extract the current CNOP ethics code from the saved official HTML page.

The script deliberately preserves the wording published by CNOP, including apparent
typographical errors. The ``segments`` field is an editorial aid, not a legal
subdivision of the Code, and must be reviewed before comments are authored.
"""

from __future__ import annotations

import json
import re
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "research" / "sources" / "cnop-codice-vigente-2025-03-24.html"
OUTPUT = ROOT / "data" / "articles.it.json"
SOURCE_URL = (
    "https://www.psy.it/la-professione-psicologica/"
    "codice-deontologico-degli-psicologi-italiani/codice-deontologico-vigente/"
)


class ParagraphParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.section_depth = 0
        self.paragraph_depth = 0
        self.paragraph_parts: list[str] = []
        self.paragraphs: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_map = dict(attrs)
        if tag == "section" and "entry-content" in (attr_map.get("class") or "").split():
            self.section_depth = 1
            return
        if self.section_depth:
            if tag == "section":
                self.section_depth += 1
            elif tag == "p":
                self.paragraph_depth += 1
                if self.paragraph_depth == 1:
                    self.paragraph_parts = []

    def handle_endtag(self, tag: str) -> None:
        if not self.section_depth:
            return
        if tag == "p" and self.paragraph_depth:
            if self.paragraph_depth == 1:
                text = re.sub(r"\s+", " ", "".join(self.paragraph_parts)).strip()
                if text:
                    self.paragraphs.append(text)
            self.paragraph_depth -= 1
        elif tag == "section":
            self.section_depth -= 1

    def handle_data(self, data: str) -> None:
        if self.section_depth and self.paragraph_depth:
            self.paragraph_parts.append(data)


def editorial_segments(text: str) -> list[dict[str, str | int]]:
    """Create draft meaning units at sentence and semicolon boundaries."""

    pieces = re.split(r"(?<=[.;!?])(?=\s|[A-ZÀ-Ö])", text)
    cleaned = [piece.strip() for piece in pieces if piece.strip()]
    return [
        {
            "id": f"s{index}",
            "text": piece,
            "segmentation_status": "auto_draft_needs_legal_editor_review",
        }
        for index, piece in enumerate(cleaned, start=1)
    ]


def extract() -> dict[str, object]:
    parser = ParagraphParser()
    parser.feed(SOURCE.read_text(encoding="utf-8"))

    current_chapter: str | None = None
    articles: list[dict[str, object]] = []
    index = 0
    paragraphs = parser.paragraphs

    while index < len(paragraphs):
        paragraph = paragraphs[index]
        if paragraph.startswith("Capo "):
            current_chapter = paragraph
            index += 1
            continue

        match = re.fullmatch(r"Articolo (\d+)", paragraph)
        if not match:
            index += 1
            continue

        number = int(match.group(1))
        body_parts: list[str] = []
        index += 1
        while index < len(paragraphs):
            following = paragraphs[index]
            if following.startswith("Capo ") or re.fullmatch(r"Articolo \d+", following):
                break
            body_parts.append(following)
            index += 1

        text = "\n\n".join(body_parts).strip()
        articles.append(
            {
                "number": number,
                "chapter": current_chapter,
                "official_title": None,
                "official_text": text,
                "official_paragraphs": body_parts,
                "segments": editorial_segments(text),
                "commentary_it": {
                    "status": "not_started",
                    "plain_language_summary": None,
                    "segment_comments": [],
                    "legal_links": [],
                    "sources": [],
                },
                "examples": [],
                "real_cases": [],
            }
        )

    numbers = [article["number"] for article in articles]
    expected = list(range(1, 43))
    if numbers != expected:
        raise ValueError(f"Expected articles 1-42 in order, found {numbers}")
    if any(not article["official_text"] for article in articles):
        raise ValueError("One or more articles have no text")

    return {
        "dataset": "Codice Deontologico degli Psicologi Italiani",
        "language": "it",
        "legal_status": {
            "status": "vigente",
            "effective_from": "2024-12-24",
            "basis": "Ripristino del testo previgente dopo Consiglio di Stato n. 10376/2024",
            "checked_on": "2026-08-13",
            "future_revision_expected": True,
        },
        "source": {
            "publisher": "Consiglio Nazionale dell'Ordine degli Psicologi (CNOP)",
            "url": SOURCE_URL,
            "saved_snapshot": SOURCE.relative_to(ROOT).as_posix(),
            "page_date_modified": "2025-03-24",
            "retrieved_on": "2026-08-13",
        },
        "editorial_notice": (
            "Il testo ufficiale è conservato come pubblicato dalla fonte CNOP, incluse eventuali "
            "imperfezioni tipografiche. I segmenti sono unità redazionali provvisorie e non commi "
            "ufficiali. Commenti, traduzioni ed esempi richiedono revisione professionale."
        ),
        "articles": articles,
    }


if __name__ == "__main__":
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(
        json.dumps(extract(), ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print("Wrote data/articles.it.json")
