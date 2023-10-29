import { useState, useContext } from 'react';
import { useTimer } from 'react-timer-hook';
import { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';
import PlayerStats from '../types/playerStats';
import Powers from '../types/powers';

export default function useMultiplayerState(socket: Socket) {
  const { isAuthenticated, user, contextLoading } = useContext(AuthContext);
  let navigate = useNavigate();
  const [game, setGame] = useState<any>(null);
  const [dots, setDots] = useState('');
  const [opponent, setOpponent] = useState<any>(null);
  const [cardsActive, setCardsActive] = useState<number[]>([]);
  const [playerTurn, setPlayerTurn] = useState(false);
  const [results, setResults] = useState<string | null>(null);
  const [reveil, setReveil] = useState({
    suggested: false,
    used: false,
    on: false,
  });
  const [waitingForPlayerDecision, setWaitingForPlayerDecision] =
    useState<boolean>(false);
  const [powers, setPowers] = useState<{ [key: string]: Powers }>({
    reveilToPlayer: { used: false },
    freezeTimer: { used: false, on: false, onOpponent: false },
    freezeCard: { used: false, selectionMode: false },
  });
  const [stats, setStats] = useState<{ [key: string]: PlayerStats }>({
    player: {
      score: 0,
      comboCounter: 0,
      comboScore: 0,
    },
    opponent: {
      score: 0,
      comboCounter: 0,
      comboScore: 0,
    },
  });

  const timerConfig = {
    autoStart: false,
    expiryTimestamp: new Date(Date.now() + 30000),
    onExpire: () => {
      if (results === null && game?.config?.time) {
        opponent ? socket.emit('Timer End') : null;
      }
    },
  };

  let playerTimer: any = useTimer(timerConfig);
  let opponentTimer: any = useTimer(timerConfig);

  return {
    game,
    dots,
    opponent,
    cardsActive,
    playerTurn,
    results,
    reveil,
    waitingForPlayerDecision,
    powers,
    stats,
    playerTimer,
    opponentTimer,
    navigate,
    setGame,
    setDots,
    setOpponent,
    setCardsActive,
    setPlayerTurn,
    setResults,
    setReveil,
    setWaitingForPlayerDecision,
    setPowers,
    setStats,
    isAuthenticated,
    user,
    contextLoading,
  };
}
