import { Server } from 'socket.io';
import isEqual from 'lodash/isequal';

let waitingPlayers = [];
const rooms = new Map();
let isMultiplayer = false;

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

            if (numberOfPaired >= pairs) {
              io.to(room).emit('GameEnd');
              if (!gameConfig?.endless) {
                io.to(room).disconnectSockets();
              } else {
                if (pairs < 100) {
                  pairs = (Math.sqrt(pairs) + 2) ** 2;
                }
              }
            }
          } else {
            numberOfPaired += 2;
            socket.emit('match', savedIndexes);
            if (numberOfPaired >= pairs) {
              socket.emit('GameEnd');
            }
          }
        } else {
          if (isMultiplayer) {
            const { room } = rooms.get(socket.id);
            io.to(room).emit('no match', savedIndexes);
          } else {
            socket.emit('no match', savedIndexes);
          }
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

    socket.on('disconnect', () => {
      waitingPlayers = waitingPlayers.filter((el) => el.socket !== socket);
      if (rooms.has(socket.id)) {
        const { room } = rooms.get(socket.id);
        rooms.delete(socket.id);
        socket.leave(room);

        const playersInRoom = io.sockets.adapter.rooms.get(room);
        if (playersInRoom && playersInRoom.size > 0) {
          io.to(room).emit('opponentLeft');
        }
      }

      savedCard = null;
      savedIndexes = [];
    });
  });
}
