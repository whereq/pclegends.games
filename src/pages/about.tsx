import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {DOS_GAMES_BYTES, DOS_GAMES_COUNT} from '../data/dos-games-stats';
import styles from '../components/DosGames/dos-games.module.css';

/**
 * What this site is, where the games come from, and what the pages are
 * allowed to say.
 *
 * The licence position is the part that matters most, and it is stated
 * plainly rather than in a footnote: the archives are other people's work.
 */
export default function About(): React.JSX.Element {
  return (
    <Layout
      title="About"
      description="What PC Legends is, where the DOS game archives come from, how a page is generated from its bundle, and what the site says about the licence of the downloads.">
      <main className={styles.page}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>About</p>
          <h1 className={styles.title}>An archive of DOS games, and the facts about each one</h1>
          <p className={styles.lead}>
            PC Legends holds {DOS_GAMES_COUNT.toLocaleString('en-US')} DOS games —
            {(DOS_GAMES_BYTES / 1e9).toFixed(1)} GB of them — and gives every one
            a page of its own. The page is generated from the bundle it
            describes: the file list, the file dates, the strings inside the
            entry point, and the checksum of the archive.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What this site is</h2>
          <p className={styles.para}>
            A catalogue of old PC games with the documentation that goes with
            them. There is a game on every page, a link to the bundle, the
            name of the file the bundle wants to be started from, and — where
            anybody has actually done it — the setup and the controls.
          </p>
          <p className={styles.para}>
            The site is a set of static pages. There is no account, no login
            and no database. Every game page carries a comment thread, so a
            reader who gets further than the page says can say how.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Where the games come from</h2>
          <p className={styles.para}>
            The bundles are mirrored from the archive of Chinese DOS games
            published by the{' '}
            <a href="https://github.com/rwv/chinese-dos-games">chinese-dos-games</a>{' '}
            project. The download button on a page links straight at the
            archive the page was generated from — the same file, byte for
            byte — and the SHA-256 printed on the page is the archive&rsquo;s
            own checksum, so a copy can be checked rather than trusted.
          </p>
          <p className={styles.para}>
            The category of a game is read from that project&rsquo;s manifest,
            not guessed. Its own type code is the game&rsquo;s primary
            category; where the project also publishes a description naming a
            further genre, the game is listed under that one too. The manifest
            decides the first category and a description may add a second —
            never take one away.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>How a page is generated</h2>
          <p className={styles.para}>
            A script reads every bundle in the archive and writes a module per
            game: the facts, the download, the setup the bundle&rsquo;s own
            shape implies, and the sections that say where each fact came
            from. The script is in the{' '}
            <a href="https://github.com/whereq/pclegends.games">site repository</a>,
            and regenerating it produces the same pages it produced last time.
          </p>
          <p className={styles.para}>
            A page that has not been played through says so, in plain words,
            under &ldquo;Set it up in WhereQ-DOSBox&rdquo;. The handful that have
            been played through are written by hand and say what worked
            instead — the launcher, the key, and the screens behind it. They
            are on the <Link to="/played/">played-through shelf</Link>.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>The downloads, and who owns them</h2>
          <p className={styles.para}>
            The archives are published for study, communication and
            preservation only. They are the work of their authors and
            publishers, who hold the rights in them. Publishing a link here
            claims none of those rights and waives none of them.
          </p>
          <p className={styles.para}>
            If you believe a download here breaks a licence, a copyright or
            any other right, write to{' '}
            <a href="mailto:googol.zhang@gmail.com">googol.zhang@gmail.com</a>{' '}
            and it will be taken down. The same goes for a bundle that is
            missing something — say so in the comments and it will be
            replaced.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>WhereQ-DOSBox</h2>
          <p className={styles.para}>
            The games run on{' '}
            <a href="https://whereq.github.io/atlas/universe/whereq-dosbox">
              WhereQ-DOSBox
            </a>
            , the DOS emulator built natively for Android in the WhereQ
            Universe. Import a bundle, press Play, and the app starts the
            entry point named on the page.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>The rest of WhereQ</h2>
          <p className={styles.para}>
            PC Legends is the games shelf of the WhereQ family. The blog, the
            WhereQ Atlas and the rest of the documentation live at{' '}
            <a href="https://whereq.github.io">whereq.github.io</a>, and the
            games that used to sit there now live here.
          </p>
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
      </main>
    </Layout>
  );
}
