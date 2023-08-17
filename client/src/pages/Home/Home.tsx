import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

import { ClipLoader } from 'react-spinners';

import NavBar from '../../components/layouts/NavBar';
import Container from '../../ui/Container';
import Text from '../../ui/Text';
import * as S from './Home.style';

import Landing from './Landing';
import History from '../../components/History';
import ButtonOrLink from '../../ui/ButtonOrLink/ButtonOrLink';

import computerIcon from '../../assets/images/Home/computer.svg';
import swordsIcon from '../../assets/images/Home/swords.png';

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user, contextLoading } = useContext(AuthContext);

  useEffect(() => {
    const gameConfig = localStorage.getItem('config');
    if (gameConfig) {
      localStorage.setItem('config', '');
    }
  }, []);

  const setMultiplayer = (multiplayer: Boolean) => {
    localStorage.setItem('config', JSON.stringify({ multiplayer }));
    if (multiplayer) {
      navigate('/game/mode');
    } else {
      navigate('/game/difficulty');
    }
  };

  const quickStart = () => {
    localStorage.setItem(
      'config',
      JSON.stringify({
        multiplayer: Boolean(Math.floor(Math.random() * 2)),
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
      {contextLoading ? (
        <ClipLoader
          color="#00ffea"
          size={60}
          cssOverride={{
            display: 'block',
            margin: '10px auto',
          }}
        />
      ) : !isAuthenticated ? (
        <Landing />
      ) : (
        <main>
          <Container>
            <Text alignment="center">
              <S.UserProfileImage src={(user as any)?.profileImg} />
              {(user as any)?.username.split('@')[0]}
            </Text>
            <Text alignment="center">
              <S.Trophy />
              {(user as any)?.highScore || 0}
            </Text>
            <S.GameStartButtons>
              <p>
                <ButtonOrLink
                  $endIcon={<img src={computerIcon} />}
                  onClick={() => setMultiplayer(false)}>
                  Start game
                </ButtonOrLink>
              </p>
              <ButtonOrLink
                $colors={['#c69a00']}
                $endIcon={<img src={swordsIcon} />}
                onClick={() => setMultiplayer(true)}>
                Start battle
              </ButtonOrLink>
              <Text alignment="center">OR</Text>
              <ButtonOrLink
                $colors={['#0d66b1', '#c69a00']}
                $colorsDirection={135}
                onClick={quickStart}>
                Quick start
              </ButtonOrLink>
            </S.GameStartButtons>
          </Container>
          <S.BorderTop>
            <Container>
              <History history={(user as any)?.history} />
            </Container>
          </S.BorderTop>
        </main>
      )}
    </>
  );
}

export default Home;
