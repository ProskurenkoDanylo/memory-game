import { useState, useEffect, useRef } from 'react';
import socketIOClient from 'socket.io-client';
import { FaFire } from 'react-icons/fa';

import GameConfig from '../../types/gameConfig';
import Container from '../../ui/Container';
import Text from '../../ui/Text';
import Card from '../../components/Card';
import * as S from './GameScreen.style';

import { initializeGame } from '../../api';
import defaultCover from '../../assets/images/default-cover.svg';

const socket = socketIOClient('https://localhost:3000');

const Multiplayer = ({ gameConfig }: { gameConfig: GameConfig | null }) => {
  const [game, setGame] = useState<any>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [playerComboScore, setPlayerComboScore] = useState(0);
  const [opponentComboScore, setOpponentComboScore] = useState(0);
  const [cardsActive, setCardsActive] = useState<number[]>([]);
  const [playerTurn, setPlayerTurn] = useState(false);

  const playerComboCounter = useRef(0); // for avoiding staleness in socket.io
  const opponentComboCounter = useRef(0); // for avoiding staleness in socket.io
  const playerTurnRef = useRef(playerTurn); // for avoiding staleness in socket.io

  useEffect(() => {
    if (gameConfig) {
      const fetchData = () => {
        return initializeGame(gameConfig as any)
          .then((res) => res.json())
          .then((data) => {
            const newData = {
              ...data,
              cards: data.cards.map((el: any) => ({
                image: el,
                disabled: false,
                opened: false,
              })),
            };
            setGame(newData);
            socket.emit('joinMultiplayer', newData);
          });
      };
      fetchData();
    }
  }, [gameConfig]);

  useEffect(() => {
    socket.on('waitingForOpponent', () => {
      console.log('waiting for opponent'); // TODO beautiful message (waiting)
    });

    socket.on('startGame', () => {
      console.log('ready to start'); // TODO beautiful message (start)
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
            return prev + 300 + comboCounter * 150;
          });
        } else {
          setOpponentComboScore(opponentComboCounter.current * 150);
          setOpponentScore((prev) => {
            const comboCounter = opponentComboCounter.current;
            opponentComboCounter.current += 1;
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

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const handleCardClick = (el: any, ind: number) => {
    socket.emit('cardClicked', el, ind);
  };

  return (
    <Container>
      {game?.time && <Text>Time: {game.time}</Text>}
      {game?.endless && <Text>Endless - Yes</Text>}
      {game?.superPowers && <Text>Super Powers - Yes</Text>}
      {playerTurn ? <Text>My turn</Text> : <Text>Opponent turn</Text>}
      {/* TODO beautiful player battle */}
      <Text alignment="center" fontWeight="bold">
        <FaFire color="#FF7A00" />
        Player Score:{' '}
        <S.Score>
          {playerScore}
          {playerComboScore > 0 && (
            <S.ComboScore key={playerComboScore} className="fade-out">
              {` + ${playerComboScore}`}
            </S.ComboScore>
          )}
        </S.Score>
      </Text>
      <Text alignment="center" fontWeight="bold">
        <FaFire color="#FF7A00" />
        Opponent Score:{' '}
        <S.Score>
          {opponentScore}
          {opponentComboScore > 0 && (
            <S.ComboScore key={opponentComboScore} className="fade-out">
              {` + ${opponentComboScore}`}
            </S.ComboScore>
          )}
        </S.Score>
      </Text>
      <Text alignment="center">Highscore: 44985</Text>
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
              disabled={el.disabled}
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
