import { Request, Response } from 'express';
import crypto from 'crypto';

import {
  getAllUsers,
  getUser,
  addNewUser,
  updateUser,
  deleteUser,
} from '../../models/users.model';
import { validateRegistration, validateUpdate } from './users.validation';

async function httpGetAllUsers(req: Request, res: Response) {
  const users = await getAllUsers();
  res.status(200).json(
    users.map((user) => ({
      ...user,
      password: 'User password is not available through API call.',
      salt: 'User salt is not available through API call.',
    }))
  );
}

async function httpGetUser(req: Request, res: Response) {
  const user = await getUser({
    username: req.body?.username,
    email: req.body?.email,
  });
  if (user) {
    res.status(200).json({
      ...user,
      password: 'User password is not available through API call.',
      salt: 'User salt is not available through API call.',
    });
  } else {
    res.status(404).json({
      error: 'User not found.',
    });
  }
}

async function httpAddNewUser(req: Request, res: Response) {
  const { username, email, password, name, profileImg } = req.body;

  if (!username || !password || !profileImg) {
    res.status(400).json({
      error: 'Required data missing to add the user.',
    });
    return;
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');

  let validationResults = null;
  if (email) {
    validationResults = await validateRegistration({
      username,
      email,
      password,
    });
  } else {
    validationResults = await validateRegistration({
      username,
      password,
    });
  }

  if (validationResults !== true) {
    res.status(400).json(validationResults);
    return;
  }
  const user = await addNewUser({
    username,
    email,
    password: hashedPassword,
    salt,
    name,
    profileImg,
  });
  res.status(201).json(user);
}

async function httpUpdateUser(req: Request, res: Response) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = crypto
    .pbkdf2Sync(req.body.user.password, salt, 10000, 64, 'sha512')
    .toString('hex');
  const validationResults = await validateUpdate({
    username: req.body.user.username,
    email: req.body.user.email,
    password: req.body.user.password,
  });
  if (validationResults !== true) {
    res.status(400).json(validationResults);
    return;
  }
  const user = await updateUser({ ...req.body.user, password: hashedPassword });
  res.status(200).json(user);
}

async function httpDeleteUser(req: Request, res: Response) {
  await deleteUser(req.body.user);
  res.status(200).json({
    user: req.body.user,
  });
}

export {
  httpGetAllUsers,
  httpGetUser,
  httpAddNewUser,
  httpUpdateUser,
  httpDeleteUser,
};
