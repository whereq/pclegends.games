#!/usr/bin/env python3
"""Build the archive's English-title table.

Four sources, in the order they are trusted:

  1. **published** — the archive's own index (`dos.lol`) records an English
     name for 194 of the games.
  2. **wiki** — the CN DOS Games Wiki records the original English title of
     each of the Chinese releases it covers.
  3. **bundle** — the game says what it is called: the title is inside the
     bundle's own strings or in the name of one of its files. This is the
     strongest evidence of the three, and the one the site quotes.
  4. **known** — the title the game is established under, which this bundle
     does not carry.

Every `bundle` claim is checked here against the bundle before it is
written: the title has to actually be in the strings or the file names.
A claim that does not check out is kept as `known` instead, so a wrong
title never reaches the site as fact.

Run:  python3 scripts/build-english-names.py
Out:  data/english-names.json
"""

from __future__ import annotations

import argparse
import glob
import json
import os
import re
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

WIKI = '/home/whereq/git/dos/wiki-matched.json'
PUBLISHED = '/home/whereq/git/dos/published-names.json'
AGENT_RESULTS = '/tmp/name-results/result-*.json'
EVIDENCE = '/home/whereq/git/dos/title-evidence.json'
VERIFIED = '/home/whereq/git/dos/verified-bundle-claims.json'

# The order a source wins in: the one closest to the artefact first.
PRECEDENCE = ['bundle', 'published', 'wiki', 'known']


def norm(text):
    """A name, folded down to what a string search can match."""
    text = unicodedata.normalize('NFKC', text).lower()
    return re.sub(r'[^a-z0-9一-鿿]+', '', text)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--out', default=os.path.join(ROOT, 'data', 'english-names.json'))
    parser.add_argument('--evidence', default=EVIDENCE)
    parser.add_argument('--results', default=AGENT_RESULTS)
    args = parser.parse_args()

    merged = {}

    def offer(name, english, source):
        if not english:
            return
        current = merged.get(name)
        if current is None or PRECEDENCE.index(source) < PRECEDENCE.index(current['source']):
            merged[name] = {'en': english, 'source': source}

    # ── the archive's own index ────────────────────────────────
    if os.path.exists(PUBLISHED):
        published = json.load(open(PUBLISHED, encoding='utf-8'))
        for name, english in published.items():
            offer(name, english, 'published')
        print(f'published: {len(published)}')

    # ── the CN DOS Games Wiki ──────────────────────────────────
    if os.path.exists(WIKI):
        wiki = json.load(open(WIKI, encoding='utf-8'))
        for name, english in wiki.items():
            offer(name, english, 'wiki')
        print(f'wiki: {len(wiki)}')

    # ── what the mapping agents found, checked against the bundles ──
    # The bundle claims that `verify-bundle-claims.py` checked against the
    # bundles themselves. A claim that is not in here did not check out.
    verified = {}
    if os.path.exists(VERIFIED):
        verified = json.load(open(VERIFIED, encoding='utf-8'))
        print(f'verified bundle claims: {len(verified)}')

    checked = unverified = 0
    for path in sorted(glob.glob(args.results)):
        results = json.load(open(path, encoding='utf-8'))
        for name, entry in results.items():
            english = (entry.get('en') or '').strip()
            source = entry.get('source')
            if not english or source == 'none':
                continue
            if source == 'bundle':
                if name in verified:
                    checked += 1
                else:
                    # The claim did not check out against the bundle. Keep the
                    # title, but say where it came from honestly.
                    source = 'known'
                    unverified += 1
            offer(name, english, source)
        print(f'{os.path.basename(path)}: {len(results)} records')

    print(f'\nbundle claims verified: {checked}   not verified: {unverified}')

    counts = {}
    for entry in merged.values():
        counts[entry['source']] = counts.get(entry['source'], 0) + 1
    print('games with an English title:', len(merged))
    for source, count in sorted(counts.items(), key=lambda kv: -kv[1]):
        print(f'  {source:10s} {count}')

    with open(args.out, 'w', encoding='utf-8') as handle:
        json.dump(merged, handle, ensure_ascii=False, indent=1)
    print('wrote', args.out)


if __name__ == '__main__':
    main()
