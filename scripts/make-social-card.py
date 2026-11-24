#!/usr/bin/env python3
"""Draw the social card for PC Legends.

Every page carries an Open Graph image, and the one that ships with the
family is a screenshot of a different product. This draws the card for
this site instead: the house colours, the site name, and a row of the
card marks the catalogue uses.

Run:

    python3 scripts/make-social-card.py

Writes:

    static/img/pc-legends-card.png
"""

import os

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# The house colours: the same navy and amber the site is built from.
BACKGROUND = (13, 17, 23)
SURFACE = (22, 27, 39)
ACCENT = (245, 166, 35)
TEXT = (230, 237, 243)
MUTED = (139, 148, 158)

WIDTH = 1200
HEIGHT = 630

FONT_DIR = '/usr/share/fonts/truetype/dejavu'
BOLD = os.path.join(FONT_DIR, 'DejaVuSans-Bold.ttf')
REGULAR = os.path.join(FONT_DIR, 'DejaVuSans.ttf')

# The marks carry Chinese characters, and the Latin font has none of them.
CJK = '/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc'


def centred(draw, text, font, y, fill):
    width = draw.textlength(text, font=font)
    draw.text(((WIDTH - width) / 2, y), text, font=font, fill=fill)


def main():
    image = Image.new('RGB', (WIDTH, HEIGHT), BACKGROUND)
    draw = ImageDraw.Draw(image)

    # A row of card marks along the bottom, the way the catalogue shows
    # them: a coloured plate with the first character of a game on it.
    marks = [
        ('三', '#C0392B'),
        ('真', '#2874A6'),
        ('沙', '#117864'),
        ('炎', '#7D3C98'),
        ('帝', '#B9770E'),
        ('三', '#1F618D'),
        ('魔', '#148F77'),
        ('水', '#AF7AC5'),
    ]
    plate = 92
    gap = 20
    total = len(marks) * plate + (len(marks) - 1) * gap
    left = (WIDTH - total) / 2
    top = HEIGHT - 150

    mark_font = ImageFont.truetype(CJK, 44, index=0)
    for index, (character, colour) in enumerate(marks):
        x = left + index * (plate + gap)
        red, green, blue = int(colour[1:3], 16), int(colour[3:5], 16), int(colour[5:7], 16)
        draw.rounded_rectangle(
            [x, top, x + plate, top + plate], radius=2, fill=(red, green, blue)
        )
        width = draw.textlength(character, font=mark_font)
        draw.text(
            (x + (plate - width) / 2, top + (plate - 58) / 2),
            character,
            font=mark_font,
            fill=TEXT,
        )

    title = ImageFont.truetype(BOLD, 92)
    subtitle = ImageFont.truetype(REGULAR, 32)
    small = ImageFont.truetype(REGULAR, 24)

    # The rule under the eyebrow, in the site's amber.
    draw.rectangle([WIDTH / 2 - 40, 150, WIDTH / 2 + 40, 154], fill=ACCENT)

    eyebrow = 'THE DOS GAMES ARCHIVE'
    width = draw.textlength(eyebrow, font=small)
    draw.text(
        ((WIDTH - width) / 2, 108), eyebrow, font=small, fill=ACCENT
    )

    centred(draw, 'PC LEGENDS', title, 178, TEXT)
    centred(draw, '1,898 DOS games, each with the facts read out of its bundle',
             subtitle, 300, MUTED)
    centred(draw, 'pclegends.games', small, 352, MUTED)

    out = os.path.join(ROOT, 'static/img/pc-legends-card.png')
    image.save(out)
    print(f'wrote {out}')


if __name__ == '__main__':
    main()
