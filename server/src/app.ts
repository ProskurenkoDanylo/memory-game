import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response } from 'express';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import 'dotenv/config';

import usersRouter from './routes/users/users.route';
import achievementsRouter from './routes/achievements/achievements.route';
import categoriesRouter from './routes/categories/categories.route';

import {
  primaryAuth,
  googleAuthStrategy,
  facebookAuthStrategy,
  serializeCallback,
  deserializeCallback,
} from './auth';
import gamesRouter from './routes/games/games.route';

passport.use(primaryAuth);
passport.use(googleAuthStrategy);
passport.use(facebookAuthStrategy);
passport.serializeUser(serializeCallback);
passport.deserializeUser(deserializeCallback);

const app = express();
app.use(express.json());

app.use(cors({ origin: '*', methods: ['GET', 'PUT', 'POST'] }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(helmet());
app.use(
  session({
    name: 'user_session',
    secret: process.env.SESSION_SECRET_KEY,
    store: MongoStore.create({
      mongoUrl: process.env.CONNECTION_URI,
      dbName: process.env.DB_NAME,
    }),
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/users', usersRouter);
app.use('/achievements', achievementsRouter);
app.use('/categories', categoriesRouter);
app.use('/games', gamesRouter);

app.get('/auth/authenticated', (req: Request, res: Response) => {
  if ((req as any).isAuthenticated()) {
    res.json({
      ...(req as any).user,
      password: 'You are not allowed to view user password',
      salt: 'You are not allowed to view user salt',
    });
  } else {
    res.json({ error: 'Unathorized.' });
  }
});

app.post(
  '/auth',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/sign-in',
  })
);

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/sign-in',
  })
);

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/sign-in',
  })
);

app.get('/auth/logout', (req: Request, res: Response) => {
  (req as any).logout((err) => {
    if (err) {
      res.status(500).json({
        error: err,
      });
      res.redirect('/');
    }
  });
  return res.redirect('/');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

export default app;
