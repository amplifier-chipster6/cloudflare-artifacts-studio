"""Offline checks for documentation and candidate fixtures; not runtime authorization."""
import copy
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit

from jsonschema import Draft202012Validator, FormatChecker
from referencing import Registry, Resource

ROOT = Path(__file__).resolve().parents[1]


def require(condition, message):
    if not condition:
        raise ValueError(message)


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def canonical_digest(value):
    raw = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def validate_graph(records):
    indexed = {}
    for record in records:
        key = (record["id"], record["revision"])
        require(key not in indexed, f"Duplicate logical revision: {key}")
        indexed[key] = record

    def lookup(ref, kind=None):
        key = (ref["id"], ref["revision"])
        require(key in indexed, f"Missing reference: {key}")
        target = indexed[key]
        require(kind is None or target["record_type"] == kind, f"Wrong reference type: {key}")
        return target

    def walk(value, origin):
        if isinstance(value, dict):
            if set(value) == {"id", "revision"}:
                target = lookup(value)
                require(target["project_id"] == origin["project_id"], "Cross-project reference")
            else:
                for child in value.values():
                    walk(child, origin)
        elif isinstance(value, list):
            for child in value:
                walk(child, origin)

    for record in records:
        walk(record["payload"], record)
        if record["supersedes"]:
            prior = lookup(record["supersedes"], record["record_type"])
            require(prior["id"] == record["id"] and prior["revision"] + 1 == record["revision"],
                    "Invalid supersession chain")
        else:
            require(record["revision"] == 1, "Later revision needs supersedes")
        project = indexed.get((record["project_id"], 1))
        require(project and project["record_type"] == "project", "Unknown project")

    for record in records:
        kind, p = record["record_type"], record["payload"]
        if kind == "task":
            lookup(p["milestone"], "milestone")
            for field, target_type in (("criteria", "criterion"), ("assignments", "assignment")):
                for ref in p[field]:
                    target = lookup(ref, target_type)
                    require(target["payload"]["task"] == {"id": record["id"], "revision": record["revision"]},
                            "Task child belongs to another revision")
        elif kind == "context":
            require(hashlib.sha256(p["text"].encode()).hexdigest() == p["text_sha256"],
                    "Context text digest mismatch")
        elif kind == "context_manifest":
            task = lookup(p["task"], "task")["payload"]
            require(p["base_commit"] == task["base_commit"], "Packet base mismatch")
            for item in p["selected_items"]:
                context = lookup(item["context"], "context")
                require(item["selected"] is True, "Unselected context leaked")
                require(context["payload"]["release_scope"] in ("selected_task", "public"),
                        "Context release not approved for a worker")
                require(item["content_sha256"] == context["payload"]["text_sha256"],
                        "Selected context digest mismatch")
            packet = {k: p[k] for k in ("task", "base_commit", "selected_items")}
            require(canonical_digest(packet) == p["packet_digest"], "Packet digest mismatch")
        elif kind == "run":
            assignment = lookup(p["assignment"], "assignment")["payload"]
            manifest = lookup(p["manifest"], "context_manifest")["payload"]
            require(assignment["task"] == manifest["task"], "Run task mismatch")
            require(p["base_commit"] == manifest["base_commit"], "Run baseline mismatch")
        elif kind == "contribution":
            run = lookup(p["run"], "run")["payload"]
            require(run["status"] == "submitted", "Contribution has no submitted run")
            require(p["head_commit"] == run["head_commit"] and p["base_commit"] == run["base_commit"],
                    "Contribution identity mismatch")
            assignment = lookup(run["assignment"], "assignment")["payload"]
            task = lookup(assignment["task"], "task")["payload"]
            require(set(p["changed_paths"]) <= set(task["allowed_paths"]), "Out-of-scope change")
        elif kind == "candidate":
            task = lookup(p["task"], "task")["payload"]
            manifest = lookup(p["manifest"], "context_manifest")["payload"]
            require(manifest["task"] == p["task"] and p["base_commit"] == task["base_commit"],
                    "Candidate task/base mismatch")
            for ref in p["contributions"]:
                contribution = lookup(ref, "contribution")["payload"]
                run = lookup(contribution["run"], "run")["payload"]
                require(run["manifest"] == p["manifest"], "Candidate mixed packets")
                require(contribution["base_commit"] == p["base_commit"], "Candidate mixed baselines")
        elif kind == "verification":
            candidate = lookup(p["candidate"], "candidate")["payload"]
            task = lookup(candidate["task"], "task")["payload"]
            require(p["candidate_commit"] == candidate["commit"], "Tests bound to wrong candidate")
            require(record["authority"] == "trusted_verification" and record["producer"]["role"] == "verifier",
                    "Worker report is not independent verification")
            required = {(r["id"], r["revision"]) for r in task["criteria"]
                        if lookup(r, "criterion")["payload"]["required"]}
            checked = set()
            for check in p["checks"]:
                criterion = lookup(check["criterion"], "criterion")["payload"]
                require(criterion["task"] == candidate["task"], "Verification criterion task mismatch")
                checked.add((check["criterion"]["id"], check["criterion"]["revision"]))
                require(check["result"] != "passed" or check["exit_code"] == 0, "False passing exit")
            if p["result"] == "passed":
                require(required <= checked and all(x["result"] == "passed" for x in p["checks"]),
                        "Passing verification lacks required passing criteria")
            require(p["finished_at"] >= p["started_at"], "Verification time order")
        elif kind == "review_decision":
            candidate = lookup(p["candidate"], "candidate")["payload"]
            require(p["task"] == candidate["task"] and p["candidate_commit"] == candidate["commit"],
                    "Review identity mismatch")
            for ref in p["verifications"]:
                verification = lookup(ref, "verification")
                require(verification["payload"]["candidate"] == p["candidate"], "Review mixed candidate")
                if p["disposition"] == "accepted":
                    require(verification["payload"]["result"] == "passed", "Accepted failed evidence")
                    require(verification["authority"] == "trusted_verification", "Accepted untrusted evidence")
        elif kind == "integration_receipt":
            decision = lookup(p["decision"], "review_decision")["payload"]
            candidate = lookup(p["candidate"], "candidate")["payload"]
            require(decision["candidate"] == p["candidate"], "Integration candidate mismatch")
            if p["status"] == "confirmed":
                require(decision["disposition"] == "accepted", "Integrated unaccepted candidate")
                require(p["result_commit"] == candidate["commit"], "Integrated wrong identity")
                require(p["expected_base"] == candidate["base_commit"], "Wrong integration base")
        elif kind == "deployment_receipt":
            integration = lookup(p["integration"], "integration_receipt")["payload"]
            if p["status"] == "confirmed":
                require(integration["status"] == "confirmed", "Deployment lacks integration")
                require(p["source_commit"] == integration["result_commit"], "Deployed wrong identity")


def main():
    schema_dir = ROOT / "schemas/1-candidate"
    schemas = {p.name: read_json(p) for p in schema_dir.glob("*.schema.json")}
    for schema in schemas.values():
        Draft202012Validator.check_schema(schema)
    registry = Registry().with_resources((s["$id"], Resource.from_contents(s)) for s in schemas.values())

    def validate(record):
        validator = Draft202012Validator(schemas[record["record_type"] + ".schema.json"],
                                         registry=registry, format_checker=FormatChecker())
        validator.validate(record)

    records = [read_json(p) for p in sorted((ROOT / "examples/records").glob("*.json"))]
    require(len(records) == 16, "Expected one example for each of sixteen types")
    for record in records:
        validate(record)
    validate_graph(records)
    envelope = read_json(ROOT / "examples/ingestion/task.json")
    Draft202012Validator(schemas["source-envelope.schema.json"], registry=registry,
                        format_checker=FormatChecker()).validate(envelope)
    require(envelope["record"] == next(r for r in records if r["record_type"] == "task"),
            "Envelope task mismatch")
    require(envelope["source"]["content_sha256"] ==
            hashlib.sha256((ROOT / "examples/records/task.json").read_bytes()).hexdigest(),
            "Source envelope content mismatch")

    mutations = [
        ("unselected context", "context_manifest", lambda r: r["payload"]["selected_items"][0].update(selected=False)),
        ("private context release", "context", lambda r: r["payload"].update(release_scope="private_project")),
        ("wrong candidate evidence", "verification", lambda r: r["payload"].update(candidate_commit="f" * 40)),
        ("failed accepted evidence", "verification", lambda r: r["payload"].update(result="failed")),
        ("worker as verifier", "verification", lambda r: r.update(authority="attributed_report", producer={"id": "worker", "role": "worker"})),
        ("scope violation", "contribution", lambda r: r["payload"].update(changed_paths=["secrets.env"])),
        ("unaccepted integration", "review_decision", lambda r: r["payload"].update(disposition="rejected")),
        ("wrong deployed identity", "deployment_receipt", lambda r: r["payload"].update(source_commit="f" * 40)),
        ("dangling assignment", "run", lambda r: r["payload"].update(assignment={"id": "missing", "revision": 1})),
    ]
    for label, kind, mutate in mutations:
        bad = copy.deepcopy(records)
        mutate(next(r for r in bad if r["record_type"] == kind))
        try:
            for record in bad:
                validate(record)
            validate_graph(bad)
        except (ValueError, __import__("jsonschema").ValidationError):
            pass
        else:
            raise ValueError(f"Negative fixture accepted: {label}")

    coverage = read_json(ROOT / "docs/documentation-coverage.json")
    require([t["id"] for t in coverage["tasks"]] == [f"DOC-{i:02d}" for i in range(1, 21)],
            "Expected twenty ordered documentation tasks")
    for task in coverage["tasks"]:
        for file in task["files"]:
            require((ROOT / file).is_file(), f"Missing {task['id']} deliverable: {file}")

    git = subprocess.run(["git", "ls-files", "--cached", "--others", "--exclude-standard", "-z"],
                         cwd=ROOT, check=True, capture_output=True)
    paths = {ROOT / p.decode() for p in git.stdout.split(b"\0") if p}
    links = 0
    for path in paths:
        if path.suffix != ".md" or not path.is_file():
            continue
        text = re.sub(r"```.*?```", "", path.read_text(), flags=re.S)
        for target in re.findall(r"\[[^\]]*\]\(([^\s)]+)\)", text):
            parsed = urlsplit(target.strip("<>"))
            if parsed.scheme or target.startswith("#"):
                continue
            resolved = (path.parent / unquote(parsed.path)).resolve()
            require(resolved.is_relative_to(ROOT) and resolved.exists(),
                    f"Broken local link: {path.relative_to(ROOT)} -> {target}")
            links += 1
    print(f"PASS: {len(schemas)} schemas, {len(records)} records, 1 source envelope, "
          f"{len(mutations)} rejected negative fixtures, 20 documentation tasks, {links} local links")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"FAIL: {error}", file=sys.stderr)
        sys.exit(1)
