import { Server } from 'socket.io';
import isEqual from 'lodash/isequal';

let waitingPlayers = [];
const rooms = new Map();
let isMultiplayer = false;
let cardsFrozen = [];
let unfreezeCounter = {};

function createRoomAndStartGame({
  gameConfig,
  player1,
  player2,
  initialTurn,
  player1UserData,
  player2UserData,
}) {
  const room = `room_${player1.id}_${player2.id}`;
  rooms.set(player1.id, {
    room,
    numberOfPaired: 0,
    opponent: player2.id,
    gameConfig,
  });
  rooms.set(player2.id, {
    room,
    numberOfPaired: 0,
    opponent: player1.id,
    gameConfig,
  });
  player1.join(room);
  player2.join(room);
  player1.emit('startGame', gameConfig, player2UserData);
  player2.emit('startGame', gameConfig, player1UserData);
  if (initialTurn === 0) {
    player1.emit('Your turn');
    player2.emit('Opponent turn');
  } else {
    player2.emit('Your turn');
    player1.emit('Opponent turn');
  }
}

export function initializeSocketIo(server) {
  const io = new Server(server);

  io.on('connection', (socket) => {
    let savedCard = null;
    let savedIndexes = [];
    let numberOfPaired = 0;
    let pairs = 16;

    function resetGame(room, socket, opponent, gameConfig) {
      rooms.set(socket.id, {
        room,
        numberOfPaired: 0,
        opponent,
        gameConfig,
      });
      rooms.set(opponent, {
        room,
        numberOfPaired: 0,
        opponent: socket.id,
        gameConfig,
      });
      numberOfPaired = 0;
      savedIndexes = [];
    }

    socket.on('joinMultiplayer', (game, user) => {
      isMultiplayer = true;
      const opponent = waitingPlayers.filter(
        (el) =>
          isEqual(el.game.config, game.config) &&
          el.user.username !== user.username
      );

      if (opponent.length) {
        waitingPlayers = waitingPlayers.filter(
          (el) => el.socket !== opponent[0].socket
        );
        socket.emit('setCards', opponent[0].game);
        const initialTurn = Math.floor(Math.random() * 2);
        createRoomAndStartGame({
          gameConfig: game.config,
          player1: socket,
          player2: opponent[0].socket,
          initialTurn,
          player1UserData: user,
          player2UserData: opponent[0].user,
        });
      } else {
        waitingPlayers.push({ socket, game, user });
        socket.emit('waitingForOpponent');
      }
    });

    socket.on('setTimer', (time) => {
      if (isMultiplayer) {
        const { room } = rooms.get(socket.id);
        io.to(room).emit('setTimers', time);
      }
    });

    socket.on('GameEnd', () => {
      if (isMultiplayer) {
        const { room, gameConfig } = rooms.get(socket.id);
        if (!gameConfig?.endless) {
          io.to(room).emit('gameEnd');
        } else if (pairs < 100) {
          pairs = (Math.sqrt(pairs) + 2) ** 2;
        }
      }
    });

    socket.on('Timer End', () => {
      if (isMultiplayer) {
        const { room } = rooms.get(socket.id);
        io.to(room).emit('Timer End');
      }
    });

    socket.on('RestartGame', (newCards) => {
      if (isMultiplayer) {
        const player = rooms.get(socket.id);
        const opponent = rooms.get(player.opponent);
        io.to(player.room).emit('RestartGame', newCards);
        resetGame(player.room, socket, opponent, player.gameConfig);
      }
    });

    socket.on('cardClicked', (card, ind) => {
      savedIndexes.push(ind);

      if (isMultiplayer) {
        const { room } = rooms.get(socket.id);
        io.to(room).emit('cardClicked', ind);
      }
      if (savedCard === null) {
        savedCard = card;
      } else {
        if (savedCard === card) {
          if (isMultiplayer) {
            let { room, numberOfPaired, opponent, gameConfig } = rooms.get(
              socket.id
            );

            numberOfPaired += 2;

            rooms.set(socket.id, {
              room,
              numberOfPaired,
              opponent,
              gameConfig,
            });
            rooms.set(opponent, {
              room,
              numberOfPaired,
              opponent: socket.id,
              gameConfig,
            });

            io.to(room).emit('match', savedIndexes);

            if (cardsFrozen.length && pairs - numberOfPaired === 2) {
              const cardIndex = cardsFrozen.shift();
              io.to(room).emit('unfreezeCard', cardIndex);
            }
          } else {
            numberOfPaired += 2;
            socket.emit('match', savedIndexes);
          }
        } else if (isMultiplayer) {
          const { room, opponent } = rooms.get(socket.id);
          if (cardsFrozen.length) {
            if (unfreezeCounter[opponent] >= 1) {
              unfreezeCounter[opponent] = 0;
              const { room } = rooms.get(socket.id);
              const cardIndex = cardsFrozen.shift();
              io.to(room).emit('unfreezeCard', cardIndex);
            }
            if (unfreezeCounter[socket.id] >= 1) {
              unfreezeCounter[socket.id] = 0;
              const { room } = rooms.get(socket.id);
              const cardIndex = cardsFrozen.shift();
              io.to(room).emit('unfreezeCard', cardIndex);
            }

            if (!unfreezeCounter[socket.id]) {
              unfreezeCounter[socket.id] = 1;
            } else {
              unfreezeCounter[socket.id] += 1;
            }
          }

          io.to(room).emit('no match', savedIndexes);
        } else {
          socket.emit('no match', savedIndexes);
        }

        savedCard = null;
        savedIndexes = [];
      }
    });

    socket.on('reveilCardsSuggestion', () => {
      const { opponent } = rooms.get(socket.id);
      io.to(opponent).emit('reveilCardsSuggestion');
    });

    socket.on('reveilCards', () => {
      const { room } = rooms.get(socket.id);

      io.to(room).emit('reveilCards');
    });

    socket.on('disagreeReveilCards', () => {
      const { opponent } = rooms.get(socket.id);

      io.to(opponent).emit('disagreeReveilCards');
    });

    socket.on('reveilToPlayer', () => {
      const { opponent } = rooms.get(socket.id);

      socket.emit('reveilCardsToPlayer');
      io.to(opponent).emit('powerUpUsed', 'reveilCards');
    });

    socket.on('freezeTimer', () => {
      const { opponent } = rooms.get(socket.id);

      socket.emit('freezeTimer');
      io.to(opponent).emit('powerUpUsed', 'freezeTimer');
      setTimeout(() => {
        socket.emit('unfreezeTimer', 'player');
        io.to(opponent).emit('unfreezeTimer', 'opponent');
      }, 10000);
    });

    socket.on('freezeCard', (cardIndex) => {
      const { opponent } = rooms.get(socket.id);
      cardsFrozen.push(cardIndex);

      socket.emit('freezeCard', cardIndex, 'player');
      io.to(opponent).emit('freezeCard', cardIndex, 'opponent');
      io.to(opponent).emit('powerUpUsed', 'freezeCard');
    });

    socket.on('disconnect', () => {
      waitingPlayers = waitingPlayers.filter((el) => el.socket !== socket);
      if (rooms.has(socket.id)) {
        const { room, opponent } = rooms.get(socket.id);
        io.to(opponent).emit('opponentLeft');
      }

      savedCard = null;
      savedIndexes = [];
    });
  });
}
