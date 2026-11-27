import React from 'react';
import Layout from '@theme/Layout';
import {useCopy} from '../hooks/useCopy';
import styles from './about.module.css';

const DOSBOX_REPO = 'https://github.com/whereq/whereq-dosbox';
const DOSBOX_APK = 'https://github.com/whereq/whereq-dosbox/releases';
const DOSBOX_ATLAS = 'https://whereq.github.io/atlas/universe/whereq-dosbox/';

/**
 * The resources page: the two players that run the games (A-DOS and
 * WhereQ-DOSBox, A-DOS favoured) side by side, and a set of outbound links to
 * the wider DOS-preservation world — collections, stores and emulators worth
 * knowing, which also give the site something to point outward at.
 *
 * The comparison reuses `copy.about.compare`; the page's own words and the
 * link list are `copy.resources`. It shares `about.module.css`.
 */
export default function Resources(): React.JSX.Element {
  const copy = useCopy();
  const res = copy.resources;
  const {compare} = copy.about;

  return (
    <Layout title={res.title} description={res.description}>
      <main className={styles.page}>
        <header className={styles.hero}>
          <p className={styles.docline}>
            <span className={styles.docTag}>DOC PCL-003</span>
            <span>{res.eyebrow}</span>
          </p>
          <h1 className={styles.title}>{res.heading}</h1>
          <p className={styles.lead}>{res.lead}</p>
        </header>

        {/* ── The two players ──────────────────────────────── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNum}>1.0</span>
            {res.runTitle}
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

        {/* ── External DOS resources ───────────────────────── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNum}>2.0</span>
            {res.linksTitle}
          </h2>
          <p className={styles.para}>{res.linksIntro}</p>

          <ul className={styles.resLinks}>
            {res.links.map((link) => (
              <li className={styles.resLink} key={link.href}>
                <a
                  className={styles.resLinkMain}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer">
                  <span className={styles.resLinkName}>{link.name} ↗</span>
                  <span className={styles.resLinkHref}>{hostOf(link.href)}</span>
                </a>
                <p className={styles.resLinkNote}>{link.note}</p>
              </li>
            ))}
          </ul>
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

/** The bare host of a URL, for the mono sub-label under a link. */
function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}
