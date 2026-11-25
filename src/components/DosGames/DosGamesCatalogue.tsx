import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {Scrollbar, scrollbarCss} from '@whereq/react';
import {DOS_GAMES_INDEX, DosGameIndexEntry} from '../../data/dos-games-index';
import {
  DOS_GAME_CATEGORIES,
  DOS_GAME_CATEGORY_BY_ID,
  DosGameCategory,
} from '../../data/dos-games-categories';
import GiscusComments from '../GiscusComments';
import {useCopy, useIsChinese} from '../../hooks/useCopy';
import {gameNames} from './game-names';
import styles from './dos-games.module.css';

/**
 * The catalogue of every DOS game in the archive.
 *
 * This is the whole archive on one page. A list of 1 898 games cannot live
 * in a sidebar — every game page here carries no navigation tree at all, so
 * the catalogue is a panel of cards over a search box instead, and a game's
 * own page stands alone.
 *
 * The games are sorted into categories, and a game can be in more than one
 * of them: the archive files it under one, and the description the same
 * project publishes may name another as well. A game that is in two
 * categories is shown under both.
 *
 * The listing is a panel of its own, with the scrollbar from
 * `@whereq/react`. The search box and the category filters sit at the top
 * of it and stay there while it scrolls, so a reader always knows which
 * filters are applied to what is on screen.
 */
export default function DosGamesCatalogue(): React.JSX.Element {
  const copy = useCopy();
  const chinese = useIsChinese();
  const [query, setQuery] = React.useState('');
  const [active, setActive] = React.useState<string[]>([]);

  /** The games that match the search box, whatever the categories are. */
  const searched = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return DOS_GAMES_INDEX;
    }
    return DOS_GAMES_INDEX.filter(
      (game) =>
        game.name.toLowerCase().includes(needle) ||
        (game.nameEn ?? '').toLowerCase().includes(needle) ||
        game.id.toLowerCase().includes(needle) ||
        game.entry.toLowerCase().includes(needle),
    );
  }, [query]);

  /** The games left after the categories are applied. */
  const visible = React.useMemo(() => {
    if (active.length === 0) {
      return searched;
    }
    return searched.filter((game) => game.types.some((type) => active.includes(type)));
  }, [searched, active]);

  /**
   * The groups on screen: one per category that still has games in it.
   *
   * A game in two categories is in two groups, which is the point — the
   * counts below add up to more than the number of games.
   */
  const groups = React.useMemo(() => {
    return DOS_GAME_CATEGORIES.map((category) => ({
      category,
      games: visible.filter((game) => game.types.includes(category.id)),
    })).filter((group) => group.games.length > 0);
  }, [visible]);

  /** How many games each category holds under the current search. */
  const counts = React.useMemo(() => {
    const tally = new Map<string, number>();
    for (const game of searched) {
      for (const type of game.types) {
        tally.set(type, (tally.get(type) ?? 0) + 1);
      }
    }
    return tally;
  }, [searched]);

  const totalBytes = DOS_GAMES_INDEX.reduce((sum, game) => sum + game.size, 0);

  const toggle = (id: string) => {
    setActive((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const filtered = active.length > 0 || query.trim() !== '';

  return (
    <Layout
      title={copy.catalogue.title}
      description={copy.catalogue.description}>
      {/*
       * The `@whereq/react` scrollbar stylesheet, rendered here so it is in
       * the server HTML — no flash of the browser's default scrollbar before
       * hydration. The id is the library's own, so the component finds this
       * tag and does not inject a second copy.
       */}
      <style id="wq-scrollbar-styles">{scrollbarCss}</style>
      <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>{copy.catalogue.eyebrow}</p>
        <h1 className={styles.title}>{copy.catalogue.heading}</h1>
        <p className={styles.lead}>
          {copy.catalogue.lead(DOS_GAMES_INDEX.length.toLocaleString('en-US'))}{' '}
          <Link to="/played/">{copy.played.group}</Link>
        </p>

        <dl className={styles.stats}>
          <div className={styles.stat}>
            <dt>{copy.common.games}</dt>
            <dd>{DOS_GAMES_INDEX.length}</dd>
          </div>
          <div className={styles.stat}>
            <dt>{copy.common.archive}</dt>
            <dd>
              {(totalBytes / 1e9).toFixed(1)}
              <span className={styles.statMeta}>GB</span>
            </dd>
          </div>
          <div className={styles.stat}>
            <dt>{copy.common.categories}</dt>
            <dd>{DOS_GAME_CATEGORIES.length}</dd>
          </div>
        </dl>
      </header>

      <section className={styles.catalogue}>
        {/*
          * The filters. They sit above the listing and stick to the top of
          * the viewport, so a reader always knows which filters are applied
          * to what is on screen — whether they are scrolling the page or the
          * list inside it.
        */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarTop}>
            <input
              className={styles.search}
              type="search"
              placeholder={copy.common.searchPlaceholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label={copy.common.searchLabel}
            />
            <p className={styles.tally} aria-live="polite">
              <strong>{visible.length}</strong>
              <span className={styles.tallyMeta}>
                {visible.length === 1 ? copy.catalogue.tallyOne : copy.catalogue.tallyMany}
                {active.length > 0 && copy.catalogue.tallyCategories(active.length)}
              </span>
            </p>
          </div>

          <div className={styles.chips} role="group" aria-label="Filter by category">
            <button
              className={`${styles.chip} ${active.length === 0 ? styles.chipOn : ''}`}
              type="button"
              onClick={() => setActive([])}
              aria-pressed={active.length === 0}>
              {copy.common.all}
              <span className={styles.chipCount}>{searched.length}</span>
            </button>
            {DOS_GAME_CATEGORIES.map((category) => {
              const count = counts.get(category.id) ?? 0;
              const on = active.includes(category.id);
              return (
                <button
                  className={`${styles.chip} ${on ? styles.chipOn : ''}`}
                  type="button"
                  key={category.id}
                  onClick={() => toggle(category.id)}
                  aria-pressed={on}
                  disabled={count === 0 && !on}>
                  <span
                    className={styles.chipDot}
                    style={{background: category.accent}}
                    aria-hidden="true"
                  />
                  {chinese ? category.labelZh : category.label}
                  <span className={styles.chipCount}>{count}</span>
                </button>
              );
            })}
            {filtered && (
              <button
                className={styles.clear}
                type="button"
                onClick={() => {
                  setQuery('');
                  setActive([]);
                }}>
                {copy.common.clear}
              </button>
            )}
          </div>
        </div>

        {/*
         * The listing panel. Its own scrollbar comes from `@whereq/react`,
         * the same one the Atlas rail uses.
         */}
        <Scrollbar className={styles.listing} axis="vertical">
          <div className={styles.listingInner}>
            {groups.map((group) => (
              <Group
                key={group.category.id}
                category={group.category}
                games={group.games}
                chinese={chinese}
              />
            ))}

            {groups.length === 0 && (
              <p className={styles.empty}>
                {copy.catalogue.empty}
              </p>
            )}
          </div>
        </Scrollbar>
      </section>

      <aside className={styles.notice}>
        <p className={styles.noticeTitle}>{copy.common.noticeTitle}</p>
        <p className={styles.noticeText}>{copy.common.noticeText}</p>
      </aside>

      <section className={styles.comments}>
        <h2 className={styles.sectionTitle}>{copy.common.comments}</h2>
        <p className={styles.para}>{copy.common.commentsText}</p>
        <GiscusComments />
      </section>
      </main>
    </Layout>
  );
}

/** One category and the games in it. */
function Group({
  category,
  games,
  chinese,
}: {
  category: DosGameCategory;
  games: DosGameIndexEntry[];
  chinese: boolean;
}) {
  return (
    <section className={styles.group} aria-labelledby={`group-${category.id}`}>
      <div className={styles.groupHead}>
        <span
          className={styles.groupRule}
          style={{background: category.accent}}
          aria-hidden="true"
        />
        <div className={styles.groupHeadMain}>
          <h2 className={styles.groupTitle} id={`group-${category.id}`}>
            {chinese ? category.labelZh : category.label}
            <span className={styles.groupCount}>{games.length}</span>
          </h2>
          <p className={styles.groupBlurb}>
            {chinese ? category.blurbZh : category.blurb}
          </p>
        </div>
      </div>
      <div className={styles.grid}>
        {games.map((game) => (
          <GameCard game={game} key={game.id} chinese={chinese} />
        ))}
      </div>
    </section>
  );
}

/**
 * One game.
 *
 * The card shows the game: its picture, its name in the reader's language,
 * and the categories it sits in. The facts read out of the bundle — the
 * year, the entry point, how many files it holds, how big it is — are on the
 * game's own page, where there is room for them.
 */
function GameCard({
  game,
  chinese,
}: {
  game: DosGameIndexEntry;
  chinese: boolean;
}) {
  const copy = useCopy();
  const names = gameNames(game.name, game.nameEn, chinese);
  return (
    <article className={styles.card}>
      <Link className={styles.cardLink} to={game.page}>
        <span className={styles.cardMark}>
          <img
            src={game.image ?? `/img/dos-games/${game.id}.svg`}
            alt=""
            width={44}
            height={44}
            loading="lazy"
            decoding="async"
          />
        </span>
        <span className={styles.cardHead}>
          <span className={styles.cardName}>{names.primary}</span>
          <span className={styles.cardTypes}>
            {game.types.map((type, index) => {
              const category = DOS_GAME_CATEGORY_BY_ID[type];
              const label = chinese ? category?.labelZh ?? type : category?.label ?? type;
              return (
                <span className={styles.cardType} key={type}>
                  {index === 0 ? label : `+ ${label}`}
                </span>
              );
            })}
          </span>
        </span>
      </Link>

      <div className={styles.cardActions}>
        <Link className={styles.cardRead} to={game.page}>
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
  );
}
