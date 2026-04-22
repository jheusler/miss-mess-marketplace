#!/bin/bash
set -euo pipefail

echo "📂 Working directory: $(pwd)" >&2

if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules/.package-lock.json" ]; then
  echo "📦 Installing dependencies..." >&2
  npm install --silent
  echo "✅ Dependencies ready" >&2
else
  echo "✅ Dependencies up to date" >&2
fi
