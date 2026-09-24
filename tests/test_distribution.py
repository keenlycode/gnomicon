import hashlib
import json
from pathlib import Path
import tempfile
import unittest
import xml.etree.ElementTree as ET

from scripts import build, svg


class DistributionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory()
        cls.output = Path(cls.temp.name) / "dist"
        cls.catalog = build.build(cls.output)

    @classmethod
    def tearDownClass(cls):
        cls.temp.cleanup()

    def test_exact_upstream_union_and_priority(self):
        expected = {svg.icon_name(p.name) for p in (build.ROOT / "src/icons").rglob("*") if p.is_file()}
        actual = {icon["name"] for icon in self.catalog["icons"]}
        self.assertEqual(actual, expected)
        self.assertEqual(len(actual), len(self.catalog["icons"]))
        folder = next(i for i in self.catalog["icons"] if i["name"] == "folder")
        self.assertEqual(folder["source"], "icon-dev-kit")
        self.assertFalse((self.output / "icon.svg").exists())

    def test_modules_svg_and_manifest_agree(self):
        identifiers = set()
        for icon in self.catalog["icons"]:
            name = icon["importPath"].removeprefix("icons/")
            self.assertNotIn(icon["exportName"], identifiers)
            identifiers.add(icon["exportName"])
            raw = (self.output / icon["svg"]).read_text()
            ET.fromstring(raw)
            module = (self.output / f"modules/{name}.js").read_text()
            payload = module.split("export const svg = ", 1)[1].split(";\nexport default svg;", 1)[0]
            self.assertEqual(json.loads(payload), raw)
            typed = (self.output / f"jsr/icons/{name}.ts").read_text()
            self.assertIn("export const svg: string = " + payload, typed)
            self.assertTrue((self.output / f"modules/{name}.d.ts").is_file())
            self.assertNotIn(svg.GPA, raw)
            self.assertNotIn("url(#gpa:", raw)

    def test_svg_references_resolve(self):
        for path in (self.output / "svg").glob("*.svg"):
            root = ET.parse(path).getroot()
            ids = [node.get("id") for node in root.iter() if node.get("id")]
            self.assertEqual(len(ids), len(set(ids)), path.name)
            for node in root.iter():
                for value in node.attrib.values():
                    for ref in svg.REF.findall(value):
                        self.assertIn(ref, ids, path.name)

    def test_jsr_exports_and_licenses(self):
        config = json.loads((self.output / "jsr/jsr.json").read_text())
        self.assertEqual(config["version"], self.catalog["version"])
        self.assertEqual(config["name"], "@devcapsule/gnomicon")
        self.assertEqual(config["license"], "CC-BY-SA-4.0")
        for filename in ("LICENSE.md", "README.md"):
            notice = (self.output / "jsr" / filename).read_text()
            for license_name in ("CC-BY-SA-4.0", "CC BY-SA 3.0 US", "CC0 1.0"):
                self.assertIn(license_name, notice)
        self.assertEqual(len(config["exports"]), len(self.catalog["icons"]) + 1)
        for entry in config["exports"].values():
            self.assertTrue((self.output / "jsr" / entry).is_file())
        for source in self.catalog["sources"]:
            for filename in source["licenseFiles"]:
                self.assertEqual((self.output / "licenses" / source["id"] / filename).read_bytes(),
                                 (self.output / "jsr/licenses" / source["id"] / filename).read_bytes())

    def test_rebuild_is_deterministic_and_removes_stale_outputs(self):
        def hashes():
            return {p.relative_to(self.output).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest()
                    for p in self.output.rglob("*") if p.is_file()}
        before = hashes()
        (self.output / "svg/obsolete.svg").write_text("obsolete")
        build.build(self.output)
        self.assertEqual(before, hashes())

    def test_refuses_unmarked_output(self):
        output = Path(self.temp.name) / "unrelated"
        output.mkdir()
        (output / "keep.txt").write_text("keep")
        with self.assertRaisesRegex(ValueError, "unmarked"):
            build.build(output)
        self.assertEqual((output / "keep.txt").read_text(), "keep")

    def test_source_receipt_rejects_config_changes(self):
        config = json.loads((build.ROOT / "upstream.json").read_text())
        config["version"] = "99.0.0"
        with self.assertRaisesRegex(ValueError, "configuration changed"):
            build.selected_icons(config)


if __name__ == "__main__":
    unittest.main()
