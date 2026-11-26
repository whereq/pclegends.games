/**
 * Google AdSense — where the site's advertising is configured.
 *
 * The site uses AdSense **auto ads**: one script on every page, and AdSense
 * decides where the ads land. Turning ads on is a two-step job:
 *
 *   1. Get `pclegends.games` approved in the AdSense console.
 *   2. Paste the publisher ID below. It looks like
 *      `ca-pub-1234567890123456`.
 *
 * Nothing else has to change. Until the ID is here the script is never
 * added to a page, so the site stays ad-free and no Google cookie is ever
 * set.
 *
 * **Consent is Google's job.** The loader is part of every page's HTML, so
 * that AdSense can see the ad code when it reviews the site — a site whose
 * pages carry no ad code is turned away for exactly that. What the visitor
 * meets is Google's own consent message (the European regulations message in
 * the AdSense console): in the EEA, the UK and Switzerland the message asks
 * first, and ads are served only to the visitors who agree. We keep no copy
 * of the choice; Google holds it, and the visitor can change it through the
 * control Google shows.
 *
 * The console verifies the **root** domain, and only the root domain: a
 * subdomain of an approved domain inherits the verdict and is never reviewed
 * on its own. `pclegends.games` is a root domain, so it can be approved on
 * its own — which is why the games live here rather than behind
 * `whereq.github.io`.
 */

/** The publisher ID from the AdSense console. Empty means "no ads". */
export const ADSENSE_CLIENT = '';

/** True once a real publisher ID is in place. */
export const ADSENSE_ENABLED = /^ca-pub-\d+$/.test(ADSENSE_CLIENT);

/** Google's loader. The publisher ID rides along in the query string. */
export const ADSENSE_SCRIPT_SRC =
  'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' +
  encodeURIComponent(ADSENSE_CLIENT);

/**
 * The tag that goes into the head of every page.
 *
 * The server renders it, so the ad code is in the HTML as it is served —
 * which is what the AdSense reviewer reads. A script added by hand in the
 * browser after a click would leave the served page without any ad code, and
 * the review would fail on a technicality.
 */
export const ADSENSE_HEAD_TAG = {
  tagName: 'script',
  attributes: {
    src: ADSENSE_SCRIPT_SRC,
    async: 'async',
    crossOrigin: 'anonymous',
  },
};
