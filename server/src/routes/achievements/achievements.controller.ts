import { Request, Response } from 'express';

import {
  getAllAchievements,
  getAchievementByTitle,
  addAchievement,
  updateAchievement,
  deleteAchievement,
} from '../../models/achievements.model';

async function httpGetAllAchievements(req: Request, res: Response) {
  const achievements = await getAllAchievements();
  res.status(200).json(achievements);
}

async function httpGetAchievementByTitle(req: Request, res: Response) {
  const achievement = await getAchievementByTitle({
    title: req.body?.title,
  });
  if (achievement) {
    res.status(200).json(achievement);
  } else {
    res.status(404).json({
      error: 'Achievement not found.',
    });
  }
}

async function httpAddNewAchievement(req: Request, res: Response) {
  const { title, image, description } = req.body;

  if (!title || !image || !description) {
    res.status(400).json({
      error: 'Required data missing to add the achievement.',
    });
    return;
  }

  const achievement = await addAchievement({
    title,
    image,
    description,
  });
  res.status(201).json(achievement);
}

async function httpUpdateAchievement(req: Request, res: Response) {
  const achievement = await updateAchievement({
    ...req.body.achievement,
  });
  res.status(200).json(achievement);
}

async function httpDeleteAchievement(req: Request, res: Response) {
  await deleteAchievement(req.body.achievement);
  res.status(200).json({
    achievement: req.body.achievement,
  });
}

export {
  httpGetAllAchievements,
  httpGetAchievementByTitle,
  httpAddNewAchievement,
  httpUpdateAchievement,
  httpDeleteAchievement,
};
