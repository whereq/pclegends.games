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
  /**
   * The /resources page. It renders the two-player comparison (reusing
   * `about.compare`) and a set of outbound links to the wider world of DOS
   * preservation.
   */
  resources: {
    title: string;
    description: string;
    eyebrow: string;
    heading: string;
    lead: string;
    runTitle: string;
    walkTitle: string;
    walkIntro: string;
    walk: {img: string; caption: string; portrait?: boolean}[];
    linksTitle: string;
    linksIntro: string;
    links: {name: string; href: string; note: string}[];
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
          'Every bundle here is collected from the public archives that preserve DOS software. None of it is hosted by PC Legends: the download button on a page points straight at the external archive the page was generated from, so the file travels from that archive to you and never passes through this site. The SHA-256 printed on the page is that archive’s own checksum, so the copy you fetch can be checked against what the page describes rather than taken on trust.',
          'Those same archives are where the facts come from — the dates, the file list, the entry point and the category are read from what each collection already records, not guessed. The archives a game is drawn from may grow and change over time; a page always links at wherever its copy lives today, and says nothing about it beyond what that source does.',
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
        title: 'Running the games',
        paragraphs: [
          'A bundle is a DOS program, so it needs a player — and there are two, both from the WhereQ Universe. *A-DOS* is the finished app, on its way to Google Play: install it, open a bundle and it starts the entry point the page names, no setup to speak of. *WhereQ-DOSBox* is the open-source emulator these pages are written against, for anyone who would rather read the source or build it themselves.',
          'A-DOS is the one most people will want — it installs from the Play Store, keeps itself up to date and stays out of the way. The [resources page](/resources/) sets the two side by side, and points on to the wider world of DOS preservation.',
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
          'You install the signed APK from the repository: turn on installs from outside the store, and fetch each new build yourself.',
          'It keeps a service running in the background the way a development build does, so it stays a little busy even after you set it down.',
          'Press Play and it runs — close to the metal, and happiest in the hands of someone who likes to look under the hood.',
          'Android 6.0 or newer. The checksum sits beside the file on GitHub Releases.',
        ],
        apk: 'Download the APK',
        atlas: 'Read it in the Atlas',
      },
      ados: {
        kind: 'ANDROID · GOOGLE PLAY',
        points: [
          'The finished DOS player: one tap from Google Play and it is installed, trusted and kept current on its own — nothing to sideload, nothing to manage.',
          'It bows out the moment you leave — no background service, no drain on memory or battery, just the game while you are playing it.',
          'The same bundles and the same one-tap setup as the emulator, with every rough edge sanded smooth.',
          'The one most people will simply want: open it, pick a game, play.',
          'Android 5.0 or newer.',
        ],
        badge: 'Coming soon to Google Play',
        note: 'Not published yet — the listing goes live when the app is approved.',
      },
    },
  },
  resources: {
    title: 'Resources',
    description:
      'The two players that run the games — A-DOS and WhereQ-DOSBox — set side by side, and a map of the wider world of DOS preservation: where to find, buy and play more DOS games.',
    eyebrow: 'Players & resources',
    heading: 'Running DOS games, and where to find more',
    lead:
      'A bundle from the archive is a DOS program; it needs a player. Here are the two from the WhereQ Universe, and then the places worth knowing across the rest of the DOS world.',
    runTitle: 'Two ways to run these games',
    walkTitle: 'A run through WhereQ-DOSBox',
    walkIntro:
      'The whole route in, on WhereQ-DOSBox 1.0.0.20, using 偷金子 (Lode Runner) — the game the front page shows. Import the bundle, press Play, and you are in; Game Mode lays a d-pad and mouse over the screen, with a green SAVE button in the top bar, and the emulator keeps running when you switch away. Save states freeze the whole machine — five slots, each one stamped with the time it was made — and a folder of your own keeps them safe when the app is uninstalled.',
    walk: [
      {img: '/img/resources/01-files-panel-empty.png', caption: 'A fresh install: the Files panel is empty, and the gold “Install a bundle (.zip)” button starts the import.'},
      {img: '/img/resources/02-picker-download.png', caption: 'The Android file picker on Downloads, with tou-jin-zi.zip selected — the bundle the PC Legends page for 偷金子 (Lode Runner) links to.', portrait: true},
      {img: '/img/resources/03-bundle-installed.png', caption: 'Installed: its entry point LR.COM, its size, and the Play / States / Launch… / Remove buttons.'},
      {img: '/img/resources/04-notification-permission.png', caption: 'Android asks once whether the app may send notifications — the foreground service needs them, and nothing else is asked.'},
      {img: '/img/resources/05-game-running.png', caption: '偷金子 (Lode Runner) running inside WhereQ-DOSBox, framed by the on-screen keyboard.'},
      {img: '/img/resources/06-files-panel-resume.png', caption: 'The Files panel over the running game, with a green Resume tou-jin-zi line above the list.'},
      {img: '/img/resources/07-dos-prompt.png', caption: 'The DOSBox banner and the C:\> prompt, with the on-screen keyboard below.'},
      {img: '/img/resources/08-game-mode-hybrid.png', caption: 'Game Mode, Hybrid profile: the 8-way d-pad, L/R-CLICK and the trackball — and in the top bar a green SAVE button, which saves the game without leaving the gamepad.'},
      {img: '/img/resources/09-game-mode-profile-picker.png', caption: 'A long press on the gold profile button opens the picker: Hybrid, Action, Point & click, and Remap buttons…'},
      {img: '/img/resources/10-game-mode-action.png', caption: 'The Action profile: the d-pad on the left, and the FIRE / JUMP / USE / ENT diamond on the right.'},
      {img: '/img/resources/11-game-mode-point.png', caption: 'The Point & click profile: big LEFT and RIGHT mouse buttons instead of a d-pad, and the trackball.'},
      {img: '/img/resources/12-game-mode-remap.png', caption: 'Remap mode: the buttons you can change are outlined in gold, under a banner that says Tap a button to remap.'},
      {img: '/img/resources/13-game-mode-save-sheet.png', caption: 'The Save states sheet, opened from the gamepad’s green SAVE button and floating over the running game: five slots, and the gamepad still behind it.'},
      {img: '/img/resources/14-game-mode-off.png', caption: 'Back to the plain keyboard pads after the reverse Konami code — the game keeps running underneath.'},
      {img: '/img/resources/15-states-empty.png', caption: 'The Save states sheet: five empty slots. Open it with States, next to the game.'},
      {img: '/img/resources/16-saves-offer.png', caption: 'After the first save, the app asks whether to keep a second copy of your saves in a folder of your own.'},
      {img: '/img/resources/17-folder-permission.png', caption: 'Android will not hand an app the whole Download folder, so the app asks for one of its own — and then for access to it.', portrait: true},
      {img: '/img/resources/18-files-panel-resume-slot.png', caption: 'The Files panel now carries a Resume line: tou-jin-zi · slot 1 · just now.'},
      {img: '/img/resources/19-states-slot.png', caption: 'Slot 1 · 12 minutes ago, and two saves made yesterday that read Yesterday 10:00 and Yesterday 20:00 — so the newer one is obvious. Load puts the whole machine back exactly where it was.'},
      {img: '/img/resources/20-settings.png', caption: 'The Settings dialog, and the Saves folder row that points at the folder you chose.'},
      {img: '/img/resources/21-saves-folder.png', caption: 'With a folder set, every save-state is mirrored there, compressed, next to the game itself.'},
      {img: '/img/resources/22-saves-folder-unset.png', caption: 'With no folder set, the saves live only inside the app — and go with it when you uninstall.'},
      {img: '/img/resources/23-durable-folder-contents.png', caption: 'The folder on the phone after the app was uninstalled. The game is still there, because it was never inside the app.', portrait: true},
      {img: '/img/resources/24-restore-games-offer.png', caption: 'The app looks inside the folder and offers to bring back what is not installed.'},
      {img: '/img/resources/25-games-restored.png', caption: 'Restored 1 game(s). Your saves are ready.'},
      {img: '/img/resources/26-states-restored-slot.png', caption: 'The restored slots still say 4 minutes ago, Yesterday 10:00 and Yesterday 20:00. A save made before the reinstall still knows when it was made.'},
      {img: '/img/resources/27-keyboard-symbols.png', caption: 'The punctuation layer of the on-screen keyboard, with the #+= key lit.'},
      {img: '/img/resources/28-keyboard-functions.png', caption: 'The function layer, with the Fn key lit — F1 to F12.'},
      {img: '/img/resources/29-launcher-home.png', caption: 'The WhereQ-DOSBox icon on the launcher, the way you find it after installing.', portrait: true},
      {img: '/img/resources/30-app-info.png', caption: 'The Android App info page for WhereQ-DOSBox.', portrait: true},
      {img: '/img/resources/31-running-in-background.png', caption: 'The “Playing tou-jin-zi — tap to return” notification: the service that keeps the machine resident while you are in another app.', portrait: true},
      {img: '/img/resources/32-tap-to-return.png', caption: 'Back in the game after tapping the notification. The emulator never stopped.'},
      {img: '/img/resources/33-narrow-18x9.png', caption: 'On an 18:9 screen the letter keys get tighter; the d-pad and the action keys keep their size.'},
    ],
    linksTitle: 'More DOS, out in the world',
    linksIntro:
      'PC Legends is one shelf among many. These are the collections, stores and emulators the DOS community has built — good places to find a game that is not here, buy a polished re-release, or just play something in the browser.',
    links: [
      {
        name: 'GOG.com',
        href: 'https://www.gog.com/',
        note: 'DRM-free classics — many DOS-era games sold and patched to run cleanly on modern machines.',
      },
      {
        name: 'Internet Archive — MS-DOS Games',
        href: 'https://archive.org/details/softwarelibrary_msdos_games',
        note: 'Thousands of MS-DOS games, preserved and playable right in the browser.',
      },
      {
        name: 'DOSGames.com',
        href: 'https://dosgames.com/',
        note: 'Freeware and shareware DOS games, sorted by genre and still downloadable.',
      },
      {
        name: 'Classic DOS Games',
        href: 'https://www.classicdosgames.com/all.html',
        note: 'A long-running index of the classic DOS catalogue.',
      },
      {
        name: 'ClassicReload',
        href: 'https://classicreload.com/',
        note: 'DOS and other retro games emulated in the browser — nothing to install.',
      },
      {
        name: 'DOSBox',
        href: 'https://www.dosbox.com/',
        note: 'The original desktop DOS emulator the WhereQ players are built on.',
      },
      {
        name: 'MobyGames',
        href: 'https://www.mobygames.com/',
        note: 'A deep catalogue of game metadata, covers and credits for cross-checking a title.',
      },
    ],
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
          '这里的每一个游戏包，都收集自那些保存着 DOS 软件的公共归档。它们都不由 PC Legends 托管：页面上的下载按钮直接指向生成该页的那个外部归档，文件是从那个归档直接传到你这里，从不经过本站。页面印出的 SHA-256 是那个归档自己的校验和，因此你取到的副本可以与页面所述相核对，而不必被凭空信任。',
          '这些事实也同样来自那些归档——日期、文件清单、入口文件和分类，都是从每个归档已经记录的内容里读出来的，而不是猜测。一款游戏所取自的归档，可能会随时间增长或变化；页面始终链接到它的副本如今所在之处，对它的陈述不会超出那个来源本身所说的范围。',
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
        title: '怎么跑这些游戏',
        paragraphs: [
          '游戏包是 DOS 程序，所以需要一个播放器——而这样的播放器有两个，都来自 WhereQ 家族。*A-DOS* 是成品应用，正在上架 Google Play：装上它、打开一个游戏包，它就会启动页面所标明的入口文件，几乎不需要任何设置。*WhereQ-DOSBox* 则是这些页面所面向的开源模拟器，留给更愿意阅读源码、或自己动手构建的人。',
          'A-DOS 是大多数人会想要的那一个——从 Play 商店安装，自动保持更新，并且从不碍事。[资源页面](/resources/)把这两者并排放在一起，并指向更广阔的 DOS 保存世界。',
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
          '以签名版 APK 的形式从仓库安装：需要允许来自商店之外的安装，每个新版本也要自己去取。',
          '它会像开发版那样在后台保持一个服务常驻，所以即便你放下它，它仍在悄悄忙活。',
          '按下开始就能跑——贴近底层，最适合喜欢掀开盖子看个究竟的人。',
          '需要 Android 6.0 或更新版本。校验值就在 GitHub Releases 的文件旁边。',
        ],
        apk: '下载 APK',
        atlas: '在图鉴中了解',
      },
      ados: {
        kind: 'ANDROID · GOOGLE PLAY',
        points: [
          '成品 DOS 播放器：在 Google Play 上一键即装，受信任、自动保持最新——无需手动安装，也没有任何需要你操心的地方。',
          '你一离开，它就退下：没有后台服务，不占内存、不耗电，只有你在玩时的那个游戏。',
          '与模拟器相同的游戏包、相同的一键设置，只是把每一处粗糙的边角都打磨得顺滑。',
          '大多数人想要的，正是它：打开、选一款、开玩。',
          '需要 Android 5.0 或更新版本。',
        ],
        badge: '即将登陆 Google Play',
        note: '尚未发布——应用通过审核后，商店页面即会上线。',
      },
    },
  },
  resources: {
    title: '资源',
    description:
      '运行这些游戏的两个播放器——A-DOS 与 WhereQ-DOSBox——并排放在一起，以及一张通往更广阔 DOS 保存世界的地图：在哪里寻找、购买与游玩更多 DOS 游戏。',
    eyebrow: '播放器与资源',
    heading: '怎么跑 DOS 游戏，以及去哪里找更多',
    lead:
      '归档里的游戏包是 DOS 程序，需要一个播放器。这里是 WhereQ 家族的两个，接着是 DOS 世界里其余那些值得知道的地方。',
    runTitle: '跑这些游戏的两种方式',
    walkTitle: '走一遍 WhereQ-DOSBox',
    walkIntro:
      '完整的进入路线，基于 WhereQ-DOSBox 1.0.0.20，用的是 偷金子（Lode Runner）——首页展示的那款游戏。导入游戏包、按下 Play，就进去了；「游戏模式」会在画面上叠一层方向键和鼠标，顶栏里还有一个绿色的 SAVE 按钮，而你切换到别的应用时，模拟器仍在后台继续运行。存档把整台机器冻住——五个档位，每个都标着保存时的时间——而你自己选的那个文件夹，会在应用被卸载之后把它们保住。',
    walk: [
      {img: '/img/resources/01-files-panel-empty.png', caption: '全新安装：文件面板是空的，金色的「Install a bundle (.zip)」按钮开始导入。'},
      {img: '/img/resources/02-picker-download.png', caption: 'Android 文件选择器停在「下载」文件夹，选中了 tou-jin-zi.zip——正是 PC Legends 上 偷金子（Lode Runner）页面所链接的那个游戏包。', portrait: true},
      {img: '/img/resources/03-bundle-installed.png', caption: '安装完成：它的入口文件 LR.COM、大小，以及 Play / States / Launch… / Remove 几个按钮。'},
      {img: '/img/resources/04-notification-permission.png', caption: 'Android 只会问一次要不要允许通知——前台服务需要它，除此之外再没有别的询问。'},
      {img: '/img/resources/05-game-running.png', caption: '偷金子（Lode Runner）在 WhereQ-DOSBox 中运行，四周是屏幕键盘。'},
      {img: '/img/resources/06-files-panel-resume.png', caption: '文件面板叠在运行中的游戏上，列表上方有一条绿色的 Resume tou-jin-zi。'},
      {img: '/img/resources/07-dos-prompt.png', caption: 'DOSBox 的欢迎横幅与 C:\> 提示符，下方是屏幕键盘。'},
      {img: '/img/resources/08-game-mode-hybrid.png', caption: '游戏模式，Hybrid 档案：八向方向键、L/R-CLICK 与轨迹球；顶栏里还有一个绿色的 SAVE 按钮，不离开手柄就能把游戏存下来。'},
      {img: '/img/resources/09-game-mode-profile-picker.png', caption: '长按那个金色档案按钮就打开选择器：Hybrid、Action、Point & click，还有 Remap buttons…'},
      {img: '/img/resources/10-game-mode-action.png', caption: 'Action 档案：左边是方向键，右边是 FIRE / JUMP / USE / ENT 那一组面键。'},
      {img: '/img/resources/11-game-mode-point.png', caption: 'Point & click 档案：没有方向键，换成大号的 LEFT 和 RIGHT 鼠标键，加上轨迹球。'},
      {img: '/img/resources/12-game-mode-remap.png', caption: '映射模式：可以改的按键镀着金色描边，顶部横幅写着 Tap a button to remap。'},
      {img: '/img/resources/13-game-mode-save-sheet.png', caption: '在手柄上按绿色 SAVE 按钮打开的存档面板，浮在正在运行的游戏上面：五个档位，手柄还在它后面。'},
      {img: '/img/resources/14-game-mode-off.png', caption: '敲完退出的那段 Konami 暗号，回到普通键盘方向键——游戏依旧在下面运行。'},
      {img: '/img/resources/15-states-empty.png', caption: '存档面板：五个空档位。在游戏旁边按 States 就能打开。'},
      {img: '/img/resources/16-saves-offer.png', caption: '第一次保存之后，应用会问你要不要把存档再存一份到你自己选的文件夹里。'},
      {img: '/img/resources/17-folder-permission.png', caption: 'Android 不会把整个「下载」文件夹交给一个应用，所以应用自己去建了一个，再向你要访问权。', portrait: true},
      {img: '/img/resources/18-files-panel-resume-slot.png', caption: '文件面板上多了一条 Resume：tou-jin-zi · slot 1 · just now。'},
      {img: '/img/resources/19-states-slot.png', caption: '档位 1「12 分钟前」，另外两个昨天做的存档写着「Yesterday 10:00」和「Yesterday 20:00」——新旧一眼就分得出来。Load 会把整台机器放回它离开时的样子。'},
      {img: '/img/resources/20-settings.png', caption: '设置对话框，以及指向你所选文件夹的那一行 Saves folder。'},
      {img: '/img/resources/21-saves-folder.png', caption: '选定了文件夹之后，每个存档都会被压缩一份进去，就放在游戏旁边。'},
      {img: '/img/resources/22-saves-folder-unset.png', caption: '没有选文件夹时，存档只留在应用自己的存储里——卸载应用，它们就一起没了。'},
      {img: '/img/resources/23-durable-folder-contents.png', caption: '应用被卸载之后，手机上那个文件夹里的东西还在。游戏还在，因为它从来就不在应用里面。', portrait: true},
      {img: '/img/resources/24-restore-games-offer.png', caption: '应用翻过那个文件夹，把没装上的东西问你要不要装回来。'},
      {img: '/img/resources/25-games-restored.png', caption: 'Restored 1 game(s). Your saves are ready.'},
      {img: '/img/resources/26-states-restored-slot.png', caption: '装回来的档位仍然写着「4 分钟前」「Yesterday 10:00」和「Yesterday 20:00」。卸载之前做的存档，依然记得自己是什么时候做的。'},
      {img: '/img/resources/27-keyboard-symbols.png', caption: '屏幕键盘的符号层，#+= 键亮着。'},
      {img: '/img/resources/28-keyboard-functions.png', caption: '功能键层，Fn 键亮着——F1 到 F12。'},
      {img: '/img/resources/29-launcher-home.png', caption: '桌面上的 WhereQ-DOSBox 图标：装好之后，你就是这样找到它的。', portrait: true},
      {img: '/img/resources/30-app-info.png', caption: 'WhereQ-DOSBox 的 Android 应用信息页。', portrait: true},
      {img: '/img/resources/31-running-in-background.png', caption: '「Playing tou-jin-zi — tap to return」通知：让机器在你切到别的应用时仍驻留的那个服务。', portrait: true},
      {img: '/img/resources/32-tap-to-return.png', caption: '点通知回到游戏。模拟器一直没有停。'},
      {img: '/img/resources/33-narrow-18x9.png', caption: '在 18:9 的屏幕上，字母键会变窄；方向键和动作键还是原来的大小。'},
    ],
    linksTitle: '世界各处，更多的 DOS',
    linksIntro:
      'PC Legends 只是众多书架中的一架。下面这些，是 DOS 社区多年来建起的合集、商店与模拟器——想找一款这里没有的游戏、买一个打磨过的复刻版，或者只是在浏览器里玩一玩，都是好去处。',
    links: [
      {
        name: 'GOG.com',
        href: 'https://www.gog.com/',
        note: '无 DRM 的经典游戏——其中许多 DOS 时代的游戏经过修补，可在现代机器上顺畅运行，并在此出售。',
      },
      {
        name: 'Internet Archive —— MS-DOS Games',
        href: 'https://archive.org/details/softwarelibrary_msdos_games',
        note: '成千上万款 MS-DOS 游戏，经过保存，可直接在浏览器里游玩。',
      },
      {
        name: 'DOSGames.com',
        href: 'https://dosgames.com/',
        note: '免费与共享版 DOS 游戏，按类型分好，仍可下载。',
      },
      {
        name: 'Classic DOS Games',
        href: 'https://www.classicdosgames.com/all.html',
        note: '一份经营多年的经典 DOS 游戏索引。',
      },
      {
        name: 'ClassicReload',
        href: 'https://classicreload.com/',
        note: 'DOS 及其他复古游戏在浏览器中模拟运行——无需安装。',
      },
      {
        name: 'DOSBox',
        href: 'https://www.dosbox.com/',
        note: 'WhereQ 的播放器所基于的那个最初的桌面 DOS 模拟器。',
      },
      {
        name: 'MobyGames',
        href: 'https://www.mobygames.com/',
        note: '一个关于游戏元数据、封面与制作人员的深厚目录，便于核对一款游戏。',
      },
    ],
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
