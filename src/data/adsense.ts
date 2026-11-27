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
 * Both are done. The publisher ID is in place, and `static/ads.txt` carries
 * the line the console hands out, so the seller of the inventory can be
 * verified at the root of the domain.
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
export const ADSENSE_CLIENT = 'ca-pub-8075492281741045';

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

/**
 * The account meta tag.
 *
 * AdSense asks the publisher to put this in the head of every page, and it
 * reads it to confirm the site belongs to the account being reviewed. It
 * carries no behaviour — it is a marker, not a loader.
 */
export const ADSENSE_META_TAG = {
  tagName: 'meta',
  attributes: {
    name: 'google-adsense-account',
    content: ADSENSE_CLIENT,
  },
};

/**
 * The deliberate ad placements the site controls.
 *
 * Auto ads place themselves wherever Google decides; these are the manual
 * units the site owns — one per spot it has chosen. Each value is the
 * `data-ad-slot` number of an ad unit created in the AdSense console under
 * **Ads → By ad unit**. Copy the long number out of the unit's snippet and
 * paste it here; nothing else has to change.
 *
 * An empty value means "no unit in this spot" — `<AdSlot>` renders nothing,
 * so a spot stays clean until its slot id is filled in. This is the same
 * "empty means off" gate the publisher id uses above, so the whole feature
 * ships inert and lights up one spot at a time.
 */
export const ADSENSE_SLOTS = {
  /** In-article, above the comment thread on a game page. (in-article-ad-01) */
  gameInArticle: '2295721659',
  /** Below the catalogue listing, above its comment thread. (display-responsive-01) */
  catalogue: '4730313303',
  /** Between the sections of the front page. (display-responsive-02) */
  home: '3209027273',
} as const;

export type AdSlotName = keyof typeof ADSENSE_SLOTS;

/**
 * Whether a named spot has a real unit behind it.
 *
 * True only when ads are on at all (a publisher id is set) and the spot
 * carries a numeric slot id. `<AdSlot>` asks this before it renders anything.
 */
export function hasAdSlot(name: AdSlotName): boolean {
  return ADSENSE_ENABLED && /^\d+$/.test(ADSENSE_SLOTS[name]);
}
