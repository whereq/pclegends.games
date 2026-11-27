import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {useCopy} from '../hooks/useCopy';

/**
 * 404 — the terminal redesign. A DOS "Bad command or file name" screen
 * rather than a blank apology, with the way back to the catalogue.
 *
 * Swizzled over the theme's own NotFound so the page a reader lands on when a
 * URL is wrong still looks like the rest of the site.
 */
export default function NotFound(): React.JSX.Element {
  const copy = useCopy();
  const mono = 'var(--pcl-font-mono)';
  return (
    <Layout title="404 · Bad command">
      <main
        style={{
          maxWidth: 820,
          margin: '0 auto',
          padding: '64px 32px 96px',
          minHeight: '50vh',
        }}>
        <p
          style={{
            margin: '0 0 24px',
            fontFamily: mono,
            fontSize: 12,
            letterSpacing: '0.18em',
            color: 'var(--pcl-amber)',
            textTransform: 'uppercase',
          }}>
          <span style={{border: '1px solid var(--pcl-amber)', borderRadius: 2, padding: '3px 8px'}}>
            ERR 404
          </span>{' '}
          {copy.notFound.eyebrow}
        </p>

        <div
          style={{
            border: '1px solid var(--pcl-border)',
            borderRadius: 8,
            background: 'var(--pcl-screen)',
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(255,181,71,0.05) 0px, rgba(255,181,71,0.05) 1px, transparent 1px, transparent 3px)',
            padding: '28px 26px',
            fontFamily: 'var(--pcl-font-crt)',
            fontSize: 22,
            lineHeight: 1.4,
            color: 'var(--pcl-amber)',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)',
          }}>
          <div style={{color: '#A3AAA2'}}>C:\PCLEGENDS&gt; {copy.notFound.command}</div>
          <div style={{color: '#ECE6D6'}}>{copy.notFound.badCommand}</div>
          <div style={{marginTop: 10}}>
            C:\PCLEGENDS&gt; <span style={{background: 'var(--pcl-amber)'}}>&nbsp;</span>
          </div>
        </div>

        <h1
          style={{
            margin: '32px 0 12px',
            fontFamily: 'var(--pcl-font-cond)',
            fontWeight: 700,
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            lineHeight: 1.05,
            color: 'var(--pcl-ink)',
          }}>
          {copy.notFound.heading}
        </h1>
        <p style={{margin: '0 0 28px', fontSize: 16, lineHeight: 1.65, color: 'var(--pcl-body)', maxWidth: 620}}>
          {copy.notFound.body}
        </p>

        <div style={{display: 'flex', flexWrap: 'wrap', gap: 12}}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: 46,
              padding: '0 20px',
              background: 'var(--pcl-amber)',
              color: 'var(--pcl-btn-ink)',
              fontWeight: 600,
              borderRadius: 2,
              textDecoration: 'none',
            }}>
            {copy.notFound.ctaHome}
          </Link>
          <Link
            to="/dos-games/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: 46,
              padding: '0 20px',
              border: '1px solid var(--pcl-border)',
              color: 'var(--pcl-ink)',
              fontWeight: 600,
              borderRadius: 2,
              textDecoration: 'none',
            }}>
            {copy.notFound.ctaCatalogue}
          </Link>
        </div>
      </main>
    </Layout>
  );
}
