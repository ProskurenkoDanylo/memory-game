import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import NavBar from '../../components/layouts/NavBar';
import ButtonOrLink from '../../ui/ButtonOrLink/ButtonOrLink';
import Container from '../../ui/Container';
import Text from '../../ui/Text';
import GameConfig from '../../types/gameConfig';

import * as S from './ModeChoosing.style';
import bomb from '../../assets/images/Home/bomb.png';
import infinity from '../../assets/images/Home/infinite.png';
import superPowers from '../../assets/images/Home/super.png';

function ModeChoosing() {
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
          <h1>Choose mode</h1>
          <S.DifficultyButtons>
            <ButtonOrLink $colors="#213068" onClick={() => setDifficulty(0)}>
              Classic
            </ButtonOrLink>
            <ButtonOrLink
              $colors="#213068"
              $startIcon={<img src={infinity} alt="" />}
              $endIcon={<img src={infinity} alt="" />}
              onClick={() => setDifficulty(1)}>
              Endless
            </ButtonOrLink>
            <ButtonOrLink
              $colors="#213068"
              $startIcon={<img src={bomb} alt="" />}
              $endIcon={<img src={bomb} alt="" />}
              onClick={() => setDifficulty(2)}>
              Bomb timer
            </ButtonOrLink>
            <ButtonOrLink
              $colors="#213068"
              $startIcon={<img src={superPowers} alt="" />}
              $endIcon={<img src={superPowers} alt="" />}
              onClick={() => setDifficulty(3)}>
              Super powers
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

export default ModeChoosing;
