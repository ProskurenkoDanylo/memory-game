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
  const score = 0;
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);

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
          .then((data) => setGame(data));
      };
      fetchData();
    }
  }, [gameConfig]);

  return (
    <>
      <NavBar />
      <main>
        <Container>
          {game?.time && <Text>Time: {game.time}</Text>}
          {game?.endless && <Text>Endless - Yes</Text>}
          {game?.superPowers && <Text>Super Powers - Yes</Text>}
          <Text alignment="center" fontWeight="bold">
            <FaFire color="#FF7A00" /> Score: {score}
          </Text>
          <Text alignment="center">Highscore: 44985</Text>
          <S.GameBoard>
            {game &&
              game.cards.map((el: any, ind: number) => (
                <Card
                  key={ind + el}
                  border={{
                    borderColor: '#fff',
                    borderWidth: 2,
                    borderStyle: 'solid',
                  }}
                  frontIconURL={el}
                  back={defaultCover}
                  opened={false}
                  onClick={() => {}}
                />
              ))}
          </S.GameBoard>
        </Container>
      </main>
    </>
  );
}

export default GameScreen;
