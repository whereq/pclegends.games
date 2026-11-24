import React from 'react';
import Giscus from '@giscus/react';
import { useColorMode } from '@docusaurus/theme-common';

/**
 * The comment thread, on every page that opens one.
 *
 * The ids are GitHub's own, and they have to agree with each other:
 * `repoId` is the repository's GraphQL id, and `categoryId` is the GraphQL
 * id of the discussion category the threads live in. The category name has
 * to match the id, or giscus cannot resolve it and the widget cannot open
 * a thread.
 *
 * The threads live in this repository's own Discussions, under **General** —
 * not in the docs hub's. A game page is about the game, and the reader who
 * has just played it is answering here.
 *
 * To read the ids again after a repository is renamed or transferred:
 *
 *     gh api graphql -f query='
 *     query {
 *       repository(owner: "whereq", name: "pclegends.games") {
 *         id
 *         discussionCategories(first: 25) { nodes { id name } }
 *       }
 *     }'
 */
export default function GiscusComments(): React.JSX.Element {
  const { colorMode } = useColorMode();

  return (
    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(245, 166, 35, 0.15)' }}>
      <Giscus
        id="comments"
        repo="whereq/pclegends.games"
        repoId="R_kgDOV6mb3g"
        category="General"
        categoryId="DIC_kwDOV6mb3s4DL5Ik"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={colorMode === 'dark' ? 'dark_dimmed' : 'light'}
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
