/**
 * The two names of a game.
 *
 * The archive files every game under its Chinese name, because that is what
 * the bundle is called — but most of these are Western games under a Chinese
 * title, and a reader looking for *Worms* will not find it under 百战天虫.
 *
 * So a game has two names, and which one leads depends on the reader's
 * language: in the English locale the original title comes first, in the
 * Chinese locale the name the bundle is filed under does. The other name
 * follows underneath — on the game's own page, where there is room for it.
 */
export type GameNames = {
  /** The name to show on the top line. */
  primary: string;
  /** The other name, shown underneath — empty when there is only one. */
  secondary: string;
};

export function gameNames(
  name: string,
  nameEn: string | undefined,
  chinese: boolean,
): GameNames {
  const english = nameEn?.trim();
  if (!english) {
    return {primary: name, secondary: ''};
  }
  if (chinese) {
    return {primary: name, secondary: english};
  }
  return {primary: english, secondary: name};
}
