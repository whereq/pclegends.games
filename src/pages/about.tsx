import React from 'react';
import Layout from '@theme/Layout';
import {DOS_GAMES_BYTES, DOS_GAMES_COUNT} from '../data/dos-games-stats';
import {useCopy} from '../hooks/useCopy';
import RichText from '../components/RichText';
import styles from './about.module.css';

/**
 * What this site is, where the games come from, and how a page is built. The
 * two players that run the games — A-DOS and WhereQ-DOSBox — are compared on
 * the /resources page, which the "Running the games" section links to. The
 * words live in `src/data/site-copy.ts`, both languages.
 */
export default function About(): React.JSX.Element {
  const copy = useCopy();

  return (
    <Layout title={copy.about.title} description={copy.about.description}>
      <main className={styles.page}>
        <header className={styles.hero}>
          <p className={styles.docline}>
            <span className={styles.docTag}>DOC PCL-000</span>
            <span>{copy.about.eyebrow}</span>
          </p>
          <h1 className={styles.title}>{copy.about.heading}</h1>
          <p className={styles.lead}>
            {copy.about.lead(
              DOS_GAMES_COUNT.toLocaleString('en-US'),
              (DOS_GAMES_BYTES / 1e9).toFixed(1),
            )}
          </p>
        </header>

        {copy.about.sections.map((section, index) => (
          <section className={styles.section} key={section.title}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNum}>{index + 1}.0</span>
              {section.title}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p className={styles.para} key={paragraph.slice(0, 40)}>
                <RichText text={paragraph} />
              </p>
            ))}
          </section>
        ))}

        <aside className={styles.notice}>
          <div className={styles.noticeTab}>
            <span className={styles.noticeKicker}>NOTICE</span>
            <span className={styles.noticeTitle}>{copy.common.noticeTitle}</span>
          </div>
          <p className={styles.noticeText}>{copy.common.noticeText}</p>
        </aside>
      </main>
    </Layout>
  );
}
