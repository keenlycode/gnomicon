"""Generate equivalent dependency-free ESM APIs for npm and JSR."""
import hashlib
import json
import re

RESERVED = set("await break case catch class const continue debugger default delete do else enum export extends false finally for function if implements import in instanceof interface let new null package private protected public return static super switch this throw true try typeof var void while with yield".split())


def export_names(names):
    result, used = {}, set()
    for name in sorted(names):
        # Keep the original icon name for subpath imports; only JS identifiers vary.
        ascii_name = "".join(c if ord(c) < 128 else f"-u{ord(c):x}-" for c in name)
        parts = re.findall(r"[A-Za-z0-9_$]+", ascii_name)
        identifier = parts[0] + "".join(p[:1].upper() + p[1:] for p in parts[1:])
        if identifier[0].isdigit():
            identifier = "icon" + identifier
        if identifier in RESERVED:
            identifier += "Icon"
        if identifier in used:
            identifier += "_" + hashlib.sha256(name.encode()).hexdigest()[:8]
        if identifier in used:
            raise ValueError(f"Export collision for {name}")
        used.add(identifier)
        result[name] = identifier
    return result


def module_paths(names):
    """JSR subpath exports allow ASCII letters, numbers, _, -, . and / only."""
    result, used = {}, set()
    for name in sorted(names):
        slug = "".join(c if re.fullmatch(r"[A-Za-z0-9_.-]", c)
                       else f"-u{ord(c):04x}-" for c in name).strip("-")
        if slug in used:
            slug += "-" + hashlib.sha256(name.encode()).hexdigest()[:8]
        if slug in used:
            raise ValueError(f"Module path collision for {name}")
        used.add(slug)
        result[name] = f"icons/{slug}"
    return result


def emit_modules(dist, icons, version, jsr_scope):
    js = dist / "modules"
    ts = dist / "jsr" / "icons"
    js.mkdir(parents=True)
    ts.mkdir(parents=True)
    js_exports, ts_exports = [], []
    config_exports = {".": "./mod.ts"}
    for icon in icons:
        name, exported = icon["name"], icon["exportName"]
        module = icon["importPath"].removeprefix("icons/")
        svg = (dist / icon["svg"]).read_text()
        value = json.dumps(svg, ensure_ascii=False)
        comment = f"/** {name} — {icon['source']}; see icons.json and licenses/. */\n"
        (js / f"{module}.js").write_text(comment + f"export const svg = {value};\nexport default svg;\n")
        (js / f"{module}.d.ts").write_text(comment + "export declare const svg: string;\nexport default svg;\n")
        (ts / f"{module}.ts").write_text(comment + f"export const svg: string = {value};\nexport default svg;\n")
        js_exports.append(f'export {{ svg as {exported} }} from "./modules/{module}.js";')
        ts_exports.append(f'export {{ svg as {exported} }} from "./icons/{module}.ts";')
        config_exports[f"./icons/{module}"] = f"./icons/{module}.ts"
    (dist / "index.js").write_text("\n".join(js_exports) + "\n")
    (dist / "index.d.ts").write_text("\n".join(js_exports) + "\n")
    (dist / "jsr/mod.ts").write_text("\n".join(ts_exports) + "\n")
    # A separate generated tree keeps docs tooling and npm metadata out of JSR.
    config = {
        "name": f"@{jsr_scope}/gnomicon",
        "version": version,
        "exports": config_exports,
        "publish": {"include": ["mod.ts", "icons/", "icons.json", "upstream.json",
                                "licenses/", "LICENSE.md", "README.md"]},
    }
    (dist / "jsr/jsr.json").write_text(json.dumps(config, indent=2, ensure_ascii=False) + "\n")
