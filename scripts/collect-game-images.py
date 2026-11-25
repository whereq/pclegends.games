#!/usr/bin/env python3
"""Collect each game's picture, and the Wikipedia page it came from.

The card on the catalogue page should show the game, not its first letter.
Where the game has a Wikipedia article, that article carries the cover art or
the screenshot — so this script finds the article and takes the picture from
it. The article's address is kept as well: the game's own page links to it,
so a reader can go and read more.

Where there is no article, the game keeps the letter on a plate that the
generator draws.

The work is done in three phases, because Wikipedia answers the two kinds of
question differently. The summary of a page is cheap and can be asked for
several at a time; the search that finds a page whose title is not exactly
the game's name is dearer, and Wikipedia throttles it when it is asked for
too much at once. So the first phase takes the pages it can find directly,
the second goes looking for the rest — one at a time, with a pause — and the
third finds the Chinese article for the Chinese locale.

Run:  ~/git/whereq-dosbox-claude/.venv/bin/python scripts/collect-game-images.py --phase direct
      ~/git/whereq-dosbox-claude/.venv/bin/python scripts/collect-game-images.py --phase search
      ~/git/whereq-dosbox-claude/.venv/bin/python scripts/collect-game-images.py --phase zh
Out: data/game-images.json

**The interpreter matters.** The slugs the pictures are filed under are the
pinyin slugs the generator gives, and pinyin comes from `pypinyin`, which is
in the venv and not in the system python. Run this with the venv's python, or
every slug falls back to its ASCII letters and the pictures land under names
the site does not use. The resizing is a separate matter: it shells out to
the system `python3`, which is where Pillow lives.
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import re
import subprocess
import sys
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)

from dos_game_slugs import unique_slug  # noqa: E402
from wiki_rules import (  # noqa: E402
    fold, is_game_category, is_game_description, name_matches, year_fits, year_of,
)

try:
    import pypinyin  # noqa: E402,F401
except ImportError:
    sys.exit('This script needs pypinyin for the pinyin slugs the site uses.\n'
             'Run it with the venv python:\n'
             '  ~/git/whereq-dosbox-claude/.venv/bin/python scripts/collect-game-images.py ...')

GAMES = '/home/whereq/git/dos/games'
INDEX = '/home/whereq/git/dos/games_index.csv'
NAMES = os.path.join(ROOT, 'data', 'english-names.json')
IMAGES = os.path.join(ROOT, 'static', 'img', 'dos-games')
OUT = os.path.join(ROOT, 'data', 'game-images.json')

USER_AGENT = ('PCLegendsArchive/1.0 (https://pclegends.games; archive of '
              'Chinese-localised MS-DOS games) python-urllib')

# The five games whose pages are written by hand; their slugs are fixed.
MANUAL = {
    '三国志英杰传': 'sanguo-yingjie-zhuan',
    '真人快打': 'mortal-kombat',
    '沙丘魔堡': 'sha-qiu-mo-bao',
    '炎龙骑士团2黄金城之谜': 'yan-long-qi-shi-tuan-ii-huang-jin-cheng-zhi-mi',
    '三国志3': 'san-guo-zhi-iii',
}

# The articles for the five hand-written games, settled by hand.
#
# The automatic search finds the wrong page for some of them: 沙丘魔堡 is the
# Taiwan release of the *first* Dune — Cryo, 1992, the adventure-strategy
# game — and not Dune II, and the three Chinese-developed games have no
# English article at all. So their articles are written down here instead,
# and the search is not asked about them.
#
# The picture is the one the article carries: the cover art for the Chinese
# games, the logo for Mortal Kombat, the cover for Dune.
CURATED = {
    'sanguo-yingjie-zhuan': {
        'wiki': 'Romance of the Three Kingdoms (video game series)',
        'wikiUrl': 'https://en.wikipedia.org/wiki/Romance_of_the_Three_Kingdoms_(video_game_series)',
        'wikiZh': '三國志英傑傳',
        'wikiUrlZh': 'https://zh.wikipedia.org/wiki/%E4%B8%89%E5%9C%8B%E5%BF%97%E8%8B%B1%E5%82%91%E5%82%B3',
        # No picture: the Chinese article carries none, and the English
        # series article shows a NES cover that is not this game. The card
        # keeps the letter on a plate rather than show the wrong box.
    },
    'mortal-kombat': {
        'wiki': 'Mortal Kombat',
        'wikiUrl': 'https://en.wikipedia.org/wiki/Mortal_Kombat',
        'wikiZh': '真人快打系列',
        'wikiUrlZh': 'https://zh.wikipedia.org/wiki/%E7%9C%9F%E4%BA%BA%E5%BF%AB%E6%89%93%E7%B3%BB%E5%88%97',
        # The logo the article carries: the game of that name, not the
        # series, so the card shows the mark the arcade cabinet wore.
        'image': 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b1/Mortal_Kombat_Logo.svg/330px-Mortal_Kombat_Logo.svg.png',
    },
    'sha-qiu-mo-bao': {
        'wiki': 'Dune (video game)',
        'wikiUrl': 'https://en.wikipedia.org/wiki/Dune_(video_game)',
        'wikiZh': '沙丘 (游戏)',
        'wikiUrlZh': 'https://zh.wikipedia.org/wiki/%E6%B2%99%E4%B8%98_(%E6%B8%B8%E6%88%8F)',
        'image': 'https://upload.wikimedia.org/wikipedia/en/f/f4/Dune_cover.png',
    },
    'yan-long-qi-shi-tuan-ii-huang-jin-cheng-zhi-mi': {
        # There is no English article for this game — it was released in
        # Taiwan only — so the Chinese one is the article on both sides.
        'wiki': '炎龍騎士團II 黃金城之謎',
        'wikiUrl': 'https://zh.wikipedia.org/wiki/%E7%82%8E%E9%BE%8D%E9%A8%8E%E5%A3%AB%E5%9C%98II_%E9%BB%83%E9%87%91%E5%9F%8E%E4%B9%8B%E8%AC%8E',
        'wikiZh': '炎龍騎士團II 黃金城之謎',
        'wikiUrlZh': 'https://zh.wikipedia.org/wiki/%E7%82%8E%E9%BE%8D%E9%A8%8E%E5%A3%AB%E5%9C%98II_%E9%BB%83%E9%87%91%E5%9F%8E%E4%B9%8B%E8%AC%8E',
        'image': 'https://upload.wikimedia.org/wikipedia/zh/f/fe/Flame_Dragon_II_Legend_Of_Golden_Castle_%28PC_Game_Cover%29.jpg',
    },
    'san-guo-zhi-iii': {
        'wiki': 'Romance of the Three Kingdoms III: Dragon of Destiny',
        'wikiUrl': 'https://en.wikipedia.org/wiki/Romance_of_the_Three_Kingdoms_III:_Dragon_of_Destiny',
        'wikiZh': '三國志III',
        'wikiUrlZh': 'https://zh.wikipedia.org/wiki/%E4%B8%89%E5%9C%8B%E5%BF%97III',
        'image': 'https://upload.wikimedia.org/wikipedia/zh/5/52/%E4%B8%89%E5%9C%8B%E5%BF%97III.jpg',
    },
}

MAX_BYTES = 500 * 1024
# The picture on a card is 44 pixels across; 250 is plenty for the detail
# page, and keeps the archive's images small. It is also one of the sizes
# Wikimedia serves on request — the others are 20, 40, 60, 120, 330, 500 and
# up, and a size that is not on that list is refused with a 400.
MAX_EDGE = 250
# The pause between the searches of the second phase.
SEARCH_PAUSE = 1.1

# Where the year of each bundle is read from.
METADATA = os.path.expanduser('~/git/whereq-dosbox-claude/data/dos-games-metadata.json')


def fetch_json(url: str, timeout: int = 25, tries: int = 1):
    """A JSON answer, or None when the server does not have one."""
    for attempt in range(tries):
        request = urllib.request.Request(url, headers={
            'User-Agent': USER_AGENT,
            'Accept': 'application/json',
        })
        try:
            with urllib.request.urlopen(request, timeout=timeout) as response:
                return json.loads(response.read().decode('utf-8'))
        except urllib.error.HTTPError as error:
            if error.code == 429 and attempt + 1 < tries:
                time.sleep(5 * (attempt + 1))
                continue
            return None
        except (urllib.error.URLError, ValueError, OSError):
            return None
    return None


# The summaries that were read, so that a page which turns up for one game
# is not asked for again for the next — and so that the verifier can be run
# without asking Wikipedia for anything at all.
#
# Wikipedia throttles a burst of requests, and a run that asks for a thousand
# summaries in a minute is answered with a thousand refusals. The cache is
# written to disk, so the second run of the verifier is quiet and the first
# one is not.
_SUMMARIES = {}
SUMMARY_CACHE = os.path.join(ROOT, 'data', 'wiki-summaries.json')
_CACHE_DIRTY = False


def load_cache():
    """The summaries that were read last time."""
    if not os.path.exists(SUMMARY_CACHE):
        return
    try:
        for key, data in json.load(open(SUMMARY_CACHE, encoding='utf-8')).items():
            lang, _, title = key.partition('|')
            _SUMMARIES[(lang, title)] = data
    except (OSError, ValueError):
        pass


def save_cache():
    """Write the summaries read this time back to the disk."""
    if not _CACHE_DIRTY:
        return
    out = {f'{lang}|{title}': data for (lang, title), data in _SUMMARIES.items()
           if data is not None}
    with open(SUMMARY_CACHE, 'w', encoding='utf-8') as handle:
        json.dump(out, handle, ensure_ascii=False)
    print(f'wrote {SUMMARY_CACHE}: {len(out)} summaries')


def summary(lang: str, title: str):
    """The Wikipedia summary of a page, or None."""
    global _CACHE_DIRTY
    key = (lang, title)
    if key in _SUMMARIES:
        return _SUMMARIES[key]
    path = urllib.parse.quote(title.replace(' ', '_'), safe='')
    data = fetch_json(f'https://{lang}.wikipedia.org/api/rest_v1/page/summary/{path}',
                      tries=3)
    if not data or data.get('type') != 'standard':
        _SUMMARIES[key] = None
        return None
    _SUMMARIES[key] = data
    _CACHE_DIRTY = True
    return data


# The one-line description Wikipedia writes under the title: "1992 video
# game", "American heavy bomber aircraft", "1986 single by Kenny Loggins".
# It is the cheapest way to tell a game from the song, the film or the
# bomber that shares its name.
ABOUT_A_GAME = {
    'en': ('video game', 'game', 'arcade', 'rpg', 'simulator'),
    'zh': ('电子游戏', '電腦遊戲', '电脑游戏', '游戏', '遊戲', '游戏机', '游戏软件'),
}


def about_a_game(lang: str, data) -> bool:
    """Is this article about a game?

    The title alone cannot tell a game from the song or the film that shares
    its name — "Danger Zone" is both — so the description is read. An
    article with no description at all is let through: the Chinese
    Wikipedia writes one for few pages, and dropping those would lose good
    articles.
    """
    if not data:
        return False
    description = (data.get('description') or '').strip().lower()
    if not description:
        return True
    return any(word in description for word in ABOUT_A_GAME.get(lang, ()))


def categories(lang: str, title: str):
    """The categories the article is filed under, or None if unread."""
    params = urllib.parse.urlencode({
        'action': 'query',
        'format': 'json',
        'prop': 'categories',
        'cllimit': 100,
        'titles': title,
    })
    data = fetch_json(f'https://{lang}.wikipedia.org/w/api.php?{params}', tries=3)
    if not data:
        return None
    for page in data.get('query', {}).get('pages', {}).values():
        return [item['title'] for item in page.get('categories', [])]
    return None


def article_is_a_game(lang: str, title: str) -> bool:
    """Is the article about a game, judged on the categories it is filed under?

    The Chinese Wikipedia writes a description for few pages, so the
    categories are what is left to judge by: an article filed under
    `Category:1995年电子游戏` is about a game, one filed under
    `Category:1976年电影` is not.
    """
    names = categories(lang, title)
    if not names:
        # The categories could not be read — the article is let through
        # rather than dropped on a technicality.
        return True
    return any(is_game_category(lang, name) for name in names)


def similar(query: str, title: str) -> bool:
    """Is this page about the game that was searched for?"""
    left, right = fold(query), fold(title)
    if not left or not right:
        return False
    if left in right or right in left:
        return True
    words_left = set(re.findall(r'[a-z0-9]{5,}', query.lower()))
    words_right = set(re.findall(r'[a-z0-9]{5,}', title.lower()))
    return bool(words_left & words_right)


def search(lang: str, title: str):
    """The Wikipedia page that best matches a title, or None.

    A search is a guess, so the answer has to be about the same game: the
    page's title has to carry the name that was searched for, or most of it.
    "3D陨石" must not turn up "圖版遊戲".
    """
    for hit in search_hits(lang, title, 3):
        if similar(title, hit):
            return hit
    return None


def search_hits(lang: str, query: str, limit: int = 6):
    """The pages a search turns up, best first."""
    params = urllib.parse.urlencode({
        'action': 'query',
        'list': 'search',
        'srsearch': query,
        'srlimit': limit,
        'format': 'json',
    })
    data = fetch_json(f'https://{lang}.wikipedia.org/w/api.php?{params}', tries=4)
    if not data:
        return []
    return [hit.get('title', '') for hit in data.get('query', {}).get('search', []) if hit.get('title')]


def research_queries(lang: str, name: str, year):
    """The ways of asking Wikipedia for a game.

    A plain search for a game's name turns up whatever else carries it: the
    film *Jurassic Park*, the song *Danger Zone*, the bomber *Boeing B-17
    Flying Fortress*. Asking for the game instead — "Jurassic Park video
    game" — and asking for it in the category of its year — "Jurassic Park
    incategory:"1993 video games"" — both turn up the game's own article.
    """
    if lang == 'zh':
        return [f'{name} 电子游戏', f'{name} 电脑游戏']
    queries = [f'{name} video game']
    if year:
        queries.append(f'{name} incategory:"{year} video games"')
    else:
        queries.append(f'{name} dos game')
    return queries


def candidate_score(query: str, title: str, data, year):
    """How well this page answers the question, and its year.

    The page that carries the game's name and nothing else is the best
    answer; a page about the whole series is about the game only in part;
    and a page about the version this archive holds — the one for the
    computer — is better than the one for the console.
    """
    score = 0
    folded_title, folded_query = fold(title), fold(query)
    if folded_title == folded_query:
        score += 4
    elif folded_title.startswith(folded_query):
        score += 3
    elif folded_query.startswith(folded_title):
        score += 2
    else:
        score += 1
    if re.search(r'(video games|game series|series)$', title, re.IGNORECASE):
        score -= 2
    if re.search(r'\b(computer|dos)\b', title, re.IGNORECASE):
        score += 2
    if (data.get('thumbnail') or {}).get('source'):
        score += 1
    article_year = year_of(data.get('description') or '')
    if article_year and year and not year_fits(article_year, year):
        # The page is about something of another year that shares the name.
        score -= 4
    return score, article_year


def research_game(lang: str, name: str, slug: str, year, fresh: bool = True):
    """The article that is really about this game, or None.

    Every page the searches turn up is looked at, and the one that is about
    a game, carries the game's name and sits in the right year is kept. The
    year matters: a game of 1995 is not the comic of 1963 that shares its
    name, and the categories a search can ask for settle it before the
    article is even read.
    """
    if not name:
        return None
    query = name

    titles = []
    for search_query in research_queries(lang, query, year):
        for hit in search_hits(lang, search_query, 6):
            if hit not in titles:
                titles.append(hit)
        time.sleep(SEARCH_PAUSE)

    if not titles:
        return None

    def read(title):
        return title, summary(lang, title)

    with ThreadPoolExecutor(max_workers=3) as pool:
        summaries = dict(pool.map(read, titles[:12]))

    best = None
    best_score = None
    for title, data in summaries.items():
        if not data:
            continue
        # The name is checked first: it costs nothing, and it is the check
        # that throws away most of the pages a search turns up.
        if not name_matches(query, title):
            continue
        description = data.get('description') or ''
        verdict = is_game_description(lang, description)
        if verdict is False:
            continue
        if verdict is None:
            # The Wikipedia writes no description — the Chinese one rarely
            # does — so the categories are read instead.
            if not article_is_a_game(lang, title):
                continue
        score, article_year = candidate_score(query, title, data, year)
        if score < 0:
            continue
        record = record_for(data, lang, slug, fresh=fresh)
        if not record:
            continue
        if best_score is None or score > best_score:
            best, best_score = record, score
    return best


def smaller(url: str) -> str:
    """The same picture, asked for at a smaller size.

    Wikimedia serves a picture at any width it has already made, but a width
    it has not made has to be one of the standard sizes or the request is
    refused. The summary endpoint hands back a picture at a standard size
    already, so this is only the fallback for the rare case where it did not.
    """
    clean = url.split('?')[0]
    match = re.search(r'/(\d+)px-([^/]+)$', clean)
    if match:
        clean = clean[:match.start()] + f'/{MAX_EDGE}px-' + match.group(2)
    tail = ('?' + url.split('?')[1]) if '?' in url else ''
    return clean + tail


SHRINK = """
import sys
try:
    from PIL import Image
except ImportError:
    sys.exit(0)
path = sys.argv[1]
try:
    image = Image.open(path)
    image.thumbnail((%d, %d))
    if image.mode in ('RGBA', 'LA', 'P'):
        image = image.convert('RGBA')
        background = Image.new('RGB', image.size, (255, 255, 255))
        background.paste(image, mask=image.split()[-1])
        image = background
    else:
        image = image.convert('RGB')
    image.save(path, 'JPEG', quality=82, optimize=True)
except Exception:
    sys.exit(0)
"""


def shrink(path: str) -> bool:
    """Make the picture small enough to live on a card."""
    try:
        subprocess.run(['python3', '-c', SHRINK % (MAX_EDGE, MAX_EDGE), path],
                       timeout=30, capture_output=True)
    except (OSError, subprocess.SubprocessError):
        pass
    return os.path.exists(path) and os.path.getsize(path) > 0


def download(url: str, path: str) -> bool:
    """Fetch an image to a file, unless it is too big to be worth it."""
    request = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    try:
        with urllib.request.urlopen(request, timeout=40) as response:
            body = response.read(MAX_BYTES + 1)
    except (urllib.error.HTTPError, urllib.error.URLError, OSError):
        return False
    if len(body) > MAX_BYTES:
        return False
    with open(path, 'wb') as handle:
        handle.write(body)
    return shrink(path)


def fetch_image(source: str, path: str) -> bool:
    """Fetch the picture, trying the address as it stands first.

    The address Wikipedia gives is already at a size it serves, so it is
    tried first. The rewritten one is the fallback: a size that is not on
    Wikimedia's list of standard sizes is refused with a 400.
    """
    for url in dict.fromkeys([source, smaller(source)]):
        if download(url, path):
            return True
    return False


def article_url(lang: str, title: str) -> str:
    key = urllib.parse.quote(title.replace(' ', '_'), safe='()_')
    return f'https://{lang}.wikipedia.org/wiki/{key}'


def record_for(data, lang: str, slug: str, fresh: bool = False):
    """The record for a page that was found: where it is, and what it says.

    A page that carries a picture gives the card its picture. A page that
    does not — some articles have no lead image at all — still gives the
    game its Wikipedia address, so the reader can still go and read more.

    With `fresh` the picture is fetched again even when the file is already
    there. That is what a second search needs: the article has changed, and
    the picture the last article carried was the wrong one.
    """
    if not data:
        return None
    source = (data.get('thumbnail') or {}).get('source') or \
        (data.get('originalimage') or {}).get('source')
    title = data.get('title')
    if not title:
        return None
    record = {
        'wiki': title,
        'wikiUrl': article_url(lang, title),
        'lang': lang,
    }
    if not source:
        return record
    path = os.path.join(IMAGES, slug + '.jpg')
    picture = os.path.exists(path) and os.path.getsize(path) > 0
    if fresh or not picture:
        picture = fetch_image(source, path)
    if picture:
        record['image'] = f'/img/dos-games/{slug}.jpg'
        # The address the picture came from, so that it can be fetched again
        # when the article is looked for a second time.
        record['imageSource'] = source
    return record


def slugs():
    """Every game's slug, the way the generator assigns them."""
    with open(INDEX, newline='', encoding='utf-8') as handle:
        rows = list(csv.DictReader(handle))
    taken = set()
    out = {}
    for row in rows:
        identifier = row['identifier']
        if identifier in MANUAL:
            out[identifier] = MANUAL[identifier]
            continue
        if not os.path.exists(os.path.join(GAMES, identifier + '.zip')):
            continue
        name = row['name_zh'] or identifier
        out[identifier] = unique_slug(name, taken)
    return out


def years():
    """The year each bundle is dated, by the game's own name.

    The copyright line the executable carries is the original year of the
    game; the dates the files carry are the year the Chinese release was
    pressed. The copyright year is the better of the two.
    """
    out = {}
    if not os.path.exists(METADATA):
        return out
    for record in json.load(open(METADATA, encoding='utf-8')):
        identifier = record.get('identifier')
        files = record.get('yearFiles')
        year = files if isinstance(files, int) else None
        if not year:
            copy = record.get('yearCopyright')
            if isinstance(copy, int):
                year = copy
            elif copy:
                found = re.search(r'(19[89]\d|20[0-2]\d)', str(copy))
                if found:
                    year = int(found.group(1))
        if year:
            out[identifier] = year
    return out


def load():
    if os.path.exists(OUT):
        return json.load(open(OUT, encoding='utf-8'))
    return {}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--names', default=NAMES)
    parser.add_argument('--images', default=IMAGES)
    parser.add_argument('--out', default=OUT)
    parser.add_argument('--phase',
                        choices=['direct', 'search', 'zh', 'zhsearch', 'research'],
                        default='direct')
    parser.add_argument('--workers', type=int, default=4)
    parser.add_argument('--limit', type=int, default=0)
    parser.add_argument('--needs', default=os.path.join(ROOT, 'data', 'wiki-needs-research.json'))
    args = parser.parse_args()

    english_names = {}
    if os.path.exists(args.names):
        english_names = json.load(open(args.names, encoding='utf-8'))

    found = load()
    os.makedirs(args.images, exist_ok=True)
    load_cache()

    # The hand-written games have their articles settled already, so they are
    # put in place before anything is looked up, and the search is not asked
    # about them.
    for slug, curated in CURATED.items():
        record = dict(curated)
        record['lang'] = 'en'
        picture = record.pop('image', None)
        path = os.path.join(args.images, slug + '.jpg')
        if picture:
            if not (os.path.exists(path) and os.path.getsize(path) > 0):
                fetch_image(picture, path)
            if os.path.exists(path) and os.path.getsize(path) > 0:
                record['image'] = f'/img/dos-games/{slug}.jpg'
        found[slug] = record

    games = []
    for identifier, slug in slugs().items():
        # A game that already has a picture is settled. One that has only an
        # article is worth another look — a different spelling of its name
        # may lead to a page that does carry a picture.
        #
        # The Chinese pass wants every game: it is looking for the Chinese
        # article, not for a picture.
        if slug in CURATED:
            continue
        if args.phase != 'zh' and slug in found and found[slug].get('image'):
            continue
        entry = english_names.get(identifier) or {}
        games.append((identifier, slug, entry.get('en')))

    if args.limit:
        games = games[:args.limit]

    if args.phase == 'research':
        # The fifth phase: look again for the articles that were checked and
        # found wanting.
        #
        # The verifier writes down the sides that failed — the English
        # article was about the film, or the song, or the bomber that shares
        # the game's name — and those are the sides looked for again, this
        # time asking Wikipedia for the game rather than for the name.
        #
        # The record is built afresh out of what is found: a side that is
        # looked for again and is not found keeps no article at all rather
        # than the wrong one, and a side that was not looked for keeps the
        # article it had.
        needs = {}
        if os.path.exists(args.needs):
            loaded = json.load(open(args.needs, encoding='utf-8'))
            if isinstance(loaded, dict):
                needs = loaded
            else:
                needs = {slug: ['en', 'zh'] for slug in loaded}
        reverse = {value: key for key, value in slugs().items()}
        year_of_game = years()

        def research_side(slug, side, identifier, year):
            if side == 'en':
                entry = english_names.get(identifier) or {}
                english = entry.get('en')
                if not english:
                    return None
                return research_game('en', english, slug, year)
            return research_game('zh', identifier, slug, year, fresh=False)

        def work_one(item):
            """The record for one game, after the search."""
            slug, sides = item
            identifier = reverse.get(slug)
            current = found.get(slug) or {}
            year = year_of_game.get(identifier) if identifier else None

            # The picture the dropped article carried was the wrong one — it
            # was the film's poster, or the song's cover — so it goes with
            # the article, and the file it was saved in goes with it.
            if 'en' in sides and current.get('image'):
                path = os.path.join(args.images, slug + '.jpg')
                if os.path.exists(path):
                    os.remove(path)
                current = {k: v for k, v in current.items()
                           if k not in ('image', 'imageSource')}

            fresh_record = {}
            for side in ('en', 'zh'):
                if side in sides:
                    found_side = research_side(slug, side, identifier, year) if identifier else None
                    if not found_side:
                        continue
                    if side == 'en':
                        fresh_record['wiki'] = found_side['wiki']
                        fresh_record['wikiUrl'] = found_side['wikiUrl']
                        fresh_record['lang'] = 'en'
                        if found_side.get('image'):
                            fresh_record['image'] = found_side['image']
                            fresh_record['imageSource'] = found_side.get('imageSource')
                    else:
                        fresh_record['wikiZh'] = found_side['wiki']
                        fresh_record['wikiUrlZh'] = found_side['wikiUrl']
                        if not fresh_record.get('image') and found_side.get('image'):
                            fresh_record['image'] = found_side['image']
                            fresh_record['imageSource'] = found_side.get('imageSource')
                else:
                    # This side was not looked for again: the article it had
                    # was checked and kept.
                    for key in ('wiki', 'wikiUrl', 'image', 'imageSource', 'lang',
                                'wikiZh', 'wikiUrlZh'):
                        if current.get(key):
                            fresh_record[key] = current[key]

            if 'en' in sides and 'wiki' not in fresh_record and fresh_record.get('wikiZh'):
                # The English article is gone, but the Chinese one is right:
                # the record names the Chinese article.
                fresh_record['wiki'] = fresh_record.pop('wikiZh')
                fresh_record['wikiUrl'] = fresh_record.pop('wikiUrlZh')
                fresh_record['lang'] = 'zh'
            return slug, fresh_record

        todo = [(slug, sides) for slug, sides in needs.items() if slug not in CURATED]
        if args.limit:
            todo = todo[:args.limit]
        print(f'researching {len(todo)} games')
        # The searches run in a few threads at a time. Wikipedia throttles a
        # search that is asked for too often, but three at once with a pause
        # between them is answered without complaint.
        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            for count, (slug, fresh_record) in enumerate(pool.map(work_one, todo), 1):
                if fresh_record.get('wiki'):
                    found[slug] = fresh_record
                else:
                    found.pop(slug, None)
                if count % 25 == 0:
                    pictures = sum(1 for item in found.values() if item.get('image'))
                    print(f'  {count}/{len(todo)} researched, {pictures} with a picture',
                          flush=True)
                    with open(args.out, 'w', encoding='utf-8') as handle:
                        json.dump(found, handle, ensure_ascii=False, indent=1)

        with open(args.out, 'w', encoding='utf-8') as handle:
            json.dump(found, handle, ensure_ascii=False, indent=1)
        pictures = sum(1 for item in found.values() if item.get('image'))
        print(f'games: {len(todo)}   pages found: {len(found)}   with a picture: {pictures}')
        print('wrote', args.out)
        save_cache()
        return

    if args.phase == 'zhsearch':
        # The sixth phase: the Chinese article for every game that has not got
        # one yet.
        #
        # The Chinese Wikipedia has an article for fewer games than the
        # English one has, and it writes them under the Chinese name the
        # bundle is filed under — so the game is looked for by that name,
        # asking for the game rather than for the name.
        #
        # The English article is not touched: only the Chinese side of the
        # record is filled in.
        reverse = {value: key for key, value in slugs().items()}
        year_of_game = years()

        def work(item):
            slug, identifier = item
            year = year_of_game.get(identifier)
            chinese = research_game('zh', identifier, slug, year, fresh=False)
            return slug, chinese

        todo = [(slug, identifier) for identifier, slug in slugs().items()
                if slug not in CURATED and not (found.get(slug) or {}).get('wikiUrlZh')]
        if args.limit:
            todo = todo[:args.limit]
        print(f'looking for the Chinese article of {len(todo)} games')
        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            for count, (slug, chinese) in enumerate(pool.map(work, todo), 1):
                current = found.get(slug)
                if chinese:
                    if current:
                        current['wikiZh'] = chinese['wiki']
                        current['wikiUrlZh'] = chinese['wikiUrl']
                        if not current.get('image') and chinese.get('image'):
                            current['image'] = chinese['image']
                            current['imageSource'] = chinese.get('imageSource')
                    else:
                        found[slug] = {'wiki': chinese['wiki'], 'wikiUrl': chinese['wikiUrl'],
                                       'lang': 'zh'}
                        if chinese.get('image'):
                            found[slug]['image'] = chinese['image']
                            found[slug]['imageSource'] = chinese.get('imageSource')
                if count % 25 == 0:
                    articles = sum(1 for item in found.values() if item.get('wikiUrlZh'))
                    pictures = sum(1 for item in found.values() if item.get('image'))
                    print(f'  {count}/{len(todo)} looked for, {articles} Chinese articles, '
                          f'{pictures} with a picture', flush=True)
                    with open(args.out, 'w', encoding='utf-8') as handle:
                        json.dump(found, handle, ensure_ascii=False, indent=1)

        with open(args.out, 'w', encoding='utf-8') as handle:
            json.dump(found, handle, ensure_ascii=False, indent=1)
        articles = sum(1 for item in found.values() if item.get('wikiUrlZh'))
        print(f'games: {len(todo)}   Chinese articles: {articles}')
        print('wrote', args.out)
        save_cache()
        return

    if args.phase == 'zh':
        # The third phase: the Chinese Wikipedia article for every game.
        #
        # The English article is what the English locale links to and the
        # Chinese one is what the Chinese locale links to, so both are kept.
        # The Chinese article is found by the game's own Chinese name, and
        # the picture on the card comes from whichever article has one.
        #
        # The summaries are asked for several at a time — Wikipedia serves
        # them cheaply. Only the search, which it throttles, is asked for
        # one at a time with a pause.
        def merge(slug, record):
            """Put the Chinese article beside the English one."""
            current = found.get(slug) or {}
            if current.get('wikiUrl') and current.get('lang') == 'en':
                current['wikiZh'] = record['wiki']
                current['wikiUrlZh'] = record['wikiUrl']
                if not current.get('image') and record.get('image'):
                    current['image'] = record['image']
                found[slug] = current
            else:
                found[slug] = record

        def lookup(item):
            identifier, slug, english = item
            data = summary('zh', identifier)
            if not data:
                return slug, None
            record = record_for(data, 'zh', slug)
            if record:
                record['lang'] = 'zh'
            return slug, record

        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            for count, (slug, record) in enumerate(pool.map(lookup, games), 1):
                if record:
                    merge(slug, record)
                if count % 100 == 0:
                    pictures = sum(1 for item in found.values() if item.get('image'))
                    print(f'  {count}/{len(games)} summarised, {pictures} with a picture',
                          flush=True)
                    with open(args.out, 'w', encoding='utf-8') as handle:
                        json.dump(found, handle, ensure_ascii=False, indent=1)

        # What the summary did not answer, the search has to look for. One
        # search at a time, with a pause, because Wikipedia throttles it.
        for index, (identifier, slug, english) in enumerate(games, 1):
            if found.get(slug, {}).get('wikiUrlZh'):
                continue
            title = search('zh', identifier)
            if title:
                data = summary('zh', title)
                record = record_for(data, 'zh', slug)
                if record:
                    record['lang'] = 'zh'
                    merge(slug, record)
            if index % 25 == 0:
                pictures = sum(1 for item in found.values() if item.get('image'))
                print(f'  {index}/{len(games)} searched, {pictures} with a picture',
                      flush=True)
                with open(args.out, 'w', encoding='utf-8') as handle:
                    json.dump(found, handle, ensure_ascii=False, indent=1)
            time.sleep(SEARCH_PAUSE)

    elif args.phase == 'direct':
        def work(item):
            identifier, slug, english = item
            record = None
            if english:
                data = summary('en', english)
                if data:
                    record = record_for(data, 'en', slug)
                    if record and record.get('image'):
                        return slug, record
            data = summary('zh', identifier)
            if data:
                other = record_for(data, 'zh', slug)
                if other and other.get('image'):
                    return slug, other
                if record is None:
                    record = other
            return slug, record

        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            for count, (slug, record) in enumerate(pool.map(work, games), 1):
                if record:
                    found[slug] = record
                if count % 100 == 0:
                    pictures = sum(1 for item in found.values() if item.get('image'))
                    print(f'  {count}/{len(games)} checked, {pictures} with a picture',
                          flush=True)
                    with open(args.out, 'w', encoding='utf-8') as handle:
                        json.dump(found, handle, ensure_ascii=False, indent=1)
    else:
        # The second phase: look for the pages whose title is not exactly the
        # game's name. One search at a time, with a pause between them.
        for index, (identifier, slug, english) in enumerate(games, 1):
            title = english or identifier
            lang = 'en' if english else 'zh'
            found_title = search(lang, title)
            if found_title:
                data = summary(lang, found_title)
                record = record_for(data, lang, slug)
                if record:
                    # A record with a picture is better than one without, so
                    # the earlier one is kept unless this one brings a
                    # picture of its own.
                    if not (record.get('image') and found.get(slug, {}).get('image')):
                        found[slug] = record
            if index % 25 == 0:
                pictures = sum(1 for item in found.values() if item.get('image'))
                print(f'  {index}/{len(games)} searched, {pictures} with a picture',
                      flush=True)
                with open(args.out, 'w', encoding='utf-8') as handle:
                    json.dump(found, handle, ensure_ascii=False, indent=1)
            time.sleep(SEARCH_PAUSE)

    with open(args.out, 'w', encoding='utf-8') as handle:
        json.dump(found, handle, ensure_ascii=False, indent=1)
    pictures = sum(1 for item in found.values() if item.get('image'))
    print(f'games: {len(games)}   pages found: {len(found)}   with a picture: {pictures}')
    print('wrote', args.out)
    save_cache()


if __name__ == '__main__':
    main()
