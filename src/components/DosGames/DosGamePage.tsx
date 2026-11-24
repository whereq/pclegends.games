import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {AtlasEntry} from '../../data/atlas-types';
import AtlasBlocks from '../Atlas/AtlasBlocks';
import GiscusComments from '../GiscusComments';
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
    label: 'WhereQ-DOSBox — the DOS emulator these games run on',
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
export default function DosGamePage({entry}: {entry: AtlasEntry}): React.JSX.Element {
  const notice =
    entry.notice ??
    {
      title: 'About this download',
      text: 'The archive on this page is published for study, communication and preservation only. It is the work of its authors and publishers, who hold the rights in it; publishing it here claims none of those rights and waives none of them. If you believe this download breaks a licence, a copyright or any other right, tell us and we will take it down.',
    };

  const seeAlso = (entry.related ?? [])
    .map((id) => EXTERNAL_ENTRIES[id])
    .filter((item): item is {label: string; href: string} => Boolean(item));

  return (
    <Layout
      title={entry.name}
      description={`${entry.name} — a DOS game in the PC Legends archive: the download, the setup in WhereQ-DOSBox, and what is known about how to play it.`}>
      <main className={styles.page}>
      <header className={styles.gameHeader}>
        <span className={styles.gameMark} style={{borderColor: entry.accent}}>
          <img src={entry.logo ?? `/img/dos-games/${entry.id}.svg`} alt="" />
        </span>
        <div className={styles.gameHeaderMain}>
          <p className={styles.gameRole}>{entry.role}</p>
          <h1 className={styles.gameName}>{entry.name}</h1>
          <p className={styles.gameTagline}>{entry.tagline}</p>
          <div className={styles.gameActions}>
            <a
              className={`${styles.btn} ${styles.btnPrimary}`}
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer">
              Download the bundle
            </a>
            <Link className={styles.btn} to="/dos-games/">
              The whole catalogue
            </Link>
            <Link className={styles.btn} to="/played/">
              Played through
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
        <p className={styles.infoboxTitle}>{entry.name} at a glance</p>
        <div className={styles.infoboxBody}>
          {(entry.facts ?? []).map((fact) => (
            <div className={styles.infoboxRow} key={fact.label}>
              <div className={styles.infoboxTerm}>{fact.label}</div>
              <div className={styles.infoboxDesc}>{fact.value}</div>
            </div>
          ))}
        </div>
      </div>

      {entry.sections.map((section) => (
        <section className={styles.section} key={section.title}>
          <h2 className={styles.sectionTitle}>{section.title}</h2>
          <AtlasBlocks blocks={section.blocks} />
        </section>
      ))}

      {seeAlso.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>See also</h2>
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
