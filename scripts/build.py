"""Build offline SVG assets and npm/JSR modules from verified upstream sources."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import shutil
import tempfile

from scour.scour import sanitizeOptions, scourString

try:
    from . import svg, package
except ImportError:
    import svg
    import package

ROOT = Path(__file__).resolve().parents[1]


def selected_icons(config):
    receipt = json.loads((ROOT / "src/upstream.json").read_text())
    if receipt != config:
        raise ValueError("Upstream configuration changed; run scripts/sync.py first")
    hashes = json.loads((ROOT / "src/inventory.json").read_text())
    actual = {p.relative_to(ROOT / "src/icons").as_posix(): p
              for p in (ROOT / "src/icons").rglob("*") if p.is_file()}
    if actual.keys() != hashes.keys():
        raise ValueError("Source inventory differs from pinned import")
    for rel, path in actual.items():
        if hashlib.sha256(path.read_bytes()).hexdigest() != hashes[rel]:
            raise ValueError(f"Source content differs from pinned import: {rel}")
    result, collisions = {}, []
    for source in config["sources"]:
        base = ROOT / "src/icons" / source["id"]
        paths = sorted(base.rglob("*"), key=lambda p: (
            "legacy" in p.relative_to(base).parts,
            p.name.endswith("-rtl-symbolic.svg"),
            p.relative_to(base).as_posix(),
        ))
        for path in paths:
            if not path.is_file():
                continue
            name = svg.icon_name(path.name)
            rel = path.relative_to(base).as_posix()
            record = {"name": name, "source": source["id"],
                      "sourcePath": f"{source['path']}/{rel}",
                      "svg": f"svg/{name}.svg"}
            if name in result:
                collisions.append({"name": name, "kept": result[name][1], "omitted": record})
            else:
                result[name] = (path, record)
    return result, collisions


def optimize(element):
    options = sanitizeOptions()
    options.strip_xml_prolog = True
    options.indent_type = "none"
    options.newlines = False
    options.enable_viewboxing = False
    options.strip_ids = False
    # No geometry rounding below Scour's defaults; preserve strokes and masks.
    return scourString(svg.serialize(element), options=options).strip()


def build(output=None, jsr_scope=None):
    if jsr_scope and not re.fullmatch(r"[a-z0-9][a-z0-9-]{0,30}[a-z0-9]", jsr_scope):
        raise ValueError("JSR scope must be 2–32 lowercase letters, digits or hyphens")
    config = json.loads((ROOT / "upstream.json").read_text())
    manifest = json.loads((ROOT / "package.json").read_text())
    if manifest["version"] != config["version"]:
        raise ValueError("package.json and upstream.json versions must match")
    candidates, collisions = selected_icons(config)
    names = package.export_names(candidates)
    paths = package.module_paths(candidates)
    output = Path(output or ROOT / "dist")
    if output.is_symlink():
        raise ValueError("Refusing symlink output directory")
    output = output.resolve()
    if output == ROOT or ROOT.is_relative_to(output) or output.is_relative_to(ROOT / "src"):
        raise ValueError("Refusing unsafe output directory")
    marker = ".gnomicon-dist"
    signature = "Gnomicon generated distribution v1\n"
    if output.exists() and (not output.is_dir() or (any(output.iterdir()) and (
        not (output / marker).is_file() or (output / marker).read_text() != signature
    ))):
        raise ValueError("Refusing to replace an unmarked output directory")
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix=".gnomicon-build-", dir=output.parent) as tmp:
        stage = Path(tmp) / "dist"
        (stage / "svg").mkdir(parents=True)
        (stage / marker).write_text("Gnomicon generated distribution v1\n")
        icons = []
        for name, (path, record) in sorted(candidates.items()):
            try:
                converted = svg.normalize(path.read_text(), name)
                optimized = optimize(converted)
                (stage / record["svg"]).write_text(optimized + "\n")
            except Exception as error:
                raise ValueError(f"Converting {path}: {error}") from error
            icons.append({**record, "exportName": names[name], "importPath": paths[name]})
        catalog = {"version": config["version"], "sources": config["sources"], "icons": icons}
        (stage / "icons.json").write_text(json.dumps(catalog, indent=2, ensure_ascii=False) + "\n")
        (stage / "collisions.json").write_text(json.dumps(collisions, indent=2, ensure_ascii=False) + "\n")
        package.emit_modules(stage, icons, config["version"], jsr_scope)
        for target in (stage, stage / "jsr"):
            shutil.copytree(ROOT / "licenses", target / "licenses")
            shutil.copyfile(ROOT / "license.md", target / "LICENSE.md")
            shutil.copyfile(ROOT / "readme.md", target / "README.md")
            shutil.copyfile(ROOT / "upstream.json", target / "upstream.json")
        shutil.copyfile(stage / "icons.json", stage / "jsr/icons.json")
        # Publish only a complete, successful build; no stale previous icons survive.
        if output.exists():
            shutil.rmtree(output)
        shutil.move(str(stage), str(output))
    print(f"Built {len(icons)} icons; {len(collisions)} source-name collisions recorded")
    if not jsr_scope:
        print("JSR scope is a placeholder. Rebuild with --jsr-scope YOUR-SCOPE before publishing.")
    return catalog


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path)
    parser.add_argument("--jsr-scope")
    args = parser.parse_args()
    build(args.out, args.jsr_scope)
