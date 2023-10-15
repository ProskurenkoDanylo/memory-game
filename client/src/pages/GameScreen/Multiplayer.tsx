import { useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import { useTimer } from 'react-timer-hook';
import { AuthContext } from '../../context/AuthContext';
import { initializeGame } from '../../api';
import { generateGame } from '../../utils/gameFunctions';

import Modal from '../../ui/Modal/Modal';
import Card from '../../components/Card';
import Container from '../../ui/Container';
import TurnSwitch from '../../components/TurnSwitch';
import BattleResults from '../../components/BatttleResults';
import PlayerBattleProfile from '../../components/PlayerBattleProfile';

import User from '../../types/user';
import GameConfig from '../../types/gameConfig';
import PlayerStats from '../../types/playerStats';

import * as S from './GameScreen.style';
import defaultCover from '../../assets/images/default-cover.svg';

const socket = socketIOClient('https://localhost:3000', {
  autoConnect: false,
});

const Multiplayer = ({ gameConfig }: { gameConfig: GameConfig | null }) => {
  let navigate = useNavigate();
  const { isAuthenticated, user, contextLoading } = useContext(AuthContext);

  const [game, setGame] = useState<any>(null);
  const [dots, setDots] = useState('...');
  const [opponent, setOpponent] = useState<any>(null);
  const [cardsActive, setCardsActive] = useState<number[]>([]);
  const [playerTurn, setPlayerTurn] = useState(false);
  const [playerWon, setPlayerWon] = useState<boolean | null>(null);
  const [reveil, setReveil] = useState({
    suggested: false,
    used: false,
    on: false,
  });
  const [waitingForPlayerDecision, setWaitingForPlayerDecision] =
    useState<boolean>(false);
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    score: 0,
    comboCounter: 0,
    comboScore: 0,
  });
  const [opponentStats, setOpponentStats] = useState<PlayerStats>({
    score: 0,
    comboCounter: 0,
    comboScore: 0,
  });

  const timerConfig = {
    autoStart: false,
    expiryTimestamp: new Date(Date.now() + 30000),
    onExpire: () => {
      if (playerWon === null && game?.config?.time) {
        opponent ? socket.emit('Timer End') : null;
      }
    },
  };

  let playerTimer: any = useTimer(timerConfig);
  let opponentTimer: any = useTimer(timerConfig);

  useEffect(() => {
    const interval = setInterval(() => {
      if (dots === '...') {
        setDots('');
      } else {
        setDots((dots) => dots + '.');
      }
    }, 800);
    return () => clearInterval(interval);
  }, [dots]);

  useEffect(() => {
    if (!isAuthenticated) {
      return navigate('/');
    }
    if (gameConfig) {
      const fetchData = () => {
        return initializeGame(gameConfig as any)
          .then((res) => res.json())
          .then((data) => {
            const { cards, ...config } = data;
            const newData = {
              cards: cards.map((el: any) => ({
                image: el,
                disabled: false,
                opened: false,
              })),
              config,
            };
            setGame(newData);
            socket.connect();
            socket.emit('joinMultiplayer', newData, user);
          });
      };
      fetchData();
    }

    return () => {
      socket.disconnect();
    };
  }, [gameConfig]);

  useEffect(() => {
    const startGame = (
      gameConfig: { time: number },
      opponentUserData: User
    ) => {
      setOpponent(opponentUserData);
      if (gameConfig.time) {
        const timer = Date.now() + gameConfig.time * 1000;
        playerTimer?.restart(new Date(timer), true);
        opponentTimer?.restart(new Date(timer), true);
      }
    };

    const pauseBothTimers = () => {
      playerTimer?.pause();
      opponentTimer?.pause();
    };

    const yourTurn = () => {
      playerTimer?.resume();
      opponentTimer?.pause();
      setPlayerTurn(true);
    };
    const opponentTurn = () => {
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

        const updateStats = (prev: PlayerStats) => ({
          comboScore: prev.comboCounter * 150,
          comboCounter: prev.comboCounter + 1,
          score: prev.score + 300 + prev.comboCounter * 150,
        });

        if (playerTurn) {
          setPlayerStats(updateStats);
        } else {
          setOpponentStats(updateStats);
        }
      }, 1000);

      setTimeout(() => {
        if (playerTurn) {
          playerTimer?.restart(
            new Date(Date.now() + playerTimer?.totalSeconds * 1000 + 10000)
          );
        } else {
          opponentTimer?.restart(
            new Date(Date.now() + opponentTimer?.totalSeconds * 1000 + 10000)
          );
        }
        setCardsActive([]);
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
          setPlayerStats((prev) => ({ ...prev, comboCounter: 0 }));
          const autoStart = playerTimer?.totalSeconds <= 5;
          playerTimer?.restart(
            decreaseTimerOrSetToNow(playerTimer?.totalSeconds, 5),
            autoStart
          );
          if (!autoStart) opponentTimer?.resume();
        } else {
          setOpponentStats((prev) => ({ ...prev, comboCounter: 0 }));
          const autoStart = opponentTimer?.totalSeconds <= 5;
          opponentTimer?.restart(
            decreaseTimerOrSetToNow(opponentTimer?.totalSeconds, 5),
            autoStart
          );
          if (!autoStart) playerTimer?.resume();
        }
        setCardsActive([]);
        setPlayerTurn((prev) => !prev);
      }, 1200);
    };
    const timerEnd = () => {
      if (playerTimer?.totalSeconds === 0) {
        setPlayerWon(false);
      } else {
        setPlayerWon(true);
      }
    };
    const gameEnd = () => {
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
        setTimeout(() => {
          pauseBothTimers();
          if (playerStats.score > opponentStats.score) {
            setPlayerWon(true);
            localStorage.setItem(
              'config',
              JSON.stringify({ multiplayer: true })
            );
          } else if (playerStats.score === opponentStats.score) {
            if (playerTurn) {
              setPlayerWon(true);
            } else {
              setPlayerWon(false);
            }
          } else {
            setPlayerWon(false);
            localStorage.setItem(
              'config',
              JSON.stringify({ multiplayer: true })
            );
          }
        }, 1200);
      }
    };
    const restartGame = (newCards: any[]) => {
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
      setReveil((prev) => ({ ...prev, suggested: true }));
    };
    const reveilCards = () => {
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
        setReveil((prev) => ({ ...prev, on: false }));
      }, 3000);
    };
    const disagreeReveilCards = () => {
      setWaitingForPlayerDecision(false);
    };

    socket.on('startGame', startGame);
    socket.on('Your turn', yourTurn);
    socket.on('Opponent turn', opponentTurn);
    socket.on('cardClicked', cardClicked);

    // Sets the game to be equal for both players based on one of those who connected first
    socket.on('setCards', setCards);

    socket.on('match', match);
    socket.on('no match', noMatch);
    socket.on('Timer End', timerEnd);
    socket.on('GameEnd', gameEnd);
    socket.on('RestartGame', restartGame);
    socket.on('reveilCardsSuggestion', reveilCardsSuggestion);
    socket.on('reveilCards', reveilCards);
    socket.on('disagreeReveilCards', disagreeReveilCards);

    return () => {
      socket.off('startGame', startGame);
      socket.off('Your turn', yourTurn);
      socket.off('Opponent turn', opponentTurn);
      socket.off('cardClicked', cardClicked);
      socket.off('setCards', setCards);
      socket.off('match', match);
      socket.off('no match', noMatch);
      socket.off('Timer End', timerEnd);
      socket.off('GameEnd', gameEnd);
      socket.off('RestartGame', restartGame);
    };
  }, [
    playerTimer?.totalSeconds,
    opponentTimer?.totalSeconds,
    playerTurn,
    playerStats,
    opponentStats,
    cardsActive,
  ]);

  const handleCardClick = (card: any, ind: number) => {
    socket.emit('cardClicked', card, ind);
  };

  const handleCardsReveilClick = () => {
    setWaitingForPlayerDecision(true);
    socket.emit('reveilCardsSuggestion');
  };

  const handleCardsReveilDecision = (consent: boolean) => {
    if (consent) {
      socket.emit('reveilCards');
    } else {
      setReveil((prev) => ({ ...prev, suggested: false }));
      socket.emit('disagreeReveilCards');
    }
  };

  return (
    <Container>
      {playerWon !== null // someone Won
        ? createPortal(
            <Modal canClose={false}>
              <BattleResults
                isWinner={playerWon}
                winnerScore={
                  playerWon ? playerStats.score : opponentStats.score
                }
                opponentName={opponent?.username.split('@')[0]}
              />
            </Modal>,
            document.body
          )
        : null}
      <S.Bomb
        animate={
          game?.config?.time &&
          (playerTimer?.totalSeconds === 0 || opponentTimer?.totalSeconds === 0)
        }
      />
      <S.Flex>
        <PlayerBattleProfile
          playerName={(user as any)?.username.split('@')[0]}
          playerProfileImg={
            contextLoading
              ? 'https://picsum.photos/200'
              : (user as any)?.profileImg
          }
          playerAchievements={[]}
          score={playerStats.score}
          comboScore={playerStats.comboScore}
          align="left"
          playerTurn={!opponent ? true : playerTurn}
          timer={
            opponent &&
            game?.config?.time && {
              minutes: playerTimer.minutes,
              seconds: playerTimer.seconds,
            }
          }
          powers={
            game?.config?.endless &&
            opponent && {
              reveil: {
                handler:
                  playerTurn &&
                  (reveil.used ? () => {} : handleCardsReveilClick),
                used: reveil.used,
              },
            }
          }
        />
        {waitingForPlayerDecision && !reveil.used ? (
          <Modal
            closeCallback={() => {
              handleCardsReveilDecision(false);
            }}>
            <S.Suggestion>Waiting for opponent's response...</S.Suggestion>
          </Modal>
        ) : null}
        {reveil.suggested ? (
          <Modal
            closeCallback={() => {
              handleCardsReveilDecision(false);
            }}>
            <S.Suggestion>
              Opponent suggests to use the Reveil power up.
            </S.Suggestion>
            <S.Agree>
              <S.AgreeButton onClick={() => handleCardsReveilDecision(true)}>
                Agree
              </S.AgreeButton>
              <S.Shadow />
            </S.Agree>
            <S.Disagree>
              <S.DisagreeButton
                onClick={() => handleCardsReveilDecision(false)}>
                Disagree
              </S.DisagreeButton>
              <S.Shadow />
            </S.Disagree>
          </Modal>
        ) : null}
        <div>
          {opponent ? (
            <>
              <TurnSwitch playerTurn={playerTurn} />
            </>
          ) : (
            <S.WaitingForPlayer>Matching{dots}</S.WaitingForPlayer>
          )}
        </div>
        <PlayerBattleProfile
          playerName={opponent?.username.split('@')[0]}
          playerProfileImg={opponent?.profileImg}
          playerAchievements={[]}
          score={opponentStats.score}
          comboScore={opponentStats.comboScore}
          align="right"
          playerTurn={!opponent ? true : !playerTurn}
          timer={
            opponent &&
            game?.config?.time && {
              minutes: opponentTimer.minutes,
              seconds: opponentTimer.seconds,
            }
          }
        />
      </S.Flex>
      <S.GameBoard size={game && Math.sqrt(game.cards.length)}>
        {game &&
          game.cards.map((card: any, ind: number) => (
            <Card
              key={ind + card.image}
              border={{
                borderColor: '#fff',
                borderWidth: 2,
                borderStyle: 'solid',
              }}
              frontIconURL={defaultCover}
              /* Preventing cheaters from web dev tools*/
              back={
                cardsActive.includes(ind) || reveil.on
                  ? card.image
                  : defaultCover
              }
              opened={card.opened}
              disabled={opponent ? card.disabled : true}
              onClick={
                reveil.on ||
                cardsActive.includes(ind) ||
                cardsActive.length >= 2 ||
                !playerTurn
                  ? null
                  : () => handleCardClick(card.image, ind)
              }
            />
          ))}
      </S.GameBoard>
    </Container>
  );
};

export default Multiplayer;
