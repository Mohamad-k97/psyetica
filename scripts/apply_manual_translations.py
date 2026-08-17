"""Apply human-authored translation patches and refresh Android assets.

The files under data/i18n/manual are the editorial source of truth for revised
translations. This script performs only a deterministic merge; it does not call
translation services or language models.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
I18N = ROOT / "data" / "i18n"
MANUAL = I18N / "manual"
ANDROID_DATA = ROOT / "android-app" / "app" / "src" / "main" / "assets" / "www" / "data"


KEYED_ARRAYS = {
    "meaning_units": "id",
    "flashcards": "id",
    "real_case_links": "case_id",
    "legal_connections": "source_id",
    "glossary_annotations": "glossary_id",
    "entries": "id",
    "cases": "id",
}


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, value: Any) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def merge_value(base: Any, patch: Any, field: str | None = None) -> Any:
    if isinstance(base, dict) and isinstance(patch, dict):
        for key, value in patch.items():
            base[key] = merge_value(base.get(key), value, key)
        return base
    if isinstance(base, list) and isinstance(patch, list) and field in KEYED_ARRAYS:
        key_name = KEYED_ARRAYS[field]
        index = {item.get(key_name): item for item in base if isinstance(item, dict)}
        for patch_item in patch:
            key = patch_item.get(key_name)
            if key in index:
                merge_value(index[key], patch_item)
            else:
                base.append(patch_item)
        return base
    return patch


def merge_articles(language: str, patch: dict[str, Any]) -> None:
    path = I18N / language / f"articles.{language}.json"
    root = read_json(path)
    articles = {article["number"]: article for article in root["articles"]}
    for article_patch in patch.get("articles", []):
        number = article_patch["number"]
        merge_value(articles[number], article_patch)
        articles[number].setdefault("review", {})["status"] = "llm_authored_editorial_translation"
    root["translation_route"] = "direct_from_italian_editorial_source"
    root["translation_engine"] = "human_directed_llm_authorship"
    root["translation_status"] = "partial_editorial_translation"
    write_json(path, root)


def merge_optional_dataset(language: str, dataset: str, patch: dict[str, Any]) -> None:
    items = patch.get(dataset)
    if not items:
        return
    path = I18N / language / f"{dataset}.{language}.json"
    root = read_json(path)
    root_field = "entries" if dataset == "glossary" else dataset
    merge_value(root, {root_field: items})
    root["translation_status"] = "editorial_translation"
    write_json(path, root)


def refresh_android_assets() -> None:
    for relative in (
        Path("articles.it.json"),
        Path("cases.it.json"),
        Path("cross_references.it.json"),
        Path("glossary.it.json"),
    ):
        (ANDROID_DATA / relative).write_bytes((ROOT / "data" / relative).read_bytes())
    for source in (ROOT / "data" / "editorial").glob("*.json"):
        destination = ANDROID_DATA / "editorial" / source.name
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(source.read_bytes())
    for source in I18N.rglob("*.json"):
        if MANUAL in source.parents:
            continue
        destination = ANDROID_DATA / "i18n" / source.relative_to(I18N)
        destination.parent.mkdir(parents=True, exist_ok=True)
        if source.name.startswith("articles."):
            root = read_json(source)
            root.get("page_contract", {})["flashcards"] = "italian_only"
            for article in root.get("articles", []):
                article.get("localized", {}).pop("flashcards", None)
            write_json(destination, root)
        else:
            destination.write_bytes(source.read_bytes())


def main() -> None:
    applied = 0
    coverage: dict[str, set[int]] = {}
    for path in sorted(MANUAL.glob("*.json")):
        patch = read_json(path)
        language = patch["language"]
        merge_articles(language, patch)
        coverage.setdefault(language, set()).update(
            article["number"] for article in patch.get("articles", [])
        )
        merge_optional_dataset(language, "glossary", patch)
        merge_optional_dataset(language, "cases", patch)
        applied += 1
    for language, numbers in coverage.items():
        path = I18N / language / f"articles.{language}.json"
        root = read_json(path)
        root["translation_status"] = (
            "editorial_translation" if numbers == set(range(1, 43))
            else "partial_editorial_translation"
        )
        write_json(path, root)
    refresh_android_assets()
    print(f"applied {applied} manual translation patches")


if __name__ == "__main__":
    main()
