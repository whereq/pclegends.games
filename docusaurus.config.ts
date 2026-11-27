import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {ADSENSE_ENABLED, ADSENSE_HEAD_TAG, ADSENSE_META_TAG} from './src/data/adsense';

/**
 * PC Legends — the DOS games archive, on its own domain.
 *
 * This site is games only. The blog and the WhereQ Atlas stay on
 * whereq.github.io; the 1 898 game pages live here, with the comment
 * threads and the advertising.
 *
 * The domain is served by GitHub Pages. The `static/CNAME` file in this
 * repo carries the custom domain into the build, so a release never
 * depends on a setting in the Pages UI — a UI-only CNAME is destroyed by
 * the next deploy, which is exactly what the docs hub's release script
 * does to the Pages repo.
 */
async function createConfig(): Promise<Config> {
  return {
    title: 'PC Legends',
    tagline: 'The DOS games archive — every game, with the facts read out of the bundle',
    favicon: 'img/favicon-32x32.png',

    // The canonical origin. Every canonical tag, the sitemap and the feed
    // URLs are built from this — it must be the custom domain, not the
    // github.io fallback.
    url: 'https://pclegends.games',
    baseUrl: '/',

    // The fonts the terminal redesign is built on: IBM Plex Sans (body),
    // IBM Plex Mono (labels and codes), IBM Plex Sans Condensed (headings)
    // and VT323 (the stat numbers, the logo mark and the CRT readout). They
    // are server-rendered so the page paints in them without a flash.
    //
    // Google's AdSense loader is in the served HTML of every page too, so the
    // reviewer finds the ad code. Consent is Google's own message — see
    // src/data/adsense.ts. With no publisher ID there is no script at all.
    // The meta tag is the account marker AdSense asks for; the script is the
    // loader. All of these are server-rendered, in the page as it is served.
    headTags: [
      {
        tagName: 'link',
        attributes: {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
      },
      {
        tagName: 'link',
        attributes: {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossOrigin: 'anonymous',
        },
      },
      {
        tagName: 'link',
        attributes: {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Sans+Condensed:wght@600;700&family=VT323&display=swap',
        },
      },
      ...(ADSENSE_ENABLED ? [ADSENSE_META_TAG, ADSENSE_HEAD_TAG] : []),
    ],

    organizationName: 'whereq',
    projectName: 'pclegends.games',

    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',

    markdown: {
      format: 'detect',
      hooks: {
        onBrokenMarkdownImages: 'ignore',
      },
    },

    // Two languages. The archive is Chinese — the bundles are filed under
    // their Chinese titles — but the games themselves are the Western ones
    // most readers are looking for, so the English locale shows the
    // original English title of each game with the Chinese name under it,
    // and the Chinese locale shows the Chinese name with the English one
    // under it.
    i18n: {
      defaultLocale: 'en',
      locales: ['en', 'zh-CN'],
      localeConfigs: {
        en: {label: 'English', direction: 'ltr', htmlLang: 'en'},
        'zh-CN': {label: '简体中文', direction: 'ltr', htmlLang: 'zh-CN'},
      },
    },

    presets: [
      [
        'classic',
        {
          // No blog here — that lives on the docs hub.
          //
          // The docs plugin holds the site's small guide — two pages that
          // explain how a game page is put together and where the bundles
          // come from. It also has to be on: the search bar reaches for the
          // docs plugin's context on every page, so without it the whole
          // site fails to render.
          docs: {
            routeBasePath: 'guide',
            sidebarPath: false,
          },
          blog: false,
          pages: {},
          theme: {
            customCss: './src/css/custom.css',
          },
        } satisfies Preset.Options,
      ],
    ],

    plugins: [
      [
        '@easyops-cn/docusaurus-search-local',
        {
          hashed: true,
          // The index is one index for the whole site, built for both the
          // English words and the Chinese ones. `zh` is the search plugin's
          // code for Chinese; the Docusaurus locale is `zh-CN`.
          language: ['en', 'zh'],
          highlightSearchTermsOnTargetPage: true,
          explicitSearchResultPath: true,
          indexBlog: false,
          indexDocs: false,
          indexPages: true,
          searchBarPosition: 'right',
        },
      ],
    ],

    themeConfig: {
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      image: 'img/pc-legends-card.png',
      metadata: [
        {
          name: 'keywords',
          content: 'dos games, dos archive, retro games, ms-dos, emulator, game download',
        },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      navbar: {
        title: 'PC Legends',
        logo: {
          alt: 'WhereQ Logo',
          src: 'img/whereq-logo.png',
          srcDark: 'img/whereq-logo.png',
        },
        items: [
          { to: '/dos-games', label: 'Catalogue', position: 'left' },
          { to: '/played', label: 'Played through', position: 'left' },
          { to: '/resources', label: 'Resources', position: 'left' },
          { to: '/guide/reading-a-page', label: 'Guide', position: 'left' },
          { to: '/about', label: 'About', position: 'left' },
          { to: '/privacy', label: 'Privacy', position: 'left' },
          {
            // The language switch: two buttons, EN and 中, with the one
            // being read lit. A dropdown with two entries in it costs a
            // click to say what a pair of buttons says at a glance.
            type: 'custom-localeSwitch',
            position: 'right',
            className: 'locale-switch',
          },
          {
            href: 'https://github.com/whereq/whereq-dosbox',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
        hideOnScroll: false,
        style: 'dark',
      },
      footer: {
        style: 'dark',
        // No link columns: the navbar already carries the catalogue, the
        // played-through shelf, the guide, About and Privacy, and a footer
        // that repeats them is twice the height for nothing. The docs hub's
        // footer is a single line, and this one is the same.
        links: [],
        copyright:
          'Copyright © 2026 WhereQ Inc. · <a href="/privacy">Privacy Policy</a>',
      },
      prism: {
        theme: prismThemes.vsDark,
        darkTheme: prismThemes.vsDark,
        additionalLanguages: [
          'bash', 'python', 'typescript', 'javascript', 'json', 'yaml',
          'batch', 'powershell',
        ],
        defaultLanguage: 'text',
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 4,
      },
    } satisfies Preset.ThemeConfig,
  };
}

export default createConfig();
