import { useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import { useTimer } from 'react-timer-hook';
import { AuthContext } from '../../context/AuthContext';
import { initializeGame } from '../../api';

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
      if (playerWon === null) {
        opponent ? socket.emit('Timer End') : null;
      }
    },
  };

  const {
    totalSeconds: playerTotalSeconds,
    seconds: playerSeconds,
    minutes: playerMinutes,
    pause: playerTimerPause,
    resume: playerTimerResume,
    restart: playerTimerRestart,
  } = useTimer(timerConfig);
  const {
    totalSeconds: opponentTotalSeconds,
    seconds: opponentSeconds,
    minutes: opponentMinutes,
    pause: opponentTimerPause,
    resume: opponentTimerResume,
    restart: opponentTimerRestart,
  } = useTimer(timerConfig);

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
        playerTimerRestart(new Date(timer), true);
        opponentTimerRestart(new Date(timer), true);
      }
    };
    const yourTurn = () => {
      playerTimerResume();
      opponentTimerPause();
      setPlayerTurn(true);
    };
    const opponentTurn = () => {
      opponentTimerResume();
      playerTimerPause();
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
      playerTimerPause();
      opponentTimerPause();
      setTimeout(() => {
        setGame((prev: any) => {
          const newData = { ...prev };
          newData.cards[cardIds[0]].opened = false;
          newData.cards[cardIds[1]].opened = false;
          newData.cards[cardIds[0]].disabled = true;
          newData.cards[cardIds[1]].disabled = true;
          return newData;
        });

        if (playerTurn) {
          setPlayerStats((prev) => ({
            comboScore: prev.comboCounter * 150,
            comboCounter: prev.comboCounter + 1,
            score: prev.score + 300 + prev.comboCounter * 150,
          }));
        } else {
          setOpponentStats((prev) => ({
            comboScore: prev.comboCounter * 150,
            comboCounter: prev.comboCounter + 1,
            score: prev.score + 300 + prev.comboCounter * 150,
          }));
        }
      }, 1000);

      setTimeout(() => {
        if (playerTurn) {
          playerTimerRestart(
            new Date(Date.now() + playerTotalSeconds * 1000 + 10000)
          );
        } else {
          opponentTimerRestart(
            new Date(Date.now() + opponentTotalSeconds * 1000 + 10000)
          );
        }
        setCardsActive([]);
      }, 1200);
    };
    const noMatch = (cardIds: number[]) => {
      // timeout for remembering cards by player
      playerTimerPause();
      opponentTimerPause();

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
          const autoStart = playerTotalSeconds <= 5;
          playerTimerRestart(
            decreaseTimerOrSetToNow(playerTotalSeconds, 5),
            autoStart
          );
          if (!autoStart) opponentTimerResume();
        } else {
          setOpponentStats((prev) => ({ ...prev, comboCounter: 0 }));
          const autoStart = opponentTotalSeconds <= 5;
          opponentTimerRestart(
            decreaseTimerOrSetToNow(opponentTotalSeconds, 5),
            autoStart
          );
          if (!autoStart) playerTimerResume();
        }
        setCardsActive([]);
        setPlayerTurn((prev) => !prev);
      }, 1200);
    };
    const timerEnd = () => {
      if (playerTotalSeconds === 0) {
        setPlayerWon(false);
      } else {
        setPlayerWon(true);
      }
    };
    const gameEnd = () => {
      setTimeout(() => {
        playerTimerPause();
        opponentTimerPause();
        if (playerStats.score > opponentStats.score) {
          setPlayerWon(true);
          localStorage.setItem('config', JSON.stringify({ multiplayer: true }));
        } else if (playerStats.score === opponentStats.score) {
          if (playerTurn) {
            setPlayerWon(true);
          } else {
            setPlayerWon(false);
          }
        } else {
          setPlayerWon(false);
          localStorage.setItem('config', JSON.stringify({ multiplayer: true }));
        }
      }, 1200);
    };

    socket.on('startGame', startGame);
    socket.on('Your turn', yourTurn);
    socket.on('Opponent turn', opponentTurn);
    socket.on('cardClicked', cardClicked);

    // Sets the game to be equal in both players based on one of those who connected first
    socket.on('setCards', setCards);

    socket.on('match', match);
    socket.on('no match', noMatch);
    socket.on('Timer End', timerEnd);
    socket.on('GameEnd', gameEnd);

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
    };
  }, [
    playerTotalSeconds,
    opponentTotalSeconds,
    playerTurn,
    playerStats,
    opponentStats,
  ]);

  const handleCardClick = (el: any, ind: number) => {
    socket.emit('cardClicked', el, ind);
  };

  return (
    <Container>
      {playerWon !== null // someone Won
        ? createPortal(
            <BattleResults
              isWinner={playerWon}
              winnerScore={playerWon ? playerStats.score : opponentStats.score}
              opponentName={opponent?.username.split('@')[0]}
            />,
            document.body
          )
        : null}
      <S.Bomb
        animate={playerTotalSeconds === 0 || opponentTotalSeconds === 0}
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
          timer={opponent && { minutes: playerMinutes, seconds: playerSeconds }}
          animateExplosionAfterTimerEnds
        />
        <div>
          {opponent ? (
            <TurnSwitch playerTurn={playerTurn} />
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
            opponent && { minutes: opponentMinutes, seconds: opponentSeconds }
          }
          animateExplosionAfterTimerEnds
        />
      </S.Flex>
      <S.GameBoard>
        {game &&
          game.cards.map((el: any, ind: number) => (
            <Card
              key={ind + el.image}
              border={{
                borderColor: '#fff',
                borderWidth: 2,
                borderStyle: 'solid',
              }}
              frontIconURL={defaultCover}
              /* Preventing cheaters from web dev tools*/
              back={cardsActive.includes(ind) ? el.image : defaultCover}
              opened={el.opened}
              disabled={opponent ? el.disabled : true}
              onClick={
                cardsActive.includes(ind) ||
                cardsActive.length >= 2 ||
                !playerTurn
                  ? null
                  : () => handleCardClick(el.image, ind)
              }
            />
          ))}
      </S.GameBoard>
    </Container>
  );
};

export default Multiplayer;
