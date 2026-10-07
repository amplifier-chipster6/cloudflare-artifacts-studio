"""Validate offline reference provenance, links and optional cached source bytes."""
import hashlib
import json
import re
from collections import Counter
from pathlib import Path
from urllib.parse import unquote, urlsplit

REFERENCE = Path(__file__).resolve().parents[1]
ROOT = REFERENCE.parents[2]


def require(ok, message):
    if not ok:
        raise ValueError(message)


def read(name):
    return json.loads((REFERENCE / name).read_text(encoding="utf-8"))


def main():
    inventory = read("source-inventory.json")
    commit = inventory["commit"]
    require(re.fullmatch(r"[0-9a-f]{40}", commit), "Invalid commit pin")
    require(inventory["tree_truncated"] is False, "Truncated source inventory")
    indexed = {item["path"]: item for item in inventory["files"]}
    require(len(indexed) == len(inventory["files"]), "Duplicate source path")
    source = REFERENCE / "source" / commit
    verified = 0
    if source.exists():
        for item in inventory["files"]:
            if item["acquisition"] != "cached_verified":
                continue
            path = source / item["path"]
            require(path.is_file(), f"Cached source missing: {item['path']}")
            raw = path.read_bytes()
            require(len(raw) == item["size"], f"Byte-count drift: {item['path']}")
            blob = hashlib.sha1(b"blob " + str(len(raw)).encode() + b"\0" + raw).hexdigest()
            require(blob == item["blob_sha"], f"Git blob drift: {item['path']}")
            require(hashlib.sha256(raw).hexdigest() == item["content_sha256"],
                    f"SHA-256 drift: {item['path']}")
            raw.decode("utf-8")
            verified += 1

    facts = read("FACTS.json")
    require(facts["commit"] == commit, "Facts use a different pin")
    ids = set()
    for fact in facts["facts"]:
        require(fact["id"] not in ids, "Duplicate claim ID")
        ids.add(fact["id"])
        require(fact["commit"] == commit, "Mixed fact source commits")
        require(fact["evidence"], "Uncited claim")
        for evidence in fact["evidence"]:
            item = indexed.get(evidence["path"])
            require(item is not None, "Unknown claim source path")
            require(item["acquisition"] == "cached_verified", "Claim on unacquired source")
            require(1 <= evidence["line"] <= evidence["end_line"], "Invalid source span")
            require(evidence["url"] == item["source_url"] + "#L" + str(evidence["line"]),
                    "Claim URL differs from indexed identity")
            if source.exists():
                lines = (source / evidence["path"]).read_text().splitlines()
                require(evidence["end_line"] <= len(lines), "Claim span beyond source")
                if "excerpt" in evidence:
                    require(evidence["excerpt"] == "\n".join(lines[evidence["line"]-1:evidence["excerpt_end_line"]]),
                            "Claim excerpt differs from source")

    symbols = read("symbol-index.json")
    require(symbols["commit"] == commit, "Symbols use a different pin")
    for group in ("python", "headings", "routes"):
        for entry in symbols[group]:
            require(entry["path"] in indexed, "Unknown indexed symbol path")

    results = read("verification-results.json")
    require(results["commit"] == commit, "Test results use a different pin")
    fixture_count = self_tests = 0
    for result in results["results"]:
        if result["kind"] == "fixture":
            fixture_count += 1
            expected = 1 if result["sample"] == "sample-bad" else 0
            require(result["exit_code"] == expected, "Unexpected fixture exit")
            report = result["report"]
            require(bool(report["summary"]["fail"]) == bool(expected), "Fixture verdict mismatch")
            for row in report["results"]:
                require(row["status"] in {"PASS", "FAIL", "SKIP"}, "Unknown kit status")
                if row["status"] == "SKIP":
                    require(bool(row.get("reason")), "Unexplained fixture skip")
        else:
            require(result["exit_code"] == 0, "Self-test failure")
            self_tests += sum(line.startswith("  ok") for line in result["stdout"].splitlines())

    local_links = citations = 0
    prefix = "https://github.com/" + inventory["repository"] + "/blob/" + commit + "/"
    for path in REFERENCE.glob("*.md"):
        text = re.sub(r"```.*?```", "", path.read_text(), flags=re.S)
        for target in re.findall(r"\[[^\]]*\]\(([^\s)]+)\)", text):
            parsed = urlsplit(target.strip("<>"))
            if not parsed.scheme and not target.startswith("#"):
                destination = (path.parent / unquote(parsed.path)).resolve()
                require(destination.is_relative_to(ROOT) and destination.exists(),
                        f"Broken local link: {path.name} -> {target}")
                local_links += 1
            elif target.startswith(prefix):
                relative, _, fragment = target[len(prefix):].partition("#")
                require(relative in indexed, f"Unknown citation source: {relative}")
                if fragment:
                    match = re.fullmatch(r"L(\d+)(?:-L(\d+))?", fragment)
                    require(match is not None, "Invalid source line anchor")
                    if source.exists():
                        count = len((source / relative).read_text().splitlines())
                        require(1 <= int(match[1]) <= count, "Citation beyond source")
                citations += 1

    summary = {
        "status": "passed",
        "commit": commit,
        "inventory_files": len(indexed),
        "acquisition": dict(Counter(i["acquisition"] for i in indexed.values())),
        "review_depth": dict(Counter(i["review_depth"] for i in indexed.values())),
        "cache_present": source.exists(),
        "fresh_cached_blob_verifications": verified,
        "facts": len(ids),
        "fixture_runs": fixture_count,
        "self_tests": self_tests,
        "local_links": local_links,
        "pinned_source_citations": citations,
        "limits": "Integrity and reference consistency only; no automatic semantic or live verification",
    }
    (REFERENCE / "reference-validation.json").write_text(json.dumps(summary, indent=2) + "\n")
    print(json.dumps(summary))


if __name__ == "__main__":
    main()
