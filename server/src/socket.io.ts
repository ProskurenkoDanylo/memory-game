import { Server } from 'socket.io';

let savedCard = null;
let savedIndexes = [];
let comboCounter = 0;

export function initializeSocketIo(server) {
  const io = new Server(server);

  io.on('connection', (socket) => {
    socket.on('cardClicked', (card, ind) => {
      savedIndexes.push(ind);
      if (savedCard === null) {
        savedCard = card;
      } else {
        if (savedCard === card) {
          io.emit('match', savedIndexes, comboCounter);
          comboCounter += 1;
        } else {
          comboCounter = 0;
          io.emit('no match', savedIndexes, comboCounter);
        }

        savedCard = null;
        savedIndexes = [];
      }
    });

    socket.on('disconnect', () => {
      savedCard = null;
      savedIndexes = [];
      comboCounter = 0;
    });
  });
}
