import express from 'express';

import {
  httpGetAllUsers,
  httpGetUser,
  httpAddNewUser,
  httpUpdateUser,
  httpDeleteUser,
} from './users.controller';

const usersRouter = express.Router();

usersRouter.get('/', httpGetAllUsers);
usersRouter.get('/user', httpGetUser);
usersRouter.post('/addNew', httpAddNewUser);
usersRouter.post('/update', httpUpdateUser);
usersRouter.delete('/delete', httpDeleteUser);

export default usersRouter;
