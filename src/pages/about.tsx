import React from 'react';
import Layout from '@theme/Layout';
import {DOS_GAMES_BYTES, DOS_GAMES_COUNT} from '../data/dos-games-stats';
import {useCopy} from '../hooks/useCopy';
import RichText from '../components/RichText';
import styles from './about.module.css';

const DOSBOX_REPO = 'https://github.com/whereq/whereq-dosbox';
const DOSBOX_APK = 'https://github.com/whereq/whereq-dosbox/releases';
const DOSBOX_ATLAS = 'https://whereq.github.io/atlas/universe/whereq-dosbox/';

/**
 * What this site is, where the games come from, and the two apps that run
 * them — the open-source WhereQ-DOSBox and the Play-Store-bound A-DOS, set
 * side by side. The words live in `src/data/site-copy.ts`, both languages.
 */
export default function About(): React.JSX.Element {
  const copy = useCopy();
  const {compare} = copy.about;

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

        {/* ── WhereQ-DOSBox vs A-DOS ───────────────────────── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNum}>§</span>
            {compare.title}
          </h2>
          <p className={styles.para}>{compare.intro}</p>

          <div className={styles.compare}>
            {/* WhereQ-DOSBox */}
            <article className={styles.tool}>
              <div className={styles.toolHead}>
                <span className={styles.toolMark}>
                  <img src="/img/whereq-dosbox-mark.png" alt="" width={48} height={48} />
                </span>
                <div>
                  <h3 className={styles.toolName}>WhereQ-DOSBox</h3>
                  <span className={styles.toolKind}>{compare.dosbox.kind}</span>
                </div>
              </div>
              <ul className={styles.toolPoints}>
                {compare.dosbox.points.map((point) => (
                  <li key={point.slice(0, 24)}>{point}</li>
                ))}
              </ul>
              <div className={styles.toolActions}>
                <a
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  href={DOSBOX_APK}
                  target="_blank"
                  rel="noopener noreferrer">
                  ↓ {compare.dosbox.apk}
                </a>
                <a
                  className={`${styles.btn} ${styles.btnGhost}`}
                  href={DOSBOX_ATLAS}
                  target="_blank"
                  rel="noopener noreferrer">
                  {compare.dosbox.atlas} ↗
                </a>
                <a
                  className={styles.toolRepo}
                  href={DOSBOX_REPO}
                  target="_blank"
                  rel="noopener noreferrer">
                  github.com/whereq/whereq-dosbox ↗
                </a>
              </div>
            </article>

            {/* A-DOS */}
            <article className={styles.tool}>
              <div className={styles.toolHead}>
                <span className={styles.toolMark}>
                  <img src="/img/a-dos-mark.png" alt="A-DOS" width={48} height={48} />
                </span>
                <div>
                  <h3 className={styles.toolName}>A-DOS</h3>
                  <span className={styles.toolKind}>{compare.ados.kind}</span>
                </div>
              </div>
              <ul className={styles.toolPoints}>
                {compare.ados.points.map((point) => (
                  <li key={point.slice(0, 24)}>{point}</li>
                ))}
              </ul>
              <div className={styles.toolActions}>
                <span className={styles.badgeSoon} aria-disabled="true">
                  ▶ {compare.ados.badge}
                </span>
                <p className={styles.toolNote}>{compare.ados.note}</p>
              </div>
            </article>
          </div>
        </section>

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
