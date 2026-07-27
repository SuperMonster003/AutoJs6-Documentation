from __future__ import annotations

import json
import re
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable


EXCLUDED_PAGE_NAMES = {"404.html", "index.html"}
BLOCK_TAGS = {
    "blockquote",
    "br",
    "dd",
    "div",
    "dl",
    "dt",
    "li",
    "ol",
    "p",
    "pre",
    "table",
    "tbody",
    "td",
    "th",
    "thead",
    "tr",
    "ul",
}
HEADING_TAGS = {"h1", "h2", "h3", "h4"}
WHITESPACE = re.compile(r"\s+")


def compact_text(parts: Iterable[str]) -> str:
    return WHITESPACE.sub(" ", " ".join(parts)).strip()


class SearchPageParser(HTMLParser):
    def __init__(self, page_name: str) -> None:
        super().__init__(convert_charrefs=True)
        self.page_name = page_name
        self.page_title_parts: list[str] = []
        self.entries: list[list[str]] = []
        self._in_title = False
        self._content_depth = 0
        self._heading_tag: str | None = None
        self._heading_parts: list[str] = []
        self._heading_anchor = ""
        self._mark_depth = 0
        self._section_title = ""
        self._section_anchor = ""
        self._section_parts: list[str] = []

    @property
    def in_content(self) -> bool:
        return self._content_depth > 0

    def handle_starttag(
        self,
        tag: str,
        attrs: list[tuple[str, str | None]],
    ) -> None:
        attributes = {name: value or "" for name, value in attrs}
        if tag == "title":
            self._in_title = True
            return
        if not self.in_content:
            if tag == "div" and attributes.get("id") == "apicontent":
                self._content_depth = 1
            return
        if tag == "div":
            self._content_depth += 1
        if tag in HEADING_TAGS:
            self._finish_section()
            self._heading_tag = tag
            self._heading_parts = []
            self._heading_anchor = ""
            return
        if self._heading_tag and tag == "a":
            classes = attributes.get("class", "").split()
            if "mark" in classes:
                self._heading_anchor = attributes.get("id", "")
                self._mark_depth += 1
                return
        if tag in BLOCK_TAGS:
            self._section_parts.append(" ")

    def handle_startendtag(
        self,
        tag: str,
        attrs: list[tuple[str, str | None]],
    ) -> None:
        self.handle_starttag(tag, attrs)
        self.handle_endtag(tag)

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._in_title = False
            return
        if not self.in_content:
            return
        if self._heading_tag and tag == "a" and self._mark_depth:
            self._mark_depth -= 1
            return
        if tag == self._heading_tag:
            self._section_title = compact_text(self._heading_parts)
            self._section_anchor = self._heading_anchor
            self._heading_tag = None
            self._heading_parts = []
            self._heading_anchor = ""
            return
        if tag in BLOCK_TAGS:
            self._section_parts.append(" ")
        if tag == "div":
            self._content_depth -= 1
            if not self.in_content:
                self._finish_section()

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.page_title_parts.append(data)
        elif self._heading_tag:
            if not self._mark_depth:
                self._heading_parts.append(data)
        elif self.in_content:
            self._section_parts.append(data)

    def close(self) -> None:
        super().close()
        self._finish_section()

    def _finish_section(self) -> None:
        if not self._section_title:
            self._section_parts = []
            return
        page_title = compact_text(self.page_title_parts).partition(
            " | AutoJs6 文档",
        )[0]
        content = compact_text(self._section_parts)
        url = self.page_name
        if self._section_anchor:
            url += f"#{self._section_anchor}"
        self.entries.append(
            [url, page_title, self._section_title, content],
        )
        self._section_title = ""
        self._section_anchor = ""
        self._section_parts = []


def parse_search_entries(path: Path) -> list[list[str]]:
    parser = SearchPageParser(path.name)
    parser.feed(path.read_text(encoding="utf-8"))
    parser.close()
    return parser.entries


def generate_search_index(
    html_paths: Iterable[Path],
    output_path: Path,
) -> tuple[int, int]:
    entries: list[list[str]] = []
    for path in sorted(html_paths, key=lambda item: item.name.casefold()):
        if path.name in EXCLUDED_PAGE_NAMES:
            continue
        entries.extend(parse_search_entries(path))
    if not entries:
        raise ValueError("Offline search index contains no entries")

    urls = [entry[0] for entry in entries]
    if len(urls) != len(set(urls)):
        duplicates = sorted(url for url in set(urls) if urls.count(url) > 1)
        raise ValueError(
            "Offline search index contains duplicate URLs: "
            + ", ".join(duplicates[:10]),
        )

    payload = json.dumps(
        {"version": 1, "entries": entries},
        ensure_ascii=False,
        separators=(",", ":"),
    )
    payload = (
        payload.replace("<", "\\u003c")
        .replace("\u2028", "\\u2028")
        .replace("\u2029", "\\u2029")
    )
    script = f"window.__AUTOJS6_OFFLINE_SEARCH_INDEX__={payload};\n"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(script, encoding="utf-8", newline="\n")
    return len(entries), len(script.encode("utf-8"))
