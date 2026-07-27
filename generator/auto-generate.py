from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import stat
import subprocess
import sys
import tempfile
import uuid
from contextlib import contextmanager, nullcontext
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable

from search_index import generate_search_index


GENERATOR_DIR = Path(__file__).resolve().parent
PROJECT_DIR = GENERATOR_DIR.parent
API_DIR = PROJECT_DIR / "api"
DOCS_DIR = PROJECT_DIR / "docs"
JSON_DIR = PROJECT_DIR / "json"
API_IMAGES_DIR = API_DIR / "images"
DOCS_IMAGES_DIR = DOCS_DIR / "images"
TEMPLATE_PATH = PROJECT_DIR / "template.html"
PROJECT_CONFIG_PATH = PROJECT_DIR / "project.json"
LOCAL_CONFIG_PATH = GENERATOR_DIR / "local-config.json"
BATCH_GENERATOR_PATH = GENERATOR_DIR / "batch-generate.js"
MARKDOWN_NORMALIZER_PATH = GENERATOR_DIR / "normalize-markdown.py"
DEFAULT_DOCUMENTATION_VERSION = "6.x"
OFFLINE_DOCS_RELATIVE_PATH = Path("app/src/main/assets/docs")
OFFLINE_SEARCH_INDEX_RELATIVE_PATH = Path("assets/offline-search-index.js")
TEXT_ASSET_SUFFIXES = {".css", ".html", ".js"}
MAX_ANDROID_VERSION_CODE = 2_100_000_000
LEGACY_JSON_OUTPUTS = {
    # Compatibility aliases retained from the original Node.js documentation set.
    "accessibilityActionsType.json",
    "coordinates-based-automation.json",
    "coordinatesBasedAutomation.json",
    "errors.json",
    "globals.json",
    "imageWrapper.json",
    "intent.json",
    "intrinsicTypes.json",
    "widgets-based-automation.json",
    "widgetsBasedAutomation.json",
}


class AutomationError(RuntimeError):
    pass


@dataclass(frozen=True)
class FileMutation:
    path: Path
    original: bytes
    updated: bytes


@dataclass(frozen=True)
class VersionUpdatePlan:
    target_version: str
    project_version_name: str
    project_version_code: int
    next_project_version_code: int
    plugin_version_name: str
    plugin_version_code: int
    next_plugin_version_code: int
    mutations: tuple[FileMutation, ...]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Generate the offline HTML/JSON documentation and optionally sync "
            "the validated site into AutoJs6-Plugin-Offline-Docs."
        ),
    )
    parser.add_argument(
        "modules",
        nargs="*",
        metavar="MODULE",
        help="module names to generate; omit to generate every api/*.md file",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="generate into a temporary directory and report stale outputs",
    )
    parser.add_argument(
        "--sync-offline",
        action="store_true",
        help="sync the generated site into the configured offline-docs plugin",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help=(
            "with --sync-offline, show the validated plugin changes without "
            "replacing its assets/docs directory"
        ),
    )
    parser.add_argument(
        "--verify-offline",
        action="store_true",
        help="after syncing, run the plugin's tests and APK verification",
    )
    parser.add_argument(
        "--offline-project",
        type=Path,
        help="path to the AutoJs6-Plugin-Offline-Docs project",
    )
    parser.add_argument(
        "--autojs6-project",
        type=Path,
        help="fallback AutoJs6 project used to read version.properties",
    )
    parser.add_argument(
        "--version",
        dest="documentation_version",
        help="AutoJs6 version displayed in generated offline HTML",
    )
    parser.add_argument(
        "--increment-versions",
        action="store_true",
        help=(
            "after a successful offline sync, keep both version names aligned "
            "with targetAutoJs6Version and increment both version codes"
        ),
    )
    args = parser.parse_args()
    if args.check and args.sync_offline:
        parser.error("--check and --sync-offline cannot be used together")
    if args.dry_run and not args.sync_offline:
        parser.error("--dry-run requires --sync-offline")
    if args.verify_offline and not args.sync_offline:
        parser.error("--verify-offline requires --sync-offline")
    if args.modules and args.sync_offline:
        parser.error("--sync-offline requires a full build; omit MODULE arguments")
    if args.dry_run and args.verify_offline:
        parser.error("--dry-run and --verify-offline cannot be used together")
    if args.increment_versions and not args.sync_offline:
        parser.error("--increment-versions requires --sync-offline")
    return args


def load_json_object(path: Path, *, optional: bool) -> dict[str, Any]:
    if not path.is_file():
        if optional:
            return {}
        raise AutomationError(f"Configuration file is missing: {path}")
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise AutomationError(f"Cannot read JSON configuration {path}: {error}") from error
    if not isinstance(value, dict):
        raise AutomationError(f"JSON configuration must contain an object: {path}")
    return value


def target_autojs6_version(project_config: dict[str, Any]) -> str:
    value = project_config.get("targetAutoJs6Version")
    if not isinstance(value, str):
        raise AutomationError("project.json targetAutoJs6Version must be a string")
    version = value.strip()
    if (
        not version
        or version != value
        or len(version) > 100
        or any(ord(character) < 32 for character in version)
        or any(character in version for character in ('"', "\\", "`", "$"))
    ):
        raise AutomationError(
            "project.json targetAutoJs6Version must be a non-empty "
            "single-line version name without surrounding whitespace, "
            "quotes, backslashes, backticks, or dollar signs",
        )
    return version


def require_version_code(value: Any, *, source: str) -> int:
    if (
        isinstance(value, bool)
        or not isinstance(value, int)
        or value < 0
        or value >= MAX_ANDROID_VERSION_CODE
    ):
        raise AutomationError(
            f"{source} must be an integer from 0 to "
            f"{MAX_ANDROID_VERSION_CODE - 1}",
        )
    return value


def replace_text_once(
    text: str,
    pattern: re.Pattern[str],
    replacement: str,
    *,
    source: Path,
    field: str,
) -> str:
    updated, count = pattern.subn(lambda _match: replacement, text)
    if count != 1:
        raise AutomationError(
            f"Expected exactly one {field} entry in {source}, found {count}",
        )
    return updated


def java_property(text: str, key: str, *, source: Path) -> str:
    pattern = re.compile(
        rf"(?m)^[ \t]*{re.escape(key)}[ \t]*=[ \t]*([^\r\n]*)",
    )
    matches = pattern.findall(text)
    if len(matches) != 1:
        raise AutomationError(
            f"Expected exactly one {key} entry in {source}, found {len(matches)}",
        )
    return matches[0].strip()


def replace_java_property(text: str, key: str, value: str, *, source: Path) -> str:
    pattern = re.compile(
        rf"(?m)^([ \t]*{re.escape(key)}[ \t]*=[ \t]*)[^\r\n]*",
    )
    matches = list(pattern.finditer(text))
    if len(matches) != 1:
        raise AutomationError(
            f"Expected exactly one {key} entry in {source}, found {len(matches)}",
        )
    return pattern.sub(lambda match: f"{match.group(1)}{value}", text)


def text_mutation(
    path: Path,
    updated_text: str,
    *,
    original: bytes | None = None,
) -> FileMutation:
    if original is None:
        original = path.read_bytes()
    return FileMutation(path, original, updated_text.encode("utf-8"))


def read_utf8_file(path: Path, *, description: str) -> tuple[bytes, str]:
    try:
        original = path.read_bytes()
        text = original.decode("utf-8")
    except (OSError, UnicodeDecodeError) as error:
        raise AutomationError(
            f"Cannot read {description} as UTF-8: {path}: {error}",
        ) from error
    return original, text


def prepare_version_update_plan(
    project_config: dict[str, Any],
    offline_project: Path,
    target_version: str,
) -> VersionUpdatePlan:
    project_version_name = project_config.get("versionName")
    if not isinstance(project_version_name, str):
        raise AutomationError("project.json versionName must be a string")
    project_version_code = require_version_code(
        project_config.get("versionCode"),
        source="project.json versionCode",
    )
    next_project_version_code = project_version_code + 1

    project_original, project_text = read_utf8_file(
        PROJECT_CONFIG_PATH,
        description="project configuration",
    )
    try:
        current_project_config = json.loads(project_text)
    except json.JSONDecodeError as error:
        raise AutomationError(
            f"Cannot re-read project configuration {PROJECT_CONFIG_PATH}: {error}",
        ) from error
    if current_project_config != project_config:
        raise AutomationError(
            f"project.json changed while preparing the version update: "
            f"{PROJECT_CONFIG_PATH}",
        )

    updated_project_config = dict(project_config)
    updated_project_config["versionName"] = target_version
    updated_project_config["versionCode"] = next_project_version_code
    project_mutation = FileMutation(
        PROJECT_CONFIG_PATH,
        project_original,
        (
            json.dumps(updated_project_config, ensure_ascii=False, indent=2) + "\n"
        ).encode("utf-8"),
    )

    properties_path = offline_project / "version.properties"
    properties_original, properties_text = read_utf8_file(
        properties_path,
        description="offline plugin version properties",
    )
    plugin_version_name = java_property(
        properties_text,
        "VERSION_NAME",
        source=properties_path,
    )
    plugin_version_code_raw = java_property(
        properties_text,
        "VERSION_BUILD",
        source=properties_path,
    )
    try:
        parsed_plugin_version_code: Any = int(plugin_version_code_raw)
    except ValueError as error:
        raise AutomationError(
            f"Offline plugin VERSION_BUILD is not an integer: "
            f"{plugin_version_code_raw!r}",
        ) from error
    plugin_version_code = require_version_code(
        parsed_plugin_version_code,
        source="offline plugin VERSION_BUILD",
    )
    next_plugin_version_code = plugin_version_code + 1
    updated_properties = replace_java_property(
        properties_text,
        "VERSION_NAME",
        target_version,
        source=properties_path,
    )
    updated_properties = replace_java_property(
        updated_properties,
        "VERSION_BUILD",
        str(next_plugin_version_code),
        source=properties_path,
    )

    build_path = offline_project / "app/build.gradle.kts"
    build_original, build_text = read_utf8_file(
        build_path,
        description="offline plugin build configuration",
    )
    updated_build = replace_text_once(
        build_text,
        re.compile(
            r'(?m)^\s*val\s+offlineDocsContentVersion\s*=\s*"[^"]*"\s*$',
        ),
        f'val offlineDocsContentVersion = "{target_version}"',
        source=build_path,
        field="offlineDocsContentVersion",
    )

    provenance_paths = (
        offline_project / "SOURCE_PROVENANCE.md",
        offline_project / "app/src/main/assets/licenses/docs/SOURCE_PROVENANCE.md",
    )
    provenance_mutations: list[FileMutation] = []
    for provenance_path in provenance_paths:
        provenance_original, provenance_text = read_utf8_file(
            provenance_path,
            description="offline plugin source provenance",
        )
        updated_provenance = replace_text_once(
            provenance_text,
            re.compile(r"(?m)^-\s+Documentation version:\s+`[^`]*`\s*$"),
            f"- Documentation version: `{target_version}`",
            source=provenance_path,
            field="Documentation version",
        )
        provenance_mutations.append(
            text_mutation(
                provenance_path,
                updated_provenance,
                original=provenance_original,
            ),
        )

    return VersionUpdatePlan(
        target_version=target_version,
        project_version_name=project_version_name,
        project_version_code=project_version_code,
        next_project_version_code=next_project_version_code,
        plugin_version_name=plugin_version_name,
        plugin_version_code=plugin_version_code,
        next_plugin_version_code=next_plugin_version_code,
        mutations=(
            text_mutation(
                properties_path,
                updated_properties,
                original=properties_original,
            ),
            text_mutation(build_path, updated_build, original=build_original),
            *provenance_mutations,
            project_mutation,
        ),
    )


def print_version_update(plan: VersionUpdatePlan, *, preview: bool) -> None:
    prefix = "Version update preview" if preview else "Versions updated"
    print(f"{prefix}:")
    print(
        f"  Documentation: versionName "
        f"{plan.project_version_name} -> {plan.target_version}, "
        f"versionCode {plan.project_version_code} -> "
        f"{plan.next_project_version_code}",
    )
    print(
        f"  Offline plugin: VERSION_NAME "
        f"{plan.plugin_version_name} -> {plan.target_version}, "
        f"VERSION_BUILD {plan.plugin_version_code} -> "
        f"{plan.next_plugin_version_code}",
    )


def configured_path(
    explicit: Path | None,
    environment_name: str,
    local_config: dict[str, Any],
    config_name: str,
) -> Path | None:
    raw_value: str | os.PathLike[str] | None
    if explicit is not None:
        raw_value = explicit
    elif os.environ.get(environment_name):
        raw_value = os.environ[environment_name]
    else:
        configured = local_config.get(config_name)
        raw_value = configured if isinstance(configured, str) and configured.strip() else None
    if raw_value is None:
        return None
    return Path(raw_value).expanduser().resolve()


def read_java_property(path: Path, key: str) -> str | None:
    if not path.is_file():
        return None
    for raw_line in path.read_text(encoding="utf-8-sig").splitlines():
        line = raw_line.strip()
        if not line or line.startswith(("#", "!")):
            continue
        name, separator, value = line.partition("=")
        if separator and name.strip() == key:
            resolved = value.strip()
            return resolved or None
    return None


def resolve_documentation_version(
    args: argparse.Namespace,
    project_config: dict[str, Any],
    local_config: dict[str, Any],
) -> str:
    candidates = (
        args.documentation_version,
        os.environ.get("AUTOJS6_DOCS_VERSION"),
        project_config.get("targetAutoJs6Version"),
    )
    for candidate in candidates:
        if isinstance(candidate, str) and candidate.strip():
            return candidate.strip()

    autojs6_project = configured_path(
        args.autojs6_project,
        "AUTOJS6_PROJECT",
        local_config,
        "autoJs6Project",
    )
    if autojs6_project is not None:
        version = read_java_property(autojs6_project / "version.properties", "VERSION_NAME")
        if version:
            return version
        raise AutomationError(
            f"VERSION_NAME is missing from {autojs6_project / 'version.properties'}",
        )
    return DEFAULT_DOCUMENTATION_VERSION


def executable(name: str) -> str:
    resolved = shutil.which(name)
    if resolved is None:
        raise AutomationError(f"Required executable is not available on PATH: {name}")
    return resolved


def run_command(
    command: list[str],
    *,
    cwd: Path,
    show_output: bool = False,
) -> subprocess.CompletedProcess[str]:
    completed = subprocess.run(
        command,
        cwd=cwd,
        text=True,
        encoding="utf-8",
        errors="replace",
        stdout=None if show_output else subprocess.PIPE,
        stderr=None if show_output else subprocess.PIPE,
        check=False,
    )
    if completed.returncode:
        if not show_output:
            if completed.stdout:
                print(completed.stdout, end="", file=sys.stderr)
            if completed.stderr:
                print(completed.stderr, end="", file=sys.stderr)
        rendered = subprocess.list2cmdline(command)
        raise AutomationError(f"Command failed with exit code {completed.returncode}: {rendered}")
    return completed


def ensure_node_dependencies() -> str:
    node = executable("node")
    required_packages = (
        GENERATOR_DIR / "node_modules" / "marked" / "package.json",
        GENERATOR_DIR / "node_modules" / "js-yaml" / "package.json",
    )
    if all(path.is_file() for path in required_packages):
        return node

    npm = executable("npm")
    print("Generator dependencies are missing; running npm ci...")
    run_command(
        [npm, "ci", "--ignore-scripts", "--no-audit", "--no-fund"],
        cwd=GENERATOR_DIR,
        show_output=True,
    )
    return node


def verify_markdown_sources() -> None:
    if not MARKDOWN_NORMALIZER_PATH.is_file():
        raise AutomationError(
            f"Markdown normalizer is missing: {MARKDOWN_NORMALIZER_PATH}",
        )
    run_command(
        [sys.executable, str(MARKDOWN_NORMALIZER_PATH), "--check"],
        cwd=PROJECT_DIR,
    )


def normalize_module_name(raw_name: str) -> str:
    name = raw_name[:-3] if raw_name.lower().endswith(".md") else raw_name
    if (
        not name
        or name in {".", ".."}
        or any(character not in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_" for character in name)
    ):
        raise AutomationError(f"Invalid module name: {raw_name!r}")
    if not (API_DIR / f"{name}.md").is_file():
        raise AutomationError(f"Documentation module does not exist: api/{name}.md")
    return name


def selected_modules(requested: Iterable[str]) -> list[str]:
    requested_names = list(dict.fromkeys(normalize_module_name(name) for name in requested))
    if requested_names:
        return requested_names

    all_names = sorted(path.stem for path in API_DIR.glob("*.md"))
    if not all_names:
        raise AutomationError(f"No Markdown sources were found in {API_DIR}")
    return all_names


def relative_generator_path(path: Path) -> str:
    return os.path.relpath(path, GENERATOR_DIR)


def generated_html_name(module_name: str) -> str:
    return "index.html" if module_name == "toc" else f"{module_name}.html"


def validate_staged_outputs(
    modules: Iterable[str],
    stage_docs: Path,
    stage_json: Path,
) -> None:
    unresolved_placeholders = (
        "__CONTENT__",
        "__ID__",
        "__FILENAME__",
        "__SECTION__",
        "__VERSION__",
        "__TOC__",
        "__GTOC__",
    )
    for name in modules:
        html_path = stage_docs / f"{name}.html"
        json_path = stage_json / f"{name}.json"
        if not html_path.is_file() or not json_path.is_file():
            raise AutomationError(f"Generated outputs are incomplete for module: {name}")

        html = html_path.read_text(encoding="utf-8")
        if html.count("<!doctype html>") != 1 or html.count("</html>") != 1:
            raise AutomationError(f"Generated HTML structure is invalid: {html_path}")
        unresolved = [
            placeholder
            for placeholder in unresolved_placeholders
            if placeholder in html
        ]
        if unresolved:
            raise AutomationError(
                f"Generated HTML contains unresolved template placeholders "
                f"{', '.join(unresolved)}: {html_path}",
            )

        try:
            json.loads(json_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as error:
            raise AutomationError(f"Generated JSON is invalid: {json_path}: {error}") from error


def generate_into(
    modules: list[str],
    documentation_version: str,
    stage_docs: Path,
    stage_json: Path,
) -> None:
    node = ensure_node_dependencies()
    stage_docs.mkdir(parents=True, exist_ok=True)
    stage_json.mkdir(parents=True, exist_ok=True)

    entries = [
        {
            "name": name,
            "input": relative_generator_path(API_DIR / f"{name}.md"),
            "htmlOutput": str((stage_docs / f"{name}.html").resolve()),
            "jsonOutput": str((stage_json / f"{name}.json").resolve()),
        }
        for name in modules
    ]
    manifest = {
        "template": relative_generator_path(TEMPLATE_PATH),
        "version": documentation_version,
        "entries": entries,
        "linkMapInputs": [
            relative_generator_path(path)
            for path in sorted(API_DIR.glob("*.md"))
        ],
    }
    manifest_path = stage_docs.parent / "generator-manifest.json"
    manifest_path.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2),
        encoding="utf-8",
        newline="\n",
    )
    run_command(
        [node, str(BATCH_GENERATOR_PATH), str(manifest_path.resolve())],
        cwd=GENERATOR_DIR,
    )
    normalize_lf_endings(stage_docs)
    validate_staged_outputs(modules, stage_docs, stage_json)

    toc_output = stage_docs / "toc.html"
    if "toc" in modules:
        if not toc_output.is_file():
            raise AutomationError("The generated toc.html output is missing")
        toc_output.replace(stage_docs / "index.html")


def expected_outputs(
    modules: Iterable[str],
    stage_docs: Path,
    stage_json: Path,
    *,
    include_search_index: bool,
) -> list[tuple[Path, Path]]:
    outputs: list[tuple[Path, Path]] = []
    for name in modules:
        html_name = generated_html_name(name)
        outputs.append((stage_docs / html_name, DOCS_DIR / html_name))
        outputs.append((stage_json / f"{name}.json", JSON_DIR / f"{name}.json"))
    if include_search_index:
        outputs.append(
            (
                stage_docs / OFFLINE_SEARCH_INDEX_RELATIVE_PATH,
                DOCS_DIR / OFFLINE_SEARCH_INDEX_RELATIVE_PATH,
            ),
        )
    return outputs


def unexpected_generated_outputs(modules: Iterable[str]) -> list[Path]:
    expected_html = {generated_html_name(name) for name in modules}
    expected_json = {f"{name}.json" for name in modules} | LEGACY_JSON_OUTPUTS
    return [
        *sorted(
            path
            for path in DOCS_DIR.glob("*.html")
            if path.name not in expected_html
        ),
        *sorted(
            path
            for path in JSON_DIR.glob("*.json")
            if path.name not in expected_json
        ),
    ]


def remove_unexpected_outputs(paths: Iterable[Path]) -> None:
    for path in paths:
        path.unlink()
        print(f"Removed obsolete generated output: {path.relative_to(PROJECT_DIR).as_posix()}")


def atomic_copy_file(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_name(f".{destination.name}.tmp-{uuid.uuid4().hex}")
    try:
        shutil.copyfile(source, temporary)
        os.replace(temporary, destination)
    finally:
        temporary.unlink(missing_ok=True)


def atomic_write_bytes(destination: Path, content: bytes) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_name(f".{destination.name}.tmp-{uuid.uuid4().hex}")
    try:
        temporary.write_bytes(content)
        os.replace(temporary, destination)
    finally:
        temporary.unlink(missing_ok=True)


@contextmanager
def apply_version_update(plan: VersionUpdatePlan):
    applied: list[FileMutation] = []
    try:
        for mutation in plan.mutations:
            if mutation.path.read_bytes() != mutation.original:
                raise AutomationError(
                    f"Version metadata changed before synchronization: "
                    f"{mutation.path}",
                )
            atomic_write_bytes(mutation.path, mutation.updated)
            applied.append(mutation)
        yield
        changed_externally = [
            mutation.path
            for mutation in plan.mutations
            if mutation.path.read_bytes() != mutation.updated
        ]
        if changed_externally:
            rendered = ", ".join(str(path) for path in changed_externally)
            raise AutomationError(
                f"Version metadata changed unexpectedly during synchronization: "
                f"{rendered}",
            )
    except BaseException as error:
        rollback_errors: list[str] = []
        for mutation in reversed(applied):
            try:
                if mutation.path.read_bytes() != mutation.updated:
                    rollback_errors.append(
                        f"{mutation.path}: changed externally; not overwritten",
                    )
                    continue
                atomic_write_bytes(mutation.path, mutation.original)
            except OSError as rollback_error:
                rollback_errors.append(f"{mutation.path}: {rollback_error}")
        if rollback_errors:
            raise AutomationError(
                "Version synchronization failed and rollback was incomplete:\n  "
                + "\n  ".join(rollback_errors),
            ) from error
        raise


@contextmanager
def exclusive_repository_lock(
    repository: Path,
    *,
    lock_name: str,
    busy_message: str,
):
    lock_path: Path | None = None
    git = shutil.which("git")
    if git is not None:
        completed = subprocess.run(
            [git, "rev-parse", "--git-common-dir"],
            cwd=repository,
            text=True,
            encoding="utf-8",
            errors="replace",
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            check=False,
        )
        rendered_directory = completed.stdout.strip()
        if completed.returncode == 0 and rendered_directory:
            git_directory = Path(rendered_directory)
            if not git_directory.is_absolute():
                git_directory = repository / git_directory
            lock_path = git_directory.resolve() / lock_name
    if lock_path is None:
        repository_key = hashlib.sha256(
            os.path.normcase(str(repository.resolve())).encode("utf-8"),
        ).hexdigest()
        lock_path = (
            Path(tempfile.gettempdir())
            / "autojs6-documentation-locks"
            / repository_key
            / lock_name
        )
    lock_path.parent.mkdir(parents=True, exist_ok=True)
    handle = lock_path.open("a+b")

    try:
        if handle.seek(0, os.SEEK_END) == 0:
            handle.write(b"\0")
            handle.flush()
        handle.seek(0)
        if os.name == "nt":
            import msvcrt

            try:
                msvcrt.locking(handle.fileno(), msvcrt.LK_NBLCK, 1)
            except OSError as error:
                raise AutomationError(busy_message) from error
        else:
            import fcntl

            try:
                fcntl.flock(handle.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
            except OSError as error:
                raise AutomationError(busy_message) from error
        try:
            yield
        finally:
            handle.seek(0)
            if os.name == "nt":
                msvcrt.locking(handle.fileno(), msvcrt.LK_UNLCK, 1)
            else:
                fcntl.flock(handle.fileno(), fcntl.LOCK_UN)
    finally:
        handle.close()


def publish_generated_outputs(outputs: Iterable[tuple[Path, Path]]) -> None:
    for source, destination in outputs:
        if not source.is_file():
            raise AutomationError(f"Expected generated output is missing: {source}")
        atomic_copy_file(source, destination)


def stale_outputs(outputs: Iterable[tuple[Path, Path]]) -> list[Path]:
    stale: list[Path] = []
    for generated, checked_in in outputs:
        if not checked_in.is_file() or generated.read_bytes() != checked_in.read_bytes():
            stale.append(checked_in)
    return stale


def reject_link_or_reparse_point(path: Path) -> None:
    try:
        metadata = path.lstat()
    except OSError as error:
        raise AutomationError(f"Cannot inspect asset path {path}: {error}") from error
    file_attributes = getattr(metadata, "st_file_attributes", 0)
    is_reparse_point = bool(
        file_attributes & getattr(stat, "FILE_ATTRIBUTE_REPARSE_POINT", 0),
    )
    if path.is_symlink() or is_reparse_point:
        raise AutomationError(f"Asset path is a symlink or reparse point: {path}")


def validate_no_symlinks(root: Path) -> None:
    if not root.is_dir():
        raise AutomationError(f"Asset tree is missing: {root}")
    reject_link_or_reparse_point(root)
    for current_root, directory_names, file_names in os.walk(root, followlinks=False):
        current = Path(current_root)
        for name in [*directory_names, *file_names]:
            reject_link_or_reparse_point(current / name)


def synchronize_images() -> None:
    validate_no_symlinks(API_IMAGES_DIR)
    if DOCS_IMAGES_DIR.exists():
        validate_no_symlinks(DOCS_IMAGES_DIR)
    source_files = tree_files(API_IMAGES_DIR)
    destination_files = tree_files(DOCS_IMAGES_DIR)
    for name, source in source_files.items():
        atomic_copy_file(source, DOCS_IMAGES_DIR / Path(name))
    for name in sorted(set(destination_files) - set(source_files), reverse=True):
        destination_files[name].unlink()
    if DOCS_IMAGES_DIR.is_dir():
        directories = sorted(
            (path for path in DOCS_IMAGES_DIR.rglob("*") if path.is_dir()),
            key=lambda path: len(path.parts),
            reverse=True,
        )
        for directory in directories:
            try:
                directory.rmdir()
            except OSError:
                pass


def normalize_lf_endings(root: Path) -> None:
    for path in sorted(root.rglob("*")):
        if path.is_file() and path.suffix.lower() in TEXT_ASSET_SUFFIXES:
            original = path.read_bytes()
            normalized = original.replace(b"\r\n", b"\n").replace(b"\r", b"\n")
            if normalized != original:
                path.write_bytes(normalized)


def validate_offline_project(project: Path) -> tuple[Path, Path]:
    required = (
        project / "settings.gradle.kts",
        project / "app" / "build.gradle.kts",
        project / ".python" / "normalize_offline_docs.py",
    )
    missing = [path for path in required if not path.is_file()]
    if missing:
        rendered = ", ".join(str(path) for path in missing)
        raise AutomationError(f"Invalid offline-docs plugin project; missing: {rendered}")

    target = project / OFFLINE_DOCS_RELATIVE_PATH
    if os.path.lexists(target):
        reject_link_or_reparse_point(target)
        if not target.is_dir():
            raise AutomationError(f"Offline documentation target is not a directory: {target}")
        validate_no_symlinks(target)
    return target, project / ".python" / "normalize_offline_docs.py"


def validate_offline_metadata(project: Path, documentation_version: str) -> None:
    metadata_patterns = (
        (
            project / "version.properties",
            re.compile(r"(?m)^[ \t]*VERSION_NAME[ \t]*=[ \t]*([^\r\n]+)"),
        ),
        (
            project / "app" / "build.gradle.kts",
            re.compile(
                r'(?m)^\s*val\s+offlineDocsContentVersion\s*=\s*"([^"]+)"\s*$',
            ),
        ),
        (
            project / "SOURCE_PROVENANCE.md",
            re.compile(r"(?m)^-\s+Documentation version:\s+`([^`]+)`\s*$"),
        ),
        (
            project / "app/src/main/assets/licenses/docs/SOURCE_PROVENANCE.md",
            re.compile(r"(?m)^-\s+Documentation version:\s+`([^`]+)`\s*$"),
        ),
    )
    mismatches: list[str] = []
    for path, pattern in metadata_patterns:
        if not path.is_file():
            mismatches.append(f"{path} (missing)")
            continue
        match = pattern.search(path.read_text(encoding="utf-8"))
        actual = match.group(1).strip() if match else None
        if actual != documentation_version:
            mismatches.append(f"{path} ({actual or 'version not found'})")
    if mismatches:
        details = "\n  ".join(mismatches)
        raise AutomationError(
            f"Offline plugin metadata must use documentation version "
            f"{documentation_version} before synchronization:\n  {details}",
        )


def validate_regular_tree(root: Path) -> None:
    validate_no_symlinks(root)
    if not (root / "index.html").is_file():
        raise AutomationError(f"Offline documentation entry point is missing: {root / 'index.html'}")


def tree_files(root: Path) -> dict[str, Path]:
    if not root.is_dir():
        return {}
    return {
        path.relative_to(root).as_posix(): path
        for path in root.rglob("*")
        if path.is_file()
    }


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def compare_trees(source: Path, target: Path) -> tuple[list[str], list[str], list[str]]:
    source_files = tree_files(source)
    target_files = tree_files(target)
    source_names = set(source_files)
    target_names = set(target_files)
    added = sorted(source_names - target_names)
    removed = sorted(target_names - source_names)
    changed = sorted(
        name
        for name in source_names & target_names
        if source_files[name].stat().st_size != target_files[name].stat().st_size
        or file_sha256(source_files[name]) != file_sha256(target_files[name])
    )
    return added, changed, removed


def print_tree_changes(added: list[str], changed: list[str], removed: list[str]) -> None:
    print(
        "Offline plugin asset changes: "
        f"added={len(added)}, changed={len(changed)}, removed={len(removed)}",
    )
    details = [
        *(f"+ {name}" for name in added),
        *(f"~ {name}" for name in changed),
        *(f"- {name}" for name in removed),
    ]
    for line in details[:30]:
        print(f"  {line}")
    if len(details) > 30:
        print(f"  ... and {len(details) - 30} more")


def validate_staged_site(
    source_docs: Path,
    normalizer: Path,
    temporary_root: Path,
) -> Path:
    stage_root = temporary_root / "normalizer-root"
    stage_docs = stage_root / OFFLINE_DOCS_RELATIVE_PATH
    stage_normalizer = stage_root / ".python" / "normalize_offline_docs.py"
    stage_normalizer.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(source_docs, stage_docs)
    shutil.copyfile(normalizer, stage_normalizer)
    normalize_lf_endings(stage_docs)
    run_command([sys.executable, str(stage_normalizer), "--check"], cwd=stage_root)
    validate_regular_tree(stage_docs)
    return stage_docs


def gradle_verification_command(project: Path) -> list[str]:
    if os.name == "nt":
        wrapper = project / "gradlew.bat"
        if not wrapper.is_file():
            raise AutomationError(f"Gradle wrapper is missing: {wrapper}")
        command_processor = os.environ.get("COMSPEC") or executable("cmd.exe")
        return [
            command_processor,
            "/d",
            "/c",
            str(wrapper),
            "-Pautojs.gradle.build.number.auto.increment.enabled=false",
            "-Pautojs.gradle.build.time.update.enabled=false",
            ":app:testDebugUnitTest",
            ":app:verifyOfflineDocsApks",
            "--no-daemon",
        ]
    wrapper = project / "gradlew"
    if not wrapper.is_file():
        raise AutomationError(f"Gradle wrapper is missing: {wrapper}")
    return [
        str(wrapper),
        "-Pautojs.gradle.build.number.auto.increment.enabled=false",
        "-Pautojs.gradle.build.time.update.enabled=false",
        ":app:testDebugUnitTest",
        ":app:verifyOfflineDocsApks",
        "--no-daemon",
    ]


def replace_offline_tree(
    staged_docs: Path,
    target: Path,
    project: Path,
    normalizer: Path,
    verify_offline: bool,
) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    suffix = uuid.uuid4().hex
    incoming = target.parent / f".docs-incoming-{suffix}"
    backup = target.parent / f".docs-backup-{suffix}"
    failed = target.parent / f".docs-failed-{suffix}"
    target_existed = target.exists()

    try:
        shutil.copytree(staged_docs, incoming)
        if target_existed:
            target.rename(backup)
        incoming.rename(target)
        try:
            run_command(
                [sys.executable, str(normalizer), "--check"],
                cwd=project,
            )
            if verify_offline:
                run_command(
                    gradle_verification_command(project),
                    cwd=project,
                    show_output=True,
                )
        except BaseException:
            target.rename(failed)
            if target_existed:
                backup.rename(target)
            raise
        else:
            if target_existed:
                shutil.rmtree(backup)
    finally:
        if incoming.exists():
            shutil.rmtree(incoming)
        if failed.exists():
            shutil.rmtree(failed)
        if backup.exists() and not target.exists():
            backup.rename(target)


def sync_offline_site(
    source_docs: Path,
    offline_project: Path,
    documentation_version: str,
    *,
    dry_run: bool,
    verify_offline: bool,
    validate_metadata: bool = True,
) -> None:
    target, normalizer = validate_offline_project(offline_project)
    if validate_metadata:
        validate_offline_metadata(offline_project, documentation_version)
    validate_regular_tree(source_docs)
    with tempfile.TemporaryDirectory(prefix="autojs6-offline-docs-") as temporary:
        staged_docs = validate_staged_site(source_docs, normalizer, Path(temporary))
        added, changed, removed = compare_trees(staged_docs, target)
        print_tree_changes(added, changed, removed)
        if dry_run:
            print("Dry run completed; the offline plugin was not modified.")
            return
        if not added and not changed and not removed:
            print("Offline plugin assets are already up to date.")
            if verify_offline:
                run_command(
                    gradle_verification_command(offline_project),
                    cwd=offline_project,
                    show_output=True,
                )
                print("Offline plugin Gradle verification completed.")
            return
        replace_offline_tree(
            staged_docs,
            target,
            offline_project,
            normalizer,
            verify_offline,
        )
        print(f"Offline plugin assets synchronized: {target}")


def run_automation(
    args: argparse.Namespace,
    documentation_version: str,
    offline_project: Path | None,
) -> int:
    modules = selected_modules(args.modules)
    full_build = not args.modules

    with tempfile.TemporaryDirectory(prefix="autojs6-docs-build-") as temporary:
        stage_root = Path(temporary)
        stage_docs = stage_root / "docs"
        stage_json = stage_root / "json"
        generate_into(modules, documentation_version, stage_docs, stage_json)
        search_index_stats: tuple[int, int] | None = None
        if full_build:
            search_index_stats = generate_search_index(
                stage_docs.glob("*.html"),
                stage_docs / OFFLINE_SEARCH_INDEX_RELATIVE_PATH,
            )
        outputs = expected_outputs(
            modules,
            stage_docs,
            stage_json,
            include_search_index=full_build,
        )
        unexpected = unexpected_generated_outputs(modules) if full_build else []
        if args.check:
            stale = stale_outputs(outputs)
            validate_no_symlinks(API_IMAGES_DIR)
            if DOCS_IMAGES_DIR.exists():
                validate_no_symlinks(DOCS_IMAGES_DIR)
            image_changes = compare_trees(API_IMAGES_DIR, DOCS_IMAGES_DIR)
            if any(image_changes):
                stale.append(DOCS_IMAGES_DIR)
            stale.extend(unexpected)
            if stale:
                print("Generated documentation is stale:")
                for path in stale:
                    print(f"  {path.relative_to(PROJECT_DIR).as_posix()}")
                return 1
            print(
                f"Generated documentation is current "
                f"({len(modules)} modules, AutoJs6 {documentation_version}).",
            )
            return 0
        publish_generated_outputs(outputs)
        remove_unexpected_outputs(unexpected)
        synchronize_images()

        print(
            f"Generated {len(modules)} modules for AutoJs6 "
            f"{documentation_version} under {DOCS_DIR} and {JSON_DIR}.",
        )
        if search_index_stats is not None:
            entry_count, byte_count = search_index_stats
            print(
                f"Generated offline search index: "
                f"entries={entry_count}, bytes={byte_count}.",
            )

        if args.sync_offline:
            if offline_project is None:
                raise AutomationError("Offline plugin path was not resolved")
            validate_no_symlinks(DOCS_DIR)
            offline_snapshot = stage_root / "offline-site"
            shutil.copytree(DOCS_DIR, offline_snapshot)
            sync_offline_site(
                offline_snapshot,
                offline_project,
                documentation_version,
                dry_run=args.dry_run,
                verify_offline=args.verify_offline,
                validate_metadata=not (
                    args.increment_versions and args.dry_run
                ),
            )
    return 0


def main() -> int:
    args = parse_args()
    with exclusive_repository_lock(
        PROJECT_DIR,
        lock_name="autojs6-docs-generation.lock",
        busy_message="Another documentation generation is already running",
    ):
        verify_markdown_sources()
        project_config = load_json_object(PROJECT_CONFIG_PATH, optional=False)
        local_config = load_json_object(LOCAL_CONFIG_PATH, optional=True)
        target_version = target_autojs6_version(project_config)
        documentation_version = resolve_documentation_version(
            args,
            project_config,
            local_config,
        )
        if args.increment_versions and documentation_version != target_version:
            raise AutomationError(
                "--increment-versions requires the generated version to equal "
                f"project.json targetAutoJs6Version ({target_version}); remove "
                "--version or AUTOJS6_DOCS_VERSION overrides",
            )
        project_version_name = project_config.get("versionName")
        if not args.increment_versions and project_version_name != target_version:
            raise AutomationError(
                f"project.json versionName must equal targetAutoJs6Version "
                f"({target_version}); run generator/auto-generate-for-autojs6.bat "
                f"to synchronize versions",
            )

        offline_project: Path | None = None
        if args.sync_offline:
            offline_project = configured_path(
                args.offline_project,
                "AUTOJS6_OFFLINE_DOCS_PROJECT",
                local_config,
                "offlineDocsProject",
            )
            if offline_project is None:
                raise AutomationError(
                    "Offline plugin path is not configured. Copy "
                    "generator/local-config.example.json to "
                    "generator/local-config.json or pass --offline-project.",
                )

        plugin_lock = (
            exclusive_repository_lock(
                offline_project,
                lock_name="autojs6-docs-sync.lock",
                busy_message=(
                    "Another offline documentation synchronization is "
                    "already running"
                ),
            )
            if offline_project is not None
            else nullcontext()
        )
        with plugin_lock:
            version_plan: VersionUpdatePlan | None = None
            if args.increment_versions:
                if offline_project is None:
                    raise AutomationError("Offline plugin path was not resolved")
                version_plan = prepare_version_update_plan(
                    project_config,
                    offline_project,
                    target_version,
                )
                if args.dry_run:
                    print_version_update(version_plan, preview=True)

            version_context = (
                apply_version_update(version_plan)
                if version_plan is not None and not args.dry_run
                else nullcontext()
            )
            with version_context:
                result = run_automation(
                    args,
                    documentation_version,
                    offline_project,
                )
            if version_plan is not None and not args.dry_run:
                print_version_update(version_plan, preview=False)
            return result


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except AutomationError as error:
        print(f"Error: {error}", file=sys.stderr)
        raise SystemExit(1)
