import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {AtlasEntry} from '../../data/atlas-types';
import AtlasBlocks from '../Atlas/AtlasBlocks';
import GiscusComments from '../GiscusComments';
import {useCopy, useIsChinese} from '../../hooks/useCopy';
import {gameNames} from './game-names';
import styles from './dos-games.module.css';

/**
 * The pages that name something outside this site.
 *
 * The Atlas ids the pages carried over still point at the docs hub, which is
 * where the Universe lives. A page here has no sidebar to hang a "See also"
 * on, so the link is spelled out in the body.
 */
const EXTERNAL_ENTRIES: Record<string, {label: string; href: string}> = {
  'whereq-dosbox': {
    label: 'WhereQ-DOSBox — the emulator these games run on',
    href: 'https://whereq.github.io/atlas/universe/whereq-dosbox',
  },
};

/**
 * One game in the DOS games archive.
 *
 * The same shape for every game, whether its page was generated from the
 * bundle or written by hand: header, the licence notice, the facts, the
 * body, and the comment thread.
 *
 * There is no sidebar. A tree of 1 898 games on every page would make every
 * page eight times heavier than it needs to be; the catalogue at /dos-games/
 * is where the list lives.
 */
export default function DosGamePage({
  entry,
  entryZh,
}: {
  entry: AtlasEntry;
  /** The same page in Chinese, for the hand-written games that have one. */
  entryZh?: AtlasEntry;
}): React.JSX.Element {
  const copy = useCopy();
  const chinese = useIsChinese();

  /**
   * The page the reader gets. The Chinese locale reads the Chinese entry
   * where there is one; where there is not, it reads the English entry's
   * Chinese fields — the generated pages carry both in the same module.
   */
  const page = React.useMemo(() => {
    const base = chinese && entryZh ? entryZh : entry;
    if (!chinese) {
      return base;
    }
    return {
      ...base,
      role: base.roleZh ?? base.role,
      tagline: base.taglineZh ?? base.tagline,
      summary: base.summaryZh ?? base.summary,
      sections: base.sectionsZh ?? base.sections,
      facts: base.factsZh ?? base.facts ?? [],
    };
  }, [entry, entryZh, chinese]);
  const names = gameNames(page.name, page.nameEn, chinese);

  /**
   * The name on the page is the one the reader is looking for: the original
   * English title in the English locale, the name the bundle is filed under
   * in the Chinese one. The other name sits under it.
   */
  const name = names.primary;
  const altName = names.secondary;

  const notice =
    page.notice ??
    (chinese ? entry.noticeZh : undefined) ??
    entry.notice ?? {
      title: copy.game.noticeTitle,
      text: copy.game.noticeText,
    };

  const sections = page.sections;
  const facts = page.facts ?? [];

  const seeAlso = (page.related ?? [])
    .map((id) => EXTERNAL_ENTRIES[id])
    .filter((item): item is {label: string; href: string} => Boolean(item));

  return (
    <Layout
      title={name}
      description={`${name} — a DOS game in the PC Legends archive: the download, the setup in WhereQ-DOSBox, and what is known about how to play it.`}>
      <main className={styles.page}>
      <header className={styles.gameHeader}>
        <span className={styles.gameMark} style={{borderColor: page.accent}}>
          <img src={page.logo ?? `/img/dos-games/${page.id}.svg`} alt="" />
        </span>
        <div className={styles.gameHeaderMain}>
          <p className={styles.gameRole}>{page.role}</p>
          <h1 className={styles.gameName}>{name}</h1>
          {altName && <p className={styles.gameAltName}>{altName}</p>}
          <p className={styles.gameTagline}>{page.tagline}</p>
          {page.nameEn && (
            <p className={styles.gameOrigin}>
              {page.nameEnSource === 'published'
                ? copy.common.englishTitlePublished
                : entry.nameEnSource === 'bundle'
                  ? copy.common.englishTitleBundle
                  : copy.common.englishTitleKnown}
            </p>
          )}
          <div className={styles.gameActions}>
            <a
              className={`${styles.btn} ${styles.btnPrimary}`}
              href={page.url}
              target="_blank"
              rel="noopener noreferrer">
              {copy.game.download}
            </a>
            <Link className={styles.btn} to="/dos-games/">
              {copy.game.wholeCatalogue}
            </Link>
            <Link className={styles.btn} to="/played/">
              {copy.game.playedThrough}
            </Link>
          </div>
        </div>
      </header>

      {notice && (
        <aside className={styles.notice}>
          <p className={styles.noticeTitle}>{notice.title}</p>
          <p className={styles.noticeText}>{notice.text}</p>
        </aside>
      )}

      <div className={styles.infobox}>
        <p className={styles.infoboxTitle}>{copy.game.atAGlance(name)}</p>
        <div className={styles.infoboxBody}>
          {page.nameEn && (
            <div className={styles.infoboxRow}>
              <div className={styles.infoboxTerm}>{copy.game.originalTitle}</div>
              <div className={styles.infoboxDesc}>{page.nameEn}</div>
            </div>
          )}
          {facts.map((fact) => (
            <div className={styles.infoboxRow} key={fact.label}>
              <div className={styles.infoboxTerm}>{fact.label}</div>
              <div className={styles.infoboxDesc}>{fact.value}</div>
            </div>
          ))}
        </div>
      </div>

      {sections.map((section) => (
        <section className={styles.section} key={section.title}>
          <h2 className={styles.sectionTitle}>{section.title}</h2>
          <AtlasBlocks blocks={section.blocks} />
        </section>
      ))}

      {seeAlso.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{copy.game.seeAlso}</h2>
          <ul className={styles.linkList}>
            {seeAlso.map((item) => (
              <li key={item.href}>
                <a
                  className={styles.btn}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={styles.comments}>
        <h2 className={styles.sectionTitle}>Comments</h2>
        <p className={styles.para}>
          Got this one running where the page could not? Say what you did in
          the comments — the next reader will thank you.
        </p>
        <GiscusComments />
      </section>
      </main>
    </Layout>
  );
}
