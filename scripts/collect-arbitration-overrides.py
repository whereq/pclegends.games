#!/usr/bin/env python3
"""Collect what the arbitration found into the override file.

The arbitration checked the names the indexes publish against the bundles.
Its answer is either "keep it", "the bundle says this other title", "the
real title is this one", or "this game has no English title". Only the
answers that change something are written out, and the builder reads them
last, so a checked title beats an index's.

Run:  python3 scripts/collect-arbitration-overrides.py
Out: /tmp/name-overrides.json
"""

from __future__ import annotations

import argparse
import glob
import json
import os

RESULTS = '/tmp/name-results/arbitration-*.json'
OUT = '/tmp/name-overrides.json'


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--results', default=RESULTS)
    parser.add_argument('--out', default=OUT)
    args = parser.parse_args()

    overrides = {}
    kept = dropped = 0
    for path in sorted(glob.glob(args.results)):
        results = json.load(open(path, encoding='utf-8'))
        for name, entry in results.items():
            source = entry.get('source')
            english = (entry.get('en') or '').strip()
            if source == 'keep':
                kept += 1
                continue
            if source == 'none' or not english:
                overrides[name] = {'en': None, 'source': 'none',
                                   'evidence': entry.get('evidence', '')}
                dropped += 1
                continue
            overrides[name] = {'en': english,
                               'source': 'bundle' if source == 'bundle' else 'known',
                               'evidence': entry.get('evidence', '')}
        print(f'{os.path.basename(path)}: {len(results)} records')

    with open(args.out, 'w', encoding='utf-8') as handle:
        json.dump(overrides, handle, ensure_ascii=False, indent=1)
    print(f'kept as they were: {kept}   changed or dropped: {dropped}')
    print('wrote', args.out)


if __name__ == '__main__':
    main()
