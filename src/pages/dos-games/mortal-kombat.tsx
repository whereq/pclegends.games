import React from 'react';
import DosGamePage from '../../components/DosGames/DosGamePage';
import {PLAYED_BY_ID} from '../../data/games-played';
import {PLAYED_BY_ID_ZH} from '../../data/games-played-zh';

/** 真人快打 — the DOS games archive. */
export default function DosGame(): React.JSX.Element {
  return (
    <DosGamePage
      entry={PLAYED_BY_ID['mortal-kombat']}
      entryZh={PLAYED_BY_ID_ZH['mortal-kombat']}
    />
  );
}
