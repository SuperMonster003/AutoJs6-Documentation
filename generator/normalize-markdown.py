# -*- coding: utf-8 -*-
"""Normalize AutoJs6 Markdown sources to the current reference style."""

from __future__ import annotations

import argparse
import html
import re
import unicodedata
from collections import Counter
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
API_DIR = PROJECT_ROOT / "api"

# These phrases describe the current application. Historical names, third-party
# project names, compatibility discussions, and Auto.js Pro references stay intact.
CURRENT_PRODUCT_REPLACEMENTS = (
    (
        "如果在Auto.js中运行则为Auto.js的版本号",
        "如果在AutoJs6中运行则为AutoJs6的版本号",
    ),
    (
        "如果在Auto.js中运行则为Auto.js的版本名称",
        "如果在AutoJs6中运行则为AutoJs6的版本名称",
    ),
    ("Auto.js版本号", "AutoJs6版本号"),
    ("Auto.js版本名称", "AutoJs6版本名称"),
    ('launchApp("Auto.js")', 'launchApp("AutoJs6")'),
    (
        "启动Auto.js的特定界面. 该函数在Auto.js内运行则会打开Auto.js内的界面",
        "启动AutoJs6的特定界面. 该函数在AutoJs6内运行则会打开AutoJs6内的界面",
    ),
    ("Auto.js的设置界面", "AutoJs6的设置界面"),
    (
        "发送以上特定名称的广播可以触发Auto.js的布局分析, "
        "方便脚本调试. 这些广播在Auto.js发送才有效",
        "发送以上特定名称的广播可以触发AutoJs6的布局分析, "
        "方便脚本调试. 这些广播在AutoJs6发送才有效",
    ),
    ("屏幕上有Auto.js和QQ两个应用", "屏幕上有AutoJs6和QQ两个应用"),
    (
        "其他设备上AutoJs会自动放缩坐标",
        "其他设备上AutoJs6会自动放缩坐标",
    ),
    (
        "只能在Auto.js的界面保持屏幕常亮",
        "只能在AutoJs6的界面保持屏幕常亮",
    ),
    (
        "但Auto.js软件本身的toast除外",
        "但AutoJs6软件本身的toast除外",
    ),
    ("尽管Auto.js通过各种方式", "尽管AutoJs6通过各种方式"),
    (
        "Auto.js 有一个简单的模块加载系统.  在 Auto.js 中",
        "AutoJs6 有一个简单的模块加载系统.  在 AutoJs6 中",
    ),
    ("目前Auto.js只能额外申请两个权限", "目前AutoJs6只能额外申请两个权限"),
    (
        "增加Auto.js以及Auto.js打包的应用的权限",
        "增加AutoJs6以及AutoJs6打包的应用的权限",
    ),
    ("在Auto.js大致等同于用adb执行命令", "在AutoJs6大致等同于用adb执行命令"),
    (
        "在Auto.js中, 线程间变量在符合JavaScript变量作用域规则的前提下是共享的",
        "在AutoJs6中, 线程间变量在符合JavaScript变量作用域规则的前提下是共享的",
    ),
    (
        "Rhino和Auto.js提供了一些简单的设施来解决简单的线程安全问题",
        "Rhino和AutoJs6提供了一些简单的设施来解决简单的线程安全问题",
    ),
    (
        "Auto.js提供了一些简单的设施来支持简单的线程通信",
        "AutoJs6提供了一些简单的设施来支持简单的线程通信",
    ),
    (
        "Auto.js 中的计时器函数实现了与 Web 浏览器提供的定时器类似的 API",
        "AutoJs6 中的计时器函数实现了与 Web 浏览器提供的定时器类似的 API",
    ),
    ("Auto.js 不能保证回调被触发的确切时间", "AutoJs6 不能保证回调被触发的确切时间"),
    (
        "Auto.js的UI系统来自于Android, 所有属性和方法都能在Android源码中找到. "
        "如果某些代码或属性没有出现在Auto.js的文档中",
        "AutoJs6的UI系统来自于Android, 所有属性和方法都能在Android源码中找到. "
        "如果某些代码或属性没有出现在AutoJs6的文档中",
    ),
    ("Hello, Auto.js UI", "Hello, AutoJs6 UI"),
    ("Auto.js会自动使用适当的缓存", "AutoJs6会自动使用适当的缓存"),
    (
        'packageName: "org.autojs.autojs"',
        'packageName: "org.autojs.autojs6"',
    ),
)

ALLOWED_LEGACY_AUTOJS_LINE_MARKERS = (
    "Auto.js Pro",
    "Auto.js DevTools",
    "Auto.js 4",
    "Auto.js 应用",
    "Auto.js 版本",
    "github.com/hyb1996/Auto.js",
    "github.com/TonyJiangWJ/Auto.js",
    "| AUTOJS",
    "Auto.js图标",
)

KNOWN_TEXT_REPLACEMENTS = (
    ("verionName", "versionName"),
    ("Emiiter", "Emitter"),
    ("EventEmmiter", "EventEmitter"),
    ("emiiter", "emitter"),
    ("{Boolea}", "{boolean}"),
    ("最快的更新频率]", "最快的更新频率"),
    ("应用的签名信息（已弃用", "应用的签名信息 (已弃用)"),
    ("无障碍物服", "无障碍服务"),
    (
        "#### isDate(o)\n6\n- **o**",
        "#### isDate(o)\n\n- **o**",
    ),
)

MONTHS = {
    "Jan": 1,
    "Feb": 2,
    "Mar": 3,
    "Apr": 4,
    "May": 5,
    "Jun": 6,
    "Jul": 7,
    "Aug": 8,
    "Sep": 9,
    "Oct": 10,
    "Nov": 11,
    "Dec": 12,
}

PROHIBITED_SYMBOL_PATTERN = re.compile(
    r"[\u2010-\u2027\u3000-\u303F\u30FB\uFE10-\uFE6F\uFF00-\uFFEF]",
)
HTML_ENTITY_PATTERN = re.compile(
    r"&(?:#(?:[xX][0-9A-Fa-f]+|[0-9]+)|[A-Za-z][A-Za-z0-9]+);",
)
PROHIBITED_CONTROL_PATTERN = re.compile(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]")
TRAILING_HORIZONTAL_WHITESPACE_PATTERN = re.compile(r"[ \t]+$")
VAR_DECLARATION_PATTERN = re.compile(
    r"\bvar(?=\s+(?:[A-Za-z_$]|\{|\[))",
)
FENCE_OPEN_PATTERN = re.compile(
    r"^[ \t]*(?P<marker>`{3,}|~{3,})(?P<info>[^\r\n]*)$",
)
LEGACY_MARKER_PATTERN = re.compile(
    r"^---[ \t]*\n"
    r"\n?"
    r'<p style="font: italic 1em sans-serif; color: #78909C">'
    r"此章节待补充或完善\.\.\.</p>\n"
    r'<p style="font: italic 1em sans-serif; color: #78909C">'
    r"Marked by (?P<author>[A-Za-z0-9_-]+) on "
    r"(?P<month>[A-Z][a-z]{2}) (?P<day>\d{1,2}), (?P<year>\d{4})\.</p>\n"
    r"\n?"
    r"^---[ \t]*$",
    re.MULTILINE,
)

SIGNATURE_NAME = r"(?:\.{2,3})?[A-Za-z_$][A-Za-z0-9_$]*(?:\(\))?"
CODE_TYPED_NAME_PATTERN = re.compile(
    r"^(?P<prefix>[ \t]*[-*+][ \t]+)"
    r"`(?P<name>" + SIGNATURE_NAME + r")`"
    r"[ \t]*(?P<brace>\{)",
)
BARE_TYPED_NAME_PATTERN = re.compile(
    r"^(?P<prefix>[ \t]*[-*+][ \t]+)"
    r"(?!(?:return|returns)\b)"
    r"(?P<name>"
    + SIGNATURE_NAME
    + r"(?:[ \t]*,[ \t]*"
    + SIGNATURE_NAME
    + r")*)"
    r"[ \t]*(?P<brace>\{)",
    re.IGNORECASE,
)
BRACED_RETURN_PATTERN = re.compile(
    r"^(?P<prefix>[ \t]*[-*+][ \t]+)"
    r"(?:返回|Returns?:?)[ \t]*(?P<brace>\{)",
    re.IGNORECASE,
)
LINKED_RETURN_PATTERN = re.compile(
    r"^(?P<prefix>[ \t]*[-*+][ \t]+)"
    r"返回[ \t]*(?P<link>\[(?:ScriptSource|SensorEventEmitter|Thread|Disposable|"
    r"AtomicLong|ReentrantLock)\]\([^\r\n]+\))[ \t]*(?P<newline>\r?\n)?$",
)
CALLBACK_RETURN_PATTERN = re.compile(
    r"^(?P<prefix>[ \t]*[-*+][ \t]+)"
    r"返回[ \t]*callback[ \t]*的执行结果[ \t]*(?P<newline>\r?\n)?$",
)
LEGACY_RETURN_LABEL_PATTERN = re.compile(
    r"^[ \t]*[-*+][ \t]+(?:返回|Returns?:?)(?=[ \t{\[])",
    re.IGNORECASE,
)
TYPE_ANNOTATION_PATTERN = re.compile(
    r"(?<!\{)\{(?P<body>[^{}\r\n]+)\}(?!\})",
)
TYPE_TOKEN_PATTERN = re.compile(
    r"^(?P<name>boolean|integer|number|string|symbol|Function|Array|Object|"
    r"ArrayBuffer|DataView|TypedArray|Uint8Array)(?P<arrays>(?:\[\])*)$",
)
TYPE_LINK_TARGETS = {
    "boolean": "boolean",
    "integer": "number",
    "number": "number",
    "string": "string",
    "symbol": "symbol",
    "Function": "function",
    "Array": "array",
    "Object": "object",
    "ArrayBuffer": "arraybuffer",
    "DataView": "dataview",
    "TypedArray": "typedarray",
    "Uint8Array": "uint8array",
}

FULL_WIDTH_CLOSE_PARENTHESIS_BEFORE_TEXT_PATTERN = re.compile(
    r"\uff09(?=[A-Za-z0-9_$\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF"
    r"\uAC00-\uD7AF\uF900-\uFAFF])",
)
SIMPLE_ASCII_REPLACEMENTS = {
    "\u2010": "-",
    "\u2011": "-",
    "\u2012": "-",
    "\u2013": "-",
    "\u2015": "-",
    "\u2018": "'",
    "\u2019": "'",
    "\u201a": "'",
    "\u201b": "'",
    "\u201c": '"',
    "\u201d": '"',
    "\u201e": '"',
    "\u201f": '"',
    "\u2025": "..",
    "\u2026": "...",
    "\u3008": '"',
    "\u3009": '"',
    "\u300a": '"',
    "\u300b": '"',
    "\u300c": '"',
    "\u300d": '"',
    "\u300e": '"',
    "\u300f": '"',
    "\u3010": "[",
    "\u3011": "]",
    "\u3014": "[",
    "\u3015": "]",
    "\u3016": "[",
    "\u3017": "]",
    "\u3018": "[",
    "\u3019": "]",
    "\u301a": "[",
    "\u301b": "]",
    "\u301c": "~",
    "\u3030": "~",
    "\u30fb": ".",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check",
        action="store_true",
        help="report files that are not normalized without modifying them",
    )
    return parser.parse_args()


def add_stat(stats: Counter, key: str, count: int) -> None:
    if count:
        stats[key] += count


def line_without_newline(line: str) -> str:
    return line[:-1] if line.endswith("\n") else line


def fence_details(line: str) -> tuple[str, int, str] | None:
    match = FENCE_OPEN_PATTERN.match(line_without_newline(line))
    if match is None:
        return None
    marker = match.group("marker")
    return marker[0], len(marker), match.group("info").strip()


def is_fence_close(line: str, character: str, minimum_length: int) -> bool:
    candidate = line_without_newline(line).strip(" \t")
    return (
        len(candidate) >= minimum_length
        and candidate
        and all(value == character for value in candidate)
    )


def language_name(info: str) -> str:
    if not info:
        return ""
    token = info.split(maxsplit=1)[0].strip("{}").lstrip(".").lower()
    for prefix in ("language-", "lang-"):
        if token.startswith(prefix):
            token = token[len(prefix) :]
    return token


def should_preserve_var(info: str, body: str) -> bool:
    if language_name(info) in {"kotlin", "e4x"}:
        return True
    if "var sales = <sales" in body and "for each( var price" in body:
        return True
    return all(
        declaration in body
        for declaration in (
            "let selector = 1;",
            "const selector = 1;",
            "var selector = 1;",
        )
    )


def normalize_code_body(body: str, info: str, stats: Counter) -> str:
    typo_count = body.count("cosnt csvPath")
    if typo_count:
        body = body.replace("cosnt csvPath", "const csvPath")
        stats["const_typos"] += typo_count

    body, count = re.subn(
        r"(?m)^(?P<indent>[ \t]*)r = http\.postJson",
        r"\g<indent>let r = http.postJson",
        body,
    )
    add_stat(stats, "implicit_http_variables", count)

    if should_preserve_var(info, body):
        return body
    body, count = VAR_DECLARATION_PATTERN.subn("let", body)
    add_stat(stats, "var_declarations", count)
    return body


def normalize_code_fences(text: str, path: Path, stats: Counter) -> str:
    output: list[str] = []
    body: list[str] = []
    active: tuple[str, int, str, int] | None = None

    for line_number, line in enumerate(text.splitlines(keepends=True), 1):
        if active is None:
            details = fence_details(line)
            if details is None:
                output.append(line)
                continue
            character, length, info = details
            output.append(line)
            active = character, length, info, line_number
            body = []
            continue

        character, length, info, _ = active
        if is_fence_close(line, character, length):
            output.append(normalize_code_body("".join(body), info, stats))
            output.append(line)
            active = None
            body = []
        else:
            body.append(line)

    if active is not None:
        _, _, _, line_number = active
        raise ValueError(
            f"Unclosed Markdown code fence in "
            f"{path.relative_to(PROJECT_ROOT)}:{line_number}"
        )
    return "".join(output)


def replace_legacy_marker(match: re.Match[str]) -> str:
    month = MONTHS.get(match.group("month"))
    if month is None:
        raise ValueError(f"Unsupported marker month: {match.group('month')}")
    marked_on = (
        f"{int(match.group('year')):04d}-{month:02d}-{int(match.group('day')):02d}"
    )
    return (
        "---\n\n"
        '<aside class="doc-status doc-status--incomplete" '
        f'data-marked-by="{match.group("author")}" data-marked-on="{marked_on}">\n'
        "<p><strong>文档状态:</strong> 此章节仍在补充或完善中.</p>\n"
        "</aside>"
    )


def normalize_markers(text: str, stats: Counter) -> str:
    text, count = LEGACY_MARKER_PATTERN.subn(replace_legacy_marker, text)
    add_stat(stats, "incomplete_markers", count)
    return text


def replace_current_product_names(text: str, stats: Counter) -> str:
    for old, new in CURRENT_PRODUCT_REPLACEMENTS:
        count = text.count(old)
        if count:
            text = text.replace(old, new)
            stats["current_product_phrases"] += count
    return text


def normalize_known_text_issues(text: str, stats: Counter) -> str:
    for old, new in KNOWN_TEXT_REPLACEMENTS:
        count = text.count(old)
        if count:
            text = text.replace(old, new)
            stats["known_text_issues"] += count
    text, count = re.subn(
        r"应用的签名信息 \(已弃用(?!\))",
        "应用的签名信息 (已弃用)",
        text,
    )
    add_stat(stats, "known_text_issues", count)
    control_count = len(PROHIBITED_CONTROL_PATTERN.findall(text))
    if control_count:
        text = PROHIBITED_CONTROL_PATTERN.sub("", text)
        stats["control_characters"] += control_count
    return text


def normalize_signature_line(line: str, stats: Counter) -> str:
    def canonical_prefix(prefix: str) -> str:
        indent = re.match(r"^[ \t]*", prefix)
        return f'{indent.group() if indent else ""}- '

    match = CALLBACK_RETURN_PATTERN.match(line)
    if match is not None:
        stats["callback_return_labels"] += 1
        newline = match.group("newline") or ""
        return (
            f'{canonical_prefix(match.group("prefix"))}<ins>**returns**</ins> '
            "{ [any](dataTypes#any) } callback 的执行结果"
            f"{newline}"
        )

    match = LINKED_RETURN_PATTERN.match(line)
    if match is not None:
        stats["linked_return_labels"] += 1
        newline = match.group("newline") or ""
        return (
            f'{canonical_prefix(match.group("prefix"))}<ins>**returns**</ins> '
            f'{{ {match.group("link")} }}{newline}'
        )

    match = BRACED_RETURN_PATTERN.match(line)
    if match is not None:
        stats["return_labels"] += 1
        start, end = match.span()
        replacement = (
            f'{canonical_prefix(match.group("prefix"))}<ins>**returns**</ins> '
            f'{match.group("brace")}'
        )
        return replacement + line[end:]

    match = CODE_TYPED_NAME_PATTERN.match(line)
    if match is not None:
        stats["typed_code_names"] += 1
        _, end = match.span()
        replacement = (
            f'{canonical_prefix(match.group("prefix"))}**{match.group("name")}** '
            f'{match.group("brace")}'
        )
        return replacement + line[end:]

    match = BARE_TYPED_NAME_PATTERN.match(line)
    if match is not None:
        stats["typed_plain_names"] += 1
        _, end = match.span()
        name = re.sub(r"[ \t]*,[ \t]*", ", ", match.group("name"))
        replacement = (
            f'{canonical_prefix(match.group("prefix"))}**{name}** '
            f'{match.group("brace")}'
        )
        return replacement + line[end:]

    return line


def normalize_signatures(text: str, path: Path, stats: Counter) -> str:
    output: list[str] = []
    active: tuple[str, int, int] | None = None

    for line_number, line in enumerate(text.splitlines(keepends=True), 1):
        if active is None:
            details = fence_details(line)
            if details is not None:
                character, length, _ = details
                active = character, length, line_number
                output.append(line)
            else:
                output.append(normalize_signature_line(line, stats))
            continue

        character, length, _ = active
        output.append(line)
        if is_fence_close(line, character, length):
            active = None

    if active is not None:
        _, _, line_number = active
        raise ValueError(
            f"Unclosed Markdown code fence in "
            f"{path.relative_to(PROJECT_ROOT)}:{line_number}"
        )
    return "".join(output)


def normalize_type_annotation(match: re.Match[str], stats: Counter) -> str:
    body = match.group("body").strip()
    if "](" in body:
        return match.group()
    converted_parts: list[str] = []
    converted_count = 0
    for part in re.split(r"[ \t]*\|[ \t]*", body):
        token = part.strip()
        token_match = TYPE_TOKEN_PATTERN.fullmatch(token)
        if token_match is None:
            converted_parts.append(token)
            continue
        name = token_match.group("name")
        display_name = name + token_match.group("arrays")
        target = TYPE_LINK_TARGETS[name]
        converted_parts.append(f"[{display_name}](dataTypes#{target})")
        converted_count += 1
    if not converted_count:
        return match.group()
    stats["internal_type_links"] += converted_count
    return "{ " + " | ".join(converted_parts) + " }"


def normalize_type_link_line(line: str, stats: Counter) -> str:
    if re.match(r"^[ \t]*[-*+][ \t]+", line) is None:
        return line
    normalized, count = TYPE_ANNOTATION_PATTERN.subn(
        lambda match: normalize_type_annotation(match, stats),
        line,
    )
    if count and normalized != line:
        normalized = re.sub(
            r"^(?P<indent>[ \t]*)[-*+][ \t]+",
            r"\g<indent>- ",
            normalized,
        )
    return normalized


def normalize_type_links(text: str, path: Path, stats: Counter) -> str:
    output: list[str] = []
    active: tuple[str, int, int] | None = None
    for line_number, line in enumerate(text.splitlines(keepends=True), 1):
        if active is None:
            details = fence_details(line)
            if details is not None:
                character, length, _ = details
                active = character, length, line_number
                output.append(line)
            else:
                output.append(normalize_type_link_line(line, stats))
            continue
        output.append(line)
        if is_fence_close(line, active[0], active[1]):
            active = None
    if active is not None:
        _, _, line_number = active
        raise ValueError(
            f"Unclosed Markdown code fence in "
            f"{path.relative_to(PROJECT_ROOT)}:{line_number}"
        )
    return "".join(output)


def decode_prohibited_entity(match: re.Match[str], stats: Counter) -> str:
    decoded = html.unescape(match.group())
    prohibited_count = len(PROHIBITED_SYMBOL_PATTERN.findall(decoded))
    if not prohibited_count:
        return match.group()
    stats["prohibited_symbol_entities"] += prohibited_count
    return decoded


def normalize_ascii_punctuation(text: str, path: Path, stats: Counter) -> str:
    text = HTML_ENTITY_PATTERN.sub(
        lambda match: decode_prohibited_entity(match, stats),
        text,
    )

    for old, new in (
        ("\u3001", ", "),
        ("\uff0c", ", "),
        ("\uff1a", ": "),
        ("\uff1b", "; "),
        ("\u3002", ". "),
    ):
        text, count = re.subn(f"{old}[ \\t]*", new, text)
        add_stat(stats, "full_width_symbols", count)

    text, count = re.subn(r"(?P<before>\S)\uff08[ \t]*", r"\g<before> (", text)
    add_stat(stats, "full_width_symbols", count)
    text, count = re.subn(r"\uff08[ \t]*", "(", text)
    add_stat(stats, "full_width_symbols", count)
    text, count = FULL_WIDTH_CLOSE_PARENTHESIS_BEFORE_TEXT_PATTERN.subn(") ", text)
    add_stat(stats, "full_width_symbols", count)
    text, count = re.subn("\uff09", ")", text)
    add_stat(stats, "full_width_symbols", count)

    def replace_em_dash_run(match: re.Match[str]) -> str:
        return "-" * len(match.group()) if len(match.group()) > 1 else " - "

    text, count = re.subn("\u2014+", replace_em_dash_run, text)
    add_stat(stats, "full_width_symbols", count)

    ideographic_space_replacement = (
        "&nbsp;" if path.name == "colorTable.md" else " "
    )
    count = text.count("\u3000")
    if count:
        text = text.replace("\u3000", ideographic_space_replacement)
        stats["full_width_symbols"] += count

    for old, new in SIMPLE_ASCII_REPLACEMENTS.items():
        count = text.count(old)
        if count:
            text = text.replace(old, new)
            stats["full_width_symbols"] += count

    text, count = re.subn(
        r"(?P<open>\*\*|__)(?P<body>[^\r\n]+?[,;:])[ \t]+(?P=open)",
        r"\g<open>\g<body>\g<open>",
        text,
    )
    add_stat(stats, "markup_punctuation_spaces", count)

    def normalize_remaining_symbol(match: re.Match[str]) -> str:
        original = match.group()
        normalized = unicodedata.normalize("NFKC", original)
        if normalized != original:
            stats["full_width_symbols"] += 1
            return normalized
        return original

    return PROHIBITED_SYMBOL_PATTERN.sub(normalize_remaining_symbol, text)


def normalize_trailing_whitespace(text: str, path: Path, stats: Counter) -> str:
    output: list[str] = []
    active: tuple[str, int, int] | None = None

    for line_number, line in enumerate(text.splitlines(keepends=True), 1):
        has_newline = line.endswith("\n")
        content = line_without_newline(line)
        details = fence_details(line) if active is None else None
        closing = (
            active is not None
            and is_fence_close(line, active[0], active[1])
        )
        match = TRAILING_HORIZONTAL_WHITESPACE_PATTERN.search(content)
        if match is not None:
            whitespace = match.group()
            content = content[: match.start()]
            is_hard_break = (
                active is None
                and details is None
                and content
                and "\t" not in whitespace
                and len(whitespace) >= 2
                and not content.endswith(("<br>", "<br/>", "\\"))
                and not content.lstrip().startswith(("<", "|"))
            )
            if is_hard_break:
                content += "<br>"
                stats["markdown_hard_breaks"] += 1
            stats["trailing_whitespace"] += len(whitespace)

        output.append(content + ("\n" if has_newline else ""))

        if active is None and details is not None:
            character, length, _ = details
            active = character, length, line_number
        elif closing:
            active = None

    if active is not None:
        _, _, line_number = active
        raise ValueError(
            f"Unclosed Markdown code fence in "
            f"{path.relative_to(PROJECT_ROOT)}:{line_number}"
        )
    return "".join(output)


def normalize(text: str, path: Path, stats: Counter) -> str:
    text = normalize_markers(text, stats)
    text = replace_current_product_names(text, stats)
    text = normalize_code_fences(text, path, stats)
    text = normalize_known_text_issues(text, stats)
    text = normalize_signatures(text, path, stats)
    text = normalize_type_links(text, path, stats)
    text = normalize_ascii_punctuation(text, path, stats)
    text = normalize_known_text_issues(text, stats)
    return normalize_trailing_whitespace(text, path, stats)


def outside_fence_text(text: str, path: Path) -> str:
    output: list[str] = []
    active: tuple[str, int, int] | None = None

    for line_number, line in enumerate(text.splitlines(keepends=True), 1):
        if active is None:
            details = fence_details(line)
            if details is None:
                output.append(line)
                continue
            character, length, _ = details
            active = character, length, line_number
            output.append("\n" if line.endswith("\n") else "")
            continue

        character, length, _ = active
        output.append("\n" if line.endswith("\n") else "")
        if is_fence_close(line, character, length):
            active = None

    if active is not None:
        _, _, line_number = active
        raise ValueError(
            f"Unclosed Markdown code fence in "
            f"{path.relative_to(PROJECT_ROOT)}:{line_number}"
        )
    return "".join(output)


def fenced_code_blocks(text: str, path: Path) -> list[tuple[str, str]]:
    blocks: list[tuple[str, str]] = []
    body: list[str] = []
    active: tuple[str, int, str, int] | None = None

    for line_number, line in enumerate(text.splitlines(keepends=True), 1):
        if active is None:
            details = fence_details(line)
            if details is not None:
                character, length, info = details
                active = character, length, info, line_number
                body = []
            continue

        character, length, info, _ = active
        if is_fence_close(line, character, length):
            blocks.append((info, "".join(body)))
            active = None
            body = []
        else:
            body.append(line)

    if active is not None:
        _, _, _, line_number = active
        raise ValueError(
            f"Unclosed Markdown code fence in "
            f"{path.relative_to(PROJECT_ROOT)}:{line_number}"
        )
    return blocks


def validate(text: str, path: Path) -> None:
    relative = path.relative_to(PROJECT_ROOT)

    match = PROHIBITED_SYMBOL_PATTERN.search(text)
    if match is not None:
        code_point = f"U+{ord(match.group()):04X}"
        raise ValueError(
            f"Prohibited full-width symbol {match.group()!r} "
            f"({code_point}) in {relative}"
        )

    for entity_match in HTML_ENTITY_PATTERN.finditer(text):
        decoded = html.unescape(entity_match.group())
        prohibited = PROHIBITED_SYMBOL_PATTERN.search(decoded)
        if prohibited is not None:
            code_point = f"U+{ord(prohibited.group()):04X}"
            raise ValueError(
                f"Prohibited symbol entity {entity_match.group()!r} "
                f"({code_point}) in {relative}"
            )

    if (
        "此章节待补充或完善..." in text
        or re.search(r"Marked by [A-Za-z0-9_-]+ on [A-Z][a-z]{2} \d", text)
    ):
        raise ValueError(f"Legacy incomplete-section marker in {relative}")

    # `callAutoJs` is the public Node bridge method name, not a product name.
    if re.search(r"(?<!call)AutoJs(?!6|Pro|-Docs)", text):
        raise ValueError(f"Legacy bare AutoJs product name in {relative}")
    if re.search(
        r"""packageName\s*:\s*["']org\.autojs\.autojs["']""",
        text,
    ):
        raise ValueError(f"Legacy current-product package name in {relative}")
    for line_number, line in enumerate(text.splitlines(), 1):
        if "Auto.js" in line and not any(
            marker in line for marker in ALLOWED_LEGACY_AUTOJS_LINE_MARKERS
        ):
            raise ValueError(
                f"Auto.js outside an allowed historical context in "
                f"{relative}:{line_number}"
            )

    typo_patterns = (
        r"\bverionName\b",
        r"\b[A-Za-z]*Emiiter\b",
        r"\bBoolea\b",
        r"\bcosnt\s+csvPath\b",
        r"最快的更新频率\]",
        r"无障碍物服",
    )
    if any(re.search(pattern, text) for pattern in typo_patterns):
        raise ValueError(f"Known documentation typo in {relative}")
    if re.search(r"应用的签名信息\s*\(已弃用(?!\))", text):
        raise ValueError(f"Unclosed deprecation note in {relative}")
    if re.search(r"(?m)^[ \t]*r = http\.postJson", text):
        raise ValueError(f"Implicit HTTP example variable in {relative}")
    if re.search(r"(?m)^#### isDate\(o\)\n6$", text):
        raise ValueError(f"Stray isDate text in {relative}")

    outside = outside_fence_text(text, path)
    for line in outside.splitlines(keepends=True):
        if CODE_TYPED_NAME_PATTERN.match(line) is not None:
            raise ValueError(f"Legacy code-form parameter signature in {relative}")
        if BARE_TYPED_NAME_PATTERN.match(line) is not None:
            raise ValueError(f"Legacy bare parameter signature in {relative}")
        if LEGACY_RETURN_LABEL_PATTERN.match(line) is not None:
            raise ValueError(f"Legacy return signature in {relative}")

    for info, body in fenced_code_blocks(text, path):
        if not should_preserve_var(info, body) and VAR_DECLARATION_PATTERN.search(body):
            raise ValueError(f"Legacy var declaration in {relative}")

    control = PROHIBITED_CONTROL_PATTERN.search(text)
    if control is not None:
        code_point = f"U+{ord(control.group()):04X}"
        raise ValueError(f"Prohibited control character {code_point} in {relative}")
    trailing = re.search(r"[ \t]+(?=\r?$)", text, re.MULTILINE)
    if trailing is not None:
        raise ValueError(f"Trailing horizontal whitespace in {relative}")


def read_lf(path: Path) -> str:
    with path.open("r", encoding="utf-8", newline=None) as source:
        return source.read()


def write_lf(path: Path, text: str) -> None:
    with path.open("w", encoding="utf-8", newline="\n") as target:
        target.write(text)


def main() -> int:
    args = parse_args()
    paths = sorted(API_DIR.glob("*.md"))
    if not paths:
        raise FileNotFoundError(f"No Markdown documentation found in {API_DIR}")

    changed: list[tuple[Path, str]] = []
    stats: Counter = Counter()
    for path in paths:
        original = read_lf(path)
        normalized = normalize(original, path, stats)
        validate(normalized, path)
        repeated = normalize(normalized, path, Counter())
        if repeated != normalized:
            raise ValueError(
                f"Markdown normalization is not idempotent: "
                f"{path.relative_to(PROJECT_ROOT)}"
            )
        if normalized != original:
            changed.append((path, normalized))

    if args.check and changed:
        print("Markdown documentation requires normalization:")
        for path, _ in changed:
            print(f"  {path.relative_to(PROJECT_ROOT).as_posix()}")
        return 1

    if not args.check:
        for path, normalized in changed:
            write_lf(path, normalized)

    action = "checked" if args.check else "normalized"
    summary = [f"files={len(paths)}", f"changed={len(changed)}"]
    summary.extend(f"{key}={value}" for key, value in sorted(stats.items()))
    print(f"Markdown documentation {action}: {', '.join(summary)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
