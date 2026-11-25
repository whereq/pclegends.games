import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {PLAYED_GAMES, PLAYED_GROUPS, PLAYED_INTRO} from '../../data/games-played';
import {
  PLAYED_GAMES_ZH,
  PLAYED_GROUPS_ZH,
  PLAYED_INTRO_ZH,
} from '../../data/games-played-zh';
import {DOS_GAMES_COUNT} from '../../data/dos-games-stats';
import {useCopy, useIsChinese} from '../../hooks/useCopy';
import AtlasBlocks from '../Atlas/AtlasBlocks';
import GiscusComments from '../GiscusComments';
import {gameNames} from './game-names';
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
  const copy = useCopy();
  const chinese = useIsChinese();
  const intro = chinese ? PLAYED_INTRO_ZH : PLAYED_INTRO;
  const groups = chinese ? PLAYED_GROUPS_ZH : PLAYED_GROUPS;
  const games = chinese ? PLAYED_GAMES_ZH : PLAYED_GAMES;

  const gamesByGroup = groups.map((group) => ({
    group,
    games: games.filter((game) => game.group === group.id),
  })).filter((entry) => entry.games.length > 0);

  return (
    <Layout
      title={copy.played.title}
      description={copy.played.description}>
      <main className={styles.page}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>{copy.played.eyebrow}</p>
          <h1 className={styles.title}>{copy.played.heading}</h1>
          <p className={styles.lead}>{copy.played.lead}</p>
          <p className={styles.para}>
            {copy.played.intro(PLAYED_GAMES.length)}{' '}
            <Link to="/dos-games/">{copy.catalogue.title}</Link>
          </p>
        </header>

        {intro.map((section) => (
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
                      <span className={styles.cardName}>
                        {gameNames(game.name, game.nameEn, chinese).primary}
                      </span>
                      {gameNames(game.name, game.nameEn, chinese).secondary && (
                        <span className={styles.cardAltName}>
                          {gameNames(game.name, game.nameEn, chinese).secondary}
                        </span>
                      )}
                      <span className={styles.cardTypes}>
                        <span className={styles.cardType}>{game.status}</span>
                      </span>
                    </span>
                  </Link>
                  <p className={styles.cardBlurb}>{game.tagline}</p>
                  <div className={styles.cardActions}>
                    <Link className={styles.cardRead} to={`/dos-games/${game.id}/`}>
                      {copy.common.readThePage}
                    </Link>
                    <a
                      className={styles.cardDownload}
                      href={game.url}
                      target="_blank"
                      rel="noopener noreferrer">
                      {copy.common.download}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        <section className={styles.comments}>
          <h2 className={styles.sectionTitle}>{copy.common.comments}</h2>
          <p className={styles.para}>{copy.played.commentsText}</p>
          <GiscusComments />
        </section>
      </main>
    </Layout>
  );
}
