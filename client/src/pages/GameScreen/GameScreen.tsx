import NavBar from '../../components/layouts/NavBar';
import Container from '../../ui/Container';
import Text from '../../ui/Text';
import Card from '../../components/Card';

import * as S from './GameScreen.style';
import { FaFire } from 'react-icons/fa';

import defaultCover from '../../assets/images/default-cover.svg';

function GameScreen() {
  const score = 0;

  return (
    <>
      <NavBar />
      <main>
        <Container>
          <Text alignment="center" fontWeight="bold">
            <FaFire color="#FF7A00" /> Score: {score}
          </Text>
          <Text alignment="center">Highscore: 44985</Text>
          <S.GameBoard>
            {Array(16)
              .fill(0)
              .map((_, ind) => (
                <Card
                  key={ind}
                  border={{
                    borderColor: '#fff',
                    borderWidth: 2,
                    borderStyle: 'solid',
                  }}
                  frontIconURL="https://artofthemovies.co.uk/cdn/shop/products/image2.jpg?v=1654535114"
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
