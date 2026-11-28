import React from 'react';

/**
 * A game's card mark, drawn in the browser instead of fetched as a file.
 *
 * Every game used to ship a generated `<slug>.svg` — 1,893 of them, times two
 * locales — just to show a coloured plate with a letter on it. The plate is
 * fully determined by two things the catalogue already knows: the accent
 * colour (keyed off the name's first letter) and that letter. So it is drawn
 * here, inline, from the index data — no file, no request, and nothing for a
 * static host to count against a file limit.
 *
 * This is the same plate the old `scripts/generate-dos-games.py` wrote: a
 * vertical gradient of the accent, a hairline border, and the initial centred
 * on it.
 */

/** Name's-first-letter → accent colour. Mirrors `ACCENTS` in the generator. */
const ACCENTS: Record<string, string> = {
  a: '#C0392B', b: '#B9770E', c: '#7D6608', d: '#6E7B05',
  e: '#2874A6', f: '#1F618D', g: '#117864', h: '#148F77',
  i: '#1E8449', j: '#229954', k: '#7D3C98', l: '#8E44AD',
  m: '#AF7AC5', n: '#D98880', o: '#E59866', p: '#F5B041',
  q: '#F8C471', r: '#F1948A', s: '#EC7063', t: '#CD6155',
  u: '#A04000', v: '#B03A2E', w: '#7F8C8D', x: '#909497',
  y: '#626567', z: '#515A5A', '0': '#34495E',
};

const DEFAULT_ACCENT = '#5D6D7E';

/** The accent a game's mark carries — keyed off its tag, the old way. */
export function markAccent(tag: string | undefined): string {
  const key = (tag ?? '').trim().toLowerCase()[0] ?? '';
  return ACCENTS[key] ?? DEFAULT_ACCENT;
}

export default function GameMark({
  name,
  tag,
  className,
}: {
  /** The name whose first character sits on the plate. */
  name: string;
  /** The game's tag — its first letter — which picks the accent. */
  tag?: string;
  className?: string;
}): React.JSX.Element {
  const accent = markAccent(tag);
  const initial = [...name.trim()][0] ?? '?';
  // A per-instance gradient id, so many marks on one page do not collide.
  const gid = React.useId().replace(/:/g, '');

  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      role="img"
      aria-label={name}
      preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={accent} />
          <stop offset="1" stopColor={accent} stopOpacity="0.72" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" fill={`url(#${gid})`} />
      <rect x="1" y="1" width="62" height="62" fill="none" stroke="#000" strokeOpacity="0.18" strokeWidth="2" />
      <text
        x="32"
        y="44"
        textAnchor="middle"
        fontFamily="'IBM Plex Sans Condensed', 'Noto Serif CJK TC', serif"
        fontSize="38"
        fontWeight="700"
        fill="#FFF8E7">
        {initial}
      </text>
    </svg>
  );
}
