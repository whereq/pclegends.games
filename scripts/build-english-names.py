#!/usr/bin/env python3
"""Build the archive's English-title table.

Every game in the archive is filed under a Chinese title. The site shows the
title the game was actually released under in English, and says where that
name comes from. Four kinds of name are trusted, in this order:

  1. **bundle** — the bundle says what it is called: the English title is in
     the game's own strings or in the name of one of its files. This is the
     strongest evidence and the one the site quotes.
  2. **published** — the archive's own index (`dos.lol`) records an English
     name for the game.
  3. **wiki** — the CN DOS Games Wiki records the original English title of
     each of the Chinese releases it covers.
  4. **known** — the title the game is established under, which this bundle
     does not carry and no index publishes.

A name that only a loose catalogue match offers is not taken on trust: it is
read out of the bundle first, and only published if the bundle carries it.

Run:  python3 scripts/build-english-names.py
Out:  data/english-names.json
"""

from __future__ import annotations

import argparse
import glob
import importlib.util
import json
import os
import re
import sys
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)

from opencc import OpenCC

_spec = importlib.util.spec_from_file_location(
    'verify_bundle_claims', os.path.join(HERE, 'verify-bundle-claims.py'))
_verify = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_verify)

_rom_spec = importlib.util.spec_from_file_location(
    'find_romanised', os.path.join(HERE, 'find-romanised.py'))
_romanised = importlib.util.module_from_spec(_rom_spec)
_rom_spec.loader.exec_module(_romanised)

PUBLISHED = '/home/whereq/git/dos/published-names.json'
WIKI = '/home/whereq/git/dos/wiki-english-names.json'
CATALOGUE = '/home/whereq/git/dos/catalogue-names.json'
AGENT_RESULTS = '/tmp/name-results/result-*.json'
OVERRIDES = '/tmp/name-overrides.json'
EVIDENCE = '/home/whereq/git/dos/title-evidence.json'

# The order a source wins in: the one closest to the artefact first. A title
# that is only the Chinese name in Latin letters comes last of all — it is
# not an English title, and the site does not offer it as one.
PRECEDENCE = ['bundle', 'published', 'wiki', 'known', 'romanised']

# The words a Chinese title carries to say which edition of a game it is.
MARKERS = ['威力加强版', '加强版', '完美版', '豪华版', '繁体版', '简体版', '中文版',
           '英文版', '民间改版', '民间版', '移植版', '资料片', '合集', '完全版',
           '加强型', '豪华型', '资料篇', '外传', '前传', '试玩版', 'demo',
           'DOS', 'PC', '简体中文版', '繁体中文版']

_converter = OpenCC('t2s')


def fold(text: str) -> str:
    """A name, folded down to what a string search can match."""
    text = unicodedata.normalize('NFKC', text).lower()
    text = re.sub(r'[（(]\s*(19|20)\d{2}\s*[)）]', '', text)
    text = re.sub(r'[^a-z0-9一-鿿]+', '', text)
    return text


def key(text: str) -> str:
    """A Chinese title, folded and brought into simplified characters."""
    return fold(_converter.convert(text))


def bare(text: str) -> str:
    """A Chinese title with its edition markers taken off."""
    out = key(text)
    changed = True
    while changed:
        changed = False
        for marker in MARKERS:
            if marker in out:
                out = out.replace(marker, '')
                changed = True
    return out


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--out', default=os.path.join(ROOT, 'data', 'english-names.json'))
    parser.add_argument('--results', default=AGENT_RESULTS)
    parser.add_argument('--report', default='/tmp/name-conflicts.json')
    args = parser.parse_args()

    archive = [record['zh'] for record in
               json.load(open(EVIDENCE, encoding='utf-8'))]

    exact_index, bare_index = {}, {}
    for name in archive:
        exact_index.setdefault(key(name), name)
        bare_index.setdefault(bare(name), name)

    folded = [(name, key(name)) for name in archive]

    def containment(name):
        """The archive title this name is a longer form of.

        The wiki writes "三国志-武将争霸" for the game the archive files
        under 武将争霸, and "吞食天地4 楚汉光辉" for 吞食天地4. The archive title
        is the one the longer name carries, at its start or at its end, and
        it has to be three characters or more — 中国 is part of 中国武将列传
        and is not that game.
        """
        probe = bare(name)
        if len(probe) < 3:
            return None

        for other, text in folded:
            if len(text) < 3 or text == probe:
                continue
            if text.startswith(probe) and len(text) - len(probe) <= 8:
                return other
            if probe.startswith(text) and len(probe) - len(text) <= 8:
                return other
        return None

    candidates = []   # (archive name, english, trust, provenance)

    def add(name, english, trust, provenance, source_zh=None):
        if not english:
            return
        candidates.append({'name': name, 'en': english.strip(),
                           'trust': trust, 'from': provenance,
                           'source_zh': source_zh})

    # ── the archive's own index ────────────────────────────────
    if os.path.exists(PUBLISHED):
        published = json.load(open(PUBLISHED, encoding='utf-8'))
        for name, english in published.items():
            add(name, english, 'published', 'published')
        print(f'published: {len(published)}')

    # ── the CN DOS Games Wiki ──────────────────────────────────
    if os.path.exists(WIKI):
        wiki = json.load(open(WIKI, encoding='utf-8'))
        for name, english in wiki.items():
            name = name.split(' (')[0].strip()
            hit = exact_index.get(key(name))
            if hit:
                add(hit, english, 'wiki', 'wiki', name)
            else:
                # The wiki writes the title with a prefix or a suffix — "三国志-
                # 武将争霸" for the game the archive files under 武将争霸. That
                # guess is only good enough if the bundle says so.
                loose = containment(name)
                if loose:
                    add(loose, english, 'wiki', 'wiki', name)
        print(f'wiki: {len(wiki)}')

    # ── the chiuinan catalogue: a candidate, not a source ──────
    if os.path.exists(CATALOGUE):
        catalogue = json.load(open(CATALOGUE, encoding='utf-8'))
        for row in catalogue:
            hit = exact_index.get(key(row['zh']))
            if hit:
                add(hit, row['en'], 'catalogue', 'catalogue', row['zh'])
            else:
                loose = containment(row['zh'])
                if loose:
                    add(loose, row['en'], 'loose', 'catalogue', row['zh'])
        print(f'catalogue: {len(catalogue)} rows')

    # ── what the mapping agents found ─────────────────────────
    agent_files = sorted(glob.glob(args.results))
    for path in agent_files:
        try:
            results = json.load(open(path, encoding='utf-8'))
        except (json.JSONDecodeError, OSError):
            # A batch that is still being written; take what is readable later.
            print(f'{os.path.basename(path)}: not readable yet, skipped')
            continue
        for name, entry in results.items():
            english = (entry.get('en') or '').strip()
            source = entry.get('source')
            if not english or source == 'none':
                continue
            add(name, english, source, os.path.basename(path))
        print(f'{os.path.basename(path)}: {len(results)} records')

    # ── check every claim against the bundle it is a claim about ─
    merged = {}
    conflicts = []
    bundles = {}
    checked = 0

    def bundle_says(name):
        if name not in bundles:
            bundles[name] = _verify.bundle_strings(name)
        return bundles[name]

    for candidate in candidates:
        name = candidate['name']
        english = candidate['en']
        trust = candidate['trust']

        if trust == 'bundle':
            # An agent said the title is in the bundle. Look for it there.
            checked += 1
            if not _verify.says_title(bundle_says(name), english):
                trust = 'known'          # keep the name, drop the claim
        elif trust in ('catalogue', 'loose'):
            # Neither of these is a source on its own: the bundle has to say it.
            checked += 1
            if _verify.says_title(bundle_says(name), english):
                trust = 'bundle'
            else:
                continue

        if trust in ('published', 'wiki', 'known') and \
                _romanised.is_romanised(name, english,
                                       candidate.get('source_zh') or ''):
            # The Chinese name in Latin letters, not an English release title.
            trust = 'romanised'

        current = merged.get(name)
        if current is None:
            merged[name] = {'en': english, 'source': trust}
        else:
            if current['en'] != english:
                conflicts.append({'name': name, 'kept': current,
                                  'dropped': {'en': english, 'source': trust}})
            if PRECEDENCE.index(trust) < PRECEDENCE.index(current['source']):
                merged[name] = {'en': english, 'source': trust}

    # A game whose only name is the Chinese one in Latin letters has no
    # English title to show. It keeps its place in the catalogue without one.
    romanised_only = [name for name, entry in merged.items()
                      if entry['source'] == 'romanised']
    for name in romanised_only:
        del merged[name]

    # ── what the arbitration found ─────────────────────────────
    # The indexes publish machine output for some of the Chinese games: the
    # Chinese name in Latin letters, or the Chinese name translated word for
    # word. A checked game can carry a different title, or none at all.
    if os.path.exists(OVERRIDES):
        overrides = json.load(open(OVERRIDES, encoding='utf-8'))
        for name, entry in overrides.items():
            english = (entry.get('en') or '').strip()
            if not english:
                merged.pop(name, None)
                continue
            source = entry.get('source') or 'known'
            if source == 'bundle':
                checked += 1
                if not _verify.says_title(bundle_says(name), english):
                    source = 'known'
            merged[name] = {'en': english, 'source': source}
        print(f'overrides applied: {len(overrides)}')

    print(f'\nbundle checks: {checked}')

    counts = {}
    for entry in merged.values():
        counts[entry['source']] = counts.get(entry['source'], 0) + 1
    print('games with an English title:', len(merged))
    for source, count in sorted(counts.items(), key=lambda kv: -kv[1]):
        print(f'  {source:10s} {count}')

    missing = [name for name in archive if name not in merged]
    print(f'games still without a title: {len(missing)}')
    print(f'names dropped as romanised: {len(romanised_only)}')

    with open(args.out, 'w', encoding='utf-8') as handle:
        json.dump(merged, handle, ensure_ascii=False, indent=1)
    print('wrote', args.out)

    with open(args.report, 'w', encoding='utf-8') as handle:
        json.dump({'conflicts': conflicts, 'missing': missing}, handle,
                  ensure_ascii=False, indent=1)
    print('wrote', args.report)


if __name__ == '__main__':
    main()
