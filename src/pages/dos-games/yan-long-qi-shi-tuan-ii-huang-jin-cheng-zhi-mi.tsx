import React from 'react';
import DosGamePage from '../../components/DosGames/DosGamePage';
import {PLAYED_BY_ID} from '../../data/games-played';
import {PLAYED_BY_ID_ZH} from '../../data/games-played-zh';

/** 炎龙骑士团II‧黄金城之谜 — the DOS games archive. */
export default function DosGame(): React.JSX.Element {
  return (
    <DosGamePage
      entry={PLAYED_BY_ID['yan-long-qi-shi-tuan-ii-huang-jin-cheng-zhi-mi']}
      entryZh={PLAYED_BY_ID_ZH['yan-long-qi-shi-tuan-ii-huang-jin-cheng-zhi-mi']}
    />
  );
}
