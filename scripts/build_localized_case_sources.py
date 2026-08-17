"""Consolidate translated case notes already present in localized articles."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LANGUAGES = ("en", "es", "ro", "sq", "ar", "fa")


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def dump(path: Path, value: dict) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    cases_it = load(ROOT / "data" / "cases.it.json")
    for language in LANGUAGES:
        articles = load(
            ROOT / "data" / "i18n" / language / f"articles.{language}.json"
        )
        notes: dict[str, list[dict[str, object]]] = {}
        for article in articles["articles"]:
            for link in article["localized"]["real_case_links"]:
                notes.setdefault(link["case_id"], []).append({
                    "article": article["number"],
                    "role": link["role"],
                    "note": link["note"],
                })
        localized_cases = []
        for case in cases_it["cases"]:
            localized_cases.append({
                "id": case["id"],
                "italian_source": {
                    "kind": case["kind"],
                    "authority": case["authority"],
                    "decision": case["decision"],
                    "summary": case["summary"],
                    "outcome": case["outcome"],
                    "teaching_point": case["teaching_point"],
                    "source": case["source"],
                },
                "articles_found_violated": case.get("articles_found_violated", []),
                "articles_not_found_violated": case.get("articles_not_found_violated", []),
                "finality_known": case["finality_known"],
                "localized_article_notes": notes.get(case["id"], []),
                "translation_status": "machine_draft_needs_native_legal_review",
            })
        dump(
            ROOT / "data" / "i18n" / language / f"cases.{language}.json",
            {
                "schema_version": "1.0.0",
                "dataset": f"Localized case-note bridge - {language}",
                "language": language,
                "source_language": "it",
                "source_file": "data/cases.it.json",
                "note": "Authority, decision, outcome, source, and controlling case summary remain in Italian; localized notes reproduce only contextual explanations already translated in article cards.",
                "cases": localized_cases,
            },
        )
        print(f"built {language}: {len(localized_cases)} cases, {sum(map(len, notes.values()))} article notes")


if __name__ == "__main__":
    main()

