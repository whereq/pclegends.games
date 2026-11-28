import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {useCopy} from '../hooks/useCopy';
import styles from './about.module.css';

/**
 * How to reach a person about the site — a channel per section, plus the
 * takedown notice the rest of the site carries. The words live in
 * `src/data/site-copy.ts`, both languages; the page borrows the About
 * stylesheet so the two read as one document.
 */
export default function Contact(): React.JSX.Element {
  const copy = useCopy();

  return (
    <Layout title={copy.contact.title} description={copy.contact.description}>
      <main className={styles.page}>
        <header className={styles.hero}>
          <p className={styles.docline}>
            <span className={styles.docTag}>DOC PCL-005</span>
            <span>{copy.contact.eyebrow}</span>
          </p>
          <h1 className={styles.title}>{copy.contact.heading}</h1>
          <p className={styles.lead}>{copy.contact.lead}</p>
        </header>

        {copy.contact.channels.map((channel, index) => {
          const external = channel.href.startsWith('http');
          const link = external ? (
            <a href={channel.href} target="_blank" rel="noopener noreferrer">
              {channel.value} ↗
            </a>
          ) : channel.href.startsWith('mailto:') ? (
            <a href={channel.href}>{channel.value}</a>
          ) : (
            <Link to={channel.href}>{channel.value}</Link>
          );
          return (
            <section className={styles.section} key={channel.label}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionNum}>{index + 1}.0</span>
                {channel.label}
              </h2>
              <p className={styles.para}>{link}</p>
              <p className={styles.para}>{channel.note}</p>
            </section>
          );
        })}

        <aside className={styles.notice}>
          <div className={styles.noticeTab}>
            <span className={styles.noticeKicker}>NOTICE</span>
            <span className={styles.noticeTitle}>{copy.common.noticeTitle}</span>
          </div>
          <p className={styles.noticeText}>{copy.common.noticeText}</p>
        </aside>
      </main>
    </Layout>
  );
}
