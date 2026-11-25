#!/usr/bin/env python3
"""Collect the English-title evidence that every bundle carries about itself.

A Chinese-localised DOS game keeps the original Western title inside the
bundle more often than not: in the executable's strings, in the name of a
data file, in the text of a readme. This script reads every bundle once and
writes out what it found, so that the mapping from the Chinese title to the
English one can be made against evidence rather than from memory.

Out: a JSON file, one record per game:
    {"zh": "红色警戒", "files": [...], "strings": [...]}

Run:  python3 scripts/collect-title-evidence.py
"""

from __future__ import annotations

import argparse
import collections
import json
import os
import re
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
GAMES = '/home/whereq/git/dos/games'
META = '/home/whereq/git/whereq-dosbox-claude/data/dos-games-metadata.json'

PRINTABLE = re.compile(rb"[\x20-\x7e]{4,}")

# A string that could be a title: letters, digits and the punctuation titles
# actually use, in one to five words.
WORD = re.compile(r"^[A-Za-z][A-Za-z0-9'&:,\.\-/ ]*$")

# The runtime's own words. They turn up in every bundle and are never a title.
RUNTIME = re.compile(
    r"(?i)\b(dos|dos/16m|error|memory|press|install|setup|uninstall|please|continue|"
    r"copyright|version|program|path|driver|system|disk|floppy|cannot|invalid|abort|"
    r"failed|warning|directory|folder|keyboard|mouse|joystick|config|option|select|"
    r"sound|music|volume|speed|parameter|argument|watcom|borland|microsoft|registered|"
    r"registration|shareware|evaluation|demo|order|mail|product|support|windows|"
    r"interrupt|general protection|page fault|stack|heap|buffer|file|read|write|load|"
    r"save|savegame|key|enter|space|escape|esc|any key|ready|running|loading|"
    r"free memory|not enough|size|address|segment|offset|handle|code|data|"
    r"graphics|display|palette|vga|ega|svga|mono|color|colours|colors|"
    r"buttons|axes|joy|strings|cannot open|not found|no such|"
    r"unknown|illegal|overflow|underflow|division|"
    r"this program|cannot be run|in dos mode|ms-dos|msdos|"
    r"supported|unsupported|failed to|unable|try again|goodbye|"
    r"all rights|registered to|this game|the game|"
    r"debug|trace|verbose|quiet|force|default|user|name|number|index|level|"
    r"new|old|yes|no|true|false|null|none|any|some|one|two|"
    r"back|next|prev|quit|exit|help|info|about|credits|options|"
    r"rom|cartridge|attract|intro|high score|hiscore|"
    r"demo|install|copying|installing|success|unsuccessful|again|hit space)\b")


def read_metadata():
    if not os.path.exists(META):
        return {}
    return {r['identifier']: r for r in json.load(open(META, encoding='utf-8'))}


def candidate_strings(data):
    """The printable strings in one file that could be a title."""
    out = collections.Counter()
    for raw in PRINTABLE.findall(data):
        text = raw.decode('ascii', 'ignore').strip()
        if not WORD.match(text):
            continue
        if not 4 <= len(text) <= 40:
            continue
        words = text.split()
        if len(words) > 5:
            continue
        if len(words) == 1 and len(text) < 5:
            continue
        letters = [c for c in text if c.isalpha()]
        if len(letters) < 3:
            continue
        # a title has vowels
        if not re.search(r'[AEIOUaeiou]', text):
            continue
        if RUNTIME.search(text):
            continue
        if sum(1 for c in letters if c.isupper()) / len(letters) < 0.7:
            continue
        out[text] += 1
    return out


def evidence_for(name, meta):
    path = os.path.join(GAMES, name + '.zip')
    record = {'zh': name, 'files': [], 'strings': []}
    if not os.path.exists(path):
        return record
    try:
        archive = zipfile.ZipFile(path)
    except zipfile.BadZipFile:
        return record
    with archive:
        names = archive.namelist()
        entry = meta.get(name, {}).get('entryExecutable')
        order = []
        if entry and entry in names:
            order.append(entry)
        order += [n for n in names if n != entry and n.lower().endswith(('.exe', '.com'))]
        order += [n for n in names
                  if n != entry and n.lower().endswith(('.bat', '.txt', '.doc', '.nfo', '.diz', '.cfg'))]
        seen = set()
        hits = collections.Counter()
        where = collections.defaultdict(set)
        for member in order[:14]:
            if member in seen:
                continue
            seen.add(member)
            try:
                info = archive.getinfo(member)
                if info.file_size > 4 * 1024 * 1024:
                    continue
                data = archive.read(member)[: 2 * 1024 * 1024]
            except Exception:  # noqa: BLE001
                continue
            for text, count in candidate_strings(data).items():
                hits[text] += count
                where[text].add(member)
        record['files'] = sorted({n.split('/')[-1] for n in names})[:60]
        ranked = sorted(hits.items(), key=lambda kv: (-len(where[kv[0]]), -kv[1], kv[0]))
        record['strings'] = [t for t, _ in ranked[:40]]
    return record


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--out', default='/home/whereq/git/dos/title-evidence.json')
    args = parser.parse_args()
    meta = read_metadata()
    games = sorted(os.path.splitext(f)[0] for f in os.listdir(GAMES) if f.endswith('.zip'))
    out = []
    for index, name in enumerate(games, 1):
        out.append(evidence_for(name, meta))
        if index % 100 == 0:
            print(f'{index}/{len(games)}', flush=True)
    path = os.path.abspath(args.out)
    with open(path, 'w', encoding='utf-8') as handle:
        json.dump(out, handle, ensure_ascii=False, indent=1)
    print(f'wrote {len(out)} records to {path}')


if __name__ == '__main__':
    main()
