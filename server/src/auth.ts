import GoogleStrategy from 'passport-google-oauth20';
import FacebookStrategy from 'passport-facebook';
import LocalStrategy from 'passport-local';

import {
  verifyCredentials,
  getUser,
  addNewUser,
  updateUser,
} from './models/users.model';

const primaryAuth = new LocalStrategy(async (username, password, done) => {
  const user = await verifyCredentials({
    username,
    password,
  });
  if (user && !('error' in user)) {
    done(null, user);
  } else {
    done(null, false);
  }
});

const googleAuthStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://localhost:3000/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await getUser({
        email: profile.emails[0].value,
        googleId: profile.id,
      });

      if (existingUser && !('error' in existingUser)) {
        if (existingUser.googleId) {
          done(null, existingUser);
        } else {
          await updateUser({
            _id: existingUser._id,
            googleId: profile.id,
          });
          done(null, existingUser);
        }
      } else {
        const newUser = {
          username: profile.emails[0].value,
          email: profile.emails[0].value,
          password: null,
          salt: null,
          name: profile.displayName,
          profileImg: profile.photos[0].value,
          googleId: profile.id,
        };
        await addNewUser(newUser);
        done(null, newUser);
      }
    } catch (error) {
      done(error, null);
    }
  }
);

const facebookAuthStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'https://localhost:3000/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'emails'],
    enableProof: true,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await getUser({ facebookId: profile.id });

      if (existingUser && !('error' in existingUser)) {
        if (existingUser.facebookId) {
          done(null, existingUser);
        } else {
          await updateUser({
            _id: existingUser._id,
            facebookId: profile.id,
          });
          done(null, existingUser);
        }
      } else {
        const newUser = {
          username: `user${profile.id}`,
          email: null,
          password: null,
          salt: null,
          name: profile.displayName,
          profileImg: profile.photos[0].value,
          facebookId: profile.id,
        };
        await addNewUser(newUser);
        done(null, newUser);
      }
    } catch (error) {
      done(error, null);
    }
  }
);

const serializeCallback = (user, done) => {
  if (user._id) {
    done(null, user._id);
  } else if (user.googleId) {
    done(null, user.googleId);
  } else if (user.facebookId) {
    done(null, user.facebookId);
  }
};

const deserializeCallback = async (id, done) => {
  try {
    const user = await getUser({
      _id: id,
      googleId: id,
      facebookId: id,
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
};

export {
  primaryAuth,
  googleAuthStrategy,
  facebookAuthStrategy,
  serializeCallback,
  deserializeCallback,
};
