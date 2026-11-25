import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useAlternatePageUtils} from '@docusaurus/theme-common/internal';
import {useHistorySelector} from '@docusaurus/theme-common';
import styles from './styles.module.css';

/**
 * The language switch in the navbar.
 *
 * The site has two languages, so a dropdown with two entries in it is a
 * menu that costs a click to say something the reader can already see.
 * The switch is two buttons instead: **EN** and **中**, with the one being
 * read lit and the other dimmed. Each button carries the language, so the
 * pair reads as "English or Chinese" and not as "English, chosen".
 *
 * The button leads to the same page in the other language — the catalogue
 * stays the catalogue, the game stays the game — which is what the
 * dropdown did too.
 */

/** The mark each language is shown by. */
const MARKS: Record<string, string> = {
  en: 'EN',
  'zh-CN': '中',
};

type Props = {
  /** The mobile drawer asks for the entries laid out one under another. */
  mobile?: boolean;
  /** A query string to carry over to the other language. */
  queryString?: string;
};

export default function LocaleSwitchNavbarItem({
  mobile,
  queryString,
}: Props): React.JSX.Element {
  const {
    siteConfig,
    i18n: {currentLocale, locales, localeConfigs},
  } = useDocusaurusContext();
  const alternatePageUtils = useAlternatePageUtils();
  const search = useHistorySelector((history) => history.location.search);
  const hash = useHistorySelector((history) => history.location.hash);

  /**
   * The address of the same page in another language.
   *
   * Both languages are served from the same domain, so the address is a
   * path rather than a full URL — and the query and the anchor of the page
   * being read travel with it, so the reader lands where they were.
   *
   * `createUrl` already knows the path of every locale, so it is asked for
   * the address of the page being read in the other language.
   */
  const urlFor = (locale: string): string => {
    const localeConfig = localeConfigs[locale];
    if (!localeConfig) {
      return '#';
    }
    const sameDomain = localeConfig.url === siteConfig.url;
    // The `pathname://` protocol tells the theme's link that this is not
    // an ordinary internal link: the other language is another build of
    // the site, and the reader has to be sent to it whole. The link opens
    // in this tab rather than a new one.
    const base = sameDomain
      ? `pathname://${alternatePageUtils.createUrl({
          locale,
          fullyQualified: false,
        })}`
      : alternatePageUtils.createUrl({locale, fullyQualified: true});
    const query = [search, queryString].filter(Boolean).join('');
    return `${base}${query}${hash}`;
  };

  /**
   * The link must not add the base URL of its own.
   *
   * A link that starts with `/` is normally given the base URL of the site
   * it is served from — which, in the Chinese build, is `/zh-CN/`. The
   * address of the English page is `/dos-games/`, and it would be rewritten
   * to `/zh-CN/dos-games/`, which is the Chinese page again. The address is
   * already complete, so the theme is told to leave it alone.
   */
  const linkProps = {autoAddBaseUrl: false, target: '_self'} as const;

  if (mobile) {
    return (
      <ul className={styles.mobileList}>
        {locales.map((locale) => (
          <li key={locale}>
            <Link
              className={
                locale === currentLocale
                  ? styles.mobileItemActive
                  : styles.mobileItem
              }
              to={urlFor(locale)}
              {...linkProps}
              aria-current={locale === currentLocale ? 'true' : undefined}>
              {localeConfigs[locale]?.label ?? locale}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={styles.switch} role="group" aria-label="Language">
      {locales.map((locale) => {
        const active = locale === currentLocale;
        return (
          <Link
            key={locale}
            className={active ? styles.itemActive : styles.item}
            to={urlFor(locale)}
            {...linkProps}
            lang={localeConfigs[locale]?.htmlLang}
            aria-current={active ? 'true' : undefined}>
            {MARKS[locale] ?? locale}
          </Link>
        );
      })}
    </div>
  );
}
