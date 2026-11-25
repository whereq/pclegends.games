import React from 'react';
import Link from '@docusaurus/Link';

/**
 * A paragraph of text with links in it.
 *
 * The site's copy lives in `src/data/site-copy.ts` as plain strings, so it
 * can be translated; a translation cannot hold a React element. So a link
 * is written the way it is written in Markdown — `[label](/url)` — and
 * picked up here.
 *
 * Only two things are understood: a link, and `*emphasis*`. Anything else
 * is left exactly as it is.
 */
export default function RichText({text}: {text: string}): React.JSX.Element {
  const parts: React.ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)\s]+)\)|\*([^*]+)\*/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    if (match[1] !== undefined) {
      const label = match[1];
      const href = match[2];
      parts.push(
        href.startsWith('/') ? (
          <Link key={match.index} to={href}>
            {label}
          </Link>
        ) : (
          <a key={match.index} href={href}>
            {label}
          </a>
        ),
      );
    } else if (match[3] !== undefined) {
      parts.push(<em key={match.index}>{match[3]}</em>);
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    parts.push(text.slice(last));
  }

  return <>{parts}</>;
}
