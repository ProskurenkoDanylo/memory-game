import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

import { ClipLoader } from 'react-spinners';

import NavBar from '../../components/layouts/NavBar';
import Container from '../../ui/Container';
import Text from '../../ui/Text';
import * as S from './Home.style';

import Landing from './Landing';
import ButtonOrLink from '../../ui/ButtonOrLink/ButtonOrLink';

import computerIcon from '../../assets/images/Home/computer.svg';
import swordsIcon from '../../assets/images/Home/swords.png';

function Home() {
  const { isAuthenticated, user, contextLoading } = useContext(AuthContext);

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
                <ButtonOrLink $endIcon={<img src={computerIcon} />}>
                  Start game
                </ButtonOrLink>
              </p>
              <ButtonOrLink
                $colors={['#c69a00']}
                $endIcon={<img src={swordsIcon} />}>
                Start battle
              </ButtonOrLink>
              <Text alignment="center">OR</Text>
              <ButtonOrLink
                $colors={['#0d66b1', '#c69a00']}
                $colorsDirection={135}>
                Quick start
              </ButtonOrLink>
            </S.GameStartButtons>
            {/* TODO History block (expansible, contains 5 last games) */}
          </Container>
        </main>
      )}
    </>
  );
}

export default Home;
