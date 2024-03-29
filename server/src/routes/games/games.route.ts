import express from 'express';

import {
  httpGetAllGames,
  httpAddNewGame,
  httpUpdateGame,
  httpDeleteGame,
  httpInitializeGame,
} from './games.controller';

const gamesRouter = express.Router();

gamesRouter.get('/', httpGetAllGames);
gamesRouter.post('/initialize', httpInitializeGame);
gamesRouter.post('/addNew', httpAddNewGame);
gamesRouter.post('/update', httpUpdateGame);
gamesRouter.delete('/delete', httpDeleteGame);

export default gamesRouter;
