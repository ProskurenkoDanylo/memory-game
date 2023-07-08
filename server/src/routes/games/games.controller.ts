import { Request, Response } from 'express';

import {
  getAllGames,
  addGame,
  updateGame,
  deleteGame,
} from '../../models/games.model';

async function httpGetAllGames(req: Request, res: Response) {
  const games = await getAllGames();
  res.status(200).json(games);
}

async function httpAddNewGame(req: Request, res: Response) {
  const { played_at, players, total_time_played, winner } = req.body;

  if (!played_at || !players || !total_time_played || winner) {
    res.status(400).json({
      error: 'Required data missing to add the game.',
    });
    return;
  }

  const game = await addGame({
    played_at,
    players,
    total_time_played,
    winner,
  });
  res.status(201).json(game);
}

async function httpUpdateGame(req: Request, res: Response) {
  const game = await updateGame({
    ...req.body.game,
  });
  res.status(200).json(game);
}

async function httpDeleteGame(req: Request, res: Response) {
  await deleteGame(req.body.game);
  res.status(200).json({
    game: req.body.game,
  });
}

export { httpGetAllGames, httpAddNewGame, httpUpdateGame, httpDeleteGame };
