#!/usr/bin/env bash
#
# deploy.sh — (re)deploy pclegends.games from the current `main`.
#
# A release (bin/release.sh) already deploys, because pushing to `main` runs
# the GitHub Actions workflow. This script is for the other case: redeploying
# the current `main` without a new commit — e.g. after changing a Pages
# setting, or to re-run a failed/cancelled deploy. It dispatches the same
# workflow (.github/workflows/deploy.yml) and can watch it.
#
# Usage:
#   bin/deploy.sh            # dispatch a fresh deploy of main, then watch it
#   bin/deploy.sh --status   # just show the latest deploy run, don't start one
#   bin/deploy.sh --no-watch # dispatch and return immediately
#
set -euo pipefail

REPO="whereq/pclegends.games"
WORKFLOW="deploy.yml"
BRANCH="main"

command -v gh >/dev/null 2>&1 || { echo "deploy: needs the GitHub CLI (gh)" >&2; exit 1; }

latest_run() {
  gh run list --repo "$REPO" --workflow "$WORKFLOW" --branch "$BRANCH" --limit 1 \
    --json databaseId,status,conclusion,displayTitle,createdAt \
    --jq '.[0] | "  run \(.databaseId)  \(.status)/\(.conclusion // "—")  \(.createdAt)  \(.displayTitle)"' 2>/dev/null
}

case "${1:-}" in
  --status)
    echo "deploy: latest deploy of $BRANCH —"
    latest_run || echo "  (no runs found)"
    exit 0
    ;;
  --no-watch) WATCH=0 ;;
  "" ) WATCH=1 ;;
  -h|--help) sed -n '2,20p' "$0"; exit 0 ;;
  *) echo "deploy: unknown option: $1" >&2; exit 2 ;;
esac

echo "deploy: dispatching $WORKFLOW on $BRANCH…"
gh workflow run "$WORKFLOW" --repo "$REPO" --ref "$BRANCH"

# Give GitHub a moment to register the run, then grab its id.
sleep 4
RUN_ID="$(gh run list --repo "$REPO" --workflow "$WORKFLOW" --branch "$BRANCH" --limit 1 --json databaseId --jq '.[0].databaseId')"
echo "deploy: started run $RUN_ID"

if [[ "${WATCH:-1}" -eq 1 ]]; then
  gh run watch "$RUN_ID" --repo "$REPO" --exit-status && \
    echo "deploy: done — https://pclegends.games/" || \
    { echo "deploy: the run failed — see: gh run view $RUN_ID --repo $REPO --log-failed" >&2; exit 1; }
else
  echo "deploy: watch it with — gh run watch $RUN_ID --repo $REPO"
fi
