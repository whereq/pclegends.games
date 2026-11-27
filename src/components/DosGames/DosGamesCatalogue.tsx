import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {DOS_GAMES_INDEX, DosGameIndexEntry} from '../../data/dos-games-index';
import {
  DOS_GAME_CATEGORIES,
  DOS_GAME_CATEGORY_BY_ID,
} from '../../data/dos-games-categories';
import GiscusComments from '../GiscusComments';
import AdSlot from '../AdSlot';
import {useCopy, useIsChinese} from '../../hooks/useCopy';
import {gameNames} from './game-names';
import styles from './catalogue.module.css';

type ViewMode = 'cards' | 'rows';

/**
 * The catalogue of every DOS game — the terminal redesign.
 *
 * A terminal toolbar (`C:\> FIND`), the category chips, and a view toggle:
 * **Rows** is a dense table, **Cards** is a grid of mini-CRT cards. The games
 * are grouped by category; a game in two categories appears under both.
 */
export default function DosGamesCatalogue(): React.JSX.Element {
  const copy = useCopy();
  const chinese = useIsChinese();
  const [query, setQuery] = React.useState('');
  const [active, setActive] = React.useState<string[]>([]);
  const [view, setView] = React.useState<ViewMode>('cards');

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

  const visible = React.useMemo(() => {
    if (active.length === 0) {
      return searched;
    }
    return searched.filter((game) => game.types.some((type) => active.includes(type)));
  }, [searched, active]);

  const groups = React.useMemo(() => {
    return DOS_GAME_CATEGORIES.map((category) => ({
      category,
      games: visible.filter((game) => game.types.includes(category.id)),
    })).filter((group) => group.games.length > 0);
  }, [visible]);

  const counts = React.useMemo(() => {
    const tally = new Map<string, number>();
    for (const game of searched) {
      for (const type of game.types) {
        tally.set(type, (tally.get(type) ?? 0) + 1);
      }
    }
    return tally;
  }, [searched]);

  const toggle = (id: string) => {
    setActive((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const filtered = active.length > 0 || query.trim() !== '';

  return (
    <Layout title={copy.catalogue.title} description={copy.catalogue.description}>
      <main className={styles.page}>
        {/* ── HEADER ───────────────────────────────────────── */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroMain}>
              <p className={styles.docline}>
                <span className={styles.docTag}>DOC PCL-002</span>
                <span>{copy.catalogue.eyebrow}</span>
              </p>
              <h1 className={styles.heroTitle}>{copy.catalogue.heading}</h1>
              <p className={styles.heroLead}>
                {copy.catalogue.lead(DOS_GAMES_INDEX.length.toLocaleString('en-US'))}{' '}
                <Link to="/played/">{copy.played.group}</Link>
              </p>
            </div>
          </div>
        </section>

        {/* ── TOOLBAR (sticky) ─────────────────────────────── */}
        <section className={styles.toolbar}>
          <div className={styles.toolbarInner}>
            <div className={styles.toolbarTop}>
              <label className={styles.find}>
                <span className={styles.findPrompt}>C:\&gt;</span>
                <span className={styles.findCmd}>FIND</span>
                <input
                  className={styles.findInput}
                  type="search"
                  placeholder={copy.common.searchPlaceholder}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label={copy.common.searchLabel}
                />
              </label>

              <p className={styles.tally} aria-live="polite">
                <strong>{visible.length}</strong>
                <span className={styles.tallyMeta}>
                  {visible.length === 1 ? copy.catalogue.tallyOne : copy.catalogue.tallyMany}
                </span>
              </p>

              <div className={styles.viewToggle} role="group" aria-label="View">
                <button
                  type="button"
                  className={`${styles.viewBtn} ${view === 'rows' ? styles.viewBtnOn : ''}`}
                  onClick={() => setView('rows')}
                  aria-pressed={view === 'rows'}>
                  ≡ {chinese ? '列表' : 'Rows'}
                </button>
                <button
                  type="button"
                  className={`${styles.viewBtn} ${view === 'cards' ? styles.viewBtnOn : ''}`}
                  onClick={() => setView('cards')}
                  aria-pressed={view === 'cards'}>
                  ▦ {chinese ? '卡片' : 'Cards'}
                </button>
              </div>
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
        </section>

        {/* ── LIST ─────────────────────────────────────────── */}
        <section className={styles.listing}>
          {groups.length === 0 && <p className={styles.empty}>{copy.catalogue.empty}</p>}

          {groups.map((group) => (
            <section className={styles.group} key={group.category.id}>
              <div className={styles.groupHead}>
                <h2 className={styles.groupTitle}>
                  <span className={styles.groupCode}>{group.category.code}</span>
                  {chinese ? group.category.labelZh : group.category.label}
                  <span className={styles.groupCount}>{group.games.length}</span>
                </h2>
                <p className={styles.groupBlurb}>
                  {chinese ? group.category.blurbZh : group.category.blurb}
                </p>
              </div>

              {view === 'rows' ? (
                <div className={styles.rows} role="table" aria-label={group.category.label}>
                  <div className={styles.rowHead} role="row">
                    <span role="columnheader">NO.</span>
                    <span role="columnheader">{chinese ? '标题' : 'TITLE'}</span>
                    <span role="columnheader">{chinese ? '分类' : 'CATEGORIES'}</span>
                    <span role="columnheader" className={styles.rowRight}>BUNDLE</span>
                  </div>
                  {group.games.map((game, index) => (
                    <GameRow game={game} index={index} chinese={chinese} copy={copy} key={game.id} />
                  ))}
                </div>
              ) : (
                <div className={styles.grid}>
                  {group.games.map((game) => (
                    <GameCard game={game} chinese={chinese} copy={copy} key={game.id} />
                  ))}
                </div>
              )}
            </section>
          ))}
        </section>

        <AdSlot name="catalogue" />

        <section className={styles.commentsWrap}>
          <aside className={styles.notice}>
            <div className={styles.noticeTab}>
              <span className={styles.noticeKicker}>NOTICE</span>
              <span className={styles.noticeTitle}>{copy.common.noticeTitle}</span>
            </div>
            <p className={styles.noticeText}>{copy.common.noticeText}</p>
          </aside>

          <h2 className={styles.commentsTitle}>{copy.common.comments}</h2>
          <p className={styles.commentsText}>{copy.common.commentsText}</p>
          <GiscusComments />
        </section>
      </main>
    </Layout>
  );
}

/** The mini-CRT thumbnail: the game's logo if one was found, else its first
 *  character in VT323 — the capital-letter mark from the redesign. */
function Thumb({game, chinese}: {game: DosGameIndexEntry; chinese: boolean}) {
  const names = gameNames(game.name, game.nameEn, chinese);
  const initial = [...names.primary][0] ?? '?';
  return (
    <span className={styles.thumb} aria-hidden="true">
      {game.image ? (
        <img className={styles.thumbImg} src={game.image} alt="" loading="lazy" decoding="async" />
      ) : (
        <span className={styles.thumbChar}>{initial}</span>
      )}
    </span>
  );
}

type CardProps = {
  game: DosGameIndexEntry;
  chinese: boolean;
  copy: ReturnType<typeof useCopy>;
};

function Tags({game, chinese}: {game: DosGameIndexEntry; chinese: boolean}) {
  return (
    <span className={styles.tags}>
      {game.types.map((type, index) => {
        const category = DOS_GAME_CATEGORY_BY_ID[type];
        const label = chinese ? category?.labelZh ?? type : category?.label ?? type;
        return (
          <span className={styles.tag} key={type}>
            {index === 0 ? label : `+ ${label}`}
          </span>
        );
      })}
    </span>
  );
}

function sizeKb(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/** One game, as a card. */
function GameCard({game, chinese, copy}: CardProps) {
  const names = gameNames(game.name, game.nameEn, chinese);
  return (
    <article className={styles.card}>
      <Link className={styles.cardLink} to={game.page}>
        <Thumb game={game} chinese={chinese} />
        <span className={styles.cardHead}>
          <Tags game={game} chinese={chinese} />
          <span className={styles.cardName}>{names.primary}</span>
          {names.secondary && <span className={styles.cardAlt}>{names.secondary}</span>}
        </span>
      </Link>
      <div className={styles.cardFoot}>
        <Link className={styles.cardRead} to={game.page}>
          {copy.common.readThePage}
        </Link>
        <a
          className={styles.cardDownload}
          href={game.url}
          target="_blank"
          rel="noopener noreferrer">
          ↓ {copy.common.download}
        </a>
      </div>
    </article>
  );
}

/** One game, as a table row. */
function GameRow({
  game,
  index,
  chinese,
  copy,
}: CardProps & {index: number}) {
  const names = gameNames(game.name, game.nameEn, chinese);
  return (
    <div className={styles.row} role="row">
      <span className={styles.rowNo} role="cell">{String(index + 1).padStart(3, '0')}</span>
      <Link className={styles.rowTitle} role="cell" to={game.page}>
        <Thumb game={game} chinese={chinese} />
        <span className={styles.rowNames}>
          <span className={styles.rowName}>{names.primary}</span>
          {names.secondary && <span className={styles.rowAlt}>{names.secondary}</span>}
        </span>
      </Link>
      <span role="cell"><Tags game={game} chinese={chinese} /></span>
      <span className={styles.rowBundle} role="cell">
        <span className={styles.rowSize}>{sizeKb(game.size)}</span>
        <a
          className={styles.rowDownload}
          href={game.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={copy.common.download}>
          ↓
        </a>
      </span>
    </div>
  );
}
