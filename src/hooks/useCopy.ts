import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {SITE_COPY, SiteCopy} from '../data/site-copy';

/**
 * The copy for the language the page is being rendered in.
 *
 * Docusaurus renders each locale separately, so `currentLocale` is the
 * language of the page in hand — not a runtime choice the reader makes.
 * A locale with no copy of its own falls back to English, so a half-written
 * translation never leaves a page blank.
 */
export function useCopy(): SiteCopy {
  const {i18n} = useDocusaurusContext();
  return SITE_COPY[i18n.currentLocale] ?? SITE_COPY.en;
}

/** Whether the page is being rendered in Chinese. */
export function useIsChinese(): boolean {
  const {i18n} = useDocusaurusContext();
  return i18n.currentLocale === 'zh-CN';
}

/** The locale the page is being rendered in. */
export function useLocale(): string {
  const {i18n} = useDocusaurusContext();
  return i18n.currentLocale;
}
