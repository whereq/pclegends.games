#!/usr/bin/env python3
"""Collect the English titles the chiuinan catalogue publishes.

The catalogue lists the Chinese DOS games of the era in traditional Chinese,
and next to each entry it prints the game's English title — the name the
release carried in the West. This script pulls those pages down, reads every
row, and writes out each (Chinese title, English title) pair it found.

A row can name several Chinese titles and several English ones, separated by
a slash; they are paired up in order, so "惡魔獵人1／鬼泣1" with "Devil May
Cry 1" gives two pairs, not four.

Run:  python3 scripts/collect-catalogue-names.py
Out: /home/whereq/git/dos/catalogue-names.json
"""

from __future__ import annotations

import argparse
import json
import os
import re
import urllib.request

from opencc import OpenCC

BASE = ('https://raw.githubusercontent.com/chiuinan/chiuinan.github.io/master/'
        'game/game/')
PAGES = ['cgame11', 'cgame12', 'cgame21', 'cgame22', 'cgame31', 'cgame32',
         'cgame33', 'cgame41', 'cgame42', 'cgame43', 'cgame44', 'cgame51',
         'cgame52']
CACHE = '/home/whereq/git/dos/catalogue-cache'
OUT = '/home/whereq/git/dos/catalogue-names.json'

ANCHOR = re.compile(r'<a\b[^>]*href="([^"]+)"[^>]*>(.*?)</a>', re.S | re.I)
TAG = re.compile(r'<[^>]+>')
SPLIT = re.compile(r'[／/]')


def fetch(page: str) -> str:
    os.makedirs(CACHE, exist_ok=True)
    path = os.path.join(CACHE, page + '.htm')
    if not os.path.exists(path):
        urllib.request.urlretrieve(BASE + page + '.htm', path)
    with open(path, encoding='utf-8-sig') as handle:
        return handle.read()


def clean(text: str) -> str:
    text = TAG.sub('', text).replace('[待重整]', '').replace('[待整理]', '')
    return text.replace('[待補]', '').strip()


def parts(cell: str) -> list[str]:
    """The titles in one cell, split on the slashes the catalogue uses."""
    out = []
    for piece in SPLIT.split(cell):
        piece = clean(piece).strip()
        if piece and piece not in out:
            out.append(piece)
    return out


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--out', default=OUT)
    args = parser.parse_args()

    converter = OpenCC('t2s')
    pairs = []
    seen = set()

    for page in PAGES:
        html = fetch(page)
        for chunk in html.split('<tr')[1:]:
            match = ANCHOR.search(chunk)
            if not match:
                continue
            label = match.group(2)
            cells = [clean(p) for p in re.split(r'<br\s*/?>', label)]
            cells = [p for p in cells if p]
            if len(cells) < 2:
                continue
            chinese = parts(cells[0])
            english = parts(cells[1])
            if not chinese or not english:
                continue
            for index, name in enumerate(chinese):
                title = english[index] if index < len(english) else english[0]
                simplified = converter.convert(name).strip()
                if not simplified or not title:
                    continue
                key = (simplified, title)
                if key in seen:
                    continue
                seen.add(key)
                pairs.append({'zh': simplified, 'en': title, 'page': page,
                              'href': match.group(1)})

    print(f'rows: {len(pairs)} pairs')
    with open(args.out, 'w', encoding='utf-8') as handle:
        json.dump(pairs, handle, ensure_ascii=False, indent=1)
    print('wrote', args.out)


if __name__ == '__main__':
    main()
