/**
 * Build the Algolia search index for pclegends.games.
 *
 * Instead of crawling the deployed HTML, this pushes a record per game (and a
 * few for the main pages) straight from the catalogue index — the data is
 * already structured, so it is faster and exact. The records follow the
 * DocSearch schema (hierarchy + url + type) so the Docusaurus Algolia search
 * UI renders them.
 *
 * Run it with the **Admin** API key in the environment — never commit that key:
 *
 *   ALGOLIA_ADMIN_KEY=xxxxxxxx npx tsx scripts/algolia-index.ts
 *
 * It clears and rewrites the index, so it is safe to re-run after the games
 * change. The site reads the App ID, the Search-Only key and the index name
 * from src/data/algolia.ts.
 */
import {algoliasearch} from 'algoliasearch';
import {ALGOLIA} from '../src/data/algolia';
import {DOS_GAMES_INDEX} from '../src/data/dos-games-index';
import {DOS_GAME_CATEGORY_BY_ID} from '../src/data/dos-games-categories';

const SITE = 'https://pclegends.games';

const adminKey = process.env.ALGOLIA_ADMIN_KEY;
if (!adminKey) {
  console.error('Set ALGOLIA_ADMIN_KEY (the Admin API key) in the environment.');
  process.exit(1);
}
if (!ALGOLIA.appId || !ALGOLIA.indexName) {
  console.error('src/data/algolia.ts is missing appId/indexName.');
  process.exit(1);
}

type Record = {
  objectID: string;
  url: string;
  hierarchy: Record2;
  content: string | null;
  type: string;
  weight: {pageRank: number; level: number; position: number};
};
type Record2 = {
  lvl0: string;
  lvl1: string | null;
  lvl2: string | null;
  lvl3: null;
  lvl4: null;
  lvl5: null;
  lvl6: null;
};

function hierarchy(lvl0: string, lvl1: string, lvl2: string | null): Record2 {
  return {lvl0, lvl1, lvl2, lvl3: null, lvl4: null, lvl5: null, lvl6: null};
}

const records: Record[] = [];

// One record per game. Both names go in `content`, so a search finds a game by
// its English title or its Chinese one; the result links to the game's page.
for (const g of DOS_GAMES_INDEX) {
  const cats = g.types.map((t) => DOS_GAME_CATEGORY_BY_ID[t]?.label ?? t);
  const lvl1 = g.nameEn || g.name;
  records.push({
    objectID: g.id,
    url: `${SITE}${g.page}`,
    hierarchy: hierarchy('Games', lvl1, g.nameEn ? g.name : null),
    content: [g.name, g.nameEn, g.entry, ...cats].filter(Boolean).join(' · '),
    type: 'lvl1',
    weight: {pageRank: 0, level: 70, position: 0},
  });
}

// The main pages, ranked above the games so they surface for obvious queries.
const PAGES: [string, string][] = [
  ['The DOS games catalogue', '/dos-games/'],
  ['Resources — players & DOS links', '/resources/'],
  ['Played through', '/played/'],
  ['About', '/about/'],
  ['PC Legends — the DOS games archive', '/'],
];
for (const [title, path] of PAGES) {
  records.push({
    objectID: `page:${path}`,
    url: `${SITE}${path}`,
    hierarchy: hierarchy('Pages', title, null),
    content: title,
    type: 'lvl1',
    weight: {pageRank: 10, level: 100, position: 0},
  });
}

async function main() {
  const client = algoliasearch(ALGOLIA.appId, adminKey!);

  console.log(`Setting index settings on "${ALGOLIA.indexName}"…`);
  await client.setSettings({
    indexName: ALGOLIA.indexName,
    indexSettings: {
      searchableAttributes: [
        'unordered(hierarchy.lvl0)',
        'unordered(hierarchy.lvl1)',
        'unordered(hierarchy.lvl2)',
        'content',
      ],
      attributesForFaceting: ['filterOnly(type)'],
      attributesToRetrieve: ['hierarchy', 'content', 'url', 'type'],
      attributesToHighlight: ['hierarchy', 'content'],
      attributesToSnippet: ['content:15'],
      customRanking: ['desc(weight.pageRank)', 'desc(weight.level)', 'asc(weight.position)'],
      ranking: ['words', 'filters', 'typo', 'attribute', 'proximity', 'exact', 'custom'],
      distinct: true,
      attributeForDistinct: 'url',
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
      minWordSizefor1Typo: 3,
      minWordSizefor2Typos: 7,
      ignorePlurals: true,
      advancedSyntax: true,
    },
  });

  console.log(`Clearing and writing ${records.length} records…`);
  await client.clearObjects({indexName: ALGOLIA.indexName});
  await client.saveObjects({
    indexName: ALGOLIA.indexName,
    objects: records as unknown as globalThis.Record<string, unknown>[],
    waitForTasks: true,
  });

  console.log(`Done — ${records.length} records in "${ALGOLIA.indexName}" on app ${ALGOLIA.appId}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
