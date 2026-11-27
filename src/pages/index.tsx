import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {
  DOS_GAME_CATEGORIES,
  DOS_GAME_CATEGORY_BY_ID,
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
 * The front door of PC Legends.
 *
 * The catalogue is the site; this page says what it is, how much is in it,
 * and where the ten categories sit — so a visitor who arrives from a search
 * engine sees a site with a shape rather than a single list.
 */
export default function Home(): React.JSX.Element {
  const copy = useCopy();
  const chinese = useIsChinese();
  const games = DOS_GAMES_COUNT;
  const bytes = DOS_GAMES_BYTES;

  return (
    <Layout
      title={copy.home.title}
      description={copy.home.description}>
      <main className={styles.page}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>{copy.home.eyebrow}</p>
          <h1 className={styles.title}>{copy.home.heading}</h1>
          <p className={styles.lead}>
            {copy.home.lead(games.toLocaleString('en-US'))}
          </p>
          <div className={styles.actions}>
            <Link className={`${styles.btn} ${styles.btnPrimary}`} to="/dos-games/">
              {copy.home.ctaCatalogue}
            </Link>
            <Link className={styles.btn} to="/played/">
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
                <span className={styles.statMeta}>GB</span>
              </dd>
            </div>
            <div className={styles.stat}>
              <dt>{copy.common.categories}</dt>
              <dd>{DOS_GAME_CATEGORIES.length}</dd>
            </div>
          </dl>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{copy.home.categoriesTitle}</h2>
          <p className={styles.para}>{copy.home.categoriesIntro}</p>
          <div className={styles.grid}>
            {DOS_GAME_CATEGORIES.map((category) => (
              <article className={styles.card} key={category.id}>
                <span
                  className={styles.cardRule}
                  style={{background: category.accent}}
                  aria-hidden="true"
                />
                <h3 className={styles.cardTitle}>
                  {chinese ? category.labelZh : category.label}
                  <span className={styles.cardCount}>
                    {(DOS_GAMES_BY_CATEGORY[category.id] ?? 0).toLocaleString('en-US')}
                  </span>
                </h3>
                <p className={styles.cardBlurb}>
                  {chinese ? category.blurbZh : category.blurb}
                </p>
                <Link className={styles.cardLink} to="/dos-games/">
                  {chinese
                    ? DOS_GAME_CATEGORY_BY_ID[category.id]?.labelZh ?? category.labelZh
                    : DOS_GAME_CATEGORY_BY_ID[category.id]?.label ?? category.label}
                  <span aria-hidden="true"> →</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <AdSlot name="home" />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{copy.home.stepsTitle}</h2>
          <div className={styles.steps}>
            {copy.home.steps.map((step) => (
              <div className={styles.step} key={step.mark}>
                <p className={styles.stepMark}>{step.mark}</p>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.para}>{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className={styles.notice}>
          <p className={styles.noticeTitle}>{copy.common.noticeTitle}</p>
          <p className={styles.noticeText}>{copy.common.noticeText}</p>
        </aside>

        <section className={styles.section}>
          <p className={styles.para}>
            {copy.home.universeBefore}{' '}
            <a href="https://whereq.github.io">{copy.home.universeLink}</a>
            {copy.home.universeAfter}
          </p>
        </section>
      </main>
    </Layout>
  );
}
