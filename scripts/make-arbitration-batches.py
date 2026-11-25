#!/usr/bin/env python3
"""Make the batches that check the index names against the bundles.

Two indexes publish an English name for the archive's games: the archive's
own index (`dos.lol`) and the CN DOS Games Wiki. For a Western game their
names are right. For a game made in China or Taiwan they are often not a
release title at all — the Chinese name in Latin letters ("Jin Yong Qun Xia
Zhuan"), or the Chinese name translated word for word ("Heavenly Sword
Dragon Slaying Sabe").

This script writes out the games whose name came from an index, with what
the bundle says about itself, so that each of them can be checked.

Run:  python3 scripts/make-arbitration-batches.py
Out: /tmp/arbitration/batch-NN.json
"""

from __future__ import annotations

import argparse
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TABLE = os.path.join(ROOT, 'data', 'english-names.json')
EVIDENCE = '/home/whereq/git/dos/title-evidence.json'
OUT = '/tmp/arbitration'

BATCH = 60


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--table', default=TABLE)
    parser.add_argument('--out', default=OUT)
    args = parser.parse_args()

    table = json.load(open(args.table, encoding='utf-8'))
    evidence = {record['zh']: record
                for record in json.load(open(EVIDENCE, encoding='utf-8'))}

    rows = []
    for name, entry in sorted(table.items()):
        if entry['source'] not in ('published', 'wiki'):
            continue
        record = evidence.get(name, {})
        rows.append({
            'zh': name,
            'current': entry['en'],
            'current_source': entry['source'],
            'files': record.get('files', [])[:40],
            'strings': record.get('strings', [])[:30],
        })

    os.makedirs(args.out, exist_ok=True)
    batches = [rows[i:i + BATCH] for i in range(0, len(rows), BATCH)]
    for index, batch in enumerate(batches, 1):
        path = os.path.join(args.out, f'batch-{index:02d}.json')
        with open(path, 'w', encoding='utf-8') as handle:
            json.dump(batch, handle, ensure_ascii=False, indent=1)

    print(f'{len(rows)} index names in {len(batches)} batches in {args.out}')


if __name__ == '__main__':
    main()
