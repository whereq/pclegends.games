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
import styles from './index.module.css';

/**
 * The front door of PC Legends.
 *
 * The catalogue is the site; this page says what it is, how much is in it,
 * and where the ten categories sit — so a visitor who arrives from a search
 * engine sees a site with a shape rather than a single list.
 */
export default function Home(): React.JSX.Element {
  const games = DOS_GAMES_COUNT;
  const bytes = DOS_GAMES_BYTES;

  return (
    <Layout
      title="The DOS games archive"
      description={`${games} DOS games, each with a page of its own: the facts read out of the bundle, the download, and the setup it needs in WhereQ-DOSBox. Sorted into ${DOS_GAME_CATEGORIES.length} categories, with comments on every page.`}>
      <main className={styles.page}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>The DOS games archive</p>
          <h1 className={styles.title}>Every game, with the facts read out of the bundle</h1>
          <p className={styles.lead}>
            PC Legends holds {games.toLocaleString('en-US')} DOS games. Each one
            has a page: the file list, the dates, the entry point and the
            checksum, read out of the bundle itself — then the download, and
            the setup that bundle&rsquo;s own shape implies. Nothing here is
            written from memory.
          </p>
          <div className={styles.actions}>
            <Link className={`${styles.btn} ${styles.btnPrimary}`} to="/dos-games/">
              Open the catalogue
            </Link>
            <Link className={styles.btn} to="/played/">
              Played through
            </Link>
          </div>

          <dl className={styles.stats}>
            <div className={styles.stat}>
              <dt>Games</dt>
              <dd>{games.toLocaleString('en-US')}</dd>
            </div>
            <div className={styles.stat}>
              <dt>Archive</dt>
              <dd>
                {(bytes / 1e9).toFixed(1)}
                <span className={styles.statMeta}>GB</span>
              </dd>
            </div>
            <div className={styles.stat}>
              <dt>Categories</dt>
              <dd>{DOS_GAME_CATEGORIES.length}</dd>
            </div>
          </dl>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>The categories</h2>
          <p className={styles.para}>
            The category of a game comes from the manifest of the project the
            bundles were mirrored from — its own primary classification, not a
            guess. Where the same project publishes a description that names
            another genre, the game is listed under that one too: the manifest
            decides the first category, a description may add a second, and
            never takes one away.
          </p>
          <div className={styles.grid}>
            {DOS_GAME_CATEGORIES.map((category) => (
              <article className={styles.card} key={category.id}>
                <span
                  className={styles.cardRule}
                  style={{background: category.accent}}
                  aria-hidden="true"
                />
                <h3 className={styles.cardTitle}>
                  {category.label}
                  <span className={styles.cardCount}>
                    {(DOS_GAMES_BY_CATEGORY[category.id] ?? 0).toLocaleString('en-US')}
                  </span>
                </h3>
                <p className={styles.cardBlurb}>{category.blurb}</p>
                <Link className={styles.cardLink} to="/dos-games/">
                  {DOS_GAME_CATEGORY_BY_ID[category.id]?.label ?? category.label}
                  <span aria-hidden="true"> →</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>How a page is put together</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <p className={styles.stepMark}>01</p>
              <h3 className={styles.stepTitle}>Read from the bundle</h3>
              <p className={styles.para}>
                The file list, the file dates, the strings inside the entry
                point and the SHA-256 of the archive. The facts are the
                bundle&rsquo;s, not a description of it.
              </p>
            </div>
            <div className={styles.step}>
              <p className={styles.stepMark}>02</p>
              <h3 className={styles.stepTitle}>Download the original</h3>
              <p className={styles.para}>
                The link on a page goes to the archive the page was generated
                from. The file the reader downloads is the file the page
                describes, and the checksum on the page is the archive&rsquo;s
                own.
              </p>
            </div>
            <div className={styles.step}>
              <p className={styles.stepMark}>03</p>
              <h3 className={styles.stepTitle}>Set it up in WhereQ-DOSBox</h3>
              <p className={styles.para}>
                The entry point is named, and what to press is written down. A
                setup that has not been played through says so plainly — and
                the comment thread is where to say what worked.
              </p>
            </div>
          </div>
        </section>

        <aside className={styles.notice}>
          <p className={styles.noticeTitle}>About these downloads</p>
          <p className={styles.noticeText}>
            The archives linked from this site are published for study,
            communication and preservation only. They are the work of their
            authors and publishers, who hold the rights in them; publishing
            one here claims none of those rights and waives none of them. If
            you believe a download here breaks a licence, a copyright or any
            other right, tell us and we will take it down.
          </p>
        </aside>

        <section className={styles.section}>
          <p className={styles.para}>
            PC Legends is part of the WhereQ Universe. The blog, the WhereQ
            Atlas and the rest of the documentation live at{' '}
            <a href="https://whereq.github.io">whereq.github.io</a>.
          </p>
        </section>
      </main>
    </Layout>
  );
}
