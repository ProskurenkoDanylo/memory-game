import { getRandomImagesFromCategory } from '../api';

function generateRandomNumber(limit: number) {
  return Math.floor(Math.random() * limit);
}

/**
 * Generates a game field based on the category and size (which applies to both columns and rows) passed to the function.
 */
export async function generateGame(category: string, size: number) {
  if (size % 2 === 1) {
    console.error(
      "We don't allow fields with non-even size as it will one card left after the rest of the uncovered."
    );
    return [
      {
        error:
          "We don't allow fields with non-even size as it will one card left after the rest of the uncovered.",
      },
    ];
  }
  const numberOfImagesNeeded = (size * size) / 2;
  const randomImages = await getRandomImagesFromCategory(
    category,
    numberOfImagesNeeded
  ).then((res) => res.json());

  const cards = [];
  let used: any = {};

  for (let i = 0; i < size ** 2; i++) {
    let img = (randomImages as any)[generateRandomNumber(size ** 2 / 2)];
    if (!used.hasOwnProperty(img)) {
      used[img] = 1;
    } else if (used[img] === 1) {
      used[img] += 1;
    } else {
      let isUsedTwice = true;
      while (isUsedTwice) {
        img = (randomImages as any)[generateRandomNumber(size ** 2 / 2)];
        if (!used.hasOwnProperty(img) || used[img] < 2) {
          isUsedTwice = false;
          break;
        }
      }
      used[img] ? (used[img] += 1) : (used[img] = 1);
    }

    cards.push(img);
  }

  return cards;
}
