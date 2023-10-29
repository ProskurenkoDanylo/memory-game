import { AiOutlineEye } from 'react-icons/ai';
import { BsSnow } from 'react-icons/bs';
import { FaHourglassHalf } from 'react-icons/fa';
import { TimerResult } from 'react-timer-hook';

import PlayerBattleProfile from '../components/PlayerBattleProfile';

import User from '../types/user';
import Powers from '../types/powers';
import { initializeGame } from '../api';
import PlayerStats from '../types/playerStats';

type Card = {
  image: any;
  disabled: boolean;
  opened: boolean;
  frozen: boolean;
};

// Fetch game data and transform it
async function fetchData(
  gameConfig: any
): Promise<{ cards: Card[]; config: any }> {
  const res = await initializeGame(gameConfig);
  const data = await res.json();
  const { cards, ...config } = data;
  return {
    cards: cards.map((el: any) => ({
      image: el,
      disabled: false,
      opened: false,
    })),
    config,
  };
}

// Set up the game and connect the socket
export function setUpGameAndConnectSocket({
  setGame,
  socket,
  user,
  gameConfig,
}: any) {
  fetchData(gameConfig).then((newData) => {
    setGame(newData);
    socket.connect();
    socket.emit('joinMultiplayer', newData, user);
  });
}

// Get the player's name from the user object
export function getPlayerName(user?: User | null): string {
  return user?.username?.split('@')[0] || '';
}

// Get the player's profile image URL
export function getPlayerProfileImg(
  user?: User | null,
  contextLoading?: boolean
) {
  return contextLoading ? 'https://picsum.photos/200' : user?.profileImg || '';
}

// Check if it's the player's turn
export function isPlayerTurn(playerTurn: boolean, opponent: User): boolean {
  return opponent ? playerTurn : true;
}

// Get the timer values
export function getTimer(opponent: User, game: any, timer: TimerResult) {
  if (opponent && game?.config?.time) {
    return {
      minutes: timer.minutes,
      seconds: timer.seconds,
    };
  }
  return null;
}

// Count the number of active cards
const countActiveCards = (cards: any[]) => {
  return cards.filter((card) => !card.disabled).length;
};

// Get the powers configuration
export function getPowers(
  game: any,
  opponent: User,
  playerTurn: boolean,
  reveil: any,
  powers: any,
  handleFreezePowerUpClick: () => void,
  handleCardsReveilClick: () => void,
  handlePowerUpClick: (power: string) => void
) {
  type PowerConfig = {
    handler: () => void;
    used: boolean;
    title: string;
    icon: any;
  };

  const powersConfig: {
    [key: string]: PowerConfig;
  } = {};

  if (game?.config?.superPowers && opponent) {
    powersConfig.reveilToPlayer = {
      handler: playerTurn
        ? powers.reveilToPlayer.used
          ? () => {}
          : () => handlePowerUpClick('reveilToPlayer')
        : () => {},
      used: powers.reveilToPlayer.used,
      title: 'Reveil to player',
      icon: <AiOutlineEye size={24} color="#fff" />,
    };
    powersConfig.freezeTimer = {
      handler: playerTurn
        ? !powers.freezeTimer.used
          ? () => handlePowerUpClick('freezeTimer')
          : () => {}
        : () => {},
      used: powers.freezeTimer.used,
      title: 'Freeze timer',
      icon: <FaHourglassHalf size={24} color="#fff" />,
    };
    powersConfig.freezeCard = {
      handler:
        playerTurn && !(countActiveCards(game.cards) <= 4)
          ? powers.freezeCard.used
            ? () => {}
            : () => handleFreezePowerUpClick()
          : () => {},
      used: countActiveCards(game.cards) <= 4 || powers.freezeCard.used,
      title: 'Freeze card',
      icon: <BsSnow size={24} color="#fff" />,
    };
  }

  if (game?.config?.endless && opponent) {
    powersConfig.reveil = {
      handler: playerTurn
        ? !reveil.used
          ? () => handleCardsReveilClick()
          : () => {}
        : () => {},
      used: reveil.used,
      title: 'Reveil',
      icon: <AiOutlineEye size={24} color="#fff" />,
    };
  }

  return powersConfig;
}

// Calculate the winner's score
export function calculateWinnersScore(
  results: string,
  stats: { [key: string]: PlayerStats }
) {
  if (results === 'won' || results === 'draw') {
    return stats.player.score;
  } else {
    return stats.opponent.score;
  }
}

// Animate dots
export function animateDots(
  setDots: React.Dispatch<React.SetStateAction<string>>
) {
  let dotsCounter = 0;
  const interval = setInterval(() => {
    if (dotsCounter >= 3) {
      setDots('');
      dotsCounter = 0;
    } else {
      dotsCounter++;
      setDots((dots) => dots + '.');
    }
  }, 800);
  return () => clearInterval(interval);
}

// Handle card actions
export function CardActions({
  powers,
  reveil,
  cardsActive,
  playerTurn,
  cardIndex,
  card,
  handleCardClick,
  handlePowerUpClick,
}: {
  powers: { [key: string]: Powers };
  reveil: any;
  cardsActive: number[];
  playerTurn: boolean;
  cardIndex: number;
  card: Card;
  handleCardClick: (image: string, index: number) => void;
  handlePowerUpClick: (power: string, selectedCardIndex?: number) => void;
}) {
  if (!powers.freezeCard.used && powers.freezeCard?.selectionMode) {
    if (!card.frozen && !cardsActive.includes(cardIndex)) {
      return () => handlePowerUpClick('freezeCard', cardIndex);
    } else {
      return () => {};
    }
  } else if (
    !reveil?.on &&
    !cardsActive.includes(cardIndex) &&
    !(cardsActive.length >= 2) &&
    !card.frozen &&
    playerTurn
  ) {
    return () => handleCardClick(card.image, cardIndex);
  } else {
    return () => {};
  }
}

// Check if the timer has ended
export function isTimerEnd(
  game: any,
  playerTimer: TimerResult,
  opponentTimer: TimerResult
): boolean {
  return (
    game?.config?.time &&
    (playerTimer?.totalSeconds === 0 || opponentTimer?.totalSeconds === 0)
  );
}

export const createPlayerBattleProfile = ({
  player,
  state,
  handleFreezePowerUpClick,
  handleCardsReveilClick,
  handlePowerUpClick,
}: {
  state: any;
  handleFreezePowerUpClick: () => void;
  handleCardsReveilClick: () => void;
  handlePowerUpClick:
    | (() => void)
    | ((power: string, selectedCardIndex?: number) => void);
  player: User;
}) => (
  <PlayerBattleProfile
    playerName={getPlayerName(player)}
    playerProfileImg={getPlayerProfileImg(player, state?.contextLoading)}
    playerAchievements={[]}
    score={state?.stats[player === state?.user ? 'player' : 'opponent'].score}
    comboScore={
      state?.stats[player === state?.user ? 'player' : 'opponent'].comboScore
    }
    align={player === state?.user ? 'left' : 'right'}
    playerTurn={
      player === state?.user
        ? isPlayerTurn(state?.playerTurn, state?.opponent)
        : isPlayerTurn(!state?.playerTurn, state?.opponent)
    }
    timer={
      state?.opponent &&
      (player === state?.user
        ? {
            time: getTimer(player, state?.game, state?.playerTimer),
            frozen: state?.powers.freezeTimer?.on,
          }
        : {
            time: getTimer(player, state?.game, state?.opponentTimer),
            frozen: state?.powers.freezeTimer?.onOpponent,
          })
    }
    powers={
      state?.opponent &&
      (player === state?.user
        ? getPowers(
            state?.game,
            player,
            state?.playerTurn,
            state?.reveil,
            state?.powers,
            handleFreezePowerUpClick,
            handleCardsReveilClick,
            handlePowerUpClick
          )
        : null)
    }
  />
);
