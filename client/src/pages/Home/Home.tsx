import { useContext } from 'react';
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
  const { isAuthenticated, user, contextLoading } = useContext(AuthContext);

  // const history = [
  //   {
  //     game_id: 'fsd',
  //     opponent: 'opponentName',
  //     scoreEarned: 2990,
  //     mode: 'bomb',
  //     movie: 'Avatar',
  //     result: 'win',
  //   },
  //   {
  //     game_id: 'fsd',
  //     opponent: 'opponent2',
  //     scoreEarned: 1112,
  //     mode: 'bomb',
  //     movie: 'Avatar',
  //     result: 'draw',
  //   },
  //   {
  //     game_id: 'fsd',
  //     opponent: 'sus291',
  //     scoreEarned: 3242,
  //     mode: 'bomb',
  //     movie: 'Avatar',
  //     result: 'lose',
  //   },
  // ];

  return (
    <>
      <NavBar />
      {contextLoading && false ? (
        <ClipLoader
          color="#00ffea"
          size={60}
          cssOverride={{
            display: 'block',
            margin: '10px auto',
          }}
        />
      ) : !isAuthenticated && false ? (
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
