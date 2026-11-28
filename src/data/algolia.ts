/**
 * Algolia DocSearch — the hosted search that replaced the offline index.
 *
 * The offline local-search plugin built one search index per locale, ~28 MB
 * (English) and ~33 MB (Chinese), because it indexes all 1,898 games twice.
 * That is over the 25 MB per-file limit Cloudflare Pages (and most static
 * hosts) enforce, and it shipped to every visitor who opened search. Algolia
 * keeps the index on its own servers and crawls the deployed site to build it;
 * the site itself ships only the three small values below.
 *
 * Fill these from the Algolia dashboard once the Crawler has run:
 *   - `appId`    — Application → Overview (or API keys)
 *   - `apiKey`   — the **Search-Only** (public) API key. Never the Admin key:
 *                  it is embedded in the page and must be read-only.
 *   - `indexName`— the index the Crawler writes to.
 *
 * Until all three are set, `ALGOLIA_ENABLED` is false and the site ships with
 * no search box at all — everything else is unaffected.
 */
export const ALGOLIA = {
  appId: '',
  apiKey: '',
  indexName: '',
};

/** True once real Algolia credentials are in place. */
export const ALGOLIA_ENABLED = Boolean(
  ALGOLIA.appId && ALGOLIA.apiKey && ALGOLIA.indexName,
);
