"""Write exact UTF-8 connector results and verify Git blob identities."""
import hashlib
import json
import sys
from pathlib import Path

REFERENCE = Path(__file__).resolve().parents[1]
manifest_path = REFERENCE / "source-inventory.json"
manifest = json.loads(manifest_path.read_text())
indexed = {item["path"]: item for item in manifest["files"]}
batch = json.loads(Path(sys.argv[1]).read_text())
root = REFERENCE / "source" / manifest["commit"]
written = 0
errors = []
for item in batch:
    path = item["path"]
    relative = Path(path)
    if relative.is_absolute() or ".." in relative.parts or path not in indexed:
        raise ValueError("Unsafe/unindexed source path")
    data = item["content"].encode("utf-8")
    actual = hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()
    expected = indexed[path]["blob_sha"]
    if actual != expected:
        indexed[path]["acquisition"] = "integrity_mismatch"
        errors.append(path)
        continue
    destination = root / relative
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(data)
    indexed[path]["acquisition"] = "cached_verified"
    indexed[path]["content_sha256"] = hashlib.sha256(data).hexdigest()
    written += 1
manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")
print(json.dumps({"verified_written": written, "mismatches": errors}))
if errors:
    sys.exit(1)
