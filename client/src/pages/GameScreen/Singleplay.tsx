import socketIOClient from 'socket.io-client';

import { useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import BattleResults from '../../components/BatttleResults';

import { useNavigate } from 'react-router-dom';
import { FaFire } from 'react-icons/fa';
import { useTimer } from 'react-timer-hook';

import GameConfig from '../../types/gameConfig';
import { AuthContext } from '../../context/AuthContext';

import Container from '../../ui/Container';
import Text from '../../ui/Text';
import Card from '../../components/Card';
import * as S from './GameScreen.style';
import { initializeGame } from '../../api';
import PlayerStats from '../../types/playerStats';

import defaultCover from '../../assets/images/default-cover.svg';

const socket = socketIOClient('https://localhost:3000');

const Singleplay = ({ gameConfig }: { gameConfig: GameConfig | null }) => {
  let navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [game, setGame] = useState<any>(null);
  const [gameEnd, setGameEnd] = useState(false);
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    score: 0,
    comboCounter: 0,
    comboScore: 0,
  });
  const [cardsActive, setCardsActive] = useState<number[]>([]);
  const [playerWon, setPlayerWon] = useState(true);
  const timerConfig = {
    autoStart: false,
    expiryTimestamp: new Date(Date.now() + 30000),
    onExpire: () => {
      socket.emit('Timer End');
      setPlayerWon(false);
    },
  };
  const {
    totalSeconds: playerTotalSeconds,
    seconds: playerSeconds,
    minutes: playerMinutes,
    pause: playerTimerPause,
    restart: playerTimerRestart,
  } = useTimer(timerConfig);

  useEffect(() => {
    if (!isAuthenticated) {
      return navigate('/');
    }
    if (gameConfig) {
      const fetchData = async () => {
        return await initializeGame(gameConfig as any)
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
            socket.connect();
            setGame(newData);
            if (newData.config.time) {
              const timer = Date.now() + newData.config.time * 1000;
              playerTimerRestart(new Date(timer), true);
            }
          });
      };
      fetchData();
    }

    return () => {
      socket.disconnect();
    };
  }, [gameConfig]);

  useEffect(() => {
    const match = (cardIds: number[]) => {
      // timeout for remembering cards by player
      setTimeout(() => {
        setGame((prev: any) => {
          const newData = { ...prev };
          newData.cards[cardIds[0]].opened = false;
          newData.cards[cardIds[1]].opened = false;
          newData.cards[cardIds[0]].disabled = true;
          newData.cards[cardIds[1]].disabled = true;
          return newData;
        });
        setPlayerStats((prev) => ({
          comboScore: prev.comboCounter * 150,
          comboCounter: prev.comboCounter + 1,
          score: prev.score + 300 + prev.comboCounter * 150,
        }));
      }, 1000);

      // larger timeout for css transition to end
      setTimeout(() => {
        setCardsActive([]);
      }, 1200);
    };
    const noMatch = (cardIds: number[]) => {
      // timeout for remembering cards by player
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
        setPlayerStats((prev) => ({ ...prev, comboCounter: 0 }));
        playerTimerRestart(
          decreaseTimerOrSetToNow(playerTotalSeconds, 5),
          true
        );
        setCardsActive([]);
      }, 1200);
    };
    const timerEnd = () => {
      setGameEnd(true);
    };
    const gameEnd = () => {
      setTimeout(() => {
        playerTimerPause();
        setGameEnd(true);
      }, 1200);
    };

    socket.on('match', match);
    socket.on('no match', noMatch);
    socket.on('Timer End', timerEnd);
    socket.on('GameEnd', gameEnd);

    return () => {
      socket.off('match', match);
      socket.off('no match', noMatch);
      socket.off('Timer End', timerEnd);
      socket.off('GameEnd', gameEnd);
    };
  }, [playerTotalSeconds, playerStats]);

  const handleCardClick = (card: string, ind: number) => {
    setGame((prev: any) => {
      const newData = { ...prev };
      newData.cards[ind].opened = true;
      return newData;
    });

    setCardsActive((prev) => [...prev, ind]);
    socket.emit('cardClicked', card, ind);
  };

  return (
    <Container>
      {gameEnd !== false
        ? createPortal(
            <BattleResults
              isWinner={playerWon}
              winnerScore={playerStats.score}
            />,
            document.body
          )
        : null}
      {game?.config.time && (
        <Text>
          Time: {playerMinutes}: {playerSeconds}
        </Text>
      )}
      <Text alignment="center" fontWeight="bold">
        <FaFire color="#FF7A00" />
        Score:{' '}
        <S.Score>
          {playerStats.score}
          {playerStats.comboScore > 0 && (
            <S.ComboScore key={playerStats.comboScore} className="fade-out">
              {` + ${playerStats.comboScore}`}
            </S.ComboScore>
          )}
        </S.Score>
      </Text>
      <Text alignment="center">Highscore: 44985</Text>
      <S.GameBoard size={game && Math.sqrt(game.cards.length)}>
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
              back={cardsActive.includes(ind) ? el.image : ''}
              opened={el.opened}
              disabled={el.disabled}
              onClick={
                cardsActive.includes(ind) || cardsActive.length >= 2
                  ? () => {}
                  : () => handleCardClick(el.image, ind)
              }
            />
          ))}
      </S.GameBoard>
    </Container>
  );
};

export default Singleplay;
