import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {AtlasEntry} from '../../data/atlas-types';
import AtlasBlocks from '../Atlas/AtlasBlocks';
import GiscusComments from '../GiscusComments';
import AdSlot from '../AdSlot';
import {useCopy, useIsChinese} from '../../hooks/useCopy';
import {gameNames} from './game-names';
import styles from './game.module.css';

/**
 * The pages that name something outside this site. The Atlas ids the pages
 * carried over still point at the docs hub, where the Universe lives.
 */
const EXTERNAL_ENTRIES: Record<string, {label: string; href: string}> = {
  'whereq-dosbox': {
    label: 'WhereQ-DOSBox — the emulator these games run on',
    href: 'https://whereq.github.io/atlas/universe/whereq-dosbox',
  },
};

/** The entry point hides in the facts as a value like `LR.COM`. */
function entryPoint(facts: {label: string; value: string}[]): string | null {
  const hit = facts.find((f) => /\.(exe|com|bat)$/i.test(f.value.trim()));
  return hit ? hit.value.trim() : null;
}

/**
 * One game in the DOS games archive — the terminal redesign.
 *
 * A breadcrumb, a header with the role and category as machine badges, a CRT
 * figure that spells out the route in, a spec sheet read from the bundle, the
 * numbered sections, and the comment thread. The same shape whether the page
 * was generated or written by hand, and in either language.
 */
export default function DosGamePage({
  entry,
  entryZh,
}: {
  entry: AtlasEntry;
  entryZh?: AtlasEntry;
}): React.JSX.Element {
  const copy = useCopy();
  const chinese = useIsChinese();

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
  const name = names.primary;
  const altName = names.secondary;

  const notice =
    page.notice ??
    (chinese ? entry.noticeZh : undefined) ??
    entry.notice ?? {title: copy.game.noticeTitle, text: copy.game.noticeText};

  const sections = page.sections;
  const facts = page.facts ?? [];
  const entry0 = entryPoint(facts);
  const wiki = chinese ? (page.wikiZh ?? page.wiki) : page.wiki;

  const seeAlso = (page.related ?? [])
    .map((id) => EXTERNAL_ENTRIES[id])
    .filter((item): item is {label: string; href: string} => Boolean(item));

  return (
    <Layout
      title={name}
      description={`${name} — a DOS game in the PC Legends archive: the download, the setup in WhereQ-DOSBox, and what is known about how to play it.`}>
      <main className={styles.page}>
        {/* ── Breadcrumb ───────────────────────────────────── */}
        <nav className={styles.crumb} aria-label="Breadcrumb">
          <span className={styles.crumbPrompt}>C:\PCLEGENDS</span>
          <span className={styles.crumbSep}>\</span>
          <Link to="/dos-games/">CATALOGUE</Link>
          <span className={styles.crumbSep}>\</span>
          <span className={styles.crumbHere}>{page.id.toUpperCase()}</span>
        </nav>

        {/* ── Header ───────────────────────────────────────── */}
        <header className={styles.header}>
          <div className={styles.headMain}>
            <div className={styles.badges}>
              <span className={styles.badge}>{page.role}</span>
              {wiki && (
                <a className={styles.badgeLink} href={wiki.url} target="_blank" rel="noopener noreferrer">
                  {copy.game.wikipedia} ↗
                </a>
              )}
            </div>
            <h1 className={styles.name}>{name}</h1>
            {altName && <p className={styles.altName}>{altName}</p>}
            <p className={styles.tagline}>{page.tagline}</p>
            {page.nameEn && (
              <p className={styles.origin}>
                {page.nameEnSource === 'published'
                  ? copy.common.englishTitlePublished
                  : entry.nameEnSource === 'bundle'
                    ? copy.common.englishTitleBundle
                    : copy.common.englishTitleKnown}
              </p>
            )}
            <div className={styles.actions}>
              <a
                className={`${styles.btn} ${styles.btnPrimary}`}
                href={page.url}
                target="_blank"
                rel="noopener noreferrer">
                ↓ {copy.game.download}
              </a>
              <Link className={`${styles.btn} ${styles.btnGhost}`} to="/dos-games/">
                {copy.game.wholeCatalogue}
              </Link>
              <Link className={`${styles.btn} ${styles.btnGhost}`} to="/played/">
                {copy.game.playedThrough}
              </Link>
            </div>
          </div>

          {/* CRT — the route in, as the bundle's shape implies it. */}
          <figure className={styles.crtFigure}>
            <div className={styles.crtBezel}>
              <div className={styles.crtScreen} aria-hidden="true">
                <div className={styles.crtDim}>WhereQ-DOSBox</div>
                <div className={styles.crtDim}>──────────────────────</div>
                <div>Z:\&gt; IMPORT {page.id}.zip</div>
                {entry0 && <div className={styles.crtInk}>C:\&gt; {entry0}</div>}
                <div className={styles.crtInk}>C:\&gt; <span className={styles.crtCursor}>&nbsp;</span></div>
                <div className={styles.crtPlate}>
                  <span>PCL-CRT 14"</span>
                  <span className={styles.crtPower}><span className={styles.crtLed} aria-hidden="true" />READY</span>
                </div>
              </div>
            </div>
            <figcaption className={styles.crtCaption}>
              {copy.game.crtCaption}
            </figcaption>
          </figure>
        </header>

        {notice && (
          <aside className={styles.notice}>
            <div className={styles.noticeTab}>
              <span className={styles.noticeKicker}>NOTICE</span>
              <span className={styles.noticeTitle}>{notice.title}</span>
            </div>
            <p className={styles.noticeText}>{notice.text}</p>
          </aside>
        )}

        {/* ── Spec sheet ───────────────────────────────────── */}
        <section className={styles.spec}>
          <p className={styles.specHead}>{copy.game.atAGlance(name).toUpperCase()}</p>
          <dl className={styles.specGrid}>
            {page.nameEn && (
              <div className={styles.specRow}>
                <dt>{copy.game.originalTitle}</dt>
                <dd>{page.nameEn}</dd>
              </div>
            )}
            {facts.map((fact) => (
              <div className={styles.specRow} key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Sections (numbered) ──────────────────────────── */}
        <div className={styles.body}>
          {sections.map((section, index) => (
            <section className={styles.section} key={section.title} id={`s${index + 1}`}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNum}>{index + 1}.0</span>
                {section.title}
              </h2>
              <div className={styles.sectionBody}>
                <AtlasBlocks blocks={section.blocks} />
              </div>
            </section>
          ))}

          {seeAlso.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNum}>+</span>
                {copy.game.seeAlso}
              </h2>
              <ul className={styles.linkList}>
                {seeAlso.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} target="_blank" rel="noopener noreferrer">
                      {item.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <AdSlot name="gameInArticle" format="in-article" />

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionNum}>★</span>
              {copy.common.comments}
            </h2>
            <p className={styles.commentsText}>{copy.game.commentsPrompt}</p>
            <GiscusComments />
          </section>
        </div>
      </main>
    </Layout>
  );
}
