#!/usr/bin/env bash
#
# deploy.sh — (re)deploy pclegends.games to Cloudflare from the current `main`.
#
# The site is served by Cloudflare Workers Static Assets. A release
# (bin/release.sh) already deploys, because pushing to `main` triggers the
# Cloudflare build (npm run build → npx wrangler deploy, per wrangler.jsonc).
#
# This script is for the other case: redeploying the current `main` without a
# new commit — e.g. to re-run a failed build. It builds locally and pushes with
# wrangler. It needs the Cloudflare CLI logged in once:  npx wrangler login
# (the whereq Cloudflare account — not ccbus).
#
# Usage:
#   bin/deploy.sh            # npm run build + npx wrangler deploy
#   bin/deploy.sh --build    # just build, don't deploy
#
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || { echo "deploy: not in a git repo" >&2; exit 1; }
cd "$REPO_ROOT"

echo "deploy: building…"
npm run build

if [[ "${1:-}" == "--build" ]]; then
  echo "deploy: built into ./build (not deploying)"
  exit 0
fi

echo "deploy: uploading to Cloudflare (npx wrangler deploy)…"
echo "deploy: (if this fails with an auth error, run: npx wrangler login)"
npx wrangler deploy

echo "deploy: done — https://pclegends.games/"
