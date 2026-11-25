import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

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
          { to: '/guide/reading-a-page', label: 'Guide', position: 'left' },
          { to: '/about', label: 'About', position: 'left' },
          { to: '/privacy', label: 'Privacy', position: 'left' },
          {
            type: 'localeDropdown',
            position: 'right',
            className: 'locale-dropdown',
          },
          {
            href: 'https://github.com/whereq/pclegends.games',
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
