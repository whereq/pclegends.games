/**
 * The played-through games, in Chinese.
 *
 * The same five games as `src/data/games-played.ts`, written in the other
 * language: the Chinese locale reads these, and the English locale reads
 * the ones next door.
 *
 * The ids are the same — they are the page ids, and they are what the
 * routes and the catalogue match on. Only the words differ.
 *
 * Generated from `src/data/games-played.ts` — do not edit by hand.
 */

import {AtlasEntry, AtlasGroup, AtlasSection} from './atlas-types';

/** The introduction to the shelf of played games, in Chinese. */
export const PLAYED_INTRO_ZH: AtlasSection[] = [
  {
    title: '这一架是什么',
    blocks: [
      {
        kind: 'paragraph',
        text: '一架子 DOS 游戏，每一款都按刚装好它的人希望看到的样子来记录：游戏包在这里，启动它需要做的每一步在这里，每个按键的作用也在这里。',
      },
      {
        kind: 'paragraph',
        text: '这些是能在 WhereQ-DOSBox 上跑的游戏——那是为 Android 原生构建的 DOS 模拟器，在 WhereQ 家族里只隔一页。它们是在运行着这个应用的模拟器上测过的，所以每个页面上的步骤都是真正有效的步骤，包括那些第一次尝试时才发现走错了的步骤。',
      },
      {
        kind: 'paragraph',
        text: '这一架放的是已经在模拟器上通关过的游戏。归档里的其他每一个游戏也都有页面，在 /dos-games/ 的目录里——事实读自游戏包本身，附下载链接，以及由其结构所决定的运行方法。那些页面会直说还没有人玩过它们。随着这一架越来越长，每个页面的形状始终不变。',
      },
    ],
  },
  {
    title: '怎么看一个游戏页面',
    blocks: [
      {
        kind: 'paragraph',
        text: '每个页面的顺序都一样：这是一款什么游戏、带校验和的下载、在 WhereQ-DOSBox 里的运行方法、怎么玩、游戏包里有什么，以及每一项事实的来源。下载放在最前面是刻意的——如果读者还要自己翻找文件，这个页面就没有多大价值。',
      },
      {
        kind: 'paragraph',
        text: '每个页面还都带有一条关于下载的提示，以及一个评论串。如果某一步在你的设备上不管用，或者你知道更短的进入方式，请在评论里说出来——这正是讨论串的用处。',
      },
    ],
  },
  {
    title: '整个归档',
    blocks: [
      {
        kind: 'paragraph',
        text: '上面这一架放的是已经在模拟器上通关过的游戏。它背后的目录放着归档里的每一款游戏——一款一页，事实读自游戏包本身，附下载链接，以及由游戏包自身结构所决定的运行方法。那些页面会直说还没有人玩过它们，而每一页都为第一个到达的人留着一个评论串。',
      },
      {
        kind: 'paragraph',
        text: '目录把游戏分成若干类别——动作、角色扮演、模拟、策略等等——分类读自这些游戏包所镜像的那个项目的清单，以及该项目发布的介绍。一款游戏可以同时属于多个分类，属于哪个，它就列在哪个下面。',
      },
      {
        kind: 'links',
        items: [
          {
            label: '打开游戏目录——归档里的每一款 DOS 游戏',
            href: '/dos-games/',
            external: false,
          },
        ],
      },
    ],
  },
  {
    title: '关于这些下载',
    blocks: [
      {
        kind: 'paragraph',
        text: '这些页面上的归档文件仅供学习、交流与保存之用。它们是各自作者与出版方的作品，相关权利归其所有；在此发布既不主张这些权利，也不放弃这些权利。',
      },
      {
        kind: 'paragraph',
        text: '如果你认为某个下载侵犯了许可、著作权或其他权利，请告诉我们，我们会将其下架。游戏包缺了什么东西也是一样——在评论里说一声，我们会补上。',
      },
    ],
  },
];

/** The groups the shelf is sorted into, in Chinese. */
export const PLAYED_GROUPS_ZH: AtlasGroup[] = [
  {
    id: 'm',
    title: 'M —— 名称以“M”开头',
    blurb: '这一架上名称以 M 开头的游戏。',
  },
  {
    id: 's',
    title: 'S —— 名称以“S”开头',
    blurb: '这一架上名称以 S 开头的游戏。',
  },
  {
    id: 'y',
    title: 'Y —— 名称以“Y”开头',
    blurb: '这一架上名称以 Y 开头的游戏。',
  },
];

/** The games themselves, in Chinese. */
export const PLAYED_GAMES_ZH: AtlasEntry[] = [
  {
    id: 'sanguo-yingjie-zhuan',
    collection: 'dos-games',
    name: '三国志英杰传',
    nameEn: 'Romance of the Three Kingdoms: Heroic Legend',
    nameEnSource: 'published',
    role: '策略角色扮演',
    tagline: '光荣 1995 年的战争与战役经典——也是那个你不告诉它该怎么启动、它就不肯启动的游戏。',
    logo: '/img/dos-games/sanguo-yingjie-zhuan.svg',
    wiki: {title: 'Romance of the Three Kingdoms (video game series)', url: 'https://en.wikipedia.org/wiki/Romance_of_the_Three_Kingdoms_(video_game_series)'},
    wikiZh: {title: '三國志英傑傳', url: 'https://zh.wikipedia.org/wiki/%E4%B8%89%E5%9C%8B%E5%BF%97%E8%8B%B1%E5%82%91%E5%82%B3'},
    accent: '#A31621',
    group: 's',
    related: ['whereq-dosbox'],
    summary:
      '光荣 1995 年的策略角色扮演游戏，繁体中文 DOS 版。你扮演刘备，收拢武将、抵挡董卓，再一路打到曹魏。这是这一架上唯一一个按下播放键就拒绝启动的游戏——它需要另一个启动器，而页面写明了是哪一个。',
    status: '1995',
    url: 'https://dos-bin.zczc.cz/%E4%B8%89%E5%9B%BD%E5%BF%97%E8%8B%B1%E6%9D%B0%E4%BC%A0.zip',
    facts: [
      {label: '开发', value: 'KOEI CO., LTD'},
      {label: '发行', value: 'KOEI CO., LTD —— 台湾版由第三波（Soft-World）发行'},
      {label: '发行年份', value: '1995'},
      {label: '平台', value: 'MS-DOS'},
      {label: '类型', value: '策略角色扮演（S-RPG）'},
      {label: '语言', value: '繁体中文（Big5）'},
      {label: '启动文件', value: 'REKO3.COM —— 不是 MAIN.EXE'},
      {label: '游戏包', value: '60 个文件 · 3,461,749 字节'},
    ],
    capabilities: [
      '一张战役地图：你在城池之间移动刘备和已经加入你的武将，每一步都通向一场战斗。',
      '会加入、会升级、会带着你给他们的宝物与战马的武将——宝物尤其能改变一场战斗的结局。',
      '一段沿着《三国演义》展开的剧情，从讨伐董卓的联军一直写到伐魏的战役。',
      '第一场战斗之前有一段剧情序章，最后一场战斗之后还有一段自己的结局动画。',
    ],
    notice: {
      title: '关于这次下载',
      text: '本页的归档文件仅供学习、交流与保存之用。三国志英杰传是 KOEI CO., LTD（© 1995 KOEI CO.,LTD）以及制作它的人们的作品；在此发布既不主张他们的权利，也不放弃这些权利。如果你认为这个下载侵犯了许可、著作权或其他权利，请与我们联系，我们会将其下架。',
    },
    sections: [
      {
        title: '这是一款什么游戏',
        blocks: [
          {
            kind: 'paragraph',
            text: '三国志英杰传——Romance of the Three Kingdoms: Heroic Legend——是光荣 1995 年的策略角色扮演游戏。你扮演刘备，战役从讨伐董卓的联军一直打到与曹魏的漫长战争。随着故事推进，武将会加入你、会长进等级，而给他们配什么，直接决定一场战斗怎么结束。',
          },
          {
            kind: 'paragraph',
            text: '这个游戏包是繁体中文 DOS 版，而不是日文原版：里面的文本是 Big5，中文版的发行方是第三波（Soft-World）。画面是 VGA 文本模式加一条会动的状态栏，游戏用的是 1990 年代中文译本的语气——開始新遊戲是开始新游戏，讀取存檔是读取存档，功能設定是功能设置，觀看劇情簡介是观看剧情简介。',
          },
          {
            kind: 'paragraph',
            text: '标题画面上的版权行写着 © 1995 KOEI CO.,LTD，而可执行文件里的图形署名写着「TF-SSC … Programmed by T.FUJINUMA (TF-928) 1994,1995」。归档的安装程序字符串把这一版的日期定在 1995 年 2 月 17 日。',
          },
        ],
      },
      {
        title: '下载游戏包',
        blocks: [
          {
            kind: 'paragraph',
            text: '这个归档就是上游那个文件，逐字节相同。下面的校验和就是你应当得到的结果。',
          },
          {
            kind: 'table',
            head: ['字段', '值'],
            rows: [
              ['文件', 'sanguo-yingjie-zhuan.zip'],
              ['大小', '3,461,749 字节'],
              ['SHA-256', '07bad92d786dbcd90bf27eed6e8473e09374608e21767c68d11cf293b3982999'],
              ['内容', '60 个文件——游戏本体、驱动与数据'],
              ['来源', 'dos-bin.zczc.cz——生成该页的那个归档'],
            ],
          },
          {
            kind: 'links',
            items: [
              {
                label: '下载 三国志英杰传.zip（3.4 MB）',
                href: 'https://dos-bin.zczc.cz/%E4%B8%89%E5%9B%BD%E5%BF%97%E8%8B%B1%E6%9D%B0%E4%BC%A0.zip',
                external: false,
              },
            ],
          },
        ],
      },
      {
        title: '在 WhereQ-DOSBox 里运行',
        blocks: [
          {
            kind: 'paragraph',
            text: '这一步最容易让人卡住。对这个游戏包按下播放键并不会启动游戏——它把你丢在一个 DOS 提示符下，然后什么也不发生。游戏没有坏；它在等正确的启动器。',
          },
          {
            kind: 'list',
            items: [
              '把 zip 导入 WhereQ-DOSBox——在手机的「文件」应用里打开它并选择 WhereQ-DOSBox，或使用应用自带的导入功能。',
              '打开这个游戏那一行，点按 Launch… 以打开启动脚本。',
              '点按 Clear 清空脚本输入框。',
              '点按 REKO3.COM 标签，把 REKO3 填进脚本框。',
              '点按 Play。',
            ],
          },
          {
            kind: 'paragraph',
            text: 'REKO3.COM 是这个游戏自带的启动器，也是唯一能正确启动它的东西。它会加载声音驱动（SBOPL2.COM）、图形驱动（GRPDRV.EXE）和字体驱动（TFDED.COM），然后依次运行 OPEN.EXE（片头）、MAIN.EXE（游戏本体）和 END.EXE（结局）。',
          },
          {
            kind: 'paragraph',
            text: '它还需要游戏同时挂在两个驱动器上。WhereQ-DOSBox 已经把 A: 和 B: 挂到游戏目录，这正是 REKO3 需要的——游戏会读 A:BAKDATA.R3 和 B:IPPAN0.R3——所以不需要手动挂载任何东西。',
          },
          {
            kind: 'paragraph',
            text: '为什么单独按 Play 不行：应用会挑出游戏包里最大的、既不是安装程序也不是驱动的可执行文件，在这个游戏包里就是 MAIN.EXE。而 MAIN.EXE 是没有驱动、没有启动器的游戏本体，它会启动、画不出画面，然后退回 DOS 提示符。运行 INSTALL.EXE 只会更糟——归档本身就是已经装好的目录结构。',
          },
        ],
      },
      {
        title: '怎么玩',
        blocks: [
          {
            kind: 'paragraph',
            text: '你看到的第一样东西是密码提示：密碼，下面一行是「請輸入正確密碼 [木土日]」。随便输入什么再按回车——这道关卡收下你输入的任何东西，然后放你进菜单。它是防复制的关卡，不是秘密；那个「木土日」提示属于游戏里的另一处内容。',
          },
          {
            kind: 'paragraph',
            text: '菜单有四项：開始新遊戲（新游戏）、讀取存檔（读取存档）、功能設定（功能设置）和觀看劇情簡介（观看剧情简介）。它们靠鼠标操作——键盘移动不了那个光标。',
          },
          {
            kind: 'list',
            items: [
              '先把鼠标交给 DOSBox：在屏幕键盘上按右键（或在蓝牙键盘上按鼠标右键）打开鼠标捕获，然后点按屏幕来点击。',
              '点按 開始新遊戲 开始一段新战役。',
              '在光荣的 Logo 画面上按回车进入剧情序章，然后继续按回车翻过它。',
              '接下来正式的战役开始：地图、武将、战斗。',
            ],
          },
          {
            kind: 'paragraph',
            text: '开始之前有两件事值得知道。战役是在规划阶段决定的——你带哪些武将出场、给他们配哪件宝物、哪匹马，以及你的回合怎么花——所以地图比战斗本身更重要。而如果你想知道刘备能走到哪一步，这款游戏的攻略里写着一个把他直接升到 99 级的方法：在非战斗状态下，把箭头移到刘备的立绘上并按住鼠标左键，等问题出现时回答「是」，再对左上角那个光点做同样的操作。',
          },
        ],
      },
      {
        title: '游戏包里有什么',
        blocks: [
          {
            kind: 'table',
            head: ['文件', '是什么'],
            rows: [
              ['REKO3.COM', '启动器。要运行的是它——它把驱动、片头、游戏和结局串在一起。'],
              ['MAIN.EXE', '游戏本体，也是应用自动挑选的那个文件。没有驱动也能运行。'],
              ['OPEN.EXE / END.EXE', '剧情序章与结局动画。'],
              ['GRPDRV.EXE', '图形驱动。'],
              ['SBOPL2.COM', '声音驱动。'],
              ['TFDED.COM', '字体驱动——屏幕上的中文就是靠它显示的。'],
              ['BAKDATA.R3、IPPAN0.R3', '存档与战役数据。BAKDATA.R3 从 A: 读取，IPPAN0.R3 从 B: 读取。'],
              ['INSTALL.EXE', '1995 年的安装程序。你用不到它——归档本身已经装好了。'],
            ],
          },
        ],
      },
      {
        title: '这些事实的来源',
        blocks: [
          {
            kind: 'list',
            items: [
              '游戏本身——标题画面、菜单、密码提示和游戏内的制作名单，都在模拟器上读过。',
              '可执行文件自带的字符串：「© 1995 KOEI CO.,LTD」、「TF-SSC … Programmed by T.FUJINUMA(TF-928) 1994,1995」，以及安装程序字符串「KOEI Install Program Ver 2.4 / 1995/ 2/17」。',
              '上游文件的归档列表与校验和。',
              '维基百科，用于发行日期与台湾发行方。',
              '中文攻略（par.com.tw 与巴哈姆特板），用于战役结构与 99 级的方法。',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'mortal-kombat',
    collection: 'dos-games',
    name: '真人快打',
    nameEn: 'Mortal Kombat',
    nameEnSource: 'bundle',
    role: '格斗游戏',
    tagline: 'DOS 版真人快打——直接就能启动，然后把启动它的那个键藏了起来。',
    logo: '/img/dos-games/mortal-kombat.jpg',
    wiki: {title: 'Mortal Kombat', url: 'https://en.wikipedia.org/wiki/Mortal_Kombat'},
    wikiZh: {title: '真人快打系列', url: 'https://zh.wikipedia.org/wiki/%E7%9C%9F%E4%BA%BA%E5%BF%AB%E6%89%93%E7%B3%BB%E5%88%97'},
    accent: '#A67C00',
    group: 'm',
    related: ['whereq-dosbox'],
    summary:
      'Midway 街机格斗游戏的 1993 年 DOS 移植版，由 Acclaim 发行、Probe 移植。导入之后按下播放键，它就停在那里像是死了——因为防复制画面要一个词，而标题画面要 F1。两件事都写在这里了。',
    status: '1993',
    url: 'https://dos-bin.zczc.cz/%E7%9C%9F%E4%BA%BA%E5%BF%AB%E6%89%93.zip',
    facts: [
      {label: '开发', value: 'Probe Software——DOS 移植小组'},
      {label: '发行', value: 'Acclaim Entertainment，1993'},
      {label: '平台', value: 'MS-DOS（DOS/4GW，386）'},
      {label: '类型', value: '格斗游戏'},
      {label: '格斗角色', value: 'Kano、Johnny Cage、Rayden、Liu Kang、Scorpion、Sub-Zero、Sonya、Goro、Shang Tsung'},
      {label: '启动文件', value: 'MK.EXE——自动选中'},
      {label: '游戏包', value: '67 个文件 · 3,128,439 字节'},
    ],
    capabilities: [
      '九名格斗角色——Kano、Johnny Cage、Rayden、Liu Kang、Scorpion、Sub-Zero、Sonya、Goro 和 Shang Tsung——各有各的强项与必杀技。',
      '故事模式，每名角色都有一页人物介绍，从黑龙家族的招揽说辞到 Shang Tsung 的海岛要塞。',
      'MIRROR MATCH，以及三档难度的 ENDURANCE 锦标赛。',
      '通过 AdLib、Roland 和 Sound Blaster 驱动发声，这些驱动都在游戏包里，也都能在游戏自己的设置里选择。',
      '游戏自己的设置画面，按 F10 打开，每个操作键都可以改成你想要的任何一个键。',
    ],
    notice: {
      title: '关于这次下载',
      text: '本页的归档文件仅供学习、交流与保存之用。真人快打（Mortal Kombat）是 Midway Games、Acclaim Entertainment 以及制作 DOS 移植版的人们的作品，这些权利属于他们；在此发布既不主张这些权利，也不放弃这些权利。如果你认为这个下载侵犯了许可、著作权或其他权利，请与我们联系，我们会将其下架。',
    },
    sections: [
      {
        title: '这是一款什么游戏',
        blocks: [
          {
            kind: 'paragraph',
            text: '真人快打是 Mortal Kombat 的 DOS 版——Midway 那款街机格斗游戏，1993 年以 DOS/4GW 程序的形态登上 PC。MK.EXE 里的署名写着「THE PROBE CONVERSION TEAM:」，所以移植是 Probe Software 做的，发行方是 Acclaim。归档里的字符串和图形文件把两家都点了名：ACCLAIM.GRA 和 PROBE.GRA。',
          },
          {
            kind: 'paragraph',
            text: '归档里的日期与此吻合。数据文件的日期从 1993 年 5 月到 1993 年 12 月，游戏本体里还有一行「ALLOW 4-6 WEEKS FOR DELIVERY — OFFER EXPIRES NOVEMBER 1, 1993」。',
          },
          {
            kind: 'paragraph',
            text: '角色表就是街机版，另外多两个：Kano、Johnny Cage、Rayden、Liu Kang、Scorpion、Sub-Zero 和 Sonya，再加上 Goro 与 Shang Tsung。对战模式是 MIRROR MATCH 和三档难度的 ENDURANCE。',
          },
        ],
      },
      {
        title: '下载游戏包',
        blocks: [
          {
            kind: 'paragraph',
            text: '这个归档就是上游那个文件，逐字节相同。下面的校验和就是你应当得到的结果。',
          },
          {
            kind: 'table',
            head: ['字段', '值'],
            rows: [
              ['文件', 'mortal-kombat.zip'],
              ['大小', '3,128,439 字节'],
              ['SHA-256', '79d860d2acf89533be69bfe93f298b58309dedae14c721f2b24b12d4ab50aa75'],
              ['内容', '67 个文件——游戏本体、图形与声音驱动'],
              ['来源', 'dos-bin.zczc.cz——生成该页的那个归档'],
            ],
          },
          {
            kind: 'links',
            items: [
              {
                label: '下载 真人快打.zip（3.0 MB）',
                href: 'https://dos-bin.zczc.cz/%E7%9C%9F%E4%BA%BA%E5%BF%AB%E6%89%93.zip',
                external: false,
              },
            ],
          },
        ],
      },
      {
        title: '在 WhereQ-DOSBox 里运行',
        blocks: [
          {
            kind: 'paragraph',
            text: '这一款是最简单的情况：导入 zip，应用会自己找到 MK.EXE，按下播放键就启动了。没有启动器要设置，也没有驱动要先加载。',
          },
          {
            kind: 'list',
            items: [
              '把 zip 导入 WhereQ-DOSBox——在手机的「文件」应用里打开它并选择 WhereQ-DOSBox，或使用应用自带的导入功能。',
              '点按 Play。游戏启动。',
            ],
          },
          {
            kind: 'paragraph',
            text: '有一件事不要去动：游戏包里带着 CRACK.COM，而你不该运行它。它会打印「File Was NOT Successfully Patched!」并且什么也不改——这个归档里的 MK.EXE 已经是完成的 WOLVERINE 破解版，没有任何东西需要再打补丁。运行它只会白白浪费一个 DOS 提示符。',
          },
          {
            kind: 'paragraph',
            text: '游戏包还带着当时那四种声音驱动——ADLIB.DRV、ROLAND.DRV、SBLASTER.DRV 和 BEEP.DRV。用哪一个由 DOSBox 呈现的声卡决定，所以如果音乐听起来单薄，该调的是那个设置，而不是归档里的任何东西。',
          },
        ],
      },
      {
        title: '怎么玩',
        blocks: [
          {
            kind: 'paragraph',
            text: '这里是任何地方都没有写下来的那一段。游戏启动了，看起来像是卡住了。',
          },
          {
            kind: 'list',
            items: [
              '第一个画面：一个防复制提示，要你输入一个词。随便输入什么再按回车——它什么都收。',
              '然后是标题画面和演示循环。按 F1 开始游戏。',
              'F1 只在开始画面上有效。如果正在播放演示比赛，就一直按 F1——在比赛进行中按 F1 会直接进入故事模式。',
              '在屏幕键盘上，F1 在 Fn 层里。用蓝牙或 USB 键盘时直接按 F1：WhereQ-DOSBox 会把硬件按键转发进 DOSBox。',
            ],
          },
          {
            kind: 'paragraph',
            text: '按下 F1 之后是 CHOOSE YOUR FIGHTER。方向键移动光标，一个出拳键——默认是 S——确认你指着的角色。在战斗里，方向键移动，同一批按键出拳和踢脚，F10 打开游戏自己的设置。',
          },
          {
            kind: 'paragraph',
            text: '那个设置画面值得记住。CONTROL 1: KEYBOARD 是所有操作绑定的位置：游戏会请你按上、下、左、右的键，然后依次是高拳、低拳、防御、高踢、低踢，你按什么它就用什么。因为 WhereQ-DOSBox 会把硬件键盘转发进 DOSBox，你可以绑定任何你想要的键。同一块屏幕上还能设置难度（VERY EASY 到 VERY HARD）、速度（LOW (386) 或 HIGH (486)）、声卡（NO SOUND、SPEAKER、ADLIB、ROLAND、SOUND BLASTER 或 ROLAND & SBLASTER）以及操作设备。',
          },
          {
            kind: 'paragraph',
            text: '在模拟器上验证过：Sonya 对 Rayden、Sub-Zero 对 Kano 都能开打，按方向键时角色会动，对手的血条会下降。',
          },
        ],
      },
      {
        title: '游戏包里有什么',
        blocks: [
          {
            kind: 'table',
            head: ['文件', '是什么'],
            rows: [
              ['MK.EXE', '游戏本体。按下播放键启动的就是它。'],
              ['DOS4GW.EXE', '游戏运行所依赖的 32 位 DOS 扩展器。'],
              ['CRACK.COM', '共享软件版的补丁程序。这里没什么可打的——别去动它。'],
              ['ACCLAIM.GRA、PROBE.GRA', '发行方与开发方的标题图形。'],
              ['KANO.GRA、NINJA.GRA、RAIDEN.GRA、EMP.GRA、…', '各角色的图形，每人一个文件。'],
              ['KATT.GRA、SCATT.GRA、SZATT.GRA、…', '角色的站姿与攻击姿势。'],
              ['S1HDRS.GRA、FU1HDRS.GRA、MPHDRS.GRA、…', '游戏读取每个角色时所用的头文件。'],
              ['SAMPLES.DAT', '声音采样。'],
              ['ADLIB.DRV、ROLAND.DRV、SBLASTER.DRV、BEEP.DRV', '声音驱动。'],
            ],
          },
        ],
      },
      {
        title: '这些事实的来源',
        blocks: [
          {
            kind: 'list',
            items: [
              '游戏本身——防复制画面、标题循环、角色选择和一场真人对局，都在模拟器上读过。',
              'MK.EXE 自带的字符串：「THE PROBE CONVERSION TEAM:」、「OFFER EXPIRES NOVEMBER 1, 1993」，以及它会打开的文件名。',
              '归档内文件的日期，1993 年 5 月到 12 月。',
              '上游文件的归档列表与校验和。',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'sha-qiu-mo-bao',
    collection: 'dos-games',
    name: '沙丘魔堡',
    nameEn: 'Dune',
    nameEnSource: 'bundle',
    role: '即时战略',
    tagline: '沙丘II 的中文版——它会自己启动，然后要你点一座房子。',
    logo: '/img/dos-games/sha-qiu-mo-bao.jpg',
    wiki: {title: 'Dune (video game)', url: 'https://en.wikipedia.org/wiki/Dune_(video_game)'},
    wikiZh: {title: '沙丘 (游戏)', url: 'https://zh.wikipedia.org/wiki/%E6%B2%99%E4%B8%98_(%E6%B8%B8%E6%88%8F)'},
    accent: '#B87B3C',
    group: 's',
    related: ['whereq-dosbox'],
    summary:
      'Cryo 与 Virgin Games 1992 年的即时战略游戏，第三波发行的中文版。导入 zip，按下播放键，批处理文件会替你把片头和游戏都跑起来。这一页唯一需要解释的是选阵营的画面：它靠鼠标操作，而快速点按只会移动光标，不会点击。',
    status: '1992',
    url: 'https://dos-bin.zczc.cz/%E6%B2%99%E4%B8%98%E9%AD%94%E5%A0%A1.zip',
    facts: [
      {label: '开发', value: 'Cryo Interactive——与 Virgin Games 合作'},
      {label: '发行', value: 'Virgin Games；中文版由第三波（Soft-World）发行'},
      {label: '发行年份', value: '1992'},
      {label: '平台', value: 'MS-DOS'},
      {label: '类型', value: '即时战略'},
      {label: '语言', value: '繁体中文（Big5）'},
      {label: '启动文件', value: 'DUNE.BAT——自动选中'},
      {label: '游戏包', value: '136 个文件 · 1,743,136 字节'},
    ],
    capabilities: [
      '一场发生在厄拉科斯的即时战略游戏：你在地图上建造，敌方阵营也造起来，而香料正是双方争夺的东西。',
      '两个阵营——阿崔莱与哈克南——各有自己的兵种、建筑和指挥官。',
      '一张随时可以打开的任务图，上面标着每个阵营的部队位置。',
      '同屏双人热座：屏幕下方的面板上写着每个阵营的编号。',
    ],
    notice: {
      title: '关于这次下载',
      text: '本页的归档文件仅供学习、交流与保存之用。沙丘魔堡是 Cryo Interactive、Virgin Games 以及制作中文版的人们的作品；在此发布既不主张他们的权利，也不放弃这些权利。如果你认为这个下载侵犯了许可、著作权或其他权利，请与我们联系，我们会将其下架。',
    },
    sections: [
      {
        title: '这是一款什么游戏',
        blocks: [
          {
            kind: 'paragraph',
            text: '沙丘魔堡是 Dune 的中文版——Cryo Interactive 与 Virgin Games 1992 年的那款冒险战略游戏。这个中文标题是第三波自己的：片头画面在 VIRGIN GAMES 下面写着一行「第三波文化事業 1992 強強滾推出」，整款游戏都是繁体中文。',
          },
          {
            kind: 'paragraph',
            text: '归档里带着原始的安装程序，它点名了作者：INSTALL.EXE 里写着「(c) 1992 Cryo & Virgin Games」。这就是当年出货时的样子——软盘发行，安装程序自己的文本里写着要装哪一张盘：「INSERT DUNE DISK 1 IN DRIVE A:」。',
          },
          {
            kind: 'paragraph',
            text: '中文版把整款游戏都译了，不只是界面：序章是用中文旁白的（「在未來的世界裡 人類已發現了無數的星系…」），地图叫「沙丘地圖」，建造面板用的也是 1990 年代中文本地化的说法。',
          },
        ],
      },
      {
        title: '下载游戏包',
        blocks: [
          {
            kind: 'paragraph',
            text: '这个归档就是上游那个文件，逐字节相同。下面的校验和就是你应当得到的结果。',
          },
          {
            kind: 'table',
            head: ['字段', '值'],
            rows: [
              ['文件', 'sha-qiu-mo-bao.zip'],
              ['大小', '1,743,136 字节'],
              ['SHA-256', '982268c362a646be6454e8fce29c036a8ce1a1a38710f09c260806c621d5d641'],
              ['内容', '136 个文件——游戏本体、数据与原始安装程序'],
              ['来源', 'dos-bin.zczc.cz——生成该页的那个归档'],
            ],
          },
          {
            kind: 'links',
            items: [
              {
                label: '下载 沙丘魔堡.zip（1.7 MB）',
                href: 'https://dos-bin.zczc.cz/%E6%B2%99%E4%B8%98%E9%AD%94%E5%A0%A1.zip',
                external: false,
              },
            ],
          },
        ],
      },
      {
        title: '在 WhereQ-DOSBox 里运行',
        blocks: [
          {
            kind: 'paragraph',
            text: '这一款完全不需要设置。游戏包里只有一个批处理文件 DUNE.BAT，应用会自己选中它——所以导入 zip，按下播放键就行。',
          },
          {
            kind: 'list',
            items: [
              '把 zip 导入 WhereQ-DOSBox——在手机的「文件」应用里打开它并选择 WhereQ-DOSBox，或使用应用自带的导入功能。',
              '打开这个游戏那一行，点按 Play。应用会启动 DUNE.BAT。',
              'DUNE.BAT 会关掉声音、播放片头 Logo，然后用这一版所配的开关启动游戏。',
            ],
          },
          {
            kind: 'paragraph',
            text: 'DUNE.BAT 全部只有三行：@echo off、logo，然后是 duneprg CHIVGA SDB22227 EMS 386。第一行运行 LOGO.EXE，也就是 Virgin 与第三波的标题卡；第二行启动 DUNEPRG.EXE，带着 VGA 上显示中文的显示开关、一个 Sound Blaster 设置，以及在 386 上的扩展内存。',
          },
          {
            kind: 'paragraph',
            text: '不要运行 INSTALL.EXE。那是 1992 年的软盘安装程序：它要 A: 盘里有 DUNE DISK 1，要 2 500 KB 的空闲空间，并把游戏复制到 C:\\DUNE。归档本身已经是装好的目录结构——跑安装程序只会把游戏放错地方。',
          },
        ],
      },
      {
        title: '怎么玩',
        blocks: [
          {
            kind: 'paragraph',
            text: '先是片头：Virgin Games 的 Logo，然后是写着第三波的那行中文，然后是在沙漠画面上播放的旁白。在屏幕键盘上按空格键来推进旁白——按一次，一行。',
          },
          {
            kind: 'paragraph',
            text: '接着是选阵营的画面：一间王座，屏幕下方面板上写着阵营名，还有一个鼠标光标。这是唯一一处鼠标要紧的画面，而应用对它的处理需要一点耐心。',
          },
          {
            kind: 'list',
            items: [
              '先把鼠标交给 DOSBox：在屏幕键盘上按右键（或在蓝牙键盘上按鼠标右键）打开鼠标捕获。',
              '用屏幕键盘上的方向键移动光标。光标就是画面上那个箭头，方向键移动它。',
              '快速点按只会移动光标，不会点击。按住约半秒再松开，点击才会落下。',
              '点击屏幕左上角或右上角的阵营徽章，选定那个阵营。',
              '点击底部面板上的玩家编号——1 或 2——确认，然后世界地图就出来了。',
            ],
          },
          {
            kind: 'paragraph',
            text: '世界地图叫「沙丘地圖」，它下面的面板写着「結束地圖模式」——那是右侧控制盘的提示，按下它就能退出地图。面板上写着参战阵营的编号，所以第二个人可以在同一块屏幕上选另一个阵营。',
          },
          {
            kind: 'paragraph',
            text: '在模拟器上验证过：片头能播，阵营能选，世界地图能打开，地图上能看到基地，面板上也显示部队数量。建造阶段没有通关——那是接下来要弄清楚的事，而本页的评论正是它该去的地方。',
          },
        ],
      },
      {
        title: '游戏包里有什么',
        blocks: [
          {
            kind: 'table',
            head: ['文件', '是什么'],
            rows: [
              ['DUNE.BAT', '应用启动的启动器。先放 Logo，再进游戏。'],
              ['DUNEPRG.EXE', '游戏本体。'],
              ['LOGO.EXE', 'Virgin Games 与第三波的标题卡，由批处理文件播放。'],
              ['INSTALL.EXE', '1992 年的软盘安装程序。不要运行它——归档已经装好了。'],
              ['*.HSQ', '游戏的数据：地图、兵种、建筑、对话、手册。'],
              ['*.AGD、*.M32', '同样数据的其他格式——游戏自带的压缩格式和它的 32 位版本。'],
              ['FONT16.16P', '游戏绘制文字所用的点阵字体。'],
              ['TABLAT.BIN、VERBIN.BIN', '建筑表与版本信息块。'],
              ['DUNE23S0.SAV、DUNE23S3.SAV、DUNE23S4.SAV', '随这一版附带的存档。'],
              ['WOR16.FON、WOR16.ASC', '西文字体——屏幕上的中文就是靠它们显示的。'],
            ],
          },
        ],
      },
      {
        title: '这些事实的来源',
        blocks: [
          {
            kind: 'list',
            items: [
              '游戏本身——标题卡、旁白序章、选阵营画面与世界地图，都在模拟器上读过。',
              '从归档里读出的 DUNE.BAT：@echo off、logo、duneprg CHIVGA SDB22227 EMS 386。',
              'INSTALL.EXE 自带的字符串：「(c) 1992 Cryo & Virgin Games」、「INSERT DUNE DISK 1 IN DRIVE A:」、「Free disk space= 2500 Kb」，以及它会写入的文件。',
              '上游文件的归档列表与校验和。',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'yan-long-qi-shi-tuan-ii-huang-jin-cheng-zhi-mi',
    collection: 'dos-games',
    name: '炎龙骑士团II‧黄金城之谜',
    nameEn: 'Flame Dragon II: Legend of Golden Castle',
    nameEnSource: 'published',
    role: '奇幻策略',
    tagline: '汉堂的奇幻策略游戏——它会自己启动，而第一章像一部电影。',
    logo: '/img/dos-games/yan-long-qi-shi-tuan-ii-huang-jin-cheng-zhi-mi.jpg',
    wiki: {title: '炎龍騎士團II 黃金城之謎', url: 'https://zh.wikipedia.org/wiki/%E7%82%8E%E9%BE%8D%E9%A8%8E%E5%A3%AB%E5%9C%98II_%E9%BB%83%E9%87%91%E5%9F%8E%E4%B9%8B%E8%AC%8E'},
    wikiZh: {title: '炎龍騎士團II 黃金城之謎', url: 'https://zh.wikipedia.org/wiki/%E7%82%8E%E9%BE%8D%E9%A8%8E%E5%A3%AB%E5%9C%98II_%E9%BB%83%E9%87%91%E5%9F%8E%E4%B9%8B%E8%AC%8E'},
    accent: '#9B1B30',
    group: 'y',
    related: ['whereq-dosbox'],
    summary:
      '《炎龙骑士团》1995 年的续作，繁体中文 DOS 版。导入 zip，按下播放键：应用会选中 FD2.EXE，游戏就跑起来了，连片头动画一起。这一页写下了进去的路线——哪个键跳过影片、剧情对话如何推进、战场上如何移动，以及一场战斗从伤害到经验值是怎么打的。',
    status: '1995',
    url: 'https://dos-bin.zczc.cz/%E7%82%8E%E9%BE%99%E9%AA%91%E5%A3%AB%E5%9B%A22%E9%BB%84%E9%87%91%E5%9F%8E%E4%B9%8B%E8%B0%9C.zip',
    facts: [
      {label: '开发', value: '漢堂國際資訊 — Dynasty International Information Co., Ltd'},
      {label: '发行年份', value: '1995 —— 游戏包里最新的日期是 1995 年 1 月 18 日'},
      {label: '平台', value: 'MS-DOS —— 32 位保护模式（DOS/4GW）'},
      {label: '类型', value: '策略角色扮演（戰棋），带战术战斗'},
      {label: '语言', value: '繁体中文（Big5）'},
      {label: '启动文件', value: 'FD2.EXE —— 自动选中'},
      {label: '声音', value: 'Miles Design Audio Interface Library V3.02，1995 年 1 月 18 日'},
      {label: '游戏包', value: '47 个文件 · 8,155,666 字节'},
    ],
    capabilities: [
      '一段像电影一样播放的开场：月下的城堡、两位坐在王座上的国王，以及站在父亲面前的索尔。',
      '一张战场地图，你一格一格地走，人物会在你撞上他们时开口说话。',
      '剧情之下的战术层：选中的人物周围有一个由四个图标组成的指令环——物理攻击、法术攻击、道具、休息——最终通向一场真正的战斗。把人物移到敌人旁边，从指令环上选攻击，画面会暗下来变成夜景，一柄剑劈下来：海盗掉了血量，游戏给出 31 点经验。',
      '游戏包里带一整套声音系统——Miles Design 库，配有 Ad Lib、Roland、Sound Blaster、Tandy 和 Yamaha 的驱动，以及用来选择的 SETSOUND.EXE。',
      '游戏数据都是普通文件：动画在 ANI.DAT，人物造型在 FDSHAP.DAT，地图在 FDFIELD.DAT，文本在 FDTXT.DAT，图标在 FDICON.B24。',
    ],
    notice: {
      title: '关于这次下载',
      text: '本页的归档文件仅供学习、交流与保存之用。炎龙骑士团II‧黄金城之谜是漢堂國際資訊股份有限公司（Dynasty International Information Co., Ltd）以及制作它的人们的作品；在此发布既不主张他们的权利，也不放弃这些权利。如果你认为这个下载侵犯了许可、著作权或其他权利，请与我们联系，我们会将其下架。',
    },
    sections: [
      {
        title: '这是一款什么游戏',
        blocks: [
          {
            kind: 'paragraph',
            text: '炎龙骑士团II‧黄金城之谜——Fantasy War 2，繁体中文 DOS 版。标题画面上写着制作它的公司：漢堂，下面是一行英文 DYNASTY INTERNATIONAL INFORMATION CO., LTD。',
          },
          {
            kind: 'paragraph',
            text: '它是一个 32 位程序。FD2.EXE 是 DOS/4GW 可执行文件——Rational Systems 的保护模式运行时，版权为 1987 至 1993——并自带一套 WATCOM C/C++ 32 位运行时。游戏包里最新的日期是音频库 Miles Design Audio Interface Library V3.02，1995 年 1 月 18 日，1995 这个年份就是从它来的。',
          },
          {
            kind: 'paragraph',
            text: '声音已经配好了。DIG.INI 和 MDI.INI 都指向 220h 端口上的 Creative Labs Sound Blaster 16——SB16.DIG 和 SBPRO2.MDI——所以你不用做任何设置，游戏就有声音。',
          },
        ],
      },
      {
        title: '下载游戏包',
        blocks: [
          {
            kind: 'paragraph',
            text: '这就是生成该页的那个归档里的原件。下面的校验和就是你应当得到的结果。',
          },
          {
            kind: 'table',
            head: ['字段', '值'],
            rows: [
              ['文件', '炎龙骑士团II‧黄金城之谜.zip'],
              ['大小', '8,155,666 字节'],
              ['SHA-256', 'bd241b639ad5e122faf6996e4dd000fdd3b2a5d7bd55709df17db517e9962ed1'],
              ['内容', '47 个文件——游戏本体、数据与声音驱动'],
              ['来源', 'dos-bin.zczc.cz——生成该页的那个归档'],
            ],
          },
          {
            kind: 'links',
            items: [
              {
                label: '下载 炎龙骑士团II‧黄金城之谜.zip（7.8 MB）',
                href: 'https://dos-bin.zczc.cz/%E7%82%8E%E9%BE%99%E9%AA%91%E5%A3%AB%E5%9B%A22%E9%BB%84%E9%87%91%E5%9F%8E%E4%B9%8B%E8%B0%9C.zip',
                external: false,
              },
            ],
          },
        ],
      },
      {
        title: '在 WhereQ-DOSBox 里运行',
        blocks: [
          {
            kind: 'paragraph',
            text: '没有什么要设置的。游戏包里只有一个要紧的可执行文件 FD2.EXE，应用会自己找到它——所以导入 zip，按下播放键就行。',
          },
          {
            kind: 'list',
            items: [
              '把 zip 导入 WhereQ-DOSBox——在手机的「文件」应用里打开它并选择 WhereQ-DOSBox，或使用应用自带的导入功能。',
              '打开这个游戏那一行，点按 Play。应用会在游戏目录里写一个 RUN.BAT，并通过它运行 FD2。',
              '等一等。屏幕上的第一样东西是 DOSBox 的横幅，然后是游戏自己的标题动画。',
            ],
          },
          {
            kind: 'paragraph',
            text: '除非声音不对，否则不要运行 SETSOUND.EXE。它是 Miles 的配置工具，会写入 DIG.INI 和 MDI.INI——而这两个文件已经在游戏包里了，已经指向 220h 端口上的 Sound Blaster 16。游戏会照原样读取它们。',
          },
        ],
      },
      {
        title: '怎么玩',
        blocks: [
          {
            kind: 'paragraph',
            text: '开场是一段影片，而且很长：月下的城堡、一张用红色笔触勾出的脸、汉堂的卡片，以及红色字标上方的银色数字 2。在屏幕键盘上按空格键可以跳过。',
          },
          {
            kind: 'paragraph',
            text: '影片之后是标题菜单：START、LOAD 和 CONTINUE，英文，蓝底加一条红色横幅。空格键开始新游戏——这个画面上鼠标不起作用，所以用键盘。',
          },
          {
            kind: 'paragraph',
            text: '接着剧情以对话展开，右侧是立绘，左侧是文字。第一句是『兒臣索爾，晉見父王陛下』——索尔面见父王；稍后在王座厅里是『到這裡來，讓义王好好看看你。這一陣子國務繁忙，我們父子兩個也很久沒聚聚了』。空格、回车和 Esc 都能推进对话。',
          },
          {
            kind: 'paragraph',
            text: '剧情之后你站在战场上：一张草地与小径组成的地图，你的人物站在上面，四周还有其他人。方向键移动。撞上某人，游戏就会开始和他说话——你遇到的第一个人说的是『……唉！』，故事就从那里继续。',
          },
          {
            kind: 'paragraph',
            text: '在模拟器上验证过：按下播放键游戏就启动，标题菜单出现，片头和剧情都能播放，中文文本齐全，人物能在地图上走动，对话也能开始。随后战场地图与战斗界面也被拆开看了一遍——下一节写下屏幕上有什么、每个键做什么，以及一场战斗从第一步移动到经验值是怎么打的。',
          },
        ],
      },
      {
        title: '战场地图、指令环与一次命中的攻击',
        blocks: [
          {
            kind: 'paragraph',
            text: '战场地图是一张跟随摄像机移动的方格地图。方向键让光标一格一格地移动，右下角的小面板始终描述着光标所在的那一格：地面的图案，加上地形带来的攻击与防御修正。普通地面显示 A+05 D+00，森林显示 A-05 D+10——森林这一组正好对应游戏自己的规则里写的森林（攻 −5%、防 +10%）。',
          },
          {
            kind: 'paragraph',
            text: '把光标停在自己的人身上按空格或回车，游戏会打开这个角色的窗口：姓名、职业、等级、HP、MP、DX、MV、HIT、AP、EV、DP，以及装备及其增加的 AP 与 DP。悠妮是 LV.01 的人類法師，EX·00、HP 028/028、MP 008/008、DX·001、MV·04、HIT·086、AP·011、EV·001、DP·007；亞雷斯是 LV.01 的人類騎士，EX·00、HP 048/048、MP 000/000、DX·002、MV·07、HIT·092、AP·026、EV·002、DP·006，带着一柄刺矛（+AP 020）和一件布衣（+DP 002）；蓋亞是 LV.01 的機械機兵，HP 050/050、MP 000/000、DX·002、MV·04、HIT·092、AP·022、EV·002、DP·014，带着威力手臂（+AP 015）与战斗装甲（+DP 008）。',
          },
          {
            kind: 'paragraph',
            text: '选中的人物周围，游戏会画出一个由四个指令图标组成的环，布局和游戏自带的玩家提示里描述的一样：上是物理攻击，左是法术攻击，右是道具，下是休息。攻击图标画在红底上，另外两个画在蓝底上——红底那个就是此刻可用的指令，空格、回车和 Ins 都能确认它。法术图标周围会闪出火花。在人物身上按空格，指令环打开；再在法师身上按一次，法术列表就出来了——悠妮只會一個法術，火炎術，耗 MP 02。站在空地上按空格，打开的却是另一个环：战场菜单，有系統選單、行軍、設定和結束本回合，在它上面按回车会打开系统菜单，上面写着 MAP·01 TURN·001，列出胜利条件敵全滅与失败条件索爾死亡，并把战场记为 ENEMY·07 FRIEND·04 NPC·00，国库为 ¥00000000。',
          },
          {
            kind: 'paragraph',
            text: 'F1 打开全局地图——整个战场一览，我方是蓝色，敌方是红色。这张地图上的敌人是一群蒙面的海盗，红色头巾罩着深色面罩，人数是可读的：把光标停在其中一个上面，面板会像显示角色那样显示它的 HP（028）。',
          },
          {
            kind: 'paragraph',
            text: '移动一个角色要两步。把光标停在自己的人身上按空格，游戏进入「進行移動」，这个角色的数值出现在左上角的面板里，此时方向键带着光标走，格子面板跟着它走。再按一次空格，角色就走到光标所在的那一格。我们让亞雷斯向西走了三格、向南走了两格，从北边的小径走到一名海盗旁边的草地。',
          },
          {
            kind: 'paragraph',
            text: '站到敌人旁边，指令环就在亞雷斯周围升起，这次红底上是物理攻击，另外两个变成蓝色。空格选定目标：光标跳到那名海盗身上，它的 HP 显示在面板里。再按一次空格，攻击落下。画面暗下来变成有弯月的夜景，一柄剑劈了下来，一侧是亞雷斯 LV·01 HP 048 MP 000，另一侧是盜賊 LV·02。海盗的血量从 028 掉到 007，而游戏也为这一击付了报酬：得到經驗31點！——31 点经验，显示在带角色立绘的面板上。在敌人身上按空格，游戏会展开它的完整资料：盜賊、人類盜賊、LV·02、HP 007/028、EX 007/028、DX·002、MV·04、HIT·097、AP·024、EV·002、DP·004，带着一柄短劍（+AP 010）和一件布衣（+DP 002）。',
          },
          {
            kind: 'paragraph',
            text: '还有没弄明白的：敌人的回合。战场菜单里的「結束本回合」是能选到的——在它上面按 Ins 会弹出「要結束本回合的行動嗎？」，带 YES 和 NO 以及悠妮的立绘——但这个答案无法在应用里给出，所以还没见过敌人移动或反击。指令环也始终只能确认红底那一个：方向键会移动地图光标，却从不改变指令环选中的图标，长按按键、安卓按键事件、数字小键盘的扫描码，以及在图标上点击和拖动，也都没有用。这就是本页评论区的用处。',
          },
          {
            kind: 'paragraph',
            text: '上面这套操作方式是游戏自己的，不是我们定的：人物周围的四个指令与战场菜单的四个条目，布局与游戏玩家提示和中文攻略里描述的完全一致——「人物處按確定：上面：物理攻擊，左面：法術攻擊，下面：休息，右面：物品裝備」，以及「空白處按確定：上=系統選單，左=行軍，右=設定，下=結束本回合」。',
          },
          {
            kind: 'links',
            items: [
              {
                label: '炎龍騎士團2 新手提示 —— 游戏自带的玩家提示（chiuinan.github.io）',
                href: 'http://chiuinan.github.io/game/game/intro/ch/c31/fd2/fd2/notes.htm',
                external: true,
              },
              {
                label: '《炎龙骑士团2黄金城之谜》最全游戏攻略 —— 指令布局（bilibili）',
                href: 'https://www.bilibili.com/read/cv21183751/',
                external: true,
              },
            ],
          },
        ],
      },
      {
        title: '游戏包里有什么',
        blocks: [
          {
            kind: 'table',
            head: ['文件', '是什么'],
            rows: [
              ['FD2.EXE', '游戏本体。按下播放键启动的就是它。'],
              ['ANI.DAT', '动画——片头、立绘与地图上的小人。'],
              ['FDSHAP.DAT、FDFIELD.DAT、FDOTHER.DAT', '人物造型、地图，以及游戏绘制所用的其他一切。'],
              ['FDTXT.DAT、TITLE.DAT', '文本，以及标题画面的数据。'],
              ['FDICON.B24', '图标。'],
              ['FDMUS.DAT、TAI.DAT', '音乐。'],
              ['FD2.SAV、FD2.TMP', '存档文件及其工作副本。'],
              ['DIG.INI、MDI.INI', 'Miles 的声音配置，已经配好 220h 上的 Sound Blaster 16。'],
              ['SETSOUND.EXE', 'Miles 的配置工具。你用不到它。'],
              ['SB16.DIG、SBPRO2.MDI、ADLIB.MDI、ROLAND.MDI、TANDY.MDI、YAMAHA.MDI、…', '声音驱动——这个库认识的每一种声卡各一个。'],
              ['SAMPLE.AD、SAMPLE.OPL、SAMPLE.BNK', '乐器音色与音色库。'],
            ],
          },
        ],
      },
      {
        title: '这些事实的来源',
        blocks: [
          {
            kind: 'list',
            items: [
              '游戏本身——DOSBox 横幅、标题动画、汉堂卡片、开场对话、战场地图、指令环、人物窗口、全局地图、系统菜单，以及一整场战斗：移动、选定目标、夜战动画、伤害与经验结算，都在模拟器上读过。',
              '游戏自带的玩家提示里的操作方式——「新手提示 (操作): 方向鍵 = 移動游標, Space/Enter/Ins+己方人員：進行移動，移動後 上=攻擊，左=施法，右=物品，下=休息, Space/Enter/Ins+空地：上=系統選單，左=行軍，右=設定，下=結束本回合」，以及那张地形表：一般 +5% AP / −5% DP，森林 −5% AP / +10% DP。',
              '介绍指令环布局的中文攻略——「人物處按確定：上面：物理攻擊，左面：法術攻擊，下面：休息，右面：物品裝備」——以及「空白處按確定：上=系統選單，左=行軍，右=設定，下=結束本回合」。',
              '标题画面自己的一行字：DYNASTY INTERNATIONAL INFORMATION CO., LTD。',
              'FD2.EXE 自带的字符串：「DOS/4G Copyright (C) Rational Systems, Inc. 1987 - 1993」以及 WATCOM C/C++ 32 位运行时。',
              '从归档里读出的 DIG.INI 与 MDI.INI：「Miles Design Audio Interface Library V3.02 of 18-Jan-95」，以及 220h 上的 SB16.DIG 和 SBPRO2.MDI。',
              '上游文件的归档列表与校验和。',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'san-guo-zhi-iii',
    collection: 'dos-games',
    name: '三国志III',
    nameEn: 'Romance of the Three Kingdoms III',
    nameEnSource: 'published',
    role: '大战略',
    tagline: '光荣 1993 年的三国战争——而你不改掉应用运行的那条命令，它就不会启动。',
    logo: '/img/dos-games/san-guo-zhi-iii.jpg',
    wiki: {title: 'Romance of the Three Kingdoms III: Dragon of Destiny', url: 'https://en.wikipedia.org/wiki/Romance_of_the_Three_Kingdoms_III:_Dragon_of_Destiny'},
    wikiZh: {title: '三國志III', url: 'https://zh.wikipedia.org/wiki/%E4%B8%89%E5%9C%8B%E5%BF%97III'},
    accent: '#B32A17',
    group: 's',
    related: ['whereq-dosbox'],
    summary:
      '光荣《三国志》系列的第三作，简体中文 DOS 版。导入 zip 之后要改一行：应用会自己去启动 MAIN.EXE，而游戏会立刻退出——启动器是 KOEI.COM。改好之后，整个游戏就打开了：带着诗的开场卡、龙与虎、从 189 年到 235 年的六个剧本，以及一张你可以在其上运兵布将的中国地图。',
    status: '1993',
    url: 'https://dos-bin.zczc.cz/%E4%B8%89%E5%9B%BD%E5%BF%973.zip',
    facts: [
      {label: '开发', value: 'KOEI CO., LTD.（光荣）—— 游戏包自带的 FM 声音驱动里写着'},
      {label: '发行年份', value: '1993 —— 游戏包 35 个文件中有 23 个带着这个年份'},
      {label: '平台', value: 'MS-DOS —— 16 位实模式'},
      {label: '类型', value: '大战略——领地、城池、武将与战斗'},
      {label: '语言', value: '简体中文'},
      {label: '启动文件', value: 'KOEI.COM —— 需要手动设置'},
      {label: '游戏包', value: '35 个文件 · 2,260,444 字节'},
    ],
    capabilities: [
      '六个剧本，从 189 年的「靈帝沒落 董卓進京」到 235 年的「臥龍歸天 姜維繼志」——每一个都从不同的日期、不同的局势开始。',
      '一整张中国地图，城池按主公的颜色标着，还有道路、河流与山脉，军队则画成旗帜。',
      '屏幕顶部一整套指令——休養、軍事、人事、外交、情報、開発、謀略、商人、特別 和 功能——外加一块报出米、弓、马价格的行情面板。',
      '每名武将的名册与他的武力，以及从城里抽走壮丁、把他们编入某位将军旗下的征兵。',
      '以卡片形式出现的开场：抖动处理的画面——武将的头颅、城门——旁边竖排写着诗句。',
    ],
    notice: {
      title: '关于这次下载',
      text: '本页的归档文件仅供学习、交流与保存之用。三国志III 是 KOEI CO., LTD. 以及制作它的人们的作品；在此发布既不主张他们的权利，也不放弃这些权利。如果你认为这个下载侵犯了许可、著作权或其他权利，请与我们联系，我们会将其下架。',
    },
    sections: [
      {
        title: '这是一款什么游戏',
        blocks: [
          {
            kind: 'paragraph',
            text: '三国志III——Romance of the Three Kingdoms III，简体中文 DOS 版。它是一款大战略游戏：一张整个中国的地图，地图上的城池，占据它们的武将，以及他们做买卖的市场。归档里把它叫做三国志III，而这一份是中文版——屏幕上的每一个字都是简体。',
          },
          {
            kind: 'paragraph',
            text: '游戏包点名了自己的作者。启动器会加载的 FM 声音驱动 FMDRV.COM 里写着「Copyright (C) 1991 KOEI CO.,LTD. JAPAN」，而游戏自己的 DOS 外壳是 KOEI.COM。这个外壳被写进了游戏包的 SHELL.SYS——DOS 开机时读它来决定命令提示符是什么。',
          },
          {
            kind: 'paragraph',
            text: '这一份的日期是 1993 年：35 个文件里有 23 个带着这个年份，而游戏本体 MAIN.EXE 的日期是 1994 年 1 月 3 日。中文文本一应俱全——菜单、剧本列表、武将姓名和你下的命令都是简体，不是日文版或英文版。',
          },
          {
            kind: 'paragraph',
            text: '整款游戏就是一个装着普通文件的目录：三个可执行文件、两个 COM 加载器、中文 16 点阵字体、六个剧本文件，以及一堆 .DAT 数据文件。什么都没有压缩，也没有什么需要安装。',
          },
        ],
      },
      {
        title: '下载游戏包',
        blocks: [
          {
            kind: 'paragraph',
            text: '这就是生成该页的那个归档里的原件。下面的校验和就是你应当得到的结果。',
          },
          {
            kind: 'table',
            head: ['字段', '值'],
            rows: [
              ['文件', '三国志3.zip'],
              ['大小', '2,260,444 字节'],
              ['SHA-256', '515ec3ed07caf4948a92923388350ade12df279807c2510b0fdb51bf39f95216'],
              ['内容', '35 个文件——游戏本体、数据与它的 DOS 外壳'],
              ['来源', 'dos-bin.zczc.cz——生成该页的那个归档'],
            ],
          },
          {
            kind: 'links',
            items: [
              {
                label: '下载 三国志3.zip（2.2 MB）',
                href: 'https://dos-bin.zczc.cz/%E4%B8%89%E5%9B%BD%E5%BF%973.zip',
                external: false,
              },
            ],
          },
        ],
      },
      {
        title: '在 WhereQ-DOSBox 里运行',
        blocks: [
          {
            kind: 'paragraph',
            text: '有一处要改，而应用不会替你改。导入 zip，打开这个游戏那一行，点按 Launch…——应用默认会运行 MAIN.EXE，而 MAIN.EXE 单独运行会立刻退出，把你丢回 DOS 提示符。启动器是 KOEI.COM。',
          },
          {
            kind: 'list',
            items: [
              '把 zip 导入 WhereQ-DOSBox——在手机的「文件」应用里打开它并选择 WhereQ-DOSBox，或使用应用自带的导入功能。',
              '打开这个游戏那一行，点按 Launch…。',
              '点按 Clear，然后点按 KOEI.COM 标签。脚本那行会显示 KOEI，这就对了——DOS 会自己补上 .COM。',
              '点按 Play。应用会在游戏目录里写一个 RUN.BAT，并通过它运行 KOEI。',
            ],
          },
          {
            kind: 'paragraph',
            text: 'KOEI.COM 按顺序做这些事：先把 FMDRV.COM 作为常驻声音驱动加载，然后运行 OPEN.EXE，再运行 MAIN.EXE，游戏结束时运行 END.EXE。这些名字都出现在启动器自己的字符串里，顺序也一样。',
          },
          {
            kind: 'paragraph',
            text: '没有安装程序要运行，也没有东西要配置。不要自己去运行 OPEN.EXE 或 END.EXE——KOEI.COM 会替你按正确的顺序运行它们。',
          },
        ],
      },
      {
        title: '怎么玩',
        blocks: [
          {
            kind: 'paragraph',
            text: '开场是一连串卡片。每一张都是抖动处理的画面——蓝色的武将头像、城门——旁边竖排写着诗句。第一张是「滾滾長江東逝水，浪花淘盡英雄」，也就是《三国演义》开篇的那首诗；后面几张讲的是黄巾起义——「十常侍弄權柄，陷害忠良亂朝廷。中平元年關癘氣，大賢良師他自稱。張角舉事造黃旗」。空格键推进卡片。',
          },
          {
            kind: 'paragraph',
            text: '卡片之后是密码画面，然后是龙与虎，还有一张写着「使用滑鼠時，請按滑鼠鍵. 使用鍵盤時，請接著鍵入.」的卡片——用鼠标，或按一个键来输入。按回车，标题菜单就出来了：1. 開始新遊戲, 2. 從進度檔案載入進度, 3. 登錄新武將。',
          },
          {
            kind: 'paragraph',
            text: '这款游戏的每个菜单都是编号式的。输入编号再按回车。新游戏会依次问：几个人玩（0 到 8）、六个剧本选哪个、你是哪位主公、难度如何（初級或高級）、是否先观看其他国家的战事，以及是史實型（历史照旧发生）还是假想型（历史没有发生）。然后它把整个设置回显给你，问「全部都可以了嗎(Y/N)」。',
          },
          {
            kind: 'paragraph',
            text: '主画面是一张中国地图。顶部是指令行——0.休養 1.軍事 2.人事 3.外交 4.情報 5.開發 6.謀略 7.商人 8.特別 9.功能——最下面一行问你要做什么：『劉備，請向23.新野下命令(0-9)?』。右侧面板是你所在的城市：人口、金钱、粮食、兵力、武将与士气，旁边是行情价格，下方是你主公的立绘。',
          },
          {
            kind: 'paragraph',
            text: '軍事下面还有九项：移動、輸送、戰爭準備、戰爭、徵兵、募兵、訓練、再編成 和 造船。选徵兵会问「派誰徵兵(0-13)?」，并打开你名下武将的名册与他们的武力；输入你想要的武将编号，按回车，游戏接着问「徵兵幾百人(1-38)?」。人被抽走了，城市的兵力数字上升，剩下的则分给另一位将军。',
          },
          {
            kind: 'paragraph',
            text: '有一个值得知道的细节：屏幕上显示名册时，输入编号并不会立刻选中那名武将——它会把标记移到那一项并打上一个星号。再按一次回车，游戏才会接受。',
          },
          {
            kind: 'paragraph',
            text: '在模拟器上验证过：游戏通过 KOEI.COM 启动器起来，开场卡和龙虎都播了，标题菜单打开，从零开始设了一局新游戏，中国地图出现，軍事菜单打开，徵兵也一路做到了最后——征到 100 名士兵，城市的数字随之变化。一场战斗没有打，密码画面用的是「abc」而不是游戏给出的那个词。',
          },
        ],
      },
      {
        title: '密码画面',
        blocks: [
          {
            kind: 'paragraph',
            text: '开场卡片之后、龙与虎之前，游戏会问「密碼:」，下面写着「請輸入正確密碼」，答案用红色方括号标出——[孫李李]。这就是防复制画面，而在这个版本里它并不校验：输入「abc」按回车，游戏就当作答对了一样继续下去。',
          },
          {
            kind: 'paragraph',
            text: '所以你不必去输入孫李李——而且也很难输入，因为屏幕键盘上没有中文字符。随便输入什么再按回车就行。',
          },
        ],
      },
      {
        title: '游戏包里有什么',
        blocks: [
          {
            kind: 'table',
            head: ['文件', '是什么'],
            rows: [
              ['KOEI.COM', '启动器——694 字节，也是 SHELL.SYS 里点名的那个文件。它把 FMDRV.COM → OPEN.EXE → MAIN.EXE → END.EXE 串起来。'],
              ['FMDRV.COM', '常驻 FM 声音驱动。带着「Copyright (C) 1991 KOEI CO.,LTD. JAPAN」。'],
              ['OPEN.EXE、MAIN.EXE、END.EXE', '启动器依次运行的三个程序。MAIN.EXE 的日期是 1994 年 1 月 3 日，而且单独运行会立刻退出——这条链子不是可选的。'],
              ['SHELL.SYS', '十个字节：KOEI.COM。DOS 就是启动到它。'],
              ['SANGOKU3.SAV', '存档文件。'],
              ['HAN.16P、NAME.16P', '游戏绘制中文所用的字体——.16P 是 16 像素点阵字体。'],
              ['SNDATA1–6.CIM、SNDATA1–6B.CIM', '六个剧本，以及各自旁边的一套备份。'],
              ['MAPDATA.DAT、GRPDATA.DAT、KAODATA.DAT、PACKDATA.DAT、…', '地图、图形、武将数据，以及游戏的其余数据。'],
            ],
          },
        ],
      },
      {
        title: '这些事实的来源',
        blocks: [
          {
            kind: 'list',
            items: [
              '游戏本身——开场卡、密码画面、龙与虎、标题菜单、剧本列表、中国地图、軍事 菜单，以及一路做到底的徵兵，都在模拟器上读过。',
              'FMDRV.COM 自带的字符串：「Copyright (C) 1991 KOEI CO.,LTD. JAPAN」。',
              'KOEI.COM 自带的字符串：它串联的四个程序，以及它的错误信息——「DISK ERROR  HIT ENTER to RETRY」、「Not enough memory.」、「$ : cannot execute.」、「$ : file access failure.」、「$ : password error occurred.」。',
              '从归档里读出的 SHELL.SYS：KOEI.COM。',
              '上游文件的归档列表与校验和。',
            ],
          },
        ],
      },
    ],
  },
];

/** Each game by its id, for a route that knows the slug. */
export const PLAYED_BY_ID_ZH: Record<string, AtlasEntry> =
  Object.fromEntries(PLAYED_GAMES_ZH.map((game) => [game.id, game]));
