"""Explicit, pinned upstream import. Normal builds never fetch the network."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]


def git(checkout, *args):
    return subprocess.check_output(
        ["git", "-C", str(checkout), *args], text=True
    ).strip()


def inventory(checkout, source):
    base = checkout / source["path"]
    paths = sorted(p for p in base.rglob("*") if p.suffix in source["extensions"])
    if not paths:
        raise ValueError(f"No icons in {base}")
    for path in paths:
        # Git symlinks may point elsewhere in the same pinned checkout.
        if not path.resolve().is_relative_to(checkout.resolve()):
            raise ValueError(f"Upstream symlink escapes checkout: {path}")
        if not path.is_file():
            raise ValueError(f"Missing upstream asset: {path}")
    return paths


def install_snapshot(stage, replacements):
    """Swap same-filesystem staged paths; restore the previous snapshot on failure."""
    backups = stage / "backups"
    backups.mkdir()
    changed = []
    try:
        for index, (incoming, target) in enumerate(replacements):
            target.parent.mkdir(parents=True, exist_ok=True)
            backup = backups / str(index)
            if target.exists():
                target.rename(backup)
            changed.append((target, backup))
            incoming.rename(target)
    except Exception:
        recovery_errors = []
        for target, backup in reversed(changed):
            try:
                if target.is_dir():
                    shutil.rmtree(target)
                elif target.exists():
                    target.unlink()
                if backup.exists():
                    backup.rename(target)
            except OSError as error:
                recovery_errors.append(str(error))
        if recovery_errors:
            (stage / "RECOVERY-NEEDED").write_text("\n".join(recovery_errors))
            raise RuntimeError(f"Import rollback incomplete; backups retained in {stage}")
        raise


def sync(local_checkouts=None):
    config = json.loads((ROOT / "upstream.json").read_text())
    local_checkouts = local_checkouts or {}
    records = {}
    # Stage beside the project targets so every rename stays on one filesystem.
    stage = Path(tempfile.mkdtemp(prefix=".gnomicon-sync-", dir=ROOT))
    try:
        for source in config["sources"]:
            key = source["id"]
            if key in local_checkouts:
                checkout = Path(local_checkouts[key]).resolve()
                if git(checkout, "status", "--porcelain"):
                    raise ValueError(f"Dirty upstream checkout: {checkout}")
            else:
                checkout = stage / "upstream" / key
                checkout.mkdir(parents=True)
                subprocess.run(["git", "init", "-q", str(checkout)], check=True)
                subprocess.run(["git", "-C", str(checkout), "fetch", "--depth=1",
                                source["repository"], source["revision"]], check=True)
                subprocess.run(["git", "-C", str(checkout), "checkout", "--detach",
                                "FETCH_HEAD"], check=True)
            if git(checkout, "rev-parse", "HEAD") != source["revision"]:
                raise ValueError(f"Wrong revision for {key}")
            for path in inventory(checkout, source):
                rel = path.relative_to(checkout / source["path"])
                target = stage / "icons" / key / rel
                target.parent.mkdir(parents=True, exist_ok=True)
                data = path.read_bytes()
                target.write_bytes(data)
                records[f"{key}/{rel.as_posix()}"] = hashlib.sha256(data).hexdigest()
            for name in source["licenseFiles"]:
                target = stage / "licenses" / key / name
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes((checkout / name).read_bytes())
        (stage / "inventory.json").write_text(
            json.dumps(records, indent=2, ensure_ascii=False, sort_keys=True) + "\n"
        )
        (stage / "upstream.json").write_text(
            json.dumps(config, indent=2, ensure_ascii=False) + "\n"
        )
        # Sources, licenses and both receipts form one recoverable import unit.
        install_snapshot(stage, [(stage / "icons", ROOT / "src/icons"),
                                 (stage / "licenses", ROOT / "licenses"),
                                 (stage / "inventory.json", ROOT / "src/inventory.json"),
                                 (stage / "upstream.json", ROOT / "src/upstream.json")])
    finally:
        if not (stage / "RECOVERY-NEEDED").exists():
            shutil.rmtree(stage)
    print(f"Imported {len(records)} source files at pinned revisions")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--checkout", action="append", default=[], metavar="ID=PATH",
                        help="Use an existing clean checkout at the pinned revision")
    args = parser.parse_args()
    sync(dict(item.split("=", 1) for item in args.checkout))
