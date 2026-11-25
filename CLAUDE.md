# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

PC Legends — the DOS games archive, served from <https://pclegends.games>.

Docusaurus 3.10 + React 19 + TypeScript. 1 898 DOS games, one page each:
the facts read out of the bundle itself, the download, and the setup the
bundle's own shape implies. Every page carries a comment thread, and the
site carries Google AdSense.

This repository is **games only**. The blog and the WhereQ Atlas live in
`whereq/whereq.github.io-docusaurus` and are served from
`https://whereq.github.io`. The games moved out of there; the docs hub
answers their old URLs with redirects (`src/data/game-redirects.ts` on
that side).

## Commands

```bash
npm install
npm run start       # dev server, hot reload — http://localhost:3000
npm run build       # production build into ./build/
npm run serve       # preview ./build/ locally
npm run typecheck   # runs tsc
```

There is no test suite and no linter. `npm run typecheck` is the only
verification step, and the build is the other one.

## Deployment model

The site is published by **GitHub Actions** — `.github/workflows/deploy.yml`
builds on every push to `main` and publishes with `actions/upload-pages-artifact`
and `actions/deploy-pages`. The Pages source in the repository settings
must be "GitHub Actions".

**The legacy branch build is not used.** A GitHub Pages branch build is
killed after ten minutes, and this build has 1 898 game routes in it. The
docs hub's `bin/whereq.sh` push-to-`master` pattern is for that repo, not
for this one.

**The custom domain is a repository setting** — `pclegends.games`, set on
the Pages site. With an Actions deployment GitHub ignores a `CNAME` file in
the artifact and reads the domain from the setting, which is the durable
place: the docs hub's release script replaces the Pages repo root, so a
`CNAME` committed there would not survive. `static/CNAME` still ships in the
build, so the domain travels with the source if the site is ever published
from a branch.

DNS for `pclegends.games` is at **NameSilo**, not Cloudflare: an A record
for the apex pointing at GitHub Pages (`185.199.108.153`–`185.199.111.153`),
or an ALIAS/ANAME to `whereq.github.io`, plus the `_github-pages-challenge-whereq`
TXT record GitHub asks for.

## The dependencies are pinned, and it matters

`package.json` carries an `overrides` block. Removing it breaks the build:

- **`webpackbar` must be 7.0.0.** The 6.0.1 published today assigns its own
  options to `this.options`; webpack's `ProgressPlugin` validates that
  object against its own schema and rejects it — *"Progress Plugin has been
  initialized using an options object that does not match the API schema"*.
- **Every `@docusaurus/*` package must be 3.10.0.** A mixed tree installs a
  second copy of `@docusaurus/bundler`, which resolves a different
  `webpackbar` and fails the same way.
- **`webpack` must be 5.106.1.**

## Two languages

The site speaks **English and Chinese** (`en` and `zh-CN`). The archive is
Chinese — the bundles are filed under their Chinese titles — but most of
these are Western games under a Chinese title, so the English locale shows
the **original English title** on the card, with the Chinese name under it;
the Chinese locale shows the Chinese name with the English one under it.
The switcher is in the navbar.

- **The site's own words live in `src/data/site-copy.ts`**, one object per
  language. A page never decides for itself which language it is in: it
  asks `useCopy()` (`src/hooks/useCopy.ts`) for the language Docusaurus is
  building. A link inside a copy string is written the way Markdown writes
  one — `[label](/url)` — and picked up by `src/components/RichText.tsx`.
- **A generated page carries both languages in one module**: `sections` and
  `sectionsZh`, `facts` and `factsZh`, `role`/`roleZh`, `tagline`/`taglineZh`,
  `summary`/`summaryZh`. `DosGamePage` picks the Chinese ones in the
  Chinese locale.
- **The five hand-written games** live in `src/data/games-played.ts` (English)
  and `src/data/games-played-zh.ts` (Chinese), with the same ids.
- **Markdown pages are translated through the plugins' own folders**:
  `i18n/zh-CN/docusaurus-plugin-content-pages/privacy.mdx` and
  `i18n/zh-CN/docusaurus-plugin-content-docs/current/*.md`. The theme's own
  strings are in `i18n/zh-CN/code.json` and the navbar and footer labels in
  `i18n/zh-CN/docusaurus-theme-classic/`.
- **The search plugin indexes both languages** (`language: ['en', 'zh']`) —
  `zh` is the search plugin's code for Chinese; the Docusaurus locale is
  `zh-CN`. The non-default locale is served under `/zh-CN/`.

## The English title of a game

The Chinese name on the card is the name the **bundle** is filed under. The
English name is the title the game is actually known by, and it comes from
one of four places, in the order they are trusted:

| source | what it is |
|---|---|
| `bundle` | the title is inside the game's own strings, or in the name of one of its files — the strongest evidence, and the one the site quotes |
| `published` | the archive's own index (`dos.lol`) records an English name |
| `wiki` | the [CN DOS Games Wiki](https://cn-dos-games.fandom.com) records it in the `original name (en)` field |
| `known` | the title the game is established under, which this bundle does not carry |

`data/english-names.json` is the table the generator reads. To rebuild it:

```bash
python3 scripts/collect-wiki-names.py        # the wiki's own English titles
python3 scripts/collect-catalogue-names.py   # the chiuinan catalogue's titles
python3 scripts/build-english-names.py       # merge into data/english-names.json
```

The builder does the checking itself: it opens every bundle that carries a
claim and looks for the title inside it.

**A `bundle` claim that does not check out is downgraded to `known`**, so a
wrong English title never reaches the site as fact.

**The catalogue is a candidate, not a source.** The
[chiuinan catalogue](https://chiuinan.github.io/game/game/cgame11.htm) lists
the Chinese games in traditional Chinese with an English title beside each
one, and it is useful — but its rows are not aligned with the archive's, and
its names are sometimes the Chinese name in Latin letters. So a catalogue
name is only published when the bundle itself carries it; otherwise it is
dropped.

**A title that is only the Chinese name in Latin letters is not an English
title.** `scripts/find-romanised.py` compares a title with the pinyin of the
Chinese title it belongs to: "Jin Yong Qun Xia Zhuan" is 金庸群侠传 written
in Latin letters, and the site does not offer it as the game's English
title. A real title that happens to contain a syllable — "Xuan-Yuan Sword" —
is left alone.

**Two indexes publish machine output for Chinese games.** `dos.lol` prints
"Jin Yong Qun Xia Zhuan" for 金庸群侠传 and "Heavenly Sword Dragon Slaying
Sabe" for 倚天屠龙记; neither is a release title. `scripts/make-arbitration-batches.py`
writes out the games whose name came from an index, with what the bundle says
about itself, so that each one can be checked and replaced.

## Content conventions

- **The game pages are generated, not written.** `scripts/generate-dos-games.py`
  reads the archive in `~/git/dos/games` and writes
  `src/data/dos-games/<slug>.ts` (one module per game),
  `src/data/dos-games-index.ts` (the compact index the catalogue reads),
  `src/data/dos-games-stats.ts` (the numbers the front page shows),
  `src/pages/dos-games/<slug>.tsx` (one thin route per game) and
  `static/img/dos-games/<slug>.svg` (the card mark).
- **Run it with the venv python**: `~/git/whereq-dosbox-claude/.venv/bin/python`.
  The plain `python3` has no `pypinyin` and writes the wrong slugs.
- **The generator overwrites everything it owns.** Do not hand-edit the
  index, the stats or a generated module.
- **Five games are written by hand** — 三国志英杰传, 真人快打, 沙丘魔堡,
  炎龙骑士团2黄金城之谜 and 三国志3. They live in `src/data/games-played.ts`
  and are on the played-through shelf at `/played`. The generator skips them
  and writes their routes.
- **The categories are read from a primary source.** They come from the
  manifest of [`rwv/chinese-dos-games`](https://github.com/rwv/chinese-dos-games)
  — the project the bundles were mirrored from. Every game it knows carries a
  `type` code (ACT, SIM, RPG, AVG, PUZ, SLG, HGA, SPG, RTS); that code is the
  game's primary category. Where the same project publishes a description
  naming a further genre, the game is listed under that one too. The manifest
  decides the primary category, a description may add to it, never take one
  away. **The codes are not the standard abbreviations**: `SPG` is not sports
  here but the turn-based tactics games, which is why the category is called
  *Tactics*; the sports titles sit under `SIM`. Do not "correct" this back.
- **The download link is the original copy.** Every game page links straight
  at `https://dos-bin.zczc.cz/<name>.zip` — the archive the page was
  generated from. There is no mirror: the file the reader downloads is the
  file the page describes, and its SHA-256 is the archive's own.
- **The category labels are bilingual** — `label`/`labelZh` and
  `blurb`/`blurbZh` — written in `scripts/dos_game_categories.py`.
- **A generated page is honest about what is not known.** The facts come
  from the bundle: its file list, its file dates, the strings in its entry
  point and the archive's checksum. The "How to play" section says plainly
  that nobody has played it yet and points at the comment thread.

## Architecture

- **Content** lives in `src/data/`. `atlas-types.ts` holds the page types the
  game modules use; `dos-games/` holds one module per generated game;
  `games-played.ts` holds the hand-written ones; `dos-games-index.ts`,
  `dos-games-categories.ts` and `dos-games-stats.ts` are generated.
- **Layout** lives in `src/components/DosGames/` — `DosGamesCatalogue` (the
  list), `DosGamePage` (one game, no sidebar) and `PlayedGames` (the shelf).
  `src/components/Atlas/AtlasBlocks.tsx` renders the blocks of a page's
  body; it is the only piece of the Atlas that stayed.
- **A game page has no sidebar.** A tree of 1 898 games on every page would
  make every page eight times heavier than it needs to be; the catalogue at
  `/dos-games/` is where the list lives.
- **The catalogue is a panel, not a table.** The listing sits in a scroll
  container of its own — `@whereq/react`'s `Scrollbar` — and the search box
  and the category chips are **sticky at the top of that panel**, so a reader
  always knows which filters are applied to what is on screen.
- **The docs plugin is on, and it has to be.** The search bar reaches for the
  docs plugin's context on every page; without it the whole site fails to
  render. It holds the site's guide — two pages, under `/guide`.
- **Search** is client-side/offline via `@easyops-cn/docusaurus-search-local`.
  Its index is about 24 MB and is fetched only when the search is opened.

## Advertising — Google AdSense

- **The publisher ID is the only thing to set.** `src/data/adsense.ts` holds
  `ADSENSE_CLIENT`; it is empty until the account is approved, and while it
  is empty `ADSENSE_ENABLED` is false and the script is never injected.
  Paste the `ca-pub-…` ID there and nothing else has to change.
- **Ads are gated on consent.** `src/components/AdsenseConsent` is mounted
  site-wide from `src/theme/Root.tsx`. It shows the banner, remembers the
  choice in `localStorage` under `whereq.consent`, and **only injects
  Google's script once the visitor has accepted**. Declining means no ad
  script, no ad cookie and no request to Google at all.
- **The banner sits above the fixed footer** and publishes its own height as
  the `--consent-banner-height` custom property, which `.main-wrapper` adds to
  its bottom padding. Do not hard-code the banner's height in CSS.
- **The privacy policy** is `src/pages/privacy.mdx`. It is a legal document,
  so it states what actually happens — AdSense, Giscus, GitHub Pages for
  hosting, the archive host the download buttons point at, and that the
  search box never leaves the browser. If a third party is added, the policy
  has to be updated with it.
- **AdSense approves a root domain.** `pclegends.games` is one. A subdomain
  of an approved domain inherits the verdict and is never reviewed on its
  own.
- **Verify with `ads.txt` or the `google-adsense-account` meta tag, never the
  code snippet.** Google's crawler does not click "Accept", so a
  consent-gated script is invisible to it. Both alternatives are
  server-rendered and load no Google code before consent.

## Comments

`src/components/GiscusComments` is the site-wide thread. It points at this
repository's own Discussions, under **General**, with `mapping="pathname"`.
The ids are GitHub's own and they have to agree with each other — read them
with the `gh api graphql` command in the component's own comment. **A 404
from `giscus.app/api/discussions` is not a broken mapping**: it is giscus
saying no thread exists for that page yet. The widget still renders, and the
thread is created when the first comment is posted.

## House rules

- MetroUI, and **radius xs = 2px** — the whereq family standard. A
  pill-shaped button is a second button; do not use `border-radius: 999px`.
- Colours from `--ifm-*` tokens only, so light and dark both work.
- The site is dark-first.
- `onBrokenLinks` and `onBrokenMarkdownLinks` are `warn`, not `error`.
- `showLastUpdateTime`/`showLastUpdateAuthor` are off.
