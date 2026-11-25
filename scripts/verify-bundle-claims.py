#!/usr/bin/env python3
"""Check every "bundle" claim against the bundle it is a claim about.

A mapping agent may say that a game's English title is in its bundle and
name the file or the string it found it in. This script opens the bundle
and looks for the title itself — in the file names, and in the printable
strings of every text file in it. A claim that holds is verified; a claim
that does not is not, and the site says so.

Run:  python3 scripts/verify-bundle-claims.py
Out: /home/whereq/git/dos/verified-bundle-claims.json
"""

from __future__ import annotations

import argparse
import glob
import json
import os
import re
import unicodedata
import zipfile

GAMES = '/home/whereq/git/dos/games'
AGENT_RESULTS = '/tmp/name-results/result-*.json'
OUT = '/home/whereq/git/dos/verified-bundle-claims.json'

PRINTABLE = re.compile(rb'[\x20-\x7e]{4,}')
TEXT_SUFFIXES = ('.exe', '.com', '.bat', '.cmd', '.txt', '.doc', '.nfo', '.diz',
                 '.cfg', '.ini', '.me', '.sys', '.dat')
MAX_FILE = 8 * 1024 * 1024


def norm(text):
    text = unicodedata.normalize('NFKC', text).lower()
    return re.sub(r'[^a-z0-9一-鿿]+', '', text)


def bundle_blob(name):
    """Every file name and every printable string in the bundle, folded."""
    path = os.path.join(GAMES, name + '.zip')
    if not os.path.exists(path):
        return ''
    parts = []
    try:
        archive = zipfile.ZipFile(path)
    except zipfile.BadZipFile:
        return ''
    with archive:
        for member in archive.namelist():
            parts.append(member)
            if not member.lower().endswith(TEXT_SUFFIXES):
                continue
            try:
                info = archive.getinfo(member)
                if info.file_size > MAX_FILE:
                    continue
                data = archive.read(member)[: MAX_FILE]
            except Exception:  # noqa: BLE001
                continue
            for chunk in PRINTABLE.findall(data):
                parts.append(chunk.decode('ascii', 'ignore'))
    return norm(' '.join(parts))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--results', default=AGENT_RESULTS)
    parser.add_argument('--out', default=OUT)
    args = parser.parse_args()

    claims = {}
    for path in sorted(glob.glob(args.results)):
        for name, entry in json.load(open(path, encoding='utf-8')).items():
            if entry.get('source') == 'bundle' and entry.get('en'):
                claims[name] = entry['en']

    print(f'{len(claims)} bundle claims to check')
    verified = {}
    for index, (name, english) in enumerate(sorted(claims.items()), 1):
        blob = bundle_blob(name)
        if blob and norm(english) in blob:
            verified[name] = english
        if index % 50 == 0:
            print(f'  {index}/{len(claims)} checked, {len(verified)} verified', flush=True)

    print(f'verified: {len(verified)} of {len(claims)}')
    with open(args.out, 'w', encoding='utf-8') as handle:
        json.dump(verified, handle, ensure_ascii=False, indent=1)
    print('wrote', args.out)


if __name__ == '__main__':
    main()
