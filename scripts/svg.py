"""Convert pinned GNOME artwork to static, recolorable browser SVG.

Grappa initial states are resolved at build time; GTK transitions, continuous
animations and weight interpolation are not browser animation implementations.
Ordinary SVG geometry, masks, opacity, paint order and transforms are preserved.
"""
import re
import xml.etree.ElementTree as ET

SVG = "http://www.w3.org/2000/svg"
GPA = "https://www.gtk.org/grappa"
XLINK = "http://www.w3.org/1999/xlink"
ET.register_namespace("", SVG)
ET.register_namespace("xlink", XLINK)
PAINTS = {"foreground": "currentColor", "none": "none", "transparent": "none"}
for semantic in ("success", "warning", "error", "accent"):
    PAINTS[semantic] = f"var(--gnomicon-{semantic}, currentColor)"
PRESENTATION = {
    "fill", "fill-opacity", "fill-rule", "stroke", "stroke-width", "stroke-opacity",
    "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-dasharray",
    "stroke-dashoffset", "opacity", "paint-order", "clip-path", "clip-rule", "mask",
    "filter", "transform", "display", "visibility", "vector-effect",
    "color-interpolation-filters", "stop-color", "stop-opacity",
}
FOREGROUNDS = {
    "#000", "#000000", "black", "rgb(0,0,0)", "#474747", "#2e3436", "#2e3434",
    "#222", "#222222", "#212121", "#241f31", "#3d3846", "#555753", "#5e5c64", "#2d3336",
}
REMOVE_TAGS = {"metadata", "title", "desc"}
DRAWABLE = {"path", "circle", "rect", "ellipse", "polygon", "polyline", "line"}
REF = re.compile(r"url\(['\"]?#([^)'\"]+)['\"]?\)")


def local(tag):
    return tag.rsplit("}", 1)[-1]


def icon_name(filename):
    return re.sub(r"-symbolic(?=-rtl$|$)", "", filename.rsplit(".", 1)[0])


def initial_state(root):
    names = root.get(f"{{{GPA}}}state-names", "").split()
    state = root.get(f"{{{GPA}}}state", "0")
    if state.isdigit():
        number = int(state)
        return {state, names[number]} if number < len(names) else {state}
    if state not in names:
        raise ValueError(f"Unknown initial state: {state}")
    return {state, str(names.index(state))}


def normalize(text, name):
    root = ET.fromstring(text)
    if root.tag != f"{{{SVG}}}svg":
        raise ValueError(f"Not an SVG: {name}")
    state = initial_state(root)
    width = root.get("width", "16").removesuffix("px")
    height = root.get("height", "16").removesuffix("px")
    root.set("viewBox", root.get("viewBox", f"0 0 {width} {height}"))
    root.set("width", "16")
    root.set("height", "16")

    def walk(node, protected=False):
        tag = local(node.tag)
        protected = protected or tag in {"mask", "clipPath", "filter", "pattern"}
        for child in list(node):
            child_tag = local(child.tag)
            states = child.get(f"{{{GPA}}}states", "all").split()
            if child_tag in REMOVE_TAGS or not child.tag.startswith(f"{{{SVG}}}"):
                node.remove(child)
            elif child_tag in {"script", "foreignObject", "style"}:
                raise ValueError(f"Unsupported executable/style element in {name}")
            elif not protected and "all" not in states and not state.intersection(states):
                node.remove(child)
            else:
                walk(child, protected)
        # Grappa exporters hide animated paths in ordinary SVG; GTK determines
        # their visibility from gpa:states instead. We already selected that state.
        if not protected and f"{{{GPA}}}states" in node.attrib:
            node.attrib.pop("visibility", None)
        # CSS presentation has precedence over XML presentation attributes.
        style = node.attrib.pop("style", "")
        for declaration in style.split(";"):
            key, sep, value = declaration.partition(":")
            if sep and key.strip() in PRESENTATION:
                node.set(key.strip(), value.strip())
        for key in ("fill", "stroke"):
            paint = node.get(f"{{{GPA}}}{key}")
            fallback = node.get(key)
            reference = REF.search(fallback or "")
            if paint is None and reference and reference.group(1).startswith("gpa:"):
                paint = reference.group(1).removeprefix("gpa:")
            if not protected:
                # Keep explicit symbolic roles; don't recolor mask luminance.
                if paint is not None:
                    node.set(key, PAINTS.get(paint, paint))
                elif fallback and fallback.lower().replace(" ", "") in FOREGROUNDS:
                    node.set(key, "currentColor")
                for cls in node.get("class", "").split():
                    role = cls.removesuffix(f"-{key}")
                    if cls == f"{role}-{key}" and role in PAINTS:
                        node.set(key, PAINTS[role])
                    elif key == "fill" and cls in PAINTS:
                        node.set(key, PAINTS[cls])
            elif reference and reference.group(1).startswith("gpa:"):
                node.set(key, "black")
        triplet = node.get(f"{{{GPA}}}stroke-width")
        if triplet:
            values = triplet.split()
            node.set("stroke-width", values[1] if len(values) == 3 else values[0])
        for key in list(node.attrib):
            if key.startswith("on"):
                raise ValueError(f"Event handler in {name}")
            if key.startswith("{") and not key.startswith(f"{{{XLINK}}}"):
                del node.attrib[key]
            elif key in {"class", "color"} or key.startswith("font-"):
                del node.attrib[key]
        node.text = node.text.strip() if node.text and node.text.strip() else None
        node.tail = None

    walk(root)
    # Filled legacy symbolics inherit the same foreground as stroked Grappa icons.
    root.set("fill", root.get("fill", "currentColor"))
    root.attrib.pop("id", None)
    scope_ids(root, name)
    if not any(local(e.tag) in DRAWABLE for e in root.iter()):
        raise ValueError(f"Empty default state after conversion: {name}")
    return root


def scope_ids(root, name):
    referenced = set()
    for node in root.iter():
        for key, value in node.attrib.items():
            referenced.update(REF.findall(value))
            if local(key) == "href" and value.startswith("#"):
                referenced.add(value[1:])
    ids = {}
    for node in root.iter():
        old = node.attrib.pop("id", None)
        if old in referenced:
            if old in ids:
                raise ValueError(f"Duplicate referenced source ID in {name}: {old}")
            ids[old] = f"gnomicon-{name}-{len(ids)}"
            node.set("id", ids[old])
    for node in root.iter():
        for key, value in list(node.attrib.items()):
            if local(key) == "href":
                if value.startswith("#"):
                    value = "#" + ids[value[1:]]
                elif not value.startswith("data:image/"):
                    raise ValueError(f"External SVG resource in {name}")
            def replace(match):
                old = match.group(1)
                if old not in ids:
                    raise ValueError(f"Unresolved SVG reference in {name}: {old}")
                return f"url(#{ids[old]})"
            node.set(key, REF.sub(replace, value))


def serialize(root):
    return ET.tostring(root, encoding="unicode", short_empty_elements=True)

