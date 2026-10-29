import json
import urllib.request
import jsonschema

schema_url = "https://raw.githubusercontent.com/ards-project/ard-spec/main/spec/schemas/ai-catalog.schema.json"
print("Fetching official schema from:", schema_url)
with urllib.request.urlopen(schema_url) as resp:
    schema = json.loads(resp.read().decode('utf-8'))

files_to_check = [
    "artifacts/sabbagh-kuwait/public/ai-catalog.json",
    "artifacts/sabbagh-kuwait/public/.well-known/ai-catalog.json",
    "artifacts/sabbagh-kuwait/public/.well-known/ard.json",
    "artifacts/sabbagh-kuwait/dist/public/ai-catalog.json",
    "artifacts/sabbagh-kuwait/dist/public/.well-known/ai-catalog.json",
    "artifacts/sabbagh-kuwait/dist/public/.well-known/ard.json"
]

validator = jsonschema.Draft202012Validator(schema)

for fpath in files_to_check:
    with open(fpath, "r", encoding="utf-8") as f:
        data = json.load(f)
    errors = list(validator.iter_errors(data))
    if len(errors) == 0:
        print(f"[VALID] {fpath}: Passed schema validation!")
    else:
        print(f"[INVALID] {fpath}: {len(errors)} errors:")
        for err in errors:
            print("  - Path:", list(err.path), "Error:", err.message)
        exit(1)

print("\nALL FILES ARE 100% COMPLIANT WITH ARD SPECIFICATION!")
