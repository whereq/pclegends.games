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

## Releasing & deploying

The site is served by **Cloudflare Workers Static Assets** (whereq Cloudflare
account). The Worker is connected to this repo: every push to `main` runs
`npm run build` then `npx wrangler deploy`, which uploads `build/` as static
assets (`wrangler.jsonc` → `./build`). So a release **is** a deploy — cut one
from the feature branch you want to ship:

```bash
bin/release.sh -m "feat(...): what shipped"   # squash -> main, tag, push (Cloudflare builds)
RELEASE_TAG=v1.1.0.0 bin/release.sh -m "..."  # pin the tag (default bumps the build)
bin/deploy.sh                                 # manual build + wrangler deploy of current main
```

`release.sh` squashes the branch into one commit on `main`, tags it
`v{major}.{minor}.{patch}.{build}`, pushes both, and closes the branch's PR if
one is open. The push to `main` triggers the Cloudflare build.

Moved off GitHub Pages: its cert pipeline wedged on the apex+`www` pair for
days, and it has no escape from Cloudflare's limits anyway. Cloudflare issues
apex **and** `www` certs automatically and redirects http→https. Two build
shapes keep the deploy inside Cloudflare's **20,000-file / 25 MB-per-file**
limits and must stay: the card marks are drawn in the browser
(`GameMark.tsx`, not ~3,800 SVG files), and search is Algolia DocSearch, not a
~30 MB offline index (`src/data/algolia.ts`).

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

## The pictures and the Wikipedia articles

A card shows the game itself: the cover art or the screenshot from the
game's Wikipedia article, and the name in the reader's language. A game's
own page links to the same article, so a reader can go and read more.

Both come from Wikipedia, and both are checked before they are used:

- `scripts/collect-game-images.py` finds the article. The plain search for a
  game's name turns up whatever else carries it — the film *Jurassic Park*,
  the song *Danger Zone*, the bomber *Boeing B-17 Flying Fortress* — so the
  search asks for the game ("*Jurassic Park* video game") and for the
  category of its year ("*Jurassic Park* incategory:"1993 video games"").
- `scripts/verify-wiki-articles.py` checks the article that was found. It
  has to be about a game (the description Wikipedia writes under the title
  settles it — "1992 video game" against "American heavy bomber aircraft" —
  and the categories settle it where the description is empty), it has to
  carry the game's name, and it has to sit in the right years. An article
  that fails any of these is dropped, and the game is looked for again.
- `scripts/wiki_rules.py` holds the rules the two scripts share, so that the
  collector and the verifier cannot disagree about what a game's article is.

The Chinese locale links to the Chinese article where the game has one, and
to the English article where it does not.

**The interpreter matters here too.** The slugs the pictures are filed under
are the pinyin slugs the generator gives, and pinyin comes from `pypinyin`,
which is in the venv and not in the system python.

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
