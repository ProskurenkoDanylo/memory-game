import { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import User from '../types/user';
import GameConfig from '../types/gameConfig';
import { generateGame } from '../utils/gameFunctions';
import PlayerStats from '../types/playerStats';
import { TimerResult } from 'react-timer-hook';

// Define the parameters expected by the hook
interface MultiplayerSocketLogicParams {
  socket: Socket;
  playerTimer: TimerResult;
  opponentTimer: TimerResult;
  playerTurn: boolean;
  stats: { [key: string]: PlayerStats };
  cardsActive: number[];
  game: any;
  setStats: React.Dispatch<
    React.SetStateAction<{ [key: string]: PlayerStats }>
  >;
  setOpponent: React.Dispatch<React.SetStateAction<any>>;
  setPlayerTurn: React.Dispatch<React.SetStateAction<boolean>>;
  setGame: React.Dispatch<React.SetStateAction<any>>;
  setCardsActive: React.Dispatch<React.SetStateAction<number[]>>;
  setResults: React.Dispatch<React.SetStateAction<string | null>>;
  setReveil: React.Dispatch<React.SetStateAction<any>>;
  setPowers: React.Dispatch<
    React.SetStateAction<{ [key: string]: { used: boolean } }>
  >;
  setWaitingForPlayerDecision: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create a custom hook for managing multiplayer game logic
const useMultiplayerSocketLogic = (params: MultiplayerSocketLogicParams) => {
  const {
    socket,
    playerTimer,
    opponentTimer,
    playerTurn,
    stats,
    cardsActive,
    game,
    setStats,
    setOpponent,
    setPlayerTurn,
    setGame,
    setCardsActive,
    setResults,
    setReveil,
    setWaitingForPlayerDecision,
    setPowers,
  } = params;

  // function to update stats to make it easier to read
  const updateStats = (
    player: string,
    updater: (prev: PlayerStats) => PlayerStats
  ) => {
    setStats((prev) => ({
      ...prev,
      [player]: updater(prev[player]),
    }));
  };

  // Effect that listens for events from the server and manages game logic
  useEffect(() => {
    const startGame = (
      gameConfig: { time: number },
      opponentUserData: User
    ) => {
      // Initialize the game with configuration and opponent data
      setOpponent(opponentUserData);
      socket.emit('setTimer', gameConfig.time);
    };
    const setTimers = (time: number) => {
      // Set timers for both players
      const timer = Date.now() + time * 1000;
      if (playerTurn) {
        playerTimer?.restart(new Date(timer), true);
        opponentTimer?.restart(new Date(timer), false);
      } else {
        playerTimer?.restart(new Date(timer), false);
        opponentTimer?.restart(new Date(timer), true);
      }
    };
    const pauseBothTimers = () => {
      // Pause both players' timers
      playerTimer?.pause();
      opponentTimer?.pause();
    };
    const yourTurn = () => {
      // Resume the player's timer and pause the opponent's timer
      playerTimer?.resume();
      opponentTimer?.pause();
      setPlayerTurn(true);
    };
    const opponentTurn = () => {
      // Resume the opponent's timer and pause the player's timer
      opponentTimer?.resume();
      playerTimer?.pause();
      setPlayerTurn(false);
    };
    const cardClicked = (ind: number) => {
      setGame((prev: any) => {
        const newData = { ...prev };
        newData.cards[ind].opened = true;
        return newData;
      });

      setCardsActive((prev) => [...prev, ind]);
    };
    const setCards = (game: GameConfig) => setGame(game);
    const match = (cardIds: number[]) => {
      // timeout for remembering cards by player
      pauseBothTimers();

      setTimeout(() => {
        setGame((prev: any) => {
          const newData = { ...prev };
          newData.cards[cardIds[0]].opened = false;
          newData.cards[cardIds[1]].opened = false;
          newData.cards[cardIds[0]].disabled = true;
          newData.cards[cardIds[1]].disabled = true;
          return newData;
        });

        const updateStatsCallback = (prev: PlayerStats) => {
          return {
            comboScore: prev.comboCounter * 150,
            comboCounter: prev.comboCounter + 1,
            score: prev.score + 300 + prev.comboCounter * 150,
          };
        };

        if (playerTurn) {
          updateStats('player', updateStatsCallback);
        } else {
          updateStats('opponent', updateStatsCallback);
        }
      }, 1000);

      setTimeout(() => {
        if (game.config.bombTimer) {
          if (playerTurn) {
            playerTimer?.restart(
              new Date(Date.now() + playerTimer?.totalSeconds * 1000 + 10000)
            );
          } else {
            opponentTimer?.restart(
              new Date(Date.now() + opponentTimer?.totalSeconds * 1000 + 10000)
            );
          }
        } else if (playerTurn) {
          playerTimer?.resume();
        } else {
          opponentTimer?.resume();
        }
        setCardsActive([]);
        setPowers((prev: any) => {
          const { ...prevFreezeTimer } = prev.freezeTimer;
          return {
            ...prev,
            freezeTimer: { ...prevFreezeTimer, on: false, onOpponent: false },
          };
        });
        if (game?.cards.filter((card: any) => !card.disabled).length === 0) {
          socket.emit('GameEnd');
        }
      }, 1200);
    };
    const noMatch = (cardIds: number[]) => {
      // timeout for remembering cards by player
      pauseBothTimers();

      setTimeout(() => {
        setGame((prev: any) => {
          const newData = { ...prev };
          newData.cards[cardIds[0]].opened = false;
          newData.cards[cardIds[1]].opened = false;
          return newData;
        });
      }, 1000);

      // larger timeout for css transition to end
      setTimeout(() => {
        const decreaseTimerOrSetToNow = (
          totalSeconds: number,
          secondsToDecrease: number
        ) => {
          return totalSeconds > secondsToDecrease
            ? new Date(
                Date.now() + totalSeconds * 1000 - secondsToDecrease * 1000
              )
            : new Date(Date.now());
        };

        if (playerTurn) {
          updateStats('player', (prev) => ({
            ...prev,
            comboCounter: 0,
            comboScore: 0,
          }));
          if (game.config.bombTimer) {
            const autoStart = playerTimer?.totalSeconds <= 5;
            playerTimer?.restart(
              decreaseTimerOrSetToNow(playerTimer?.totalSeconds, 5),
              autoStart
            );
            if (!autoStart) {
              opponentTimer?.resume();
            }
          }
          opponentTimer?.resume();
        } else {
          updateStats('opponent', (prev) => ({
            ...prev,
            comboCounter: 0,
            comboScore: 0,
          }));
          if (game.config.bombTimer) {
            const autoStart = opponentTimer?.totalSeconds <= 5;
            opponentTimer?.restart(
              decreaseTimerOrSetToNow(opponentTimer?.totalSeconds, 5),
              autoStart
            );
            if (!autoStart) {
              playerTimer?.resume();
            }
          }
          playerTimer?.resume();
        }
        setCardsActive([]);
        setPlayerTurn((prev) => !prev);
        setPowers((prev: any) => {
          const { ...prevFreezeTimer } = prev.freezeTimer;
          return {
            ...prev,
            freezeTimer: { ...prevFreezeTimer, on: false, onOpponent: false },
          };
        });
      }, 1200);
    };
    const timerEnd = () => {
      // Handle the event when a player's timer runs out
      if (opponentTimer.totalSeconds > playerTimer.totalSeconds) {
        setResults('loose');
      } else {
        setResults('won');
      }
      pauseBothTimers();
    };
    const gameEnd = () => {
      // Handle the end of the game when there is no cards left
      if (game?.config?.endless) {
        setTimeout(async () => {
          const amount =
            game.cards.length < 100 ? Math.sqrt(game.cards.length) + 2 : 10;
          const newCards = await generateGame(game.config.category, amount);
          if (newCards[0].error) {
            throw new Error(newCards[0].error);
          }
          socket.emit('RestartGame', newCards);
        }, 1200);
      } else {
        pauseBothTimers();
        if (stats.player.score > stats.opponent.score) {
          setResults('won');
        } else if (stats.player.score === stats.opponent.score) {
          setResults('draw');
        } else {
          setResults('loose');
        }

        localStorage.setItem('config', JSON.stringify({ multiplayer: true }));
      }
    };
    const restartGame = (newCards: any[]) => {
      // Restart the game with new cards
      const { config } = game;
      const newData = {
        cards: newCards.map((card: any) => ({
          image: card,
          disabled: false,
          opened: false,
        })),
        config,
      };
      setGame(newData);
      setCardsActive([]);
    };
    const reveilCardsSuggestion = () => {
      setReveil((prev: any) => ({ ...prev, suggested: true }));
    };
    const reveilCards = () => {
      // Reveal all cards temporarily
      setReveil({ suggested: false, used: true, on: true });
      setGame((prev: any) => {
        const newData = { ...prev };
        newData.cards.map((card: any) => (card.opened = true));
        return newData;
      });
      setTimeout(() => {
        setGame((prev: any) => {
          const newData = { ...prev };
          newData.cards.map((card: any, index: number) => {
            if (!cardsActive.includes(index)) {
              card.opened = false;
            } else {
              card.opened = true;
            }
          });
          return newData;
        });
        setReveil((prev: any) => ({ ...prev, on: false }));
      }, 3000);
    };
    const disagreeReveilCards = () => {
      setWaitingForPlayerDecision(false);
    };
    const freezeTimer = () => {
      playerTimer?.pause();
      setPowers((prev: any) => {
        const { ...prevFreezeTimer } = prev.freezeTimer;
        return {
          ...prev,
          freezeTimer: { ...prevFreezeTimer, used: true, on: true },
        };
      });
    };
    const unfreezeTimer = (player: string) => {
      if (player === 'player') {
        // Handle unfreezing the player's timer
        if (playerTurn) {
          playerTimer.resume();
        }
        setPowers((prev: any) => {
          const { ...prevFreezeTimer } = prev.freezeTimer;
          return {
            ...prev,
            freezeTimer: { ...prevFreezeTimer, on: false },
          };
        });
      } else {
        // Handle unfreezing the opponent's timer
        if (!playerTurn) {
          opponentTimer.resume();
        }
        setPowers((prev: any) => {
          const { ...prevFreezeTimer } = prev.freezeTimer;
          return {
            ...prev,
            freezeTimer: { ...prevFreezeTimer, onOpponent: false },
          };
        });
      }
    };
    const reveilCardsToPlayer = () => {
      setPowers((prev: any) => ({ ...prev, reveilToPlayer: { used: true } }));
      setReveil((prev: any) => ({ ...prev, on: true }));
      setGame((prev: any) => {
        const newData = { ...prev };
        newData.cards.map((card: any) => {
          card.opened = true;
        });
        return newData;
      });
      setTimeout(() => {
        setGame((prev: any) => {
          const newData = { ...prev };
          newData.cards.map((card: any, index: number) => {
            if (!cardsActive.includes(index)) {
              card.opened = false;
            } else {
              card.opened = true;
            }
          });
          return newData;
        });
        setReveil((prev: any) => ({ ...prev, on: false }));
      }, 3000);
    };
    const freezeCard = (index: number, player: string) => {
      // Freeze a specific card

      if (player === 'player') {
        setPowers((prev: any) => ({ ...prev, freezeCard: { used: true } }));
      }
      setGame((prev: any) => {
        const newData = { ...prev };
        newData.cards[index].frozen = true;
        return newData;
      });
    };
    const unfreezeCard = (index: number) => {
      setGame((prev: any) => {
        const newData = { ...prev };
        newData.cards[index].frozen = false;
        return newData;
      });
    };
    const powerUpUsed = (power: string) => {
      switch (power) {
        case 'reveilCards':
          console.log('The opponent used the Reveil Cards power up');
          break;
        case 'freezeTimer':
          opponentTimer.pause();
          setPowers((prev: any) => {
            const { ...prevFreezeTimer } = prev.freezeTimer;
            return {
              ...prev,
              freezeTimer: { ...prevFreezeTimer, onOpponent: true },
            };
          });
          console.log('The opponent used the Freeze Timer power up');
          break;
        case 'freezeCard':
          console.log('The opponent used the Freeze Card power up');
          break;
      }
    };
    const opponentDisconnected = () => {
      // Handle the event when the opponent disconnects
      console.log('opponent disconnected');
    };

    socket.on('startGame', startGame);
    socket.on('setTimers', setTimers);
    socket.on('Your turn', yourTurn);
    socket.on('Opponent turn', opponentTurn);
    socket.on('cardClicked', cardClicked);

    // Sets the game to be equal for both players based on one of those who connected first
    socket.on('setCards', setCards);

    socket.on('match', match);
    socket.on('no match', noMatch);
    socket.on('Timer End', timerEnd);
    socket.on('gameEnd', gameEnd);
    socket.on('RestartGame', restartGame);
    socket.on('reveilCardsSuggestion', reveilCardsSuggestion);
    socket.on('reveilCards', reveilCards);
    socket.on('disagreeReveilCards', disagreeReveilCards);
    socket.on('freezeTimer', freezeTimer);
    socket.on('unfreezeTimer', unfreezeTimer);
    socket.on('reveilCardsToPlayer', reveilCardsToPlayer);
    socket.on('freezeCard', freezeCard);
    socket.on('unfreezeCard', unfreezeCard);
    socket.on('powerUpUsed', powerUpUsed);
    socket.on('opponentLeft', opponentDisconnected);

    return () => {
      socket.off('startGame', startGame);
      socket.off('setTimers', setTimers);
      socket.off('Your turn', yourTurn);
      socket.off('Opponent turn', opponentTurn);
      socket.off('cardClicked', cardClicked);
      socket.off('setCards', setCards);
      socket.off('match', match);
      socket.off('no match', noMatch);
      socket.off('Timer End', timerEnd);
      socket.off('GameEnd', gameEnd);
      socket.off('RestartGame', restartGame);
      socket.off('freezeTimer', freezeTimer);
      socket.off('unfreezeTimer', unfreezeTimer);
      socket.off('reveilCardsToPlayer', reveilCardsToPlayer);
      socket.off('freezeCard', freezeCard);
      socket.off('unfreezeCard', unfreezeCard);
      socket.off('powerUpUsed', powerUpUsed);
      socket.off('opponentLeft', opponentDisconnected);
    };
  }, [
    playerTimer?.totalSeconds,
    opponentTimer?.totalSeconds,
    playerTurn,
    stats,
    cardsActive,
  ]);
};

export default useMultiplayerSocketLogic;
