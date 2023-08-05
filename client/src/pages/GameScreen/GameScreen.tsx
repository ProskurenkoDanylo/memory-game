import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import GameConfig from '../../types/gameConfig';

import NavBar from '../../components/layouts/NavBar';
import Singleplay from './Singleplay';
import Multiplayer from './Multiplayer';

function GameScreen() {
  const navigate = useNavigate();
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

  return (
    <>
      <NavBar />
      <main>
        {gameConfig?.multiplayer ? (
          <Multiplayer gameConfig={gameConfig} />
        ) : (
          <Singleplay gameConfig={gameConfig} />
        )}
      </main>
    </>
  );
}

export default GameScreen;
