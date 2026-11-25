#!/usr/bin/env python3
"""Tell a real English title from the Chinese one written in Latin letters.

Several indexes print a Chinese game's title the way it is written in
Chinese, in Latin letters: 金庸群侠传 comes out as "Jin Yong Qun Xia Zhuan".
That is not the title the game was released under, and the site should not
offer it as one.

This script compares a candidate title with the pinyin of the Chinese title
it belongs to. If the two share a word of four letters or more, the
candidate is the Chinese title in Latin letters — a romanisation — and not
an English release title.

Run:  python3 scripts/find-romanised.py
Out: /tmp/romanised.json
"""

from __future__ import annotations

import argparse
import json
import os
import re

from pypinyin import Style, lazy_pinyin

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TABLE = os.path.join(ROOT, 'data', 'english-names.json')
EVIDENCE = '/home/whereq/git/dos/title-evidence.json'

WORD = re.compile(r"[A-Za-z']+")
CJK = re.compile(r'[一-鿿]')


def pinyin_words(chinese: str) -> set[str]:
    """The syllables of a Chinese title, as separate words."""
    words = set()
    for piece in lazy_pinyin(chinese, style=Style.NORMAL):
        words.update(part for part in re.split(r'[\s\-_]+', piece) if part)
    return {w.lower() for w in words if len(w) >= 3}


def is_romanised(chinese: str, title: str) -> bool:
    """Is this title the Chinese name written in Latin letters?

    Every word of it has to come from the pinyin of the Chinese title. One
    ordinary English word in the middle is enough to make it a real title:
    "Xuan-Yuan Sword" is the release title, "Jin Yong Qun Xia Zhuan" is the
    Chinese name in Latin letters.
    """
    if not CJK.search(chinese):
        return False          # the Chinese name is already in Latin letters
    syllables = pinyin_words(chinese)
    if not syllables:
        return False
    words = [w.lower() for w in WORD.findall(title) if len(w) >= 2]
    if not words:
        return False
    return all(word in syllables for word in words)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--table', default=TABLE)
    parser.add_argument('--out', default='/tmp/romanised.json')
    args = parser.parse_args()

    table = json.load(open(args.table, encoding='utf-8'))
    flagged = {}
    for name, entry in table.items():
        if is_romanised(name, entry['en']):
            flagged[name] = entry

    print(f'titles: {len(table)}   romanised: {len(flagged)}')
    for name, entry in list(flagged.items())[:20]:
        print(f'  {name} -> {entry["en"]} ({entry["source"]})')

    with open(args.out, 'w', encoding='utf-8') as handle:
        json.dump(flagged, handle, ensure_ascii=False, indent=1)
    print('wrote', args.out)


if __name__ == '__main__':
    main()
