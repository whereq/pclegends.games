#!/usr/bin/env bash
#
# release.sh — cut a release of pclegends.games.
#
# For this repo a release IS a deploy. The site is served by Cloudflare Workers,
# which builds on every push to `main` (npm run build -> npx wrangler deploy,
# per wrangler.jsonc) and serves the ~1,898 game routes. So a release is just
#
#     squash the work into one commit on main  ->  tag it  ->  push
#
# and the push to `main` is what deploys. There is no server step.
#
# Usage:
#   bin/release.sh -m "feat(redesign): the DOS terminal redesign"
#   bin/release.sh -m "fix: ..." -b feat/some-branch     # release a named branch
#   RELEASE_TAG=v1.1.0.0 bin/release.sh -m "..."          # pin the tag
#   bin/release.sh -m "..." -y                            # skip the confirm prompt
#
# Run it from (or point it at) the feature branch you want to release. It
# squashes that branch's commits into a single commit on `main`, tags it
# v{major}.{minor}.{patch}.{build} (the build number auto-increments from the
# latest tag unless RELEASE_TAG pins it), pushes both, and closes the branch's
# open PR if one exists.
#
set -euo pipefail

# ── args ──────────────────────────────────────────────────────────────────
MSG=""
SRC=""
ASSUME_YES=0
while getopts ":m:b:yh" opt; do
  case "$opt" in
    m) MSG="$OPTARG" ;;
    b) SRC="$OPTARG" ;;
    y) ASSUME_YES=1 ;;
    h) sed -n '2,30p' "$0"; exit 0 ;;
    :) echo "release: -$OPTARG needs a value" >&2; exit 2 ;;
    \?) echo "release: unknown flag -$OPTARG" >&2; exit 2 ;;
  esac
done

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || { echo "release: not in a git repo" >&2; exit 1; }
cd "$REPO_ROOT"

MAIN="main"
[[ -z "$SRC" ]] && SRC="$(git rev-parse --abbrev-ref HEAD)"

# ── preconditions ─────────────────────────────────────────────────────────
if [[ -z "$MSG" ]]; then
  echo "release: a squash-commit message is required  (-m \"...\")" >&2
  exit 2
fi
if [[ "$SRC" == "$MAIN" ]]; then
  echo "release: you are on $MAIN — check out the feature branch to release, or pass -b <branch>" >&2
  exit 2
fi
if [[ -n "$(git status --porcelain)" ]]; then
  echo "release: working tree is not clean — commit or stash first" >&2
  git status --short >&2
  exit 1
fi
if ! git show-ref --verify --quiet "refs/heads/$SRC"; then
  echo "release: no such branch: $SRC" >&2
  exit 1
fi

echo "release: fetching origin…"
git fetch --quiet --prune origin

# main must match origin/main (fast-forward only); never release onto a stale or diverged main.
git checkout --quiet "$MAIN"
if git merge-base --is-ancestor "$MAIN" "origin/$MAIN"; then
  git merge --ff-only --quiet "origin/$MAIN" || true
else
  echo "release: local $MAIN has commits origin/$MAIN does not — reconcile before releasing" >&2
  git checkout --quiet "$SRC"
  exit 1
fi

# The source branch must contain everything on main, so the squash applies cleanly.
if ! git merge-base --is-ancestor "$MAIN" "$SRC"; then
  echo "release: $SRC is behind $MAIN — rebase it first:  git checkout $SRC && git rebase $MAIN" >&2
  git checkout --quiet "$SRC"
  exit 1
fi

N_COMMITS="$(git rev-list --count "$MAIN..$SRC")"
if [[ "$N_COMMITS" -eq 0 ]]; then
  echo "release: $SRC has no commits beyond $MAIN — nothing to release" >&2
  git checkout --quiet "$SRC"
  exit 1
fi

# ── tag ───────────────────────────────────────────────────────────────────
if [[ -n "${RELEASE_TAG:-}" ]]; then
  TAG="$RELEASE_TAG"
else
  LATEST="$(git tag -l 'v[0-9]*.[0-9]*.[0-9]*.[0-9]*' --sort=-v:refname | head -1)"
  if [[ -z "$LATEST" ]]; then
    TAG="v1.0.0.0"
  else
    IFS='.' read -r A B C D <<< "${LATEST#v}"
    TAG="v${A}.${B}.${C}.$((D + 1))"
  fi
fi
if git rev-parse -q --verify "refs/tags/$TAG" >/dev/null; then
  echo "release: tag $TAG already exists — pin a new one with RELEASE_TAG=vX.Y.Z.A" >&2
  git checkout --quiet "$SRC"
  exit 1
fi

# ── confirm ───────────────────────────────────────────────────────────────
echo
echo "  release $SRC  ->  $MAIN"
echo "  squash     : $N_COMMITS commit(s) into one"
echo "  message    : $MSG"
echo "  tag        : $TAG"
echo "  deploy     : push to $MAIN triggers the Cloudflare Workers build"
echo
if [[ "$ASSUME_YES" -ne 1 ]]; then
  read -r -p "Proceed? [y/N] " reply
  if [[ ! "$reply" =~ ^[Yy]$ ]]; then
    echo "release: aborted"
    git checkout --quiet "$SRC"
    exit 0
  fi
fi

# ── squash, commit, tag, push ─────────────────────────────────────────────
# Already on main. Squash the branch's tree in and commit it as one.
git merge --squash "$SRC"
git commit --quiet -m "$MSG"
git tag -a "$TAG" -m "$MSG"

echo "release: pushing $MAIN and $TAG…"
git push --quiet origin "$MAIN"
git push --quiet origin "$TAG"

# Close the branch's PR if one is open — a local squash-merge does not auto-close it.
if command -v gh >/dev/null 2>&1; then
  PR="$(gh pr list --head "$SRC" --state open --json number --jq '.[0].number' 2>/dev/null || true)"
  if [[ -n "$PR" ]]; then
    gh pr comment "$PR" --body "Released to \`$MAIN\` as $TAG via bin/release.sh (squash-merged locally)." >/dev/null 2>&1 || true
    gh pr close "$PR" >/dev/null 2>&1 || true
    echo "release: closed PR #$PR"
  fi
fi

echo
echo "release: $TAG is on $MAIN and pushed."
echo "release: Cloudflare is building it now — watch at"
echo "  Workers & Pages -> pclegends-games -> Deployments"
echo "  (it serves https://pclegends.games/ when the build finishes)"
echo "release: done."
