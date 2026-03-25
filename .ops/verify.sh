#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

test -f package.json
test -f next.config.mjs
test -d app
test -d components
test -d lib
test -f PLANS.md
test -f CONTEXT.md
test -f CHECKLIST.md

npm run build >/tmp/daker-board-build.log

echo "verification: ok"
