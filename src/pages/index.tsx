import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {
  DOS_GAME_CATEGORIES,
} from '../data/dos-games-categories';
import {
  DOS_GAMES_BY_CATEGORY,
  DOS_GAMES_BYTES,
  DOS_GAMES_COUNT,
} from '../data/dos-games-stats';
import {useCopy, useIsChinese} from '../hooks/useCopy';
import AdSlot from '../components/AdSlot';
import styles from './index.module.css';

/**
 * The front door of PC Legends — the terminal redesign.
 *
 * A DOS technical-document look: a documentation number over the headline, a
 * CRT readout that shows what a game page is made of, the ten categories as
 * an index, and the three-step signal path a page is built along. The copy is
 * the site's own (both languages); the mono labels are machine marks and stay
 * in their terminal form.
 */
export default function Home(): React.JSX.Element {
  const copy = useCopy();
  const chinese = useIsChinese();
  const games = DOS_GAMES_COUNT;
  const bytes = DOS_GAMES_BYTES;

  const maxCount = Math.max(
    1,
    ...DOS_GAME_CATEGORIES.map((c) => DOS_GAMES_BY_CATEGORY[c.id] ?? 0),
  );

  return (
    <Layout title={copy.home.title} description={copy.home.description}>
      <main className={styles.page}>
        {/* ── HERO ─────────────────────────────────────────── */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroMain}>
              <p className={styles.docline}>
                <span className={styles.docTag}>DOC PCL-001</span>
                <span>{copy.home.eyebrow}</span>
              </p>
              <h1 className={styles.heroTitle}>{copy.home.heading}</h1>
              <p className={styles.heroLead}>{copy.home.lead(games.toLocaleString('en-US'))}</p>
              <div className={styles.actions}>
                <Link className={`${styles.btn} ${styles.btnPrimary}`} to="/dos-games/">
                  {copy.home.ctaCatalogue} <span aria-hidden="true" className={styles.mono}>→</span>
                </Link>
                <Link className={`${styles.btn} ${styles.btnGhost}`} to="/played/">
                  {copy.home.ctaPlayed}
                </Link>
              </div>
              <dl className={styles.stats}>
                <div className={styles.stat}>
                  <dt>{copy.common.games}</dt>
                  <dd>{games.toLocaleString('en-US')}</dd>
                </div>
                <div className={styles.stat}>
                  <dt>{copy.common.archive}</dt>
                  <dd>
                    {(bytes / 1e9).toFixed(1)}
                    <span className={styles.statUnit}> GB</span>
                  </dd>
                </div>
                <div className={styles.stat}>
                  <dt>{copy.common.categories}</dt>
                  <dd>{DOS_GAME_CATEGORIES.length}</dd>
                </div>
              </dl>
            </div>

            {/* CRT readout — a game page is read from its bundle, like this. */}
            <figure className={styles.crtFigure}>
              <div className={styles.crtBezel}>
                <div className={styles.crtScreen} aria-hidden="true">
                  <div className={styles.crtDim}>WhereQ-DOSBox · bundle reader</div>
                  <div className={styles.crtDim}>──────────────────────────────</div>
                  <div>C:\&gt; READ TOU-JIN-ZI.ZIP</div>
                  <div className={styles.crtInk}>&nbsp; TITLE ....... Lode Runner</div>
                  <div className={styles.crtInk}>&nbsp; ORIGINAL .... 偷金子</div>
                  <div className={styles.crtInk}>&nbsp; DEVELOPER ... ORIGIN</div>
                  <div className={styles.crtInk}>&nbsp; DATED ....... 1998</div>
                  <div className={styles.crtInk}>&nbsp; ENTRY ....... LR.COM</div>
                  <div className={styles.crtInk}>&nbsp; BUNDLE ...... 2 files · 49,883 bytes</div>
                  <div className={styles.crtCyan}>&nbsp; SHA-256 ..... 15d9001b3c0dc951…5848aa</div>
                  <div className={styles.crtCursor}>C:\&gt; <span>&nbsp;</span></div>
                </div>
                <div className={styles.crtPlate}>
                  <span>PCL-CRT 14"</span>
                  <span className={styles.crtPower}>
                    <span aria-hidden="true" className={styles.crtLed} />
                    POWER
                  </span>
                </div>
              </div>
              <figcaption className={styles.crtCaption}>{copy.home.crtCaption}</figcaption>
            </figure>
          </div>
        </section>

        {/* ── §1 CATEGORIES ────────────────────────────────── */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionHeadMain}>
              <p className={styles.sectionNum}>§1 · INDEX OF CATEGORIES</p>
              <h2 className={styles.sectionTitle}>{copy.home.categoriesTitle}</h2>
            </div>
            <p className={styles.sectionIntro}>{copy.home.categoriesIntro}</p>
          </div>
          <div className={styles.catGrid}>
            {DOS_GAME_CATEGORIES.map((category) => {
              const count = DOS_GAMES_BY_CATEGORY[category.id] ?? 0;
              return (
                <Link className={styles.cat} key={category.id} to="/dos-games/">
                  <div className={styles.catTop}>
                    <span className={styles.catCode}>{category.code}</span>
                    <span className={styles.catCount}>{count.toLocaleString('en-US')}</span>
                  </div>
                  <h3 className={styles.catName}>
                    {chinese ? category.labelZh : category.label}
                  </h3>
                  <p className={styles.catDesc}>
                    {chinese ? category.blurbZh : category.blurb}
                  </p>
                  <div className={styles.catBarTrack} aria-hidden="true">
                    <div
                      className={styles.catBar}
                      style={{width: `${Math.max(2, Math.round((count / maxCount) * 100))}%`}}
                    />
                  </div>
                  <span className={styles.catOpen}>OPEN {category.code} →</span>
                </Link>
              );
            })}
          </div>
        </section>

        <AdSlot name="home" />

        {/* ── §2 SIGNAL PATH ───────────────────────────────── */}
        <section className={styles.section}>
          <p className={styles.sectionNum}>§2 · SIGNAL PATH</p>
          <h2 className={styles.sectionTitle}>{copy.home.stepsTitle}</h2>
          <ol className={styles.steps}>
            {copy.home.steps.map((step, index) => (
              <li className={styles.step} key={step.mark}>
                <div className={styles.stepHead}>
                  <span className={styles.stepNum}>{String(index + 1).padStart(2, '0')}</span>
                  <span className={styles.stepRule} aria-hidden="true" />
                  <span className={styles.stepIn}>{STEP_TAGS[index] ?? ''}</span>
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepBody}>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── NOTICE ───────────────────────────────────────── */}
        <section className={styles.sectionTight}>
          <aside className={styles.notice}>
            <div className={styles.noticeTab}>
              <span className={styles.noticeKicker}>NOTICE</span>
              <span className={styles.noticeTitle}>{copy.common.noticeTitle}</span>
            </div>
            <p className={styles.noticeText}>{copy.common.noticeText}</p>
          </aside>

          <p className={styles.universe}>
            {copy.home.universeBefore}{' '}
            <a href="https://whereq.github.io">{copy.home.universeLink}</a>
            {copy.home.universeAfter}
          </p>
        </section>
      </main>
    </Layout>
  );
}

/** The machine tag on each signal-path step — in: a zip, out: play. */
const STEP_TAGS = ['IN: .ZIP', 'SHA-256 ✓', 'OUT: PLAY'];
