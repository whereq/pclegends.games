/**
 * The archive in numbers — generated rather than written.
 *
 * The front page shows how many games there are, how big the archive is and
 * how many sit in each category. It reads them from here rather than from
 * the index, so the page does not have to pull the whole catalogue in to
 * print three numbers.
 *
 * Regenerate with `python3 scripts/generate-dos-games.py`. Do not edit it
 * by hand — the generator overwrites it.
 */

/** How many games sit in each category. */
export const DOS_GAMES_BY_CATEGORY: Record<string, number> = {
  "action": 534,
  "adventure": 252,
  "puzzle": 198,
  "real-time-strategy": 51,
  "role-playing": 329,
  "simulation": 325,
  "sports": 13,
  "strategy": 276,
  "tactics": 73,
  "text-adventure": 95,
};

/** The size of the whole archive, in bytes. */
export const DOS_GAMES_BYTES = 38127340107;

/** How many games the archive holds. */
export const DOS_GAMES_COUNT = 1898;
