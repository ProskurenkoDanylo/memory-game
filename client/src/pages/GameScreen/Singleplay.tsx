import socketIOClient from 'socket.io-client';
import { useState, useEffect, useContext, useCallback } from 'react';
import { createPortal } from 'react-dom';
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom';
import { FaFire } from 'react-icons/fa';

import GameConfig from '../../types/gameConfig';
import { AuthContext } from '../../context/AuthContext';

import * as S from './GameScreen.style';
import Card from '../../components/Card';
import BattleResults from '../../components/BattleResults';
import Container from '../../ui/Container';
import Modal from '../../ui/Modal/Modal';
import defaultCover from '../../assets/images/default-cover.svg';
import { initializeGame } from '../../api';

import PlayerStats from '../../types/playerStats';

const socket = socketIOClient('https://localhost:3000');

const Singleplay = ({ gameConfig }: { gameConfig: GameConfig | null }) => {
  let navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [game, setGame] = useState<any>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    score: 0,
    comboCounter: 0,
    comboScore: 0,
  });
  const [cardsActive, setCardsActive] = useState<number[]>([]);
  const [results, setResults] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) {
      return navigate('/');
    }
    if (gameConfig) {
      const res = await initializeGame(gameConfig as any);
      const data = await res.json();
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
    }
  }, [gameConfig, isAuthenticated, navigate]);

  const updateCards = useCallback((cardIds: number[], disabled: boolean) => {
    setGame((prev: any) => {
      const newData = { ...prev };
      newData.cards[cardIds[0]].opened = false;
      newData.cards[cardIds[1]].opened = false;
      newData.cards[cardIds[0]].disabled = disabled;
      newData.cards[cardIds[1]].disabled = disabled;
      return newData;
    });
  }, []);

  const match = useCallback(
    (cardIds: number[]) => {
      setTimeout(() => {
        updateCards(cardIds, true);

        setPlayerStats((prev: PlayerStats) => {
          return {
            comboScore: prev.comboCounter * 150,
            comboCounter: prev.comboCounter + 1,
            score: prev.score + 300 + prev.comboCounter * 150,
          };
        });
      }, 1000);

      setTimeout(() => {
        setCardsActive([]);

        if (game?.cards.filter((card: any) => !card.disabled).length === 0) {
          socket.emit('GameEnd');
        }
      }, 1200);
    },
    [game]
  );

  const noMatch = useCallback((cardIds: number[]) => {
    // timeout for remembering cards by player
    setTimeout(() => {
      updateCards(cardIds, false);
    }, 1000);

    // larger timeout for css transition to end
    setTimeout(() => {
      setPlayerStats((prev: PlayerStats) => ({
        ...prev,
        comboCounter: 0,
        comboScore: 0,
      }));
      setCardsActive([]);
    }, 1200);
  }, []);

  const gameEnd = useCallback(() => {
    setResults('won');
    localStorage.setItem('config', JSON.stringify({ multiplayer: false }));
  }, []);

  useEffect(() => {
    fetchData();

    return () => {
      socket.disconnect();
    };
  }, [fetchData]);

  useEffect(() => {
    socket.on('match', match);
    socket.on('no match', noMatch);
    socket.on('gameEnd', gameEnd);

    return () => {
      socket.off('match', match);
      socket.off('no match', noMatch);
      socket.off('gameEnd', gameEnd);
    };
  }, [playerStats]);

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
      {results !== null
        ? createPortal(
            <Modal canClose={false}>
              <BattleResults
                results={results}
                winnerScore={playerStats.score}
              />
            </Modal>,
            document.body
          )
        : null}
      <S.SinglePlayScore alignment="center" fontWeight="bold">
        <FaFire color="#FF7A00" />
        Score:{' '}
        <S.Score>
          <CountUp start={0} end={playerStats.score} delay={0} preserveValue />
          {playerStats.comboScore > 0 && (
            <S.ComboScore key={playerStats.comboScore} className="fade-out">
              {` + ${playerStats.comboScore}`}
            </S.ComboScore>
          )}
        </S.Score>
      </S.SinglePlayScore>
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
