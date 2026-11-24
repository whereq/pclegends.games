import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {PLAYED_GAMES, PLAYED_GROUPS, PLAYED_INTRO} from '../../data/games-played';
import {DOS_GAMES_COUNT} from '../../data/dos-games-stats';
import AtlasBlocks from '../Atlas/AtlasBlocks';
import GiscusComments from '../GiscusComments';
import styles from './dos-games.module.css';

/**
 * The games that have been played through on an emulator.
 *
 * Every other game in the archive has a page generated from its bundle, and
 * that page says plainly that nobody has played it yet. These five were
 * played: the setup on them was worked out on an emulator running
 * WhereQ-DOSBox, and what worked is written down.
 *
 * They sit in the catalogue like any other game — the difference is the
 * card mark, which is drawn rather than a letter on a plate.
 */
export default function PlayedGames(): React.JSX.Element {
  const gamesByGroup = PLAYED_GROUPS.map((group) => ({
    group,
    games: PLAYED_GAMES.filter((game) => game.group === group.id),
  })).filter((entry) => entry.games.length > 0);

  return (
    <Layout
      title="Played through"
      description="The DOS games that have been played through on an emulator running WhereQ-DOSBox: the exact setup each one needs, the key that starts it, and what is on the screen behind it.">
      <main className={styles.page}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>The played-through shelf</p>
          <h1 className={styles.title}>The games that have been played through</h1>
          <p className={styles.lead}>
            {PLAYED_GAMES.length} of the archive&rsquo;s {DOS_GAMES_COUNT.toLocaleString('en-US')}
            {' '}games have been run on an emulator, and what the setup
            actually took is written down here — the launcher, the key, and
            the screens behind it. Every other game has a page too, in the{' '}
            <Link to="/dos-games/">catalogue</Link>; those pages say plainly
            that nobody has played them yet.
          </p>
        </header>

        {PLAYED_INTRO.map((section) => (
          <section className={styles.section} key={section.title}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            <AtlasBlocks blocks={section.blocks} />
          </section>
        ))}

        {gamesByGroup.map(({group, games}) => (
          <section className={styles.section} key={group.id}>
            <h2 className={styles.sectionTitle}>{group.title}</h2>
            <p className={styles.para}>{group.blurb}</p>
            <div className={styles.grid}>
              {games.map((game) => (
                <article className={styles.card} key={game.id}>
                  <Link className={styles.cardLink} to={`/dos-games/${game.id}/`}>
                    <span className={styles.cardMark}>
                      <img
                        src={game.logo ?? `/img/dos-games/${game.id}.svg`}
                        alt=""
                        width={44}
                        height={44}
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    <span className={styles.cardHead}>
                      <span className={styles.cardName}>{game.name}</span>
                      <span className={styles.cardTypes}>
                        <span className={styles.cardType}>{game.status}</span>
                      </span>
                    </span>
                  </Link>
                  <p className={styles.cardBlurb}>{game.tagline}</p>
                  <div className={styles.cardActions}>
                    <Link className={styles.cardRead} to={`/dos-games/${game.id}/`}>
                      Read the page
                    </Link>
                    <a
                      className={styles.cardDownload}
                      href={game.url}
                      target="_blank"
                      rel="noopener noreferrer">
                      Download
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        <section className={styles.comments}>
          <h2 className={styles.sectionTitle}>Comments</h2>
          <p className={styles.para}>
            Played one of these on your own machine and got further than the
            page says? Say what you did — the next reader will thank you.
          </p>
          <GiscusComments />
        </section>
      </main>
    </Layout>
  );
}
