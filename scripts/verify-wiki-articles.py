#!/usr/bin/env python3
"""Check the collected Wikipedia articles: is each one really about the game?

The search that finds an article is a guess. "Jurassic Park" is a game and a
film; "Danger Zone" is a game and a song; "Su-27 Flanker" is a game and an
aircraft. A card that links to the wrong article sends the reader to the
wrong page — and worse, a card that shows the wrong article's picture shows
the wrong box — so every article that was collected is checked against the
article itself, and the wrong ones are dropped.

The check is in three parts.

* **The subject.** The article has to be about a game. The one-line
  description Wikipedia writes under the title settles most of them —
  "1992 video game" against "American heavy bomber aircraft" — and for the
  rest the categories are read, because an article filed under
  `Category:1995年电子游戏` is about a game and one filed under
  `Category:1976年电影` is not.
* **The name.** The article has to carry the name of the game. A game
  called *Might and Magic VIII* may be written *Might and Magic VIII: Day
  of the Destroyer*, so the names are compared on the run of characters
  they share rather than on equality.
* **The year.** A game released in 1995 is not the 1963 comic of the same
  name. The year the bundle's own files are dated — and the copyright year
  the executable carries — is compared with the year the article names.

Each record holds two articles: the English one the English locale links to,
and the Chinese one the Chinese locale links to. They are checked apart, so
that a game with a good English article and a wrong Chinese one keeps the
English article and loses only the Chinese one.

Run:  ~/git/whereq-dosbox-claude/.venv/bin/python scripts/verify-wiki-articles.py
      ~/git/whereq-dosbox-claude/.venv/bin/python scripts/verify-wiki-articles.py --report
Out: prints what was dropped; writes the kept records back to
     data/game-images.json. With `--report` the data file is left alone and
     the sides that need another search are written to --needs, which the
     collector's research phase reads.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import os
import sys
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)

from wiki_rules import (  # noqa: E402
    is_game_category, is_game_description, name_matches, year_fits, year_of,
)

spec = importlib.util.spec_from_file_location('cgi', os.path.join(HERE, 'collect-game-images.py'))
collector = importlib.util.module_from_spec(spec)
spec.loader.exec_module(collector)

IMAGES = os.path.join(ROOT, 'data', 'game-images.json')
METADATA = os.path.expanduser('~/git/whereq-dosbox-claude/data/dos-games-metadata.json')

def categories(lang: str, title: str):
    """The categories the article is filed under, or None if unread."""
    import urllib.parse
    query = urllib.parse.urlencode({
        'action': 'query',
        'format': 'json',
        'prop': 'categories',
        'cllimit': 100,
        'titles': title,
    })
    data = collector.fetch_json(f'https://{lang}.wikipedia.org/w/api.php?{query}', tries=3)
    if not data:
        return None
    for page in data.get('query', {}).get('pages', {}).values():
        return [item['title'] for item in page.get('categories', [])]
    return None


def archive_year(metadata, identifier):
    """The year the bundle itself is dated, or None.

    The copyright line the executable carries is the original year of the
    game; the dates the files carry are the year the Chinese release was
    pressed. The copyright year is the better of the two.
    """
    record = metadata.get(identifier) or {}
    files = record.get('yearFiles')
    if isinstance(files, int):
        return files
    copy = record.get('yearCopyright')
    if isinstance(copy, int):
        return copy
    return year_of(str(copy or ''))


def about_a_game(lang: str, description: str, cats) -> bool:
    """Is this article about a game?

    The description settles most of them. Where it says nothing — the
    Chinese Wikipedia writes one for few pages — the categories are read
    instead. Both are folded before they are compared, because the Chinese
    Wikipedia writes them in the traditional script.
    """
    verdict = is_game_description(lang, description)
    if verdict is not None:
        return verdict
    if not cats:
        # The categories could not be read — the article is let through
        # rather than dropped on a technicality.
        return True
    return any(is_game_category(lang, name) for name in cats)


def check_article(lang: str, title: str, query: str, year):
    """The verdict for one article: keep it, or drop it."""
    if not title:
        return 'no-title', False
    data = collector.summary(lang, title)
    if not data:
        return 'gone', False
    description = data.get('description') or ''
    cats = None
    if is_game_description(lang, description) is None:
        cats = categories(lang, title)
    if not about_a_game(lang, description, cats):
        return 'not-a-game', False
    if query and not name_matches(query, title):
        return 'wrong-name', False
    article_year = year_of(description)
    if article_year and year and not year_fits(article_year, year):
        return 'wrong-year', False
    has_picture = bool((data.get('thumbnail') or {}).get('source'))
    return 'keep', has_picture


def check(item):
    """The verdict for one record: what is kept, and what is looked for again."""
    slug, record, query, lang, year, zh_query, zh_year = item
    primary_title = record.get('wiki') or ''
    verdict, primary_picture = check_article(lang, primary_title, query, year)

    zh_title = record.get('wikiZh') or ''
    zh_verdict, zh_picture = ('no-title', False)
    if zh_title:
        zh_verdict, zh_picture = check_article('zh', zh_title, zh_query, zh_year)

    return slug, verdict, primary_title, zh_verdict, zh_title, primary_picture


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--images', default=IMAGES)
    parser.add_argument('--report', action='store_true',
                        help='do not change the data file; write the sides that '
                             'need another search to --needs')
    parser.add_argument('--needs', default=os.path.join(ROOT, 'data', 'wiki-needs-research.json'))
    parser.add_argument('--workers', type=int, default=4,
                        help='how many pages are asked for at once — Wikipedia '
                             'throttles a burst, and a throttled answer looks '
                             'like a missing article')
    args = parser.parse_args()

    # The summaries that were read last time are read from the disk, so
    # that a run of the verifier does not ask Wikipedia for a thousand
    # pages in a minute — Wikipedia throttles that, and answers with
    # refusals that would look like a thousand missing articles.
    collector.load_cache()

    records = json.load(open(args.images, encoding='utf-8'))
    names = json.load(open(os.path.join(ROOT, 'data', 'english-names.json'), encoding='utf-8'))
    metadata = {}
    if os.path.exists(METADATA):
        for record in json.load(open(METADATA, encoding='utf-8')):
            metadata[record['identifier']] = record
    slugs = collector.slugs()
    reverse = {value: key for key, value in slugs.items()}

    kept = {}
    items = []
    for slug, record in records.items():
        # The five games whose pages are written by hand have their articles
        # settled already: 沙丘魔堡 is the Taiwan release of the first Dune,
        # and its Chinese article is the one about Dune, not about the name
        # the bundle is filed under. The rules below would read that as the
        # wrong article, so these are left alone.
        if slug in collector.CURATED:
            kept[slug] = record
            continue
        identifier = reverse.get(slug)
        english = (names.get(identifier) or {}).get('en') if identifier else None
        lang = record.get('lang') or 'en'
        year = archive_year(metadata, identifier) if identifier else None
        # The Chinese article is judged against the Chinese name; the English
        # one against the English title.
        query = identifier if lang == 'zh' else (english or identifier or '')
        zh_query = identifier or ''
        items.append((slug, record, query, lang, year, zh_query, year))

    print(f'checking {len(items)} records')
    dropped = []
    needs = {}
    keep = kept
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        for index, (slug, verdict, title, zh_verdict, zh_title, primary_picture) in \
                enumerate(pool.map(check, items), 1):
            record = dict(records[slug])
            sides = []
            zh_kept = zh_title and zh_verdict == 'keep'
            if verdict != 'keep':
                dropped.append((slug, verdict, title))
                if zh_kept:
                    # The English article was wrong but the Chinese one is
                    # right, so the record keeps the Chinese article alone.
                    record = {
                        'wiki': zh_title,
                        'wikiUrl': record.get('wikiUrlZh'),
                        'lang': 'zh',
                    }
                    if record.get('wikiUrl') and not primary_picture:
                        record['image'] = records[slug].get('image')
                    keep[slug] = record
                    sides.append('zh')
                else:
                    sides.append('en' if record.get('lang') != 'zh' else 'zh')
            else:
                keep[slug] = record
            if zh_title and not zh_kept:
                dropped.append((slug, zh_verdict, zh_title))
                sides.append('zh')
                if slug in keep:
                    # The Chinese article is wrong, so it goes; and the
                    # picture it carried goes with it, because the picture
                    # on the card is the one that article held.
                    keep[slug].pop('wikiZh', None)
                    keep[slug].pop('wikiUrlZh', None)
                    if not primary_picture and keep[slug].get('image'):
                        keep[slug].pop('image', None)
            if sides:
                needs[slug] = sorted(set(sides))
            if index % 100 == 0:
                print(f'  {index}/{len(items)} checked, {len(dropped)} dropped',
                      flush=True)

    print(f'\ndropped {len(dropped)} of {len(items)} articles:')
    for slug, verdict, title in dropped:
        print(f'  {slug:28} {verdict:12} {title}')

    with open(args.needs, 'w', encoding='utf-8') as handle:
        json.dump(needs, handle, ensure_ascii=False, indent=1)
    print(f'\nwrote {args.needs}: {len(needs)} games to look for again')

    if args.report:
        collector.save_cache()
        print('\n--report: the data file is left as it is')
        return

    with open(args.images, 'w', encoding='utf-8') as handle:
        json.dump(keep, handle, ensure_ascii=False, indent=1)
    collector.save_cache()
    print(f'\nwrote {args.images} with {len(keep)} records')
    print(f'  with a picture: {sum(1 for r in keep.values() if r.get("image"))}')


if __name__ == '__main__':
    main()
