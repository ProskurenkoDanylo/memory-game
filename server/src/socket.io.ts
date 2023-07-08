import { Server } from 'socket.io';

let readyPlayerCount = 0;

export function initializeSocketIo(server) {
  const io = new Server(server);
  let room = null;

  io.on('connection', (socket) => {
    console.log('A user connected.');

    socket.on('ready', () => {
      room = 'room' + Math.floor(readyPlayerCount / 2);
      socket.join(room);

      console.log('Player ready', socket.id, room);

      readyPlayerCount++;

      if (readyPlayerCount % 2 === 0) {
        io.in(room).emit('startGame', socket.id);
      }
    });

    socket.on('disconnect', (reason) => {
      console.log(`Client ${socket.id} disconnected: ${reason}`);
      socket.leave(room);
    });
  });
}
