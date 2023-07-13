import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import NavBar from '../../components/layouts/NavBar';
import ButtonOrLink from '../../ui/ButtonOrLink/ButtonOrLink';
import Container from '../../ui/Container';
import Text from '../../ui/Text';
import GameConfig from '../../types/gameConfig';

import * as S from './DifficultyChoosing.style';

function DifficultyChoosing() {
  const navigate = useNavigate();
  let gameConfig: GameConfig | null = null;

  useEffect(() => {
    const configString = localStorage.getItem('config');
    if (configString !== null) {
      gameConfig = JSON.parse(configString);
    }
    if (!gameConfig || typeof gameConfig.multiplayer !== 'boolean') {
      localStorage.setItem('config', '');
      navigate('/');
    }
  }, []);

  const setDifficulty = (difficulty: number) => {
    localStorage.setItem(
      'config',
      JSON.stringify({ ...gameConfig, difficulty })
    );
    navigate('/game/mode');
  };

  const quickStart = () => {
    localStorage.setItem(
      'config',
      JSON.stringify({
        ...gameConfig,
        difficulty: Math.floor(Math.random() * 3),
        mode: Math.floor(Math.random() * 4),
        category: 'Category',
      })
    );
    navigate('/game/start');
  };

  return (
    <>
      <NavBar />
      <main>
        <Container>
          <h1>Choose level of difficulty</h1>
          <S.DifficultyButtons>
            <ButtonOrLink $colors="#0FB01F" onClick={() => setDifficulty(0)}>
              Easy
            </ButtonOrLink>
            <ButtonOrLink $colors="#C69A00" onClick={() => setDifficulty(1)}>
              Medium
            </ButtonOrLink>
            <ButtonOrLink $colors="#B0180F" onClick={() => setDifficulty(2)}>
              Hard
            </ButtonOrLink>
            <Text alignment="center">OR</Text>
            <ButtonOrLink $colors="#135151" onClick={quickStart}>
              Quick start
            </ButtonOrLink>
          </S.DifficultyButtons>
        </Container>
      </main>
    </>
  );
}

export default DifficultyChoosing;
