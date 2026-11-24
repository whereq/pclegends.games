# PC Legends

The DOS games archive, on its own domain — <https://pclegends.games>.

1,898 DOS games, one page each: the facts read out of the bundle itself,
the download, and the setup the bundle's own shape implies. Every page
carries a comment thread, and the site carries Google AdSense.

This repository is the site. The blog and the WhereQ Atlas live in
[`whereq/whereq.github.io-docusaurus`](https://github.com/whereq/whereq.github.io-docusaurus)
and are served from <https://whereq.github.io>.

## What is in here

| Piece | Where | What it is |
|---|---|---|
| The front page | `src/pages/index.tsx` | What the archive is, the numbers, the ten categories. |
| The catalogue | `src/components/DosGames/DosGamesCatalogue.tsx` | Every game — search, category filters, card grid in a scroll panel. |
| A game | `src/components/DosGames/DosGamePage.tsx` | One game: the facts, the download, the setup, the thread. |
| The played-through shelf | `src/components/DosGames/PlayedGames.tsx` | The five games that have been run on an emulator. |
| The index | `src/data/dos-games-index.ts` | One line per game — what the catalogue lists and searches. Generated. |
| A game | `src/data/dos-games/<slug>.ts` | The whole page for one game. Generated, one module per game. |
| The played games | `src/data/games-played.ts` | The five hand-written pages. |
| The categories | `src/data/dos-games-categories.ts` | The ten categories, read off the upstream manifest. Generated. |
| The numbers | `src/data/dos-games-stats.ts` | The counts the front page shows. Generated. |
| The guide | `docs/` | Two pages: how to read a game page, and where the games come from. |

## Commands

```bash
npm install
npm run start       # dev server, hot reload — http://localhost:3000
npm run build       # production build into ./build/
npm run serve       # preview ./build/ locally
npm run typecheck   # runs tsc — the only verification step
```

There is no test suite and no linter. `npm run typecheck` is the check.

## Deploying

The site is published by **GitHub Actions**, not by a branch push:

- `.github/workflows/deploy.yml` builds the site on every push to `main`
  and publishes it with `actions/upload-pages-artifact` and
  `actions/deploy-pages`.
- The custom domain travels in `static/CNAME`. A domain set in the Pages UI
  is wiped by the next deploy; a CNAME in the source repo cannot be.
- **Pages source must be set to "GitHub Actions"** in the repository
  settings, once.

The legacy branch build is not used here, and not on the docs hub either: a
Pages build is killed after ten minutes, and a build of 1 898 game routes
sits right on that edge.

## Regenerating the games

The pages are generated from the archive in `~/git/dos/games`:

```bash
~/git/whereq-dosbox-claude/.venv/bin/python scripts/generate-dos-games.py
```

It writes the index, the stats, the per-game modules, the routes and the
card marks, and it overwrites everything it owns — do not hand-edit the
index, the stats or a generated module. The plain `python3` lacks
`pypinyin` and writes the wrong slugs, which is why the venv is used.

The categories come from the manifest of the project the bundles were
mirrored from — see `scripts/dos_game_categories.py` in the docs hub.

## The dependencies are pinned

`package.json` carries an `overrides` block. It is not decoration:

- **`webpackbar` must be 7.0.0.** Version 6.0.1 as published today assigns
  its own options to `this.options`, which webpack's `ProgressPlugin` then
  validates against its own schema and rejects. The build dies with
  *"Progress Plugin has been initialized using an options object that does
  not match the API schema"*.
- **Every `@docusaurus/*` package must be 3.10.0.** A mixed tree installs a
  second copy of `@docusaurus/bundler`, which resolves a different
  `webpackbar` again.
- **`webpack` must be 5.106.1.**

## Advertising

`src/data/adsense.ts` holds the publisher ID. It is empty until the
account is approved, and while it is empty `ADSENSE_ENABLED` is false and
Google's script is never injected. Paste the `ca-pub-…` ID there and
nothing else has to change.

Ads are gated on consent: `src/components/AdsenseConsent` asks first, and
the script is only injected after the visitor accepts. Declining means no
ad script, no ad cookie and no request to Google at all.

AdSense approves a **root domain**. `pclegends.games` is one, which is why
the games live here rather than behind `whereq.github.io`.

## Comments

`src/components/GiscusComments` is the site-wide thread. It points at this
repository's own Discussions, under **General**. The ids are GitHub's own
and they have to agree with each other — read them again with:

```sh
gh api graphql -f query='
query {
  repository(owner: "whereq", name: "pclegends.games") {
    id
    discussionCategories(first: 25) { nodes { id name } }
  }
}'
```

## House rules

- MetroUI, and **radius xs = 2px**. A pill-shaped button is a second
  button; do not use `border-radius: 999px`.
- Colours come from `--ifm-*` tokens only, so light and dark both work.
- The site is dark-first.
