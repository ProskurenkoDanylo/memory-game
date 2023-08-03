import { getRandomImages } from './models/category.model';

interface Game {
  multiplayer?: Boolean;
  time?: number; // only in single mode if the difficulty is chosen
  cards?: any[];
  endless?: Boolean; // only in single mode
  multiplayerTimer?: Boolean; // only in multiplayer mode
  superPowers?: Boolean;
}

async function createGame(config) {
  const { multiplayer, difficulty, mode, category } = config;
  const game: Game = {};

  game.multiplayer = multiplayer;

  if (!multiplayer) {
    game.time = calculateTimeForDifficulty(difficulty);
  }

  if (mode === 1) {
    game.endless = true;
  } else if (mode === 2 && multiplayer) {
    game.multiplayerTimer = true;
    game.time = 60 * 2; // in seconds
  } else if (mode === 3) {
    game.superPowers = true;
  }

  const cards = await generateCards(category);
  if (!Array.isArray(cards)) {
    return {
      error: `Unable to get cards. What cards returned: ${cards}`,
    };
  } else {
    game.cards = cards;
  }

  return game;
}

function calculateTimeForDifficulty(difficulty: number) {
  let time = 0;

  if (difficulty === 0) {
    time = 5 * 60; // in seconds
  } else if (difficulty === 1) {
    time = 3 * 60; // in seconds
  } else if (difficulty === 2) {
    time = 60; // in seconds
  }

  return time;
}

async function generateCards(category: string) {
  const images = await getRandomImages(category, 8);

  if (!Array.isArray(images) && images.error) {
    return images.error;
  }

  const cards = [];
  let used: any = {};

  for (let i = 0; i < 16; i++) {
    let img = images[generateRandomNumber(8)];
    if (!used.hasOwnProperty(img)) {
      used[img] = 1;
    } else if (used[img] === 1) {
      used[img] += 1;
    } else {
      let isUsedTwice = true;
      while (isUsedTwice) {
        img = images[generateRandomNumber(8)];
        if (!used.hasOwnProperty(img) || used[img] < 2) {
          isUsedTwice = false;
        }
      }
      used[img] ? (used[img] += 1) : (used[img] = 1);
    }

    cards.push(img);
  }

  return cards;
}

function generateRandomNumber(limit: number) {
  return Math.floor(Math.random() * limit);
}

export default createGame;
