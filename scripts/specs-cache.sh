#!/usr/bin/env bash
set -euo pipefail

ACTION="${1:-status}"
PROJECT_ROOT="${2:-$PWD}"
GLOBAL_PATH="${CODEX_SPECS_GLOBAL:-$HOME/.codex/shared/specs_master.json}"
PROJECT_SPECS="$PROJECT_ROOT/data/specs.json"

usage() {
  cat <<USAGE
Usage:
  specs-cache.sh status [project_root]
  specs-cache.sh pull   [project_root]   # global -> project
  specs-cache.sh push   [project_root]   # project -> global
  specs-cache.sh link   [project_root]   # symlink project specs to global
  specs-cache.sh audit  [project_root]   # check missing models vs app.js
  specs-cache.sh touch  [project_root]   # update data_updated to today

Env:
  CODEX_SPECS_GLOBAL=/abs/path/specs_master.json
USAGE
}

ensure_parent() {
  mkdir -p "$(dirname "$GLOBAL_PATH")"
  mkdir -p "$(dirname "$PROJECT_SPECS")"
}

sha() {
  if [[ -f "$1" ]]; then
    shasum -a 256 "$1" | awk '{print $1}'
  else
    echo "missing"
  fi
}

case "$ACTION" in
  status)
    echo "global:  $GLOBAL_PATH"
    echo "project: $PROJECT_SPECS"
    echo "global_sha256=$(sha "$GLOBAL_PATH")"
    echo "project_sha256=$(sha "$PROJECT_SPECS")"
    ;;
  pull)
    ensure_parent
    if [[ ! -f "$GLOBAL_PATH" ]]; then
      echo "Global specs not found: $GLOBAL_PATH" >&2
      exit 1
    fi
    cp "$GLOBAL_PATH" "$PROJECT_SPECS"
    echo "Pulled global specs -> $PROJECT_SPECS"
    ;;
  push)
    ensure_parent
    if [[ ! -f "$PROJECT_SPECS" ]]; then
      echo "Project specs not found: $PROJECT_SPECS" >&2
      exit 1
    fi
    cp "$PROJECT_SPECS" "$GLOBAL_PATH"
    echo "Pushed project specs -> $GLOBAL_PATH"
    ;;
  link)
    ensure_parent
    if [[ ! -f "$GLOBAL_PATH" ]]; then
      if [[ -f "$PROJECT_SPECS" ]]; then
        cp "$PROJECT_SPECS" "$GLOBAL_PATH"
      else
        echo "Neither global nor project specs exists, cannot link." >&2
        exit 1
      fi
    fi
    rm -f "$PROJECT_SPECS"
    ln -s "$GLOBAL_PATH" "$PROJECT_SPECS"
    echo "Linked $PROJECT_SPECS -> $GLOBAL_PATH"
    ;;
  audit)
    ensure_parent
    if [[ ! -f "$GLOBAL_PATH" ]]; then
      echo "Global specs not found: $GLOBAL_PATH" >&2
      exit 1
    fi
    node - "$PROJECT_ROOT" "$GLOBAL_PATH" <<'NODE'
const fs = require("fs");
const projectRoot = process.argv[2];
const globalPath = process.argv[3];
const appJsPath = `${projectRoot}/app.js`;

const appJs = fs.readFileSync(appJsPath, "utf8");
const specs = JSON.parse(fs.readFileSync(globalPath, "utf8"));
const re = /\{ id: "([^"]+)", name: "([^"]+)", parent: "([^"]+)" \}/g;
const folders = [];
let m;
while ((m = re.exec(appJs)) !== null) {
  folders.push({ id: m[1], name: m[2], parent: m[3] });
}

const models = folders.filter((f) => !f.id.endsWith("-series"));
const expected = {
  ipad_specs: models.filter((f) => f.id.startsWith("ipad-")).map((f) => f.name),
  watch_specs: models.filter((f) => f.id.startsWith("watch-")).map((f) => f.name),
  mac_specs: models.filter((f) => f.id.startsWith("mac") || f.id.startsWith("imac")).map((f) => f.name)
};

let hasMissing = false;
for (const [key, list] of Object.entries(expected)) {
  const got = specs[key] || {};
  const missing = list.filter((name) => !got[name]);
  const extra = Object.keys(got).filter((name) => !list.includes(name));
  console.log(`${key}: expected=${list.length}, current=${Object.keys(got).length}, missing=${missing.length}, extra=${extra.length}`);
  if (missing.length > 0) {
    hasMissing = true;
    console.log(`  missing: ${missing.join(" | ")}`);
  }
}

if (hasMissing) process.exit(2);
NODE
    ;;
  touch)
    ensure_parent
    if [[ ! -f "$GLOBAL_PATH" ]]; then
      echo "Global specs not found: $GLOBAL_PATH" >&2
      exit 1
    fi
    node - "$GLOBAL_PATH" <<'NODE'
const fs = require("fs");
const file = process.argv[2];
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const now = new Date();
const yyyy = now.getFullYear();
const mm = String(now.getMonth() + 1).padStart(2, "0");
const dd = String(now.getDate()).padStart(2, "0");
data.data_updated = `${yyyy}-${mm}-${dd}`;
fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
console.log(`Updated data_updated -> ${data.data_updated}`);
NODE
    ;;
  *)
    usage
    exit 1
    ;;
esac
