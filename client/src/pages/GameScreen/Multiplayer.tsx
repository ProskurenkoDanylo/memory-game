import { useState, useEffect, useRef, useContext } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import Countdown from 'react-countdown';

import { AuthContext } from '../../context/AuthContext';
import GameConfig from '../../types/gameConfig';
import Container from '../../ui/Container';
import Card from '../../components/Card';
import * as S from './GameScreen.style';
import { initializeGame } from '../../api';
import defaultCover from '../../assets/images/default-cover.svg';
import PlayerBattleProfile from '../../components/PlayerBattleProfile';
import BattleResults from '../../components/BatttleResults';

const socket = socketIOClient('https://localhost:3000', {
  autoConnect: false,
});

const Multiplayer = ({ gameConfig }: { gameConfig: GameConfig | null }) => {
  let navigate = useNavigate();
  const { isAuthenticated, user, contextLoading } = useContext(AuthContext);

  const [game, setGame] = useState<any>(null);
  const [opponent, setOpponent] = useState<any>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [playerComboScore, setPlayerComboScore] = useState(0);
  const [opponentComboScore, setOpponentComboScore] = useState(0);
  const [cardsActive, setCardsActive] = useState<number[]>([]);
  const [playerTurn, setPlayerTurn] = useState(false);
  const [dots, setDots] = useState('...');
  const [playerWon, setPlayerWon] = useState<boolean | null>(null);
  const [timer, setTimer] = useState<number>(0);

  const playerScoreRef = useRef(0); // for avoiding staleness in socket.io
  const opponentScoreRef = useRef(0); // for avoiding staleness in socket.io
  const playerComboCounter = useRef(0); // for avoiding staleness in socket.io
  const opponentComboCounter = useRef(0); // for avoiding staleness in socket.io
  const playerTurnRef = useRef(playerTurn); // for avoiding staleness in socket.io

  useEffect(() => {
    const interval = setInterval(() => {
      if (dots === '...') {
        setDots('');
      } else {
        setDots((dots) => dots + '.');
      }
    }, 800);
    return () => clearInterval(interval);
  }, [dots]);

  useEffect(() => {
    if (!isAuthenticated) {
      return navigate('/');
    }
    if (gameConfig) {
      const fetchData = () => {
        return initializeGame(gameConfig as any)
          .then((res) => res.json())
          .then((data) => {
            const { cards, ...config } = data;
            const newData = {
              cards: cards.map((el: any) => ({
                image: el,
                disabled: false,
                opened: false,
              })),
              config,
            };
            setGame(newData);
            socket.connect();
            socket.emit('joinMultiplayer', newData, user);
          });
      };
      fetchData();
    }
  }, [gameConfig]);

  useEffect(() => {
    socket.on('startGame', (opponentUserData) => {
      setOpponent(opponentUserData);
      if (game.config?.time) {
        setTimer(Date.now() + game.config.time * 1000);
      }
    });

    socket.on('Your turn', () => {
      playerTurnRef.current = true;
      setPlayerTurn(true);
    });

    socket.on('Opponent turn', () => {
      playerTurnRef.current = false;
      setPlayerTurn(false);
    });

    socket.on('cardClicked', (ind) => {
      setGame((prev: any) => {
        const newData = { ...prev };
        newData.cards[ind].opened = true;
        return newData;
      });

      setCardsActive((prev) => [...prev, ind]);
    });

    // Sets the game to be equal in both players based on one of those who connected first
    socket.on('setCards', (game) => {
      setGame(game);
    });

    socket.on('match', (cardIds) => {
      // timeout for remembering cards by player
      setTimeout(() => {
        setGame((prev: any) => {
          const newData = { ...prev };
          newData.cards[cardIds[0]].opened = false;
          newData.cards[cardIds[1]].opened = false;
          newData.cards[cardIds[0]].disabled = true;
          newData.cards[cardIds[1]].disabled = true;
          return newData;
        });

        if (playerTurnRef.current) {
          setPlayerComboScore(playerComboCounter.current * 150);
          setPlayerScore((prev) => {
            const comboCounter = playerComboCounter.current;
            playerComboCounter.current += 1;
            playerScoreRef.current = prev + 300 + comboCounter * 150;
            return prev + 300 + comboCounter * 150;
          });
        } else {
          setOpponentComboScore(opponentComboCounter.current * 150);
          setOpponentScore((prev) => {
            const comboCounter = opponentComboCounter.current;
            opponentComboCounter.current += 1;
            opponentScoreRef.current = prev + 300 + comboCounter * 150;
            return prev + 300 + comboCounter * 150;
          });
        }
      }, 1000);

      setTimeout(() => {
        setCardsActive([]);
      }, 1200);
    });

    socket.on('no match', (cardIds) => {
      if (playerTurnRef.current) {
        playerComboCounter.current = 0;
      } else {
        opponentComboCounter.current = 0;
      }

      // timeout for remembering cards by player
      setTimeout(() => {
        setGame((prev: any) => {
          const newData = { ...prev };
          newData.cards[cardIds[0]].opened = false;
          newData.cards[cardIds[1]].opened = false;
          return newData;
        });
        playerTurnRef.current = !playerTurnRef.current;
        setPlayerTurn((prev) => !prev);
      }, 1000);

      // larger timeout for css transition to end
      setTimeout(() => {
        setCardsActive([]);
      }, 1200);
    });

    socket.on('GameEnd', () => {
      setTimeout(() => {
        if (playerScoreRef.current > opponentScoreRef.current) {
          setPlayerWon(true);
          localStorage.setItem('config', JSON.stringify({ multiplayer: true }));
        } else if (playerScoreRef.current === opponentScoreRef.current) {
          if (playerTurnRef.current) {
            setPlayerWon(true);
          } else {
            setPlayerWon(false);
          }
        } else {
          setPlayerWon(false);
          localStorage.setItem('config', JSON.stringify({ multiplayer: true }));
        }
      }, 1200);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const handleCardClick = (el: any, ind: number) => {
    socket.emit('cardClicked', el, ind);
  };

  const timerRenderer = ({
    formatted,
  }: {
    minutes: number;
    seconds: number;
    formatted: any;
  }) => {
    return (
      <S.Timer>
        {formatted.minutes}:{formatted.seconds}
      </S.Timer>
    );
  };

  return (
    <Container>
      {playerWon !== null
        ? createPortal(
            <BattleResults
              isWinner={playerWon}
              winnerScore={playerWon ? playerScore : opponentScore}
              opponentName={opponent?.username.split('@')[0]}
            />,
            document.body
          )
        : null}
      <S.Flex>
        <PlayerBattleProfile
          playerName={(user as any)?.username.split('@')[0]}
          playerProfileImg={
            contextLoading
              ? 'https://picsum.photos/200'
              : (user as any)?.profileImg
          }
          playerAchievements={[]}
          score={playerScore}
          comboScore={playerComboScore}
          align="left"
          playerTurn={opponent ? true : playerTurn}
        />
        <div>
          {timer ? (
            <>
              💣 <Countdown date={timer} renderer={timerRenderer} />
            </>
          ) : null}
          {opponent ? (
            playerTurn ? (
              <S.MyTurn color="#1f57ff" size="30" />
            ) : (
              <S.OpponentTurn color="#ff3131" size="30" />
            )
          ) : (
            <S.WaitingForPlayer>Matching{dots}</S.WaitingForPlayer>
          )}
        </div>
        <PlayerBattleProfile
          playerName={opponent?.username.split('@')[0]}
          playerProfileImg={opponent?.profileImg}
          playerAchievements={[]}
          score={opponentScore}
          comboScore={opponentComboScore}
          align="right"
          playerTurn={opponent ? true : !playerTurn}
        />
      </S.Flex>
      <S.GameBoard>
        {game &&
          game.cards.map((el: any, ind: number) => (
            <Card
              key={ind + el.image}
              border={{
                borderColor: '#fff',
                borderWidth: 2,
                borderStyle: 'solid',
              }}
              frontIconURL={defaultCover}
              /* Preventing cheaters from web dev tools*/
              back={cardsActive.includes(ind) ? el.image : defaultCover}
              opened={el.opened}
              disabled={opponent ? el.disabled : true}
              onClick={
                cardsActive.includes(ind) ||
                cardsActive.length >= 2 ||
                !playerTurn
                  ? null
                  : () => handleCardClick(el.image, ind)
              }
            />
          ))}
      </S.GameBoard>
    </Container>
  );
};

export default Multiplayer;
