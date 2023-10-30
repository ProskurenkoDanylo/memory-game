import { useEffect } from 'react';
import * as Helpers from '../utils/multiplayerHelperFunctions';
import { Socket } from 'socket.io-client';

import GameConfig from '../types/gameConfig';

import useMultiplayerSocketLogic from './MultiplayerSocketLogic';

export default function useMultiplayerEffects(
  gameConfig: GameConfig | null,
  state: any,
  socket: Socket
) {
  // Animate dots when the component mounts
  useEffect(() => {
    Helpers.animateDots(state.setDots);
  }, []);

  useEffect(() => {
    // Redirect to home if user is not authenticated
    if (!state.isAuthenticated) {
      return state?.navigate('/');
    }
    if (gameConfig) {
      Helpers.setUpGameAndConnectSocket({
        setGame: state.setGame,
        socket,
        gameConfig,
        user: state?.user,
      });
    }
    return () => {
      socket.disconnect();
    };
  }, [gameConfig]);

  // all the main logic for the multiplayer game is here
  useMultiplayerSocketLogic({
    socket: socket,
    playerTimer: state.playerTimer,
    opponentTimer: state.opponentTimer,
    playerTurn: state.playerTurn,
    stats: state.stats,
    cardsActive: state.cardsActive,
    game: state.game,
    setOpponent: state.setOpponent,
    setPlayerTurn: state.setPlayerTurn,
    setGame: state.setGame,
    setCardsActive: state?.setCardsActive,
    setStats: state.setStats,
    setResults: state.setResults,
    setReveil: state.setReveil,
    setPowers: state.setPowers,
    setWaitingForPlayerDecision: state.setWaitingForPlayerDecision,
  });
}
