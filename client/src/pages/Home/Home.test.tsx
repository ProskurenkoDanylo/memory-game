import { render, screen } from '@testing-library/react';
import Home from './Home';

describe('Home component', () => {
  it('renders without error', () => {
    render(<Home />);
  });

  it('displays the title correctly', () => {
    render(<Home />);
    const titleElement = screen.getByText('Memory match game');
    expect(titleElement).toBeInTheDocument();
  });

  it('displays the welcome text correctly', () => {
    render(<Home />);
    const welcomeTextElement = screen.getByText(
      /Welcome to our exciting Memory Match game/i
    );
    expect(welcomeTextElement).toBeInTheDocument();
  });

  it('displays the company logos', () => {
    render(<Home />);
    const netflixLogoElement = screen.getByAltText(
      'We have films from Netflix'
    );
    const primeLogoElement = screen.getByAltText(
      'We have films from Amazon Prime'
    );
    const appleTVLogoElement = screen.getByAltText(
      'We have films from Apple TV'
    );
    const marvelLogoElement = screen.getByAltText('We have films from Marvel');

    expect(netflixLogoElement).toBeInTheDocument();
    expect(primeLogoElement).toBeInTheDocument();
    expect(appleTVLogoElement).toBeInTheDocument();
    expect(marvelLogoElement).toBeInTheDocument();
  });

  it('displays the playing modes correctly', () => {
    render(<Home />);
    const bombModeElement = screen.getByAltText('Bomb timer mode');
    const infinityModeElement = screen.getByAltText('Endless mode');
    const superPowersModeElement = screen.getByAltText('Super powers mode');

    expect(bombModeElement).toBeInTheDocument();
    expect(infinityModeElement).toBeInTheDocument();
    expect(superPowersModeElement).toBeInTheDocument();
  });

  it('displays the difficulty levels correctly', () => {
    render(<Home />);
    const easyLevelElement = screen.getByText('Easy');
    const mediumLevelElement = screen.getByText('Medium');
    const hardLevelElement = screen.getByText('Hard');

    expect(easyLevelElement).toBeInTheDocument();
    expect(mediumLevelElement).toBeInTheDocument();
    expect(hardLevelElement).toBeInTheDocument();
  });

  it('displays the duel section correctly', () => {
    render(<Home />);
    const battleImageElement = screen.getByAltText('Illustrating battle image');
    const duelTextElement = screen.getByText(
      /Challenge your friends or compete against players worldwide/i
    );

    expect(battleImageElement).toBeInTheDocument();
    expect(duelTextElement).toBeInTheDocument();
  });

  it('displays the sign-in section correctly', () => {
    render(<Home />);
    const signInTextElement = screen.getByText(
      /Sign in now to join the movie memory challenge/i
    );
    const startPlayingButton = screen.getByRole('link', {
      name: 'Start playing',
    });

    expect(signInTextElement).toBeInTheDocument();
    expect(startPlayingButton).toBeInTheDocument();
    expect(startPlayingButton.getAttribute('href')).toBe('/sign-in');
  });
});
