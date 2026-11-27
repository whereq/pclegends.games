/**
 * The site's own words, in both languages.
 *
 * The archive is a Chinese collection — the bundles are filed under their
 * Chinese titles — but the site is read by people who do not read Chinese.
 * So the site speaks two languages: the English locale shows the original
 * English title of each game, with the Chinese name underneath it, and the
 * Chinese locale shows the Chinese name, with the English one underneath.
 *
 * Everything the site says to a reader lives here, so that a page never has
 * to decide for itself which language it is in. The generated game pages
 * carry their own prose — see `scripts/generate-dos-games.py` — and pick
 * the language from the same locale.
 */

/** The copy for one language. */
export type SiteCopy = {
  /** The name of the language, for the switcher. */
  localeName: string;
  common: {
    games: string;
    archive: string;
    categories: string;
    year: string;
    entryPoint: string;
    files: string;
    size: string;
    all: string;
    clear: string;
    searchPlaceholder: string;
    searchLabel: string;
    readThePage: string;
    download: string;
    noticeTitle: string;
    noticeText: string;
    comments: string;
    commentsText: string;
    englishTitle: string;
    englishTitleKnown: string;
    englishTitleBundle: string;
    englishTitlePublished: string;
    englishTitleWiki: string;
  };
  home: {
    title: string;
    description: string;
    eyebrow: string;
    heading: string;
    lead: (games: string) => string;
    ctaCatalogue: string;
    ctaPlayed: string;
    categoriesTitle: string;
    categoriesIntro: string;
    crtCaption: string;
    stepsTitle: string;
    steps: {mark: string; title: string; body: string}[];
    universeBefore: string;
    universeLink: string;
    universeAfter: string;
  };
  catalogue: {
    title: string;
    description: string;
    eyebrow: string;
    heading: string;
    lead: (games: string) => string;
    tallyOne: string;
    tallyMany: string;
    tallyCategories: (count: number) => string;
    empty: string;
  };
  game: {
    download: string;
    wholeCatalogue: string;
    playedThrough: string;
    atAGlance: (name: string) => string;
    seeAlso: string;
    noticeTitle: string;
    noticeText: string;
    originalTitle: string;
    wikipedia: string;
    readOnWikipedia: string;
    developer: string;
    published: string;
    type: string;
    platform: string;
    entryPoint: string;
    bundle: string;
    crtCaption: string;
    commentsPrompt: string;
  };
  played: {
    title: string;
    description: string;
    eyebrow: string;
    heading: string;
    lead: string;
    intro: (count: number) => string;
    group: string;
    commentsText: string;
  };
  about: {
    title: string;
    description: string;
    eyebrow: string;
    heading: string;
    lead: (games: string, gigabytes: string) => string;
    sections: {title: string; paragraphs: string[]}[];
    compare: {
      title: string;
      intro: string;
      dosbox: {kind: string; points: string[]; apk: string; atlas: string};
      ados: {kind: string; points: string[]; badge: string; note: string};
    };
  };
  notFound: {
    eyebrow: string;
    command: string;
    badCommand: string;
    heading: string;
    body: string;
    ctaHome: string;
    ctaCatalogue: string;
  };
};

/**
 * The English copy.
 */
const en: SiteCopy = {
  localeName: 'English',
  common: {
    games: 'Games',
    archive: 'Archive',
    categories: 'Categories',
    year: 'Year',
    entryPoint: 'Entry point',
    files: 'Files',
    size: 'Size',
    all: 'All',
    clear: 'Clear',
    searchPlaceholder: 'Search by name, pinyin or entry point…',
    searchLabel: 'Search the games',
    readThePage: 'Read the page',
    download: 'Download',
    noticeTitle: 'About these downloads',
    noticeText:
      'The archives linked from this site are published for study, communication and preservation only. They are the work of their authors and publishers, who hold the rights in them; publishing one here claims none of those rights and waives none of them. If you believe a download here breaks a licence, a copyright or any other right, tell us and we will take it down.',
    comments: 'Comments',
    commentsText:
      'A download that 404s, a name that is wrong, a game that starts and then falls over — say so here. The comments on a game’s own page are where the route in belongs.',
    englishTitle: 'Original title',
    englishTitleKnown:
      'The original title of this game. The bundle itself carries only the Chinese name.',
    englishTitleBundle:
      'The original title of this game, read out of the bundle’s own strings.',
    englishTitlePublished:
      'The original title of this game, as the archive’s own index records it.',
    englishTitleWiki:
      'The original title of this game, as the CN DOS Games Wiki records it.',
  },
  home: {
    title: 'The DOS games archive',
    description:
      'Every DOS game in the archive, with the facts read out of the bundle: the download, the setup it needs in WhereQ-DOSBox, and what is known about how to play it.',
    eyebrow: 'The DOS games archive',
    heading: 'Every game, with the facts read out of the bundle',
    lead: (games) =>
      `PC Legends holds ${games} DOS games. Each one has a page: the file list, the dates, the entry point and the checksum, read out of the bundle itself — then the download, and the setup that bundle’s own shape implies. Nothing here is written from memory.`,
    ctaCatalogue: 'Open the catalogue',
    ctaPlayed: 'Played through',
    categoriesTitle: 'The categories',
    categoriesIntro:
      'The category of a game comes from the manifest of the project the bundles were mirrored from — its own primary classification, not a guess. Where the same project publishes a description that names another genre, the game is listed under that one too: the manifest decides the first category, a description may add a second, and never takes one away.',
    crtCaption: 'FIG. 1 — Every fact on a game page is read from its bundle, like this.',
    stepsTitle: 'How a page is put together',
    steps: [
      {
        mark: '01',
        title: 'Read from the bundle',
        body: 'The file list, the file dates, the strings inside the entry point and the SHA-256 of the archive. The facts are the bundle’s, not a description of it.',
      },
      {
        mark: '02',
        title: 'Download the original',
        body: 'The link on a page goes to the archive the page was generated from. The file the reader downloads is the file the page describes, and the checksum on the page is the archive’s own.',
      },
      {
        mark: '03',
        title: 'Set it up in WhereQ-DOSBox',
        body: 'The entry point is named, and what to press is written down. A setup that has not been played through says so plainly — and the comment thread is where to say what worked.',
      },
    ],
    universeBefore: 'PC Legends is part of the WhereQ Universe. The blog, the WhereQ Atlas and the rest of the documentation live at',
    universeLink: 'whereq.github.io',
    universeAfter: '.',
  },
  catalogue: {
    title: 'DOS Games',
    description:
      'Every DOS game in the archive: the facts read out of the bundle itself, the download, and the setup each one needs in WhereQ-DOSBox.',
    eyebrow: 'The DOS game archive',
    heading: 'Every DOS game in the archive',
    lead: (games) =>
      `The archive holds ${games} DOS games. Every one of them has a page here: the facts read out of the bundle itself, the download, and the setup its shape implies. The games are sorted into categories below — a game can be in more than one, and the ones that have been played through on an emulator sit on the played-through shelf with a drawn card mark.`,
    tallyOne: 'game',
    tallyMany: 'games',
    tallyCategories: (count) => ` in ${count} categor${count === 1 ? 'y' : 'ies'}`,
    empty: 'Nothing matches that. Try a shorter word, or clear the categories.',
  },
  game: {
    download: 'Download the bundle',
    wholeCatalogue: 'The whole catalogue',
    playedThrough: 'Played through',
    atAGlance: (name) => `${name} at a glance`,
    seeAlso: 'See also',
    noticeTitle: 'About this download',
    noticeText:
      'The archive on this page is published for study, communication and preservation only. It is the work of its authors and publishers, who hold the rights in it; publishing it here claims none of those rights and waives none of them. If you believe this download breaks a licence, a copyright or any other right, tell us and we will take it down.',
    originalTitle: 'Original title',
    wikipedia: 'Wikipedia',
    readOnWikipedia: 'Read more on Wikipedia',
    developer: 'Developer',
    published: 'Published',
    type: 'Type',
    platform: 'Platform',
    entryPoint: 'Entry point',
    bundle: 'Bundle',
    crtCaption: 'FIG. 1 — The route in, as the bundle’s shape implies it.',
    commentsPrompt:
      'Got this one running where the page could not? Say what you did in the comments — the next reader will thank you.',
  },
  played: {
    title: 'Played through',
    description:
      'The DOS games that have been run on an emulator, with the route in written down: which file to start, which key opens the menu, and what the screen behind it says.',
    eyebrow: 'Played through',
    heading: 'The games, and how to get into them',
    lead:
      'Most DOS games here just start: import the bundle into WhereQ-DOSBox or A-DOS and press Play. When a bundle holds more than one program, the Launch button lets you pick any command inside it and run that one — you can usually tell which from the names.',
    intro: () =>
      'The pages on this shelf write the way in out in full, for the games worth a longer look. You rarely need that much — but if a game will not start, raise it on its page and WhereQ Universe will always be here to help.',
    group: 'Played through',
    commentsText:
      'Found a cleaner way into one of these, or got a stubborn one running? Say what you did — the next reader will thank you.',
  },
  about: {
    title: 'About',
    description:
      'What PC Legends is, where the DOS game archives come from, how a page is generated from its bundle, and what the site says about the licence of the downloads.',
    eyebrow: 'About',
    heading: 'An archive of DOS games, and the facts about each one',
    lead: (games, gigabytes) =>
      `PC Legends holds ${games} DOS games — ${gigabytes} GB of them — and gives every one a page of its own. The page is generated from the bundle it describes: the file list, the file dates, the strings inside the entry point, and the checksum of the archive.`,
    sections: [
      {
        title: 'What this site is',
        paragraphs: [
          'A catalogue of old PC games with the documentation that goes with them. There is a game on every page, a link to the bundle, the name of the file the bundle wants to be started from, and — where anybody has actually done it — the setup and the controls.',
          'The site is a set of static pages. There is no account, no login and no database. Every game page carries a comment thread, so a reader who gets further than the page says can say how.',
        ],
      },
      {
        title: 'Where the games come from',
        paragraphs: [
          'The bundles are mirrored from the archive of Chinese DOS games published by the [chinese-dos-games](https://github.com/rwv/chinese-dos-games) project. The download button on a page links straight at the archive the page was generated from — the same file, byte for byte — and the SHA-256 printed on the page is the archive’s own checksum, so a copy can be checked rather than trusted.',
          'The category of a game is read from that project’s manifest, not guessed. Its own type code is the game’s primary category; where the project also publishes a description naming a further genre, the game is listed under that one too. The manifest decides the first category and a description may add a second — never take one away.',
        ],
      },
      {
        title: 'How a page is generated',
        paragraphs: [
          'A script reads every bundle in the archive and writes a module per game: the facts, the download, the setup the bundle’s own shape implies, and the sections that say where each fact came from. The script is in the [site repository](https://github.com/whereq/pclegends.games), and regenerating it produces the same pages it produced last time.',
          'A page that has not been played through says so, in plain words, under “Set it up in WhereQ-DOSBox”. The handful that have been played through are written by hand and say what worked instead — the launcher, the key, and the screens behind it. They are on the [played-through shelf](/played/).',
        ],
      },
      {
        title: 'The downloads, and who owns them',
        paragraphs: [
          'The archives are published for study, communication and preservation only. They are the work of their authors and publishers, who hold the rights in them. Publishing a link here claims none of those rights and waives none of them.',
          'If you believe a download here breaks a licence, a copyright or any other right, write to [whereq@gmail.com](mailto:whereq@gmail.com) and it will be taken down. The same goes for a bundle that is missing something — say so in the comments and it will be replaced.',
        ],
      },
      {
        title: 'WhereQ-DOSBox',
        paragraphs: [
          'The games run on [WhereQ-DOSBox](https://whereq.github.io/atlas/universe/whereq-dosbox), the DOS emulator built natively for Android in the WhereQ Universe. Import a bundle, press Play, and the app starts the entry point named on the page.',
        ],
      },
      {
        title: 'The rest of WhereQ',
        paragraphs: [
          'PC Legends is the games shelf of the WhereQ family. The blog, the WhereQ Atlas and the rest of the documentation live at [whereq.github.io](https://whereq.github.io), and the games that used to sit there now live here.',
        ],
      },
    ],
    compare: {
      title: 'Two ways to run these games',
      intro:
        'The bundles here are DOS programs; something has to run them. There are two players for that, and they are built for two kinds of person — WhereQ-DOSBox is the open-source emulator you can pull apart, and A-DOS is the finished app coming to Google Play.',
      dosbox: {
        kind: 'OPEN SOURCE · ANDROID',
        points: [
          'A native DOS emulator for Android, built in the open — the whole thing is on GitHub to read, build and fork.',
          'You install it as a debug APK from the repository: allow installs from outside the store, and update it by hand when a new build lands.',
          'It keeps a service alive in the background, the way a development build does, so it goes on doing work even after you leave it.',
          'Import a bundle, press Play, and it starts the entry point the page names — close to the metal, for people who like to see how it runs.',
        ],
        apk: 'Download the APK',
        atlas: 'Read it in the Atlas',
      },
      ados: {
        kind: 'ANDROID · GOOGLE PLAY',
        points: [
          'The finished DOS player, installed from Google Play in a single tap — no sideloading, no “unknown sources”, and it keeps itself up to date.',
          'It stops the moment you leave it: nothing lingers in the background, so it stays light on memory and easy on the battery.',
          'The same bundles and the same one-tap setup as the emulator, with the rough edges taken off.',
          'Made for everyday play rather than for reading the source — the one to reach for when you just want the game to start.',
        ],
        badge: 'Coming soon to Google Play',
        note: 'Not published yet — the listing goes live when the app is approved.',
      },
    },
  },
  notFound: {
    eyebrow: 'Page not found',
    command: 'TYPE THIS-PAGE.HTM',
    badCommand: 'Bad command or file name',
    heading: 'There is no page at that address',
    body: 'The link may be out of date, or the address mistyped. The archive is all still here — start from the front door or jump straight to the catalogue.',
    ctaHome: 'Back to the front page',
    ctaCatalogue: 'Open the catalogue',
  },
};

/**
 * The Chinese copy.
 *
 * The archive is Chinese, so the Chinese locale is the closer one to the
 * source: the name of a game is the name the bundle is filed under, and the
 * original English title sits under it as the second line.
 */
const zhCN: SiteCopy = {
  localeName: '简体中文',
  common: {
    games: '游戏',
    archive: '归档',
    categories: '分类',
    year: '年代',
    entryPoint: '启动文件',
    files: '文件数',
    size: '大小',
    all: '全部',
    clear: '清除',
    searchPlaceholder: '按名称、拼音或启动文件搜索…',
    searchLabel: '搜索游戏',
    readThePage: '查看详情',
    download: '下载',
    noticeTitle: '关于这些下载',
    noticeText:
      '本站链接的归档文件仅供学习、交流与保存之用。它们是原作者与出版方的作品，相关权利归其所有；在此发布链接既不主张这些权利，也不放弃这些权利。如果你认为某个下载侵犯了许可、著作权或其他权利，请与我们联系，我们会将其下架。',
    comments: '评论',
    commentsText:
      '下载链接失效、名称有误、游戏启动后崩溃——都可以在这里说。每个游戏页面下的评论区，才是记录「怎么玩进去」的地方。',
    englishTitle: '原名',
    englishTitleKnown: '这款游戏的原名。游戏包本身只带有中文名称。',
    englishTitleBundle: '这款游戏的原名，读自游戏包自身的字符串。',
    englishTitlePublished: '这款游戏的原名，与归档站自己的索引记录一致。',
    englishTitleWiki: '这款游戏的原名，与 CN DOS Games Wiki 的记录一致。',
  },
  home: {
    title: 'DOS 游戏归档',
    description:
      '归档里的每一款 DOS 游戏，事实都读自游戏包本身：下载链接、在 WhereQ-DOSBox 中的运行方法，以及已知的玩法。',
    eyebrow: 'DOS 游戏归档',
    heading: '每一款游戏，事实都读自游戏包本身',
    lead: (games) =>
      `PC Legends 收录了 ${games} 款 DOS 游戏。每一款都有自己的页面：文件列表、文件日期、启动文件与校验和，全部直接读自游戏包本身——再加上下载链接，以及由游戏包自身结构所决定的运行方法。这里的内容没有一条是凭记忆写下的。`,
    ctaCatalogue: '打开游戏目录',
    ctaPlayed: '已通关的游戏',
    categoriesTitle: '游戏分类',
    categoriesIntro:
      '一款游戏属于哪个分类，取自这些游戏包所镜像的那个项目的清单——那是它自己的首要归类，而不是猜测。如果同一项目还发布了提到另一种类型的介绍，这款游戏也会同时列在那个分类下：清单决定第一个分类，介绍可以补上第二个，但绝不会拿走任何一个。',
    crtCaption: '图 1 —— 游戏页面上的每一条事实，都是这样从游戏包里读出来的。',
    stepsTitle: '一个页面是怎么组成的',
    steps: [
      {
        mark: '01',
        title: '从游戏包里读出来',
        body: '文件列表、文件日期、启动文件里的字符串，以及归档的 SHA-256。这些事实属于游戏包本身，而不是对它的描述。',
      },
      {
        mark: '02',
        title: '下载原件',
        body: '页面上的链接指向生成该页的那个归档。读者下载到的文件，就是页面所描述的那个文件；页面上的校验和也是归档自己的。',
      },
      {
        mark: '03',
        title: '在 WhereQ-DOSBox 里跑起来',
        body: '启动文件写在页面上，该按哪个键也写下来了。还没有人实测过的运行方式会直说——评论区就是记录「什么有效」的地方。',
      },
    ],
    universeBefore: 'PC Legends 是 WhereQ 家族的一员。博客、WhereQ 图鉴以及其余文档都在',
    universeLink: 'whereq.github.io',
    universeAfter: '。',
  },
  catalogue: {
    title: 'DOS 游戏',
    description:
      '归档里的每一款 DOS 游戏：事实读自游戏包本身，附下载链接，以及在 WhereQ-DOSBox 中各自需要的运行方法。',
    eyebrow: 'DOS 游戏归档',
    heading: '归档里的每一款 DOS 游戏',
    lead: (games) =>
      `归档收录了 ${games} 款 DOS 游戏，每一款在这里都有自己的页面：事实读自游戏包本身，附下载链接，以及由其结构决定的运行方法。下面的游戏按分类排列——一款游戏可以同时属于多个分类；那些已经在模拟器上通关过的游戏，则带着手绘的卡片标记放在「已通关」那一架上。`,
    tallyOne: '款游戏',
    tallyMany: '款游戏',
    tallyCategories: (count) => `，属于 ${count} 个分类`,
    empty: '没有匹配的结果。换一个更短的词，或者清除分类筛选。',
  },
  game: {
    download: '下载游戏包',
    wholeCatalogue: '完整目录',
    playedThrough: '已通关',
    atAGlance: (name) => `${name} 速览`,
    seeAlso: '相关链接',
    noticeTitle: '关于这次下载',
    noticeText:
      '本页的归档文件仅供学习、交流与保存之用。它是原作者与出版方的作品，相关权利归其所有；在此发布既不主张这些权利，也不放弃这些权利。如果你认为这个下载侵犯了许可、著作权或其他权利，请与我们联系，我们会将其下架。',
    originalTitle: '原名',
    wikipedia: '维基百科',
    readOnWikipedia: '在维基百科上阅读',
    developer: '开发',
    published: '发行',
    type: '类型',
    platform: '平台',
    entryPoint: '启动文件',
    bundle: '游戏包',
    crtCaption: '图 1 —— 进入游戏的路径，由游戏包自身的结构推断而来。',
    commentsPrompt:
      '在这个页面没能跑通的地方，你把它跑起来了？在评论里说说你是怎么做的——下一位读者会感谢你。',
  },
  played: {
    title: '已通关',
    description:
      '已经在模拟器上跑过的 DOS 游戏，写下了进去的路线：从哪个文件开始、哪个键打开菜单，以及背后的画面是什么。',
    eyebrow: '已通关',
    heading: '这些游戏，以及怎么进去',
    lead:
      '这里的大多数 DOS 游戏，直接就能开始：把游戏包导入 WhereQ-DOSBox 或 A-DOS，按下「Play」。如果一个游戏包里不止一个程序，用「Launch」按钮就能挑出其中任意一条命令来运行——看名字通常就能分辨该选哪个。',
    intro: () =>
      '这一架上的页面，把进入游戏的路线写得最详尽，留给值得细看的那些游戏。大多数时候你并不需要这么多——但如果哪个游戏启动不了，就在它的页面上提出来，WhereQ Universe 会一直在这里帮你。',
    group: '已通关',
    commentsText:
      '找到了进入其中某一款更顺的方法，或者把某个难搞的跑起来了？把你做了什么写下来——下一位读者会感谢你。',
  },
  about: {
    title: '关于',
    description:
      'PC Legends 是什么，这些 DOS 游戏归档从哪里来，一个页面如何从它的游戏包生成，以及本站对下载内容版权的说明。',
    eyebrow: '关于',
    heading: '一个 DOS 游戏归档，以及每一款游戏的事实',
    lead: (games, gigabytes) =>
      `PC Legends 收录了 ${games} 款 DOS 游戏——共 ${gigabytes} GB——并为每一款游戏配一个自己的页面。页面由它所描述的那个游戏包生成：文件列表、文件日期、启动文件里的字符串，以及归档的校验和。`,
    sections: [
      {
        title: '这个站点是什么',
        paragraphs: [
          '一个老 PC 游戏目录，连同与之配套的说明。每个页面上都有一款游戏、一个指向游戏包的链接、游戏包希望被启动的文件名，以及——在真有人跑通过的地方——运行方法与操作键位。',
          '本站是一组静态页面。没有账号、没有登录、没有数据库。每个游戏页面都带有评论区，所以读得比页面更远的读者可以把自己走通的路写下来。',
        ],
      },
      {
        title: '这些游戏从哪里来',
        paragraphs: [
          '这些游戏包镜像自 [chinese-dos-games](https://github.com/rwv/chinese-dos-games) 项目发布的中文 DOS 游戏归档。页面上的下载按钮直接指向生成该页的那个归档——同一个文件，逐字节相同——页面印出的 SHA-256 也是归档自己的校验和，因此副本可以被核对，而不必被信任。',
          '一款游戏的分类取自那个项目的清单，而不是猜测。它自己的类型代码是这款游戏的首要分类；如果该项目还发布了提到另一种类型的介绍，这款游戏也会同时列在那个分类下。清单决定第一个分类，介绍可以补上第二个——但绝不会拿走任何一个。',
        ],
      },
      {
        title: '一个页面是怎么生成的',
        paragraphs: [
          '一个脚本读取归档里的每一个游戏包，为每款游戏写出一个模块：事实、下载链接、由游戏包自身结构所决定的运行方法，以及说明每一项事实来源的各个小节。脚本放在[站点仓库](https://github.com/whereq/pclegends.games)里，重新运行会生成与上次完全相同的页面。',
          '没有被人通关的页面会直说——在「在 WhereQ-DOSBox 里跑起来」那一节下，用平实的话写明。已经通关的那少数几页是手写的，改为记录什么才有效：启动器、按键，以及其后的画面。它们在[已通关的那一架](/played/)上。',
        ],
      },
      {
        title: '这些下载，以及它们归谁',
        paragraphs: [
          '这些归档文件仅供学习、交流与保存之用。它们是原作者与出版方的作品，相关权利归其所有。在此发布链接既不主张这些权利，也不放弃这些权利。',
          '如果你认为某个下载侵犯了许可、著作权或其他权利，请写信至 [whereq@gmail.com](mailto:whereq@gmail.com)，我们会将其下架。游戏包缺了什么东西也是一样——在评论里说一声，我们会补上。',
        ],
      },
      {
        title: 'WhereQ-DOSBox',
        paragraphs: [
          '这些游戏跑在 [WhereQ-DOSBox](https://whereq.github.io/atlas/universe/whereq-dosbox) 上——WhereQ 家族里为 Android 原生构建的 DOS 模拟器。导入一个游戏包，按下播放，应用就会启动页面上写明的那个入口文件。',
        ],
      },
      {
        title: 'WhereQ 的其余部分',
        paragraphs: [
          'PC Legends 是 WhereQ 家族里的游戏架。博客、WhereQ 图鉴以及其余文档都在 [whereq.github.io](https://whereq.github.io)，原本放在那里的游戏现在都搬到了这里。',
        ],
      },
    ],
    compare: {
      title: '跑这些游戏的两种方式',
      intro:
        '这里的游戏包都是 DOS 程序，总得有东西来运行它们。有两个播放器可供选择，面向的是两类人——WhereQ-DOSBox 是你可以拆开研究的开源模拟器，而 A-DOS 则是即将上架 Google Play 的成品应用。',
      dosbox: {
        kind: '开源 · ANDROID',
        points: [
          'Android 原生 DOS 模拟器，完全公开开发——整套代码都在 GitHub 上，可阅读、可构建、可 fork。',
          '以调试版 APK 的形式从仓库安装：需要允许来自商店之外的安装，有新版本时也要手动更新。',
          '它会像开发版那样在后台保持一个服务常驻，所以即便你离开了，它仍在继续占用资源。',
          '导入一个游戏包，按下开始，它就会启动页面所标明的启动文件——贴近底层，适合喜欢研究其运作方式的人。',
        ],
        apk: '下载 APK',
        atlas: '在图鉴中了解',
      },
      ados: {
        kind: 'ANDROID · GOOGLE PLAY',
        points: [
          '成品 DOS 播放器，在 Google Play 上一键安装——无需手动安装、无需「未知来源」，而且会自动保持更新。',
          '你一离开它就会停下：不会在后台常驻，因此更省内存、也更省电。',
          '与模拟器相同的游戏包、相同的一键设置，但把粗糙的边角都打磨掉了。',
          '为日常游玩而非阅读源码而生——当你只想让游戏赶紧跑起来时，就选它。',
        ],
        badge: '即将登陆 Google Play',
        note: '尚未发布——应用通过审核后，商店页面即会上线。',
      },
    },
  },
  notFound: {
    eyebrow: '找不到页面',
    command: 'TYPE THIS-PAGE.HTM',
    badCommand: 'Bad command or file name',
    heading: '这个地址下没有页面',
    body: '链接可能已经失效，或者地址敲错了。归档里的东西都还在——从首页开始，或者直接去目录看看。',
    ctaHome: '回到首页',
    ctaCatalogue: '打开目录',
  },
};

/** The copy for every language the site ships. */
export const SITE_COPY: Record<string, SiteCopy> = {
  en,
  'zh-CN': zhCN,
};
