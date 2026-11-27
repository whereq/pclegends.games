import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {
  ADSENSE_CLIENT,
  ADSENSE_SLOTS,
  AdSlotName,
  hasAdSlot,
} from '../../data/adsense';
import {useIsChinese} from '../../hooks/useCopy';
import styles from './styles.module.css';

/**
 * One deliberate ad unit, in a spot the site has chosen.
 *
 * This is the manual half of the hybrid: Google's auto ads place themselves,
 * and these units sit where the site decides — above the comments on a game
 * page, under the catalogue listing, between the front page's sections.
 *
 * The unit is inert until its spot carries a real slot id: with no id
 * `hasAdSlot` is false and the component renders nothing, so the whole feature
 * ships without a single empty box and lights up one spot at a time as the
 * ids are filled in (`src/data/adsense.ts`).
 *
 * The unit itself renders in the browser only. The `<ins>` is rewritten by
 * Google's script the moment it is seen, which would fight React's hydration
 * if the element were in the server HTML — and an ad unit, unlike the loader
 * the reviewer reads, does not need to be. Consent is still Google's: the CMP
 * gates whether the pushed unit actually fills, so there is no consent check
 * to write here.
 */
export default function AdSlot({
  name,
  format = 'auto',
}: {
  name: AdSlotName;
  /**
   * `auto` is a responsive display unit; `in-article` is the fluid unit that
   * reads as part of the text flow.
   */
  format?: 'auto' | 'in-article';
}): React.JSX.Element | null {
  if (!hasAdSlot(name)) {
    return null;
  }
  return (
    <BrowserOnly>
      {() => <AdUnit slot={ADSENSE_SLOTS[name]} format={format} />}
    </BrowserOnly>
  );
}

/** The unit, mounted client-side, pushed to AdSense exactly once. */
function AdUnit({
  slot,
  format,
}: {
  slot: string;
  format: 'auto' | 'in-article';
}): React.JSX.Element {
  const chinese = useIsChinese();
  const pushed = React.useRef(false);

  React.useEffect(() => {
    if (pushed.current) {
      return;
    }
    pushed.current = true;
    try {
      // The loader turns `window.adsbygoogle` into a queue it drains as it
      // arrives, so pushing before the script is ready is safe — the `|| []`
      // creates the queue if the script has not landed yet.
      ((window as unknown as {adsbygoogle?: unknown[]}).adsbygoogle =
        (window as unknown as {adsbygoogle?: unknown[]}).adsbygoogle || []).push(
        {},
      );
    } catch {
      // A blocked loader (an ad blocker, or no consent) leaves the push to
      // throw; the empty slot simply stays empty.
    }
  }, []);

  const insStyle: React.CSSProperties =
    format === 'in-article'
      ? {display: 'block', textAlign: 'center'}
      : {display: 'block'};

  return (
    <aside className={styles.wrap} aria-hidden="true">
      <p className={styles.label}>{chinese ? '广告' : 'Advertisement'}</p>
      <ins
        className="adsbygoogle"
        style={insStyle}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        {...(format === 'in-article'
          ? {'data-ad-layout': 'in-article', 'data-ad-format': 'fluid'}
          : {'data-ad-format': 'auto', 'data-full-width-responsive': 'true'})}
      />
    </aside>
  );
}
