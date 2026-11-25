import React from 'react';
import Layout from '@theme/Layout';
import {DOS_GAMES_BYTES, DOS_GAMES_COUNT} from '../data/dos-games-stats';
import {useCopy} from '../hooks/useCopy';
import RichText from '../components/RichText';
import styles from '../components/DosGames/dos-games.module.css';

/**
 * What this site is, where the games come from, and what the pages are
 * allowed to say.
 *
 * The licence position is the part that matters most, and it is stated
 * plainly rather than in a footnote: the archives are other people's work.
 *
 * The words live in `src/data/site-copy.ts`, in both languages; a link in
 * them is written the way Markdown writes one, and picked up by `RichText`.
 */
export default function About(): React.JSX.Element {
  const copy = useCopy();

  return (
    <Layout
      title={copy.about.title}
      description={copy.about.description}>
      <main className={styles.page}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>{copy.about.eyebrow}</p>
          <h1 className={styles.title}>{copy.about.heading}</h1>
          <p className={styles.lead}>
            {copy.about.lead(
              DOS_GAMES_COUNT.toLocaleString('en-US'),
              (DOS_GAMES_BYTES / 1e9).toFixed(1),
            )}
          </p>
        </header>

        {copy.about.sections.map((section) => (
          <section className={styles.section} key={section.title}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p className={styles.para} key={paragraph.slice(0, 40)}>
                <RichText text={paragraph} />
              </p>
            ))}
          </section>
        ))}

        <aside className={styles.notice}>
          <p className={styles.noticeTitle}>{copy.common.noticeTitle}</p>
          <p className={styles.noticeText}>{copy.common.noticeText}</p>
        </aside>
      </main>
    </Layout>
  );
}
