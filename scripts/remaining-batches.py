#!/usr/bin/env python3
"""Make the work-remaining files: the records no result file covers yet.

A batch that was interrupted keeps the records it had already written, so the
next attempt should only carry the ones that are missing.

Run:  python3 scripts/remaining-batches.py
Out: /tmp/name-batches3/rest-NN.json
"""

from __future__ import annotations

import argparse
import glob
import json
import os

BATCHES = '/tmp/name-batches3/batch-*.json'
RESULTS = '/tmp/name-results/result-b*.json'


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--batches', default=BATCHES)
    parser.add_argument('--results', default=RESULTS)
    args = parser.parse_args()

    mapped = {}
    for path in sorted(glob.glob(args.results)):
        try:
            results = json.load(open(path, encoding='utf-8'))
        except (json.JSONDecodeError, OSError):
            continue
        for name, entry in results.items():
            if entry.get('en'):
                mapped[name] = True

    total = 0
    for path in sorted(glob.glob(args.batches)):
        rows = json.load(open(path, encoding='utf-8'))
        rest = [row for row in rows if row['zh'] not in mapped]
        number = os.path.basename(path).split('-')[1].split('.')[0]
        out = f'/tmp/name-batches3/rest-{number}.json'
        with open(out, 'w', encoding='utf-8') as handle:
            json.dump(rest, handle, ensure_ascii=False, indent=1)
        total += len(rest)
        if rest:
            print(f'batch-{number}: {len(rest)} of {len(rows)} left')
    print(f'{total} records left to map')


if __name__ == '__main__':
    main()
