import Container from '../../ui/Container';
import Text from '../../ui/Text';

import * as S from './Home.style';

import landingPreviewImage from '../../assets/images/Home/landing-preview-image.png';
import netflixLogo from '../../assets/images/Home/Netflix_logo.png';
import primeLogo from '../../assets/images/Home/prime_logo.png';
import appleTVLogo from '../../assets/images/Home/apple_tv_logo.png';
import marvelLogo from '../../assets/images/Home/marvel_logo.png';
import bomb from '../../assets/images/Home/bomb.png';
import infinity from '../../assets/images/Home/infinite.png';
import superPowers from '../../assets/images/Home/super.png';
import swords from '../../assets/images/Home/swords.png';
import ButtonOrLink from '../../ui/ButtonOrLink';

function Landing() {
  return (
    <main>
      <section>
        <Container>
          <h1>Memory match game</h1>
          <S.LandingPreviewImg src={landingPreviewImage} alt="" />
          <Text alignment="center">
            Welcome to our exciting Memory Match game! Immerse yourself in the
            world of movies as you challenge your memory skills by matching
            iconic movie posters and characters. Test your knowledge and enjoy
            the thrill of uncovering beloved films in this addictive and
            visually captivating game.
          </Text>
        </Container>
      </section>
      <S.CompaniesBoard>
        <Container>
          <img src={netflixLogo} alt="We have films from Netflix" />
          <img src={primeLogo} alt="We have films from Amazon Prime" />
          <img src={appleTVLogo} alt="We have films from Apple TV" />
          <img src={marvelLogo} alt="We have films from Marvel" />
        </Container>
      </S.CompaniesBoard>
      <section>
        <Container>
          <h2>Try different playing modes</h2>
          <S.ModesBoard>
            <img src={bomb} alt="Bomb timer mode" />
            <img src={infinity} alt="Endless mode" />
            <img src={superPowers} alt="Super powers mode" />
          </S.ModesBoard>
          <Text alignment="center">
            Experience diverse modes in our game: Endless, Bomb Timer, and Super
            Powers. Test your memory skills without time constraints in Endless
            mode, race against the clock in Bomb Timer mode, or unleash your
            inner superhero with special abilities in Super Powers mode. Elevate
            your movie memory game experience now!
          </Text>
        </Container>
      </section>
      <section>
        <Container>
          <h2>And different difficulty levels</h2>
          <S.DifficultyLevels>
            <div>Easy</div>
            <div>Medium</div>
            <div>Hard</div>
          </S.DifficultyLevels>
          <Text alignment="center">
            Experience movie memory mastery in our game's Easy, Medium, and Hard
            modes. Test your skills with progressively challenging levels,
            matching iconic movie posters and characters. Choose your mode,
            immerse yourself in the world of cinema, and enjoy the thrill of
            uncovering beloved films!
          </Text>
        </Container>
      </section>
      <section>
        <Container>
          <h2>Or duel with other players</h2>
          <S.BattleImage src={swords} alt="Illustrating battle image" />
          <Text alignment="center">
            Challenge your friends or compete against players worldwide in
            thrilling head-to-head duels, testing your movie memory prowess and
            aiming for the top spot on the leaderboard. Let the battle begin!
          </Text>
        </Container>
      </section>
      <section>
        <Container>
          <h2>Sounds interesting?</h2>
          <Text alignment="center">
            Sign in now to join the movie memory challenge and prove your skills
            as the ultimate champion!
          </Text>
          <S.CenteredDiv>
            <ButtonOrLink link="/sign-in">Start playing</ButtonOrLink>
          </S.CenteredDiv>
        </Container>
      </section>
    </main>
  );
}

export default Landing;
