import socketIOClient from 'socket.io-client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFire } from 'react-icons/fa';

import GameConfig from '../../types/gameConfig';
import { initializeGame } from '../../api';

import NavBar from '../../components/layouts/NavBar';
import Container from '../../ui/Container';
import Text from '../../ui/Text';
import Card from '../../components/Card';
import * as S from './GameScreen.style';

import defaultCover from '../../assets/images/default-cover.svg';

function GameScreen() {
  const navigate = useNavigate();
  const [game, setGame] = useState<any>(null);
  const [cardsActive, setCardsActive] = useState<number[]>([]);
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);

  const [score, setScore] = useState(0);
  const [comboScore, setComboScore] = useState(0);

  const socket = socketIOClient('https://localhost:3000');

  useEffect(() => {
    const configString = localStorage.getItem('config');
    if (configString !== null) {
      setGameConfig(JSON.parse(configString));
    }
    if (!configString) {
      localStorage.setItem('config', '');
      navigate('/');
    }
  }, []);

  useEffect(() => {
    if (gameConfig !== null) {
      const fetchData = async () => {
        return await initializeGame(gameConfig as any)
          .then((res) => res.json())
          .then((data) => {
            const newData = {
              ...data,
              cards: data.cards.map((el: any) => ({
                image: el,
                disabled: false,
                opened: false,
              })),
            };
            setGame(newData);
          });
      };
      fetchData();
    }
  }, [gameConfig]);

  useEffect(() => {
    socket.on('match', (cardIds, comboCounter) => {
      setTimeout(() => {
        setGame((prev: any) => {
          const newData = { ...prev };
          newData.cards[cardIds[0]].opened = false;
          newData.cards[cardIds[1]].opened = false;
          newData.cards[cardIds[0]].disabled = true;
          newData.cards[cardIds[1]].disabled = true;
          return newData;
        });
        const calculatedComboScore = 300 + 150 * comboCounter;
        setComboScore(comboCounter * 150);
        setScore((prev) => prev + calculatedComboScore);
        setCardsActive([]);
      }, 1000);
    });

    socket.on('no match', (cardIds) => {
      setTimeout(() => {
        setGame((prev: any) => {
          const newData = { ...prev };
          newData.cards[cardIds[0]].opened = false;
          newData.cards[cardIds[1]].opened = false;
          return newData;
        });
        setCardsActive([]);
      }, 1000);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleCardClick = (el: any, ind: number) => {
    setCardsActive((prev) => [...prev, ind]);
    socket.emit('cardClicked', el, ind);
    setGame((prev: any) => {
      const newData = { ...prev };
      newData.cards[ind].opened = true;
      return newData;
    });
  };

  return (
    <>
      <NavBar />
      <main>
        <Container>
          {game?.time && <Text>Time: {game.time}</Text>}
          {game?.endless && <Text>Endless - Yes</Text>}
          {game?.superPowers && <Text>Super Powers - Yes</Text>}
          <Text alignment="center" fontWeight="bold">
            <FaFire color="#FF7A00" />
            Score:{' '}
            <S.Score>
              {score}
              {comboScore > 0 && (
                <S.ComboScore key={comboScore} className="fade-out">
                  {` + ${comboScore}`}
                </S.ComboScore>
              )}
            </S.Score>
          </Text>
          <Text alignment="center">Highscore: 44985</Text>
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
                  back={el.image}
                  opened={el.opened}
                  disabled={el.disabled}
                  onClick={
                    cardsActive.length >= 2 || cardsActive.includes(ind)
                      ? () => {}
                      : () => handleCardClick(el.image, ind)
                  }
                />
              ))}
          </S.GameBoard>
        </Container>
      </main>
    </>
  );
}

export default GameScreen;
