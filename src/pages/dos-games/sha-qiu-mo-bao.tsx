import React from 'react';
import DosGamePage from '../../components/DosGames/DosGamePage';
import {PLAYED_BY_ID} from '../../data/games-played';

/** 沙丘魔堡 — the DOS games archive. */
export default function DosGame(): React.JSX.Element {
  return <DosGamePage entry={PLAYED_BY_ID['sha-qiu-mo-bao']} />;
}
