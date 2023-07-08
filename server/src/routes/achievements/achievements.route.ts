import express from 'express';

import {
  httpGetAllAchievements,
  httpGetAchievementByTitle,
  httpAddNewAchievement,
  httpUpdateAchievement,
  httpDeleteAchievement,
} from './achievements.controller';

const achievementsRouter = express.Router();

achievementsRouter.get('/', httpGetAllAchievements);
achievementsRouter.get('/achievement', httpGetAchievementByTitle);
achievementsRouter.post('/addNew', httpAddNewAchievement);
achievementsRouter.post('/update', httpUpdateAchievement);
achievementsRouter.delete('/delete', httpDeleteAchievement);

export default achievementsRouter;
