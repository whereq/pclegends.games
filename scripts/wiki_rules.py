#!/usr/bin/env python3
"""The rules that decide whether a Wikipedia article is about a given game.

Both the collector — which goes looking for articles — and the verifier —
which checks the ones it found — ask the same two questions:

* **Is the article about a game?**  The one-line description Wikipedia writes
  under the title settles most of them: "1992 video game" against "1986 single
  by Kenny Loggins".  Where the description says nothing — the Chinese
  Wikipedia writes one for few pages — the categories are read instead, because
  an article filed under `Category:1995年电子游戏` is about a game and one
  filed under `Category:1976年电影` is not.

* **Does the article carry the game's name?**  A game called *Might and Magic
  VIII* may be written *Might and Magic VIII: Day of the Destroyer*, so the
  names are compared on the words they share rather than on equality.  A game
  called *Ultimate Mortal Kombat 3* is not *Mortal Kombat 3*, though, and a
  game called *RS2* is not *RS-232*: the words have to line up.

The rules are here, on their own, because two scripts have to agree on them.
"""

from __future__ import annotations

import re
import unicodedata

try:
    from opencc import OpenCC
except ImportError:  # pragma: no cover - the venv carries OpenCC
    raise SystemExit('This script needs OpenCC for the Chinese names.\n'
                     'Run it with the venv python:\n'
                     '  ~/git/whereq-dosbox-claude/.venv/bin/python scripts/wiki-rules.py')

TO_SIMPLIFIED = OpenCC('t2s')

# The Roman numerals a title may carry, and the digits they are.  Longest
# first, so that "viii" is not read as "vi" plus "ii".
ROMAN = {'xii': '12', 'xi': '11', 'ix': '9', 'viii': '8', 'vii': '7',
         'vi': '6', 'iv': '4', 'iii': '3', 'ii': '2', 'x': '10', 'v': '5'}

# The Chinese numerals a title may carry, and the digits they are.  Longest
# first, so that "十二" is not read as "十" plus "二".
CHINESE_NUMERAL = {'十二': '12', '十一': '11', '十': '10', '九': '9', '八': '8',
                   '七': '7', '六': '6', '五': '5', '四': '4', '三': '3',
                   '二': '2', '一': '1'}

# The description that says the article is about a game.
GAME_DESCRIPTION = {
    'en': ('video game', 'computer game', 'arcade game'),
    'zh': ('电子游戏', '电脑游戏', '電腦遊戲', '角色扮演游戏', '回合制策略游戏'),
}

# The categories that file an article under the games.
GAME_CATEGORIES = {
    'en': ('video game', 'computer game', 'arcade game'),
    'zh': ('电子游戏', '电脑游戏', '電腦遊戲', 'dos游戏', 'dos遊戲'),
}


def normalise(text: str) -> str:
    """The name, in one script and one case."""
    text = unicodedata.normalize('NFKC', text or '').lower()
    text = TO_SIMPLIFIED.convert(text)
    text = re.sub(r'\bthe\b', ' ', text)
    # A trailing qualifier — "(video game)", "(song)" — says what the article
    # is, not which game it is about.
    text = re.sub(r'\s*\([^)]*\)\s*$', ' ', text)
    for numeral in ('viii', 'vii', 'xii', 'xi', 'ix', 'iv', 'vi', 'iii', 'ii', 'x', 'v'):
        text = re.sub(rf'(?<![a-z0-9]){numeral}(?![a-z0-9])', ROMAN[numeral], text)
    # A Chinese numeral is a number only where it stands alone: "三国志三" is
    # the third, "三國志" is not a number at all.
    text = re.sub(r'(?:十二|十一|十|九|八|七|六|五|四|三|二|一)(?![一-鿿])',
                  lambda match: CHINESE_NUMERAL[match.group(0)], text)
    return text


def fold(text: str) -> str:
    """The name with the spaces taken out — for comparing two names."""
    return re.sub(r'[^a-z0-9一-鿿]+', '', normalise(text))


def words(text: str):
    """The name's words, in order: Latin runs and Chinese runs."""
    return re.findall(r'[a-z0-9]+|[一-鿿]+', normalise(text))


def digits(text: str):
    """The numbers the name carries."""
    return set(re.findall(r'\d', normalise(text)))


def year_of(text: str):
    """The year a piece of text names, or None."""
    match = re.search(r'(19[89]\d|20[0-2]\d)', text or '')
    return int(match.group(1)) if match else None


def year_fits(article_year: int, archive_year: int) -> bool:
    """Is the year the article names the year of this game?

    The year the bundle's files are dated is the year the Chinese release
    was pressed, which is a little after the game itself came out — a game
    of 1991 was often pressed here in 1995. So the article's year may be
    earlier than the bundle's, but not much earlier: the comic of 1963
    that shares the name of a game of 1993 is not that game.
    """
    return archive_year - 9 <= article_year <= archive_year + 2


def name_matches(query: str, title: str) -> bool:
    """Does the article's title carry the name of the game?

    The two names relate in one of several ways, and each of them is a way
    of writing the same game:

    * they are the same name — *Zone 66*;
    * one is the start of the other — *Might and Magic VIII* is written
      *Might and Magic VIII: Day of the Destroyer*;
    * they are the same name spelled apart — *Sim City* and *SimCity*;
    * one carries the other and a word that does not change the game —
      *FIFA International Soccer 96* is written *FIFA Soccer 96*;
    * the Chinese article names the series the game belongs to —
      *剑侠情缘系列* is the series *剑侠情缘* belongs to.

    And there are the names that must not be taken for one another:

    * *Ultimate Mortal Kombat 3* is not *Mortal Kombat 3* — the game is
      named after more than the word they share, and the word that is
      missing comes first;
    * *RS2* is not *RS-232*, and *Might and Magic VII* is not *Might and
      Magic V* — the numbers have to agree.
    """
    left, right = fold(query), fold(title)
    if not left or not right:
        return False
    if left == right:
        return True
    if digits(query) != digits(title):
        return False

    # A Chinese title often names the series the game belongs to, so the
    # series words are taken off the end before the names are compared.
    for suffix in ('系列电子游戏', '电子游戏系列', '系列'):
        marker = fold(suffix)
        if right.endswith(marker):
            trimmed = right[:-len(marker)]
            if len(trimmed) >= 4 and (left.startswith(trimmed) or trimmed.startswith(left)):
                return True

    left_words, right_words = words(query), words(title)
    if not left_words or not right_words:
        return False

    # One name starts the other: "might and magic 8" and "might and magic 8
    # day of the destroyer".
    if len(right_words) < len(left_words) and left_words[:len(right_words)] == right_words:
        return True
    if len(left_words) < len(right_words) and right_words[:len(left_words)] == left_words:
        return True

    # The same name spelled apart: "sim city" and "simcity".
    if ''.join(left_words) == ''.join(right_words):
        return True

    # One name carries the other and the extra word is not the one that
    # tells the two games apart.  "fifa international soccer 96" and "fifa
    # soccer 96" are the same game; "ultimate mortal kombat 3" and "mortal
    # kombat 3" are not, because the word that is missing comes first.
    left_set, right_set = set(left_words), set(right_words)
    if right_set <= left_set and left_words[0] in right_set:
        return True
    if left_set <= right_set and right_words[0] in left_set:
        return True

    # One name is the start of the other, written as one long word:
    # "tenchimuyoryoohki" and "tenchimuyo".
    shorter, longer = (left, right) if len(left) <= len(right) else (right, left)
    if len(shorter) >= 4 and longer.startswith(shorter) and len(shorter) >= len(longer) * 0.55:
        return True
    return False


def is_game_description(lang: str, description: str):
    """Does the description say the article is about a game?

    True, False — or None, when the Wikipedia writes no description at all,
    which is the case for most of the Chinese articles.  None is not an
    answer: the categories have to be read then.
    """
    text = (description or '').strip()
    if not text:
        return None
    folded = fold(text)
    for word in GAME_DESCRIPTION.get(lang, ()):
        if fold(word) in folded:
            return True
    return False


def is_game_category(lang: str, name: str) -> bool:
    """Does a category file the article under the games?"""
    folded = fold(name)
    for word in GAME_CATEGORIES.get(lang, ()):
        if fold(word) in folded:
            return True
    return False
