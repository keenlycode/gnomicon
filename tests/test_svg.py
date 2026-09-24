import unittest
import xml.etree.ElementTree as ET

from scripts import svg
from scripts.package import export_names


def document(body, attributes=""):
    return f'<svg xmlns="{svg.SVG}" xmlns:gpa="{svg.GPA}" width="16" height="16" {attributes}>{body}</svg>'


class SVGTests(unittest.TestCase):
    def test_normalizes_rtl_names(self):
        self.assertEqual(svg.icon_name("go-next-symbolic-rtl.svg"), "go-next-rtl")
        self.assertEqual(svg.icon_name("go-next-rtl-symbolic.svg"), "go-next-rtl")
        self.assertEqual(svg.icon_name("play.gpa"), "play")

    def test_grappa_initial_state_and_stroke(self):
        source = document(
            '<path d="M1 1h10" visibility="hidden" gpa:states="outline" gpa:stroke="foreground" fill="none"/>'
            '<path d="M2 2h5" gpa:states="filled"/>'
            '<path d="M3 3h2" gpa:states="none"/>',
            'gpa:version="1" gpa:state="0" gpa:state-names="outline filled"',
        )
        root = svg.normalize(source, "test")
        paths = root.findall(f"{{{svg.SVG}}}path")
        self.assertEqual(len(paths), 1)
        self.assertEqual(paths[0].get("stroke"), "currentColor")
        self.assertEqual(paths[0].get("fill"), "none")
        self.assertIsNone(paths[0].get("visibility"))
        self.assertFalse(any(svg.GPA in k for e in root.iter() for k in e.attrib))

    def test_numeric_and_named_initial_state(self):
        for initial in ["1", "filled"]:
            root = svg.normalize(document(
                '<path d="M1 1h10" gpa:states="1"/>',
                f'gpa:state="{initial}" gpa:state-names="outline filled"',
            ), "test")
            self.assertEqual(len(list(root)), 1)

    def test_quoted_paint_and_style_precedence(self):
        root = svg.normalize(document(
            '<path d="M1 1h5" fill="red" style="fill:none;stroke-width:2" '
            'stroke="url(&quot;#gpa:foreground&quot;) black"/>'
        ), "test")
        path = list(root)[0]
        self.assertEqual(path.get("fill"), "none")
        self.assertEqual(path.get("stroke"), "currentColor")
        self.assertEqual(path.get("stroke-width"), "2")

    def test_semantic_color(self):
        root = svg.normalize(document('<path d="M0 0h5v5z" gpa:fill="warning"/>'), "a")
        self.assertEqual(list(root)[0].get("fill"), "var(--gnomicon-warning, currentColor)")

    def test_masks_and_internal_ids_are_preserved_and_scoped(self):
        source = document('<defs><mask id="m"><rect width="16" height="16" fill="black"/></mask></defs>'
                          '<path d="M0 0h16v16z" mask="url(#m)" fill="#222"/>')
        root = svg.normalize(source, "first")
        other = svg.normalize(source, "second")
        self.assertIn('fill="black"', svg.serialize(root))
        self.assertIn('fill="currentColor"', svg.serialize(root))
        self.assertIn('mask="url(#gnomicon-first-0)"', svg.serialize(root))
        self.assertNotEqual(root.find(f".//{{{svg.SVG}}}mask").get("id"),
                            other.find(f".//{{{svg.SVG}}}mask").get("id"))

    def test_unreferenced_duplicate_ids_are_removed(self):
        root = svg.normalize(document('<path id="x" d="M1 1h1"/><path id="x" d="M2 2h1"/>'), "x")
        self.assertFalse(any("id" in e.attrib for e in root.iter()))

    def test_unsafe_content_and_broken_refs_fail(self):
        for body in ['<script/>', '<path d="M1 1h1" onclick="alert(1)"/>',
                     '<path d="M1 1h1" mask="url(#missing)"/>',
                     '<image href="https://example.test/tracker.png"/>']:
            with self.assertRaises((ValueError, KeyError)):
                svg.normalize(document(body), "unsafe")

    def test_svg_keeps_viewbox_and_dimensions(self):
        root = svg.normalize(document('<path d="M1 1h1"/>'), "test")
        self.assertEqual(root.get("viewBox"), "0 0 16 16")
        self.assertEqual(root.get("width"), "16")
        self.assertEqual(root.get("height"), "16")

    def test_exports_are_unique_and_legal(self):
        names = export_names(["import", "3d-box", "a-b", "aB", "□-button", "application-rss+xml"])
        self.assertEqual(names["import"], "importIcon")
        self.assertEqual(len(set(names.values())), len(names))
        for name in names.values():
            self.assertRegex(name, r"^[A-Za-z_$][\w$]*$")


if __name__ == "__main__":
    unittest.main()
