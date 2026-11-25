#!/usr/bin/env python3
"""Generate the DOS games catalogue: one page per game in the archive.

The archive in ~/git/dos/games holds 1 898 DOS games. Each one gets a page:
the facts read out of the bundle itself, the download, the setup the
bundle's own shape implies, and an honest note about what has and has not
been tested on the emulator.

The pages that *have* been tested are written by hand — they live in
src/data/games-played.ts and are skipped here.

Run:
    python3 scripts/generate-dos-games.py \
        --games ~/git/dos/games \
        --index ~/git/dos/games_index.csv \
        --metadata ~/git/whereq-dosbox-claude/data/dos-games-metadata.json

Writes:
    src/data/dos-games/<slug>.ts       the full page, one module per game
    src/data/dos-games-index.ts        the compact index the catalogue reads
    src/data/dos-games-stats.ts        the numbers the front page shows
    src/pages/dos-games/<slug>.tsx     one thin route per game
    static/img/dos-games/<slug>.svg    the mark on the card

The split matters: the index is what the catalogue page reads, so it has
to be small enough to sit in the site's shared bundle. The full text of a
game lives in its own module, which only its own route imports, so the
browser fetches one game's page at a time.
"""

import argparse
import csv
import json
import os
import re
import sys
import zipfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dos_game_slugs import initial_for, unique_slug  # noqa: E402
from dos_game_categories import LABELS as CATEGORY_LABELS  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# The bundles are served by the archive the pages came from. There is no
# mirror here: the download link on a game page is the original copy, so
# the file the reader gets is the file the page describes.

# Games whose pages are written by hand — see src/data/games-played.ts.
# The slug is the one their page already lives at.
MANUAL_SLUGS = {
    '三国志英杰传': 'sanguo-yingjie-zhuan',
    '真人快打': 'mortal-kombat',
    '沙丘魔堡': 'sha-qiu-mo-bao',
    '炎龙骑士团2黄金城之谜': 'yan-long-qi-shi-tuan-ii-huang-jin-cheng-zhi-mi',
    '三国志3': 'san-guo-zhi-iii',
}
MANUAL = set(MANUAL_SLUGS)

# The year each hand-written game was published, as its own page records it.
MANUAL_YEARS = {
    'sanguo-yingjie-zhuan': '1995',
    'mortal-kombat': '1993',
    'sha-qiu-mo-bao': '1992',
    'yan-long-qi-shi-tuan-ii-huang-jin-cheng-zhi-mi': '1995',
    'san-guo-zhi-iii': '1993',
}

# A card mark per initial, so the shelf is not a wall of one colour.
ACCENTS = {
    'a': '#C0392B', 'b': '#B9770E', 'c': '#7D6608', 'd': '#6E7B05',
    'e': '#2874A6', 'f': '#1F618D', 'g': '#117864', 'h': '#148F77',
    'i': '#1E8449', 'j': '#229954', 'k': '#7D3C98', 'l': '#8E44AD',
    'm': '#AF7AC5', 'n': '#D98880', 'o': '#E59866', 'p': '#F5B041',
    'q': '#F8C471', 'r': '#F1948A', 's': '#EC7063', 't': '#CD6155',
    'u': '#A04000', 'v': '#B03A2E', 'w': '#7F8C8D', 'x': '#909497',
    'y': '#626567', 'z': '#515A5A', '0': '#34495E',
}


def ts(value):
    """A TypeScript string literal."""
    return json.dumps(value, ensure_ascii=False)


def megabytes(size):
    if size >= 1024 * 1024:
        return f'{size / (1024 * 1024):.1f} MB'
    if size >= 1024:
        return f'{size / 1024:.0f} KB'
    return f'{size} bytes'


def human_files(count):
    return f'{count:,}' if count > 999 else str(count)


def first_character(name):
    """The first visible character of a name, for the card mark."""
    for char in name:
        if char.strip():
            return char
    return '#'


def plate_svg(name, slug, accent):
    """The mark for a catalogue card: the first character on a coloured plate."""
    letter = first_character(name)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="{name}">
  <title>{name}</title>
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="{accent}"/>
      <stop offset="1" stop-color="{accent}" stop-opacity="0.72"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" fill="url(#g)"/>
  <rect x="1" y="1" width="62" height="62" fill="none" stroke="#000" stroke-opacity="0.18" stroke-width="2"/>
  <text x="32" y="44" text-anchor="middle" font-family="'Noto Serif CJK TC','Noto Serif TC','Songti TC','PMingLiU',serif" font-size="38" font-weight="700" fill="#FFF8E7">{letter}</text>
</svg>
'''


def published_sentence(meta, lang):
    """What the bundle says about when the game was made."""
    files = meta.get('yearFiles')
    copy = meta.get('yearCopyright')
    if files and copy and files == copy:
        if lang == 'zh':
            return (f'游戏包内的文件日期是 {files}，而可执行文件里带有同样年份的版权声明'
                    f'——{meta.get("yearCopyrightFrom", "")}'.strip())
        return (f"The bundle's own files are dated {files}, and the executable carries "
                f'a matching copyright line — {meta.get("yearCopyrightFrom", "")}'.strip())
    if files:
        if copy and copy != files:
            if lang == 'zh':
                return (f'游戏包内的文件日期是 {files}，也正是这份拷贝构建的时间。可执行文件里'
                        f'还带有 {copy} 年的版权声明，那属于它链接的运行时库，而不是游戏本身。')
            extra = (' The executable also carries a '
                     f'{copy} copyright line, which belongs to the runtime library it links '
                     'rather than to the game.')
            return f"The bundle's own files are dated {files}, which is when this copy was built.{extra}"
        if lang == 'zh':
            return f'游戏包内的文件日期是 {files}，也正是这份拷贝构建的时间。'
        return f"The bundle's own files are dated {files}, which is when this copy was built."
    if copy:
        if lang == 'zh':
            return f'可执行文件里带有 {copy} 年的版权声明。'
        return f'The executable carries a copyright line from {copy}.'
    if lang == 'zh':
        return '归档没有为这一款标注年代。'
    return 'The archive does not date this one.'


def publisher_sentence(meta, lang):
    """What the bundle says about who made it."""
    if meta.get('publisher'):
        if lang == 'zh':
            return f'发行商是 {meta["publisher"]}，这个名字就写在程序的版权声明里。'
        return (f"The publisher is {meta['publisher']}, named on the copyright line inside "
                'the program.')
    if meta.get('publisherSeen'):
        if lang == 'zh':
            return (f'程序里出现过 {meta["publisherSeen"]} 这个名字，虽然它并不在版权声明上'
                    f'——发行商最可能就是 {meta["publisherSeen"]}。')
        return (f"The name {meta['publisherSeen']} appears inside the program, though not on a "
                f"copyright line — the publisher is most likely {meta['publisherSeen']}.")
    return None


def language_sentence(meta, lang):
    """Whether the program speaks Chinese or English, read off its own strings."""
    language = meta.get('language')
    if language == 'chinese':
        if lang == 'zh':
            return '程序里的文字是中文。'
        return 'The text inside the program is Chinese.'
    if language == 'english':
        if lang == 'zh':
            return '程序里的文字是英文。'
        return 'The text inside the program is English.'
    return None


def build_entry(game, meta, slug, tag, accent, types, name_en=None, name_en_source=None):
    """One catalogue entry, as the Atlas wants it.

    The page carries both languages: the English text the English locale
    reads, and the Chinese text the Chinese locale reads. The two are
    written here, side by side, so a change to one cannot quietly leave the
    other behind.
    """
    name = game['name']
    entry_point = meta.get('entryExecutable') or game['indexExecutable'] or '—'
    files = game['files']
    size = game['bytes']
    year = meta.get('yearFiles')
    category_line = ' · '.join(CATEGORY_LABELS.get(item, item) for item in types)

    def build(lang):
        """The page in one language."""
        zh = lang == 'zh'
        if zh:
            tagline = (f'MS-DOS{(" · " + str(year)) if year else ""} — '
                       f'{human_files(files)} 个文件，{megabytes(size)}。')
            summary = (f'{name} 是 WhereQ 归档中的一款 DOS 游戏——'
                       f'{str(year) if year else "年代未标注"}，{human_files(files)} 个文件，'
                       f'{megabytes(size)}，启动文件是 {entry_point}。')
            sentences = [f'{name} 是 WhereQ 归档中的一款 DOS 游戏。']
            publisher = publisher_sentence(meta, lang)
            if publisher:
                sentences.append(publisher)
            sentences.append(published_sentence(meta, lang))
            sentences.append(
                f'这份拷贝就是当年发行的程序：{human_files(files)} 个文件，'
                f'{megabytes(size)}，启动文件是 {entry_point}。'
            )
            overview = ' '.join(sentences)
            facts = [
                {'label': '开发',
                 'value': meta.get('publisher') or meta.get('publisherSeen') or '游戏包中没有说明'},
                {'label': '发行', 'value': str(year) if year else '未标注年代'},
                {'label': '类型', 'value': category_line},
                {'label': '平台', 'value': 'MS-DOS'},
                {'label': '启动文件', 'value': entry_point},
                {'label': '游戏包', 'value': f'{human_files(files)} 个文件 · {megabytes(size)}'},
            ]
        else:
            tagline = f'MS-DOS{(" · " + str(year)) if year else ""} — {human_files(files)} files, {megabytes(size)}.'
            summary = (
                f'{name} is a DOS game in the WhereQ archive — '
                f'{str(year) if year else "an undated copy"}, {human_files(files)} files, '
                f'{megabytes(size)}, and an entry point of {entry_point}.'
            )
            sentences = [f'{name} is a DOS game in the WhereQ archive.']
            publisher = publisher_sentence(meta, lang)
            if publisher:
                sentences.append(publisher)
            sentences.append(published_sentence(meta, lang))
            sentences.append(
                f'The copy is the program as it was distributed: {human_files(files)} files, '
                f'{megabytes(size)}, and an entry point of {entry_point}.'
            )
            overview = ' '.join(sentences)
            facts = [
                {'label': 'Developer',
                 'value': meta.get('publisher') or meta.get('publisherSeen') or 'Not stated in the bundle'},
                {'label': 'Published', 'value': str(year) if year else 'Not dated'},
                {'label': 'Type', 'value': category_line},
                {'label': 'Platform', 'value': 'MS-DOS'},
                {'label': 'Entry point', 'value': entry_point},
                {'label': 'Bundle', 'value': f'{human_files(files)} files · {megabytes(size)}'},
            ]

        # ── The setup, read from the shape of the bundle ────────
        setup = []
        entry_is_batch = entry_point.lower().endswith(('.bat', '.cmd'))
        if entry_is_batch:
            if zh:
                setup.append({
                    'kind': 'paragraph',
                    'text': (f'游戏包以批处理文件 {entry_point} 开始。在 WhereQ-DOSBox 中按下播放时，'
                             f'运行的就是这个批处理文件；而这种批处理文件通常会先把路径设好，再启动'
                             f'游戏——所以这一款不需要单独的启动器。'),
                })
            else:
                setup.append({
                    'kind': 'paragraph',
                    'text': (f'The bundle starts with a batch file, {entry_point}. WhereQ-DOSBox runs the '
                             f'batch file when you press Play, and a batch file of this kind normally sets '
                             f'the paths up and then starts the game — which is why this one needs no '
                             f'launcher of its own.'),
                })
        else:
            if zh:
                setup.append({
                    'kind': 'paragraph',
                    'text': (f'启动文件是 {entry_point}。把 zip 导入 WhereQ-DOSBox 并按下播放，'
                             f'应用就会启动这个程序。'),
                })
            else:
                setup.append({
                    'kind': 'paragraph',
                    'text': (f'The entry point is {entry_point}. Import the zip into WhereQ-DOSBox and press '
                             f'Play, and the app starts that program.'),
                })

        if game['diskimages']:
            images = '、'.join(game['diskimages'][:4])
            if zh:
                setup.append({
                    'kind': 'paragraph',
                    'text': (f'游戏包还附带一个磁盘镜像（{images}）——原始软盘的一份拷贝。如果游戏要求一个'
                             f'它找不到的驱动器，可以在 DOSBox 提示符下用 IMGMOUNT D <file> 挂载这个镜像，'
                             f'再从 D: 运行。'),
                })
            else:
                setup.append({
                    'kind': 'paragraph',
                    'text': (f'The bundle also ships a disk image ({images}) — a copy of the original '
                             f'floppy. If the game asks for a drive it cannot find, mount the image in the '
                             f'DOSBox prompt with IMGMOUNT D <file> and run it from D:.'),
                })

        if game['coms']:
            if zh:
                setup.append({
                    'kind': 'paragraph',
                    'text': (f'它带有 {human_files(len(game["coms"]))} 个 COM 文件——程序在启动之前需要'
                             f'加载的 DOS 加载器，就像带 XMS 驱动的游戏会先把它加载进来一样。'),
                })
            else:
                setup.append({
                    'kind': 'paragraph',
                    'text': (f'It carries {human_files(len(game["coms"]))} COM file(s) — the DOS loaders the '
                             f'program needs before it starts, the way a game with an XMS driver loads it '
                             f'first.'),
                })

        if zh:
            setup.append({
                'kind': 'paragraph',
                'text': ('这套运行方式还没有在模拟器上试过。如果在你那里不管用，本页底部的评论区就是'
                         '说出来的地方——而什么有效，值得写下来。'),
            })
        else:
            setup.append({
                'kind': 'paragraph',
                'text': ('This setup has not been played through on the emulator yet. If it does not work '
                         'for you, the comment thread at the bottom of this page is where to say so — and '
                         'what worked is worth writing down.'),
            })

        # ── What is in the bundle ───────────────────────────────
        if zh:
            rows = [['启动文件', entry_point]]
            if game['exes']:
                rows.append(['可执行文件', '、'.join(sorted(game['exes'])[:8])])
            if game['bats']:
                rows.append(['批处理启动文件', '、'.join(sorted(game['bats'])[:8])])
            if game['coms']:
                rows.append(['COM 加载器', '、'.join(sorted(game['coms'])[:8])])
            if game['diskimages']:
                rows.append(['磁盘镜像', '、'.join(game['diskimages'][:8])])
            rows.append(['其他文件', f'{human_files(game["datafiles"])} 个数据文件'])
            rows.append(['合计', f'{human_files(files)} 个文件 · {megabytes(size)}'])
        else:
            rows = [['Entry point', entry_point]]
            if game['exes']:
                rows.append(['Executables', '、'.join(sorted(game['exes'])[:8])])
            if game['bats']:
                rows.append(['Batch launchers', '、'.join(sorted(game['bats'])[:8])])
            if game['coms']:
                rows.append(['COM loaders', '、'.join(sorted(game['coms'])[:8])])
            if game['diskimages']:
                rows.append(['Disk images', '、'.join(game['diskimages'][:8])])
            rows.append(['Other files', f'{human_files(game["datafiles"])} data file(s)'])
            rows.append(['Total', f'{human_files(files)} files · {megabytes(size)}'])

        if zh:
            sections = [
                {
                    'title': '这是一款什么游戏',
                    'blocks': [
                        {'kind': 'paragraph', 'text': overview},
                        {'kind': 'paragraph', 'text': (
                            '本页由游戏包本身生成：下面的文件列表、日期与校验和都读自归档，而不是凭记忆'
                            '写下的。这一架上手写的页面——也就是那些带着手绘卡片标记的——是真正在模拟器'
                            '上通关过的。')},
                    ],
                },
                {
                    'title': '下载游戏包',
                    'blocks': [
                        {'kind': 'paragraph', 'text': '游戏包就是生成该页的那个归档里的原件——同一个文件，逐字节相同。'},
                        {'kind': 'table', 'head': ['字段', '值'], 'rows': [
                            ['文件', f'{slug}.zip'],
                            ['大小', f'{human_files(size)} 字节（{megabytes(size)}）'],
                            ['SHA-256', game['sha256']],
                            ['文件数', human_files(files)],
                            ['归档', 'dos-bin.zczc.cz——生成该页的那个归档'],
                        ]},
                        {'kind': 'links', 'items': [
                            {'label': f'下载 {name}（{megabytes(size)}）',
                             'href': game['source_url'],
                             'external': True},
                        ]},
                    ],
                },
                {
                    'title': '在 WhereQ-DOSBox 里运行',
                    'blocks': setup,
                },
                {
                    'title': '怎么玩',
                    'blocks': [
                        {'kind': 'paragraph', 'text': (
                            '还没有人写下这一款怎么开始。导入它，按下播放，然后告诉我们发生了什么——'
                            '如果它要密码、序列号或者手册里的某个词，那正是值得写下来的东西。')},
                        {'kind': 'paragraph', 'text': (
                            '那些在模拟器上通关过的页面就在这一架的旁边，它们把整条路都写清楚了：'
                            '从哪个文件开始、哪个键打开菜单、接下来是哪个画面。')},
                    ],
                },
                {
                    'title': '游戏包里有什么',
                    'blocks': [
                        {'kind': 'table', 'head': ['部分', '内容'], 'rows': rows},
                    ],
                },
                {
                    'title': '这些事实的来源',
                    'blocks': [
                        {'kind': 'list', 'items': [
                            '游戏包本身——它的文件列表、文件日期，以及启动文件里的字符串。',
                            '归档索引，给出上面的大小与 SHA-256。',
                            f'原件，在 {game["source_url"]}。',
                        ]},
                    ],
                },
            ]
        else:
            sections = [
                {
                    'title': 'What it is',
                    'blocks': [
                        {'kind': 'paragraph', 'text': overview},
                        {'kind': 'paragraph', 'text': (
                            'This page is generated from the bundle itself: the file list, the dates and the '
                            'checksum below are read out of the archive, not written from memory. The '
                            'hand-written pages on this shelf — the ones with a drawn card mark — are the '
                            'ones that have been played through on an emulator.')},
                    ],
                },
                {
                    'title': 'Download the bundle',
                    'blocks': [
                        {'kind': 'paragraph', 'text': 'The bundle is the original copy from the archive this page was generated from — the same file, byte for byte.'},
                        {'kind': 'table', 'head': ['Field', 'Value'], 'rows': [
                            ['File', f'{slug}.zip'],
                            ['Size', f'{human_files(size)} bytes ({megabytes(size)})'],
                            ['SHA-256', game['sha256']],
                            ['Files', human_files(files)],
                            ['Archive', 'dos-bin.zczc.cz — the archive this page was generated from'],
                        ]},
                        {'kind': 'links', 'items': [
                            {'label': f'Download {name} ({megabytes(size)})',
                             'href': game['source_url'],
                             'external': True},
                        ]},
                    ],
                },
                {
                    'title': 'Set it up in WhereQ-DOSBox',
                    'blocks': setup,
                },
                {
                    'title': 'How to play',
                    'blocks': [
                        {'kind': 'paragraph', 'text': (
                            'Nobody has written down how this one starts yet. Import it, press Play, and tell '
                            'us what happens — if it asks for a password, a serial number or a word from a '
                            'manual, that is exactly the thing worth writing down.')},
                        {'kind': 'paragraph', 'text': (
                            'The pages that have been played through on an emulator sit alongside this one on '
                            'the shelf, and they tell you the whole route in: which file to start, which key '
                            'opens the menu, and which screen comes next.')},
                    ],
                },
                {
                    'title': 'What is in the bundle',
                    'blocks': [
                        {'kind': 'table', 'head': ['Part', 'What it holds'], 'rows': rows},
                    ],
                },
                {
                    'title': 'Where the facts come from',
                    'blocks': [
                        {'kind': 'list', 'items': [
                            'The bundle itself — its file list, its file dates and the strings inside its entry point.',
                            'The archive index, for the size and the SHA-256 above.',
                            f'The original copy, at {game["source_url"]}.',
                        ]},
                    ],
                },
            ]

        return {
            'tagline': tagline,
            'summary': summary,
            'facts': facts,
            'sections': sections,
        }

    english = build('en')
    chinese = build('zh')

    return {
        'id': slug,
        'collection': 'dos-games',
        'name': name,
        'nameEn': name_en,
        'nameEnSource': name_en_source,
        'role': 'DOS Game',
        'roleZh': 'DOS 游戏',
        'tagline': english['tagline'],
        'taglineZh': chinese['tagline'],
        'accent': accent,
        'group': tag,
        'summary': english['summary'],
        'summaryZh': chinese['summary'],
        'status': str(year) if year else 'Archive',
        'statusZh': str(year) if year else '归档',
        'url': game['source_url'],
        'facts': english['facts'],
        'factsZh': chinese['facts'],
        'sections': english['sections'],
        'sectionsZh': chinese['sections'],
    }


def write_sections(handle, sections, key='sections', indent='  '):
    """A page's body, as the Atlas reads it."""
    handle.write(f'{indent}{key}: [\n')
    for section in sections:
        handle.write(f'{indent}  {{\n')
        handle.write(f'{indent}    title: {ts(section["title"])},\n')
        handle.write(f'{indent}    blocks: [\n')
        for block in section['blocks']:
            kind = block['kind']
            if kind == 'paragraph':
                handle.write(f'{indent}      {{kind: {ts(kind)}, text: {ts(block["text"])}}},\n')
            elif kind == 'list':
                handle.write(f'{indent}      {{kind: {ts(kind)}, items: [\n')
                for item in block['items']:
                    handle.write(f'{indent}        {ts(item)},\n')
                handle.write(f'{indent}      ]}},\n')
            elif kind == 'table':
                handle.write(f'{indent}      {{kind: {ts(kind)}, head: {ts(block["head"])}, rows: [\n')
                for row in block['rows']:
                    cells = ', '.join(ts(cell) for cell in row)
                    handle.write(f'{indent}        [{cells}],\n')
                handle.write(f'{indent}      ]}},\n')
            elif kind == 'links':
                handle.write(f'{indent}      {{kind: {ts(kind)}, items: [\n')
                for item in block['items']:
                    handle.write(
                        f'{indent}        {{label: {ts(item["label"])}, href: {ts(item["href"])}, '
                        f'external: {json.dumps(item.get("external", True))}}},\n'
                    )
                handle.write(f'{indent}      ]}},\n')
        handle.write(f'{indent}    ]}},\n')
    handle.write(f'{indent}],\n')


def write_full_entry(handle, entry):
    """One game's full page, as a module of its own.

    The module carries both languages: the English fields the English
    locale reads, and the Chinese ones the Chinese locale reads.
    """
    handle.write('''/**
 * A generated page from the DOS games catalogue.
 *
 * Generated by `scripts/generate-dos-games.py` — do not edit by hand.
 */

import {AtlasEntry} from '../atlas-types';

const entry: AtlasEntry = {
''')
    handle.write(f'  id: {ts(entry["id"])},\n')
    handle.write(f'  collection: {ts(entry["collection"])},\n')
    handle.write(f'  name: {ts(entry["name"])},\n')
    if entry.get('nameEn'):
        handle.write(f'  nameEn: {ts(entry["nameEn"])},\n')
        handle.write(f'  nameEnSource: {ts(entry.get("nameEnSource") or "known")},\n')
    handle.write(f'  role: {ts(entry["role"])},\n')
    handle.write(f'  roleZh: {ts(entry["roleZh"])},\n')
    handle.write(f'  tagline: {ts(entry["tagline"])},\n')
    handle.write(f'  taglineZh: {ts(entry["taglineZh"])},\n')
    handle.write(f'  accent: {ts(entry["accent"])},\n')
    handle.write(f'  group: {ts(entry["group"])},\n')
    handle.write(f'  summary: {ts(entry["summary"])},\n')
    handle.write(f'  summaryZh: {ts(entry["summaryZh"])},\n')
    handle.write(f'  status: {ts(entry["status"])},\n')
    handle.write(f'  statusZh: {ts(entry["statusZh"])},\n')
    handle.write(f'  url: {ts(entry["url"])},\n')
    handle.write('  facts: [\n')
    for fact in entry['facts']:
        handle.write(f'    {{label: {ts(fact["label"])}, value: {ts(fact["value"])}}},\n')
    handle.write('  ],\n')
    handle.write('  factsZh: [\n')
    for fact in entry['factsZh']:
        handle.write(f'    {{label: {ts(fact["label"])}, value: {ts(fact["value"])}}},\n')
    handle.write('  ],\n')
    write_sections(handle, entry['sections'])
    write_sections(handle, entry['sectionsZh'], key='sectionsZh', indent='  ')
    handle.write('};\n\n')
    handle.write('export default entry;\n')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--games', default='/home/whereq/git/dos/games')
    parser.add_argument('--index', default='/home/whereq/git/dos/games_index.csv')
    parser.add_argument('--metadata', default='/home/whereq/git/whereq-dosbox-claude/data/dos-games-metadata.json')
    parser.add_argument('--manifest', default='/home/whereq/git/whereq-dosbox-claude/data/dos-games-manifest.json')
    parser.add_argument('--categories', default=os.path.expanduser('~/git/dos/games_categories.json'))
    parser.add_argument('--english-names', default=os.path.join(ROOT, 'data', 'english-names.json'))
    parser.add_argument('--routes', default=os.path.join(ROOT, 'src/pages/dos-games'))
    parser.add_argument('--pages', default=os.path.join(ROOT, 'src/data/dos-games'))
    parser.add_argument('--images', default=os.path.join(ROOT, 'static/img/dos-games'))
    parser.add_argument('--out', default=os.path.join(ROOT, 'src/data/dos-games-index.ts'))
    parser.add_argument('--stats', default=os.path.join(ROOT, 'src/data/dos-games-stats.ts'))
    args = parser.parse_args()

    metadata = {}
    if os.path.exists(args.metadata):
        for record in json.load(open(args.metadata, encoding='utf-8')):
            metadata[record['identifier']] = record

    # The category of every game, read from the archive's own manifest and
    # the descriptions the same project publishes. A game can be in more
    # than one category — see `scripts/dos_game_categories.py`.
    # The original English title of each game, where it is known. The
    # archive files every game under its Chinese name; this is what the
    # English locale shows on the card instead.
    english_names = {}
    if os.path.exists(args.english_names):
        english_names = json.load(open(args.english_names, encoding='utf-8'))
    else:
        print(f'warning: no English names at {args.english_names} — the cards will show the '
              'Chinese name only')

    categories = {}
    if os.path.exists(args.categories):
        categories = json.load(open(args.categories, encoding='utf-8'))
    else:
        print(f'warning: no categories at {args.categories} — every game is uncategorised')

    with open(args.index, newline='', encoding='utf-8') as handle:
        rows = list(csv.DictReader(handle))

    taken = set()
    written = set()
    entries = []
    index_rows = []
    manifest = []
    groups = {}

    os.makedirs(args.pages, exist_ok=True)
    os.makedirs(args.routes, exist_ok=True)
    os.makedirs(args.images, exist_ok=True)

    for row in rows:
        identifier = row['identifier']
        if identifier in MANUAL:
            continue

        path = os.path.join(args.games, identifier + '.zip')
        if not os.path.exists(path):
            continue

        with zipfile.ZipFile(path) as archive:
            names = [n for n in archive.namelist() if not n.endswith('/')]
            exes, bats, coms, images = [], [], [], []
            for entry_name in names:
                base = os.path.basename(entry_name)
                if not base:
                    continue
                low = base.lower()
                if low.endswith('.exe'):
                    exes.append(base)
                elif low.endswith(('.bat', '.cmd')):
                    bats.append(base)
                elif low.endswith('.com'):
                    coms.append(base)
                elif low.endswith(('.img', '.ima', '.iso')):
                    images.append(base)

        meta = metadata.get(identifier, {})
        meta.setdefault('entryExecutable', None)
        if not meta.get('entryExecutable'):
            wanted = (row['executable'] or '').lower()
            match = [e for e in exes if e.lower() == wanted]
            if match:
                meta['entryExecutable'] = match[0]
            elif exes:
                meta['entryExecutable'] = exes[0]
            elif bats:
                meta['entryExecutable'] = bats[0]
            elif coms:
                meta['entryExecutable'] = coms[0]

        name = row['name_zh'] or identifier
        slug = unique_slug(name, taken)
        tag = initial_for(slug)
        accent = ACCENTS.get(tag, '#5D6D7E')
        types = categories.get(identifier, {}).get('types', [])

        game = {
            'name': name,
            'files': len(names),
            'bytes': int(row['bytes']) if row['bytes'] else 0,
            'sha256': row['sha256'],
            'source_url': row['source_url'],
            'indexExecutable': row['executable'],
            'exes': exes,
            'bats': bats,
            'coms': coms,
            'diskimages': images,
            'datafiles': max(0, len(names) - len(exes) - len(bats) - len(coms) - len(images)),
        }
        english = english_names.get(name)
        name_en = english.get('en') if english else None
        name_en_source = english.get('source') if english else None
        entry = build_entry(game, meta, slug, tag, accent, types, name_en, name_en_source)
        entries.append(entry)
        year = meta.get('yearFiles')
        index_rows.append({
            'id': slug,
            'name': name,
            'nameEn': name_en,
            'year': str(year) if year else '',
            'size': game['bytes'],
            'files': game['files'],
            'entry': meta.get('entryExecutable') or game['indexExecutable'] or '—',
            'tag': tag,
            'types': types,
            'url': entry['url'],
            'page': f'/dos-games/{slug}/',
        })
        groups.setdefault(tag, []).append(slug)
        manifest.append({
            'identifier': identifier,
            'name': name,
            'slug': slug,
            'tag': tag,
            'bytes': game['bytes'],
            'sha256': game['sha256'],
            'path': path,
            'year': meta.get('yearFiles'),
        })

        # ── the route and the card mark ─────────────────────────
        route = os.path.join(args.routes, f'{slug}.tsx')
        with open(route, 'w', encoding='utf-8') as handle:
            handle.write(
                'import React from \'react\';\n'
                'import DosGamePage from \'../../components/DosGames/DosGamePage\';\n'
                'import entry from \'../../data/dos-games/'
                f'{slug}\';\n\n'
                f'/** {name} — the DOS games catalogue. */\n'
                'export default function DosGame(): React.JSX.Element {\n'
                '  return <DosGamePage entry={entry} />;\n'
                '}\n'
            )

        written.add(slug)

        page = os.path.join(args.pages, f'{slug}.ts')
        with open(page, 'w', encoding='utf-8') as handle:
            write_full_entry(handle, entry)

        image = os.path.join(args.images, f'{slug}.svg')
        if not os.path.exists(image):
            with open(image, 'w', encoding='utf-8') as handle:
                handle.write(plate_svg(name, slug, accent))

    # ── the groups ───────────────────────────────────────────────
    group_entries = []
    for tag in sorted(groups):
        titles = {
            '0': 'Names that start with a number',
        }
        title = titles.get(tag, f'{tag.upper()} — names that start with “{tag.upper()}”')
        blurb = (
            f'The {len(groups[tag])} games in the archive whose name begins with '
            f'“{tag.upper()}”.'
        )
        group_entries.append({'id': tag, 'title': title, 'blurb': blurb})

    # The hand-written pages are skipped above, but they still belong in the
    # catalogue: the reader should find 三国志英杰传 in the list, and be sent
    # to its page on the Atlas shelf.
    with open(args.index, newline='', encoding='utf-8') as handle:
        all_rows = {row['identifier']: row for row in csv.DictReader(handle)}
    for identifier, slug in sorted(MANUAL_SLUGS.items()):
        row = all_rows.get(identifier)
        if not row:
            continue
        tag = initial_for(slug)
        size = int(row['bytes']) if row['bytes'] else 0
        files = 0
        # The archive's own entry point is the file the game is meant to be
        # started from — for these games that is the launcher, not the
        # biggest executable in the bundle.
        entry_point = row['executable'] or '—'
        path = os.path.join(args.games, identifier + '.zip')
        if os.path.exists(path):
            with zipfile.ZipFile(path) as archive:
                names = [n for n in archive.namelist() if not n.endswith('/')]
            files = len(names)
            exes = [os.path.basename(n) for n in names if n.lower().endswith('.exe')]
            wanted = (row['executable'] or '').lower()
            for name in names:
                if os.path.basename(name).lower() == wanted:
                    entry_point = os.path.basename(name)
                    break
            else:
                if exes:
                    entry_point = exes[0]
        manifest.append({
            'identifier': identifier,
            'name': row['name_zh'] or identifier,
            'slug': slug,
            'tag': tag,
            'bytes': size,
            'sha256': row['sha256'],
            'path': path,
            'year': None,
        })
        index_rows.append({
            'id': slug,
            'name': row['name_zh'] or identifier,
            'year': MANUAL_YEARS.get(slug, ''),
            'size': size,
            'files': files,
            'entry': entry_point,
            'tag': tag,
            'types': categories.get(identifier, {}).get('types', []),
            'url': row['source_url'],
            'page': f'/dos-games/{slug}/',
        })

        # The hand-written game still needs a route of its own, next to the
        # generated ones — the catalogue links to it by path.
        route = os.path.join(args.routes, f'{slug}.tsx')
        with open(route, 'w', encoding='utf-8') as handle:
            handle.write(
                'import React from \'react\';\n'
                'import DosGamePage from \'../../components/DosGames/DosGamePage\';\n'
                'import {PLAYED_BY_ID} from \'../../data/games-played\';\n'
                'import {PLAYED_BY_ID_ZH} from \'../../data/games-played-zh\';\n\n'
                f'/** {row["name_zh"] or identifier} — the DOS games archive. */\n'
                'export default function DosGame(): React.JSX.Element {\n'
                f'  return (\n'
                f'    <DosGamePage\n'
                f'      entry={{PLAYED_BY_ID[\'{slug}\']}}\n'
                f'      entryZh={{PLAYED_BY_ID_ZH[\'{slug}\']}}\n'
                f'    />\n'
                f'  );\n'
                '}\n'
            )
        written.add(slug)

    # ── the index ───────────────────────────────────────────────
    #
    # Only what the catalogue page reads: one line per game. The full text
    # of a game lives in its own module, imported by its own route.
    with open(args.out, 'w', encoding='utf-8') as handle:
        handle.write('''/**
 * The DOS games catalogue — the index, generated rather than written.
 *
 * One line per game in the archive at ~/git/dos/games: what the catalogue
 * page lists, and what the search box searches. The full page of a game
 * lives in `src/data/dos-games/<slug>.ts`, imported only by that game's
 * own route, so the browser fetches one game at a time.
 *
 * The five games that have been played through on an emulator keep their
 * pages in `src/data/games-played.ts`; the generator writes their routes and
 * points their `page` at them like any other game.
 *
 * Regenerate with `python3 scripts/generate-dos-games.py`. Do not edit it
 * by hand — the generator overwrites it.
 */

/** One line of the catalogue. */
export type DosGameIndexEntry = {
  /** The page id — the slug the URL is built from. */
  id: string;
  /** The name, as the archive knows it. */
  name: string;
  /**
   * The original English title, when it is known.
   *
   * The English locale shows this on the card; the Chinese one shows the
   * Chinese name. The search box looks for both.
   */
  nameEn?: string;
  /** The year the bundle's own files are dated. */
  year: string;
  /** The size of the bundle, in bytes. */
  size: number;
  /** How many files the bundle holds. */
  files: number;
  /** The file the bundle wants to be started from. */
  entry: string;
  /** The first letter of the name — the letter its release sits under. */
  tag: string;
  /** The categories the game belongs to — it can be in more than one. */
  types: string[];
  /** The download — the original copy, on the archive the page came from. */
  url: string;
  /** Where the game's own page lives on this site. */
  page: string;
};

/** Every game in the archive. */
export const DOS_GAMES_INDEX: DosGameIndexEntry[] = [
''')
        for row in index_rows:
            handle.write('  {\n')
            handle.write(f'    id: {ts(row["id"])},\n')
            handle.write(f'    name: {ts(row["name"])},\n')
            if row.get('nameEn'):
                handle.write(f'    nameEn: {ts(row["nameEn"])},\n')
            handle.write(f'    year: {ts(row["year"])},\n')
            handle.write(f'    size: {row["size"]},\n')
            handle.write(f'    files: {row["files"]},\n')
            handle.write(f'    entry: {ts(row["entry"])},\n')
            handle.write(f'    tag: {ts(row["tag"])},\n')
            handle.write(f'    types: [{", ".join(ts(item) for item in row["types"])}],\n')
            handle.write(f'    url: {ts(row["url"])},\n')
            handle.write(f'    page: {ts(row["page"])},\n')
            handle.write('  },\n')
        handle.write('];\n')

    # ── the stats ───────────────────────────────────────────────
    #
    # What the front page says about the archive, in a module small enough
    # to sit in the shared bundle. The catalogue page reads the index
    # itself; this is the handful of numbers the front page needs, so it
    # does not have to pull the whole index in to show them.
    by_category = {}
    for row in index_rows:
        for type_id in row['types']:
            by_category[type_id] = by_category.get(type_id, 0) + 1
    total_bytes = sum(row['size'] for row in index_rows)

    with open(args.stats, 'w', encoding='utf-8') as handle:
        handle.write('''/**
 * The archive in numbers — generated rather than written.
 *
 * The front page shows how many games there are, how big the archive is and
 * how many sit in each category. It reads them from here rather than from
 * the index, so the page does not have to pull the whole catalogue in to
 * print three numbers.
 *
 * Regenerate with `python3 scripts/generate-dos-games.py`. Do not edit it
 * by hand — the generator overwrites it.
 */

/** How many games sit in each category. */
export const DOS_GAMES_BY_CATEGORY: Record<string, number> = {
''')
        for type_id in sorted(by_category):
            handle.write(f'  {ts(type_id)}: {by_category[type_id]},\n')
        handle.write('};\n\n')
        handle.write('/** The size of the whole archive, in bytes. */\n')
        handle.write(f'export const DOS_GAMES_BYTES = {total_bytes};\n\n')
        handle.write('/** How many games the archive holds. */\n')
        handle.write(f'export const DOS_GAMES_COUNT = {len(index_rows)};\n')

    with open(args.manifest, 'w', encoding='utf-8') as handle:
        json.dump(manifest, handle, ensure_ascii=False, indent=1)

    # ── clean up what a previous run left behind ────────────────
    #
    # A game that moves from the catalogue to the hand-written shelf
    # stops being generated, and its old route and page would sit in
    # the tree pointing at nothing. The generator owns these two
    # directories, so it can take them back.
    stale = []
    for directory, suffix in ((args.routes, '.tsx'), (args.pages, '.ts')):
        if not os.path.isdir(directory):
            continue
        for name in sorted(os.listdir(directory)):
            stem, ext = os.path.splitext(name)
            if ext != suffix or stem == 'index':
                continue
            if stem not in written:
                stale.append(os.path.join(directory, name))
    for path in stale:
        os.remove(path)
        print(f'removed stale {os.path.relpath(path, ROOT)}')

    print(f'entries: {len(entries)}  groups: {len(group_entries)}  routes: {len(entries)}')
    print(f'wrote {args.out}')


if __name__ == '__main__':
    main()
