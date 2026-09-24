from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from scripts.sync import install_snapshot, inventory


class SyncTests(unittest.TestCase):
    def test_install_replaces_directories_and_receipts(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            stage = root / "stage"
            stage.mkdir()
            old = root / "icons"
            old.mkdir()
            (old / "obsolete.svg").write_text("old")
            new = stage / "icons"
            new.mkdir()
            (new / "current.svg").write_text("new")
            (stage / "receipt.json").write_text("new receipt")
            install_snapshot(stage, [(new, old), (stage / "receipt.json", root / "receipt.json")])
            self.assertEqual([p.name for p in old.iterdir()], ["current.svg"])
            self.assertEqual((root / "receipt.json").read_text(), "new receipt")

    def test_failed_install_restores_all_prior_data(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            stage = root / "stage"
            stage.mkdir()
            for filename in ("icons", "licenses", "receipt"):
                (root / filename).write_text("old " + filename)
                (stage / filename).write_text("new " + filename)
            rename = Path.rename

            def failing_rename(path, target):
                if path == stage / "licenses":
                    raise OSError("simulated full disk")
                return rename(path, target)

            with patch.object(Path, "rename", failing_rename):
                with self.assertRaisesRegex(OSError, "full disk"):
                    install_snapshot(stage, [(stage / n, root / n) for n in ("icons", "licenses", "receipt")])
            for name in ("icons", "licenses", "receipt"):
                self.assertEqual((root / name).read_text(), "old " + name)
            self.assertFalse((stage / "RECOVERY-NEEDED").exists())

    def test_rollback_failure_preserves_recovery_evidence(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            stage = root / "stage"
            stage.mkdir()
            (root / "icons").write_text("original")
            (stage / "icons").write_text("replacement")
            rename = Path.rename

            def failing_rename(path, target):
                if path == stage / "icons" or path.parent == stage / "backups":
                    raise OSError("simulated persistent permission error")
                return rename(path, target)

            with patch.object(Path, "rename", failing_rename):
                with self.assertRaisesRegex(RuntimeError, "backups retained"):
                    install_snapshot(stage, [(stage / "icons", root / "icons")])
            self.assertEqual((stage / "backups/0").read_text(), "original")
            self.assertTrue((stage / "RECOVERY-NEEDED").exists())

    def test_import_rejects_escaping_symlinks(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "checkout/icons").mkdir(parents=True)
            (root / "outside.svg").write_text("not part of checkout")
            (root / "checkout/icons/escape.svg").symlink_to(root / "outside.svg")
            with self.assertRaisesRegex(ValueError, "escapes checkout"):
                inventory(root / "checkout", {"path": "icons", "extensions": [".svg"]})


if __name__ == "__main__":
    unittest.main()
