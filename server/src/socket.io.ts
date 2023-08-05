import { Server } from 'socket.io';

const waitingPlayers = [];
const rooms = new Map();
let isMultiplayer = false;

function createRoomAndStartGame(player1, player2, initialTurn) {
  const room = `room_${player1.id}_${player2.id}`;
  rooms.set(player1.id, room);
  rooms.set(player2.id, room);
  player1.join(room);
  player2.join(room);
  player1.emit('startGame');
  player2.emit('startGame');
  if (initialTurn === 0) {
    player1.emit('Your turn');
    player2.emit('Opponent turn');
  } else {
    player2.emit('Your turn');
    player1.emit('Opponent turn');
  }
}

function changeTurns(io, id, initialTurn) {
  console.log('Received turn', initialTurn);
  const room = rooms.get(id);
  const playersInRoom = [...io.sockets.adapter.rooms.get(room)];
  if (initialTurn === 0) {
    io.to(playersInRoom[0]).emit('Your turn');
    io.to(playersInRoom[1]).emit('Opponent turn');
  } else {
    io.to(playersInRoom[1]).emit('Your turn');
    io.to(playersInRoom[0]).emit('Opponent turn');
  }
}

export function initializeSocketIo(server) {
  const io = new Server(server);

  io.on('connection', (socket) => {
    let savedCard = null;
    let savedIndexes = [];

    socket.on('joinMultiplayer', (game) => {
      isMultiplayer = true;
      if (waitingPlayers.length === 0) {
        waitingPlayers.push({ socket, game });
        socket.emit('waitingForOpponent');
      } else {
        const opponent = waitingPlayers.shift();
        socket.emit('setCards', opponent.game);
        const initialTurn = Math.floor(Math.random() * 2);
        createRoomAndStartGame(socket, opponent.socket, initialTurn);
      }
    });

    socket.on('cardClicked', (card, ind) => {
      savedIndexes.push(ind);

      if (isMultiplayer) {
        const room = rooms.get(socket.id);
        io.to(room).emit('cardClicked', ind);
      }
      if (savedCard === null) {
        savedCard = card;
      } else {
        if (savedCard === card) {
          if (isMultiplayer) {
            const room = rooms.get(socket.id);
            io.to(room).emit('match', savedIndexes);
          } else {
            socket.emit('match', savedIndexes);
          }
        } else {
          if (isMultiplayer) {
            const room = rooms.get(socket.id);
            io.to(room).emit('no match', savedIndexes);
          } else {
            socket.emit('no match', savedIndexes);
          }
        }

        savedCard = null;
        savedIndexes = [];
      }
    });

    socket.on('disconnect', () => {
      if (rooms.has(socket.id)) {
        const room = rooms.get(socket.id);
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
