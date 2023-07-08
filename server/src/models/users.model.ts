import { MongoClient, ObjectId } from 'mongodb';
const client = new MongoClient(process.env.CONNECTION_URI);
import crypto from 'crypto';

interface User {
  username: string;
  email: string;
  password?: string;
  salt?: string;
  name: string;
  profileImg: string;
  registrationDate: number;
  googleId?: string;
  facebookId?: string;
  highestScore?: number;
  preferedCover?: string;
  preferedEffect?: string;
  achievemets?: {
    achievemnt_id: ObjectId;
    date_achieved: number;
  }[];
  history?: {
    game_id: ObjectId[];
    opponent?: User;
    scoreEarned: number;
    mode: string;
    movie: string;
    result: string;
  }[];
}

async function verifyCredentials({ username, password }) {
  const user = await getUser({ username });
  let hashedPassword = '';
  if (user && !('error' in user)) {
    hashedPassword = crypto
      .pbkdf2Sync(password, user.salt, 10000, 64, `sha512`)
      .toString(`hex`);
    if (hashedPassword === user.password) {
      return user;
    } else
      return {
        error: 'User with such credentials is not found.',
      };
  } else {
    return user;
  }
}

async function getAllUsers() {
  const database = client.db('memory-match-game');
  const users = database.collection<User>('users');
  return await users.find().toArray();
}

async function getUser({
  _id = undefined,
  username = undefined,
  email = undefined,
  googleId = undefined,
  facebookId = undefined,
}) {
  const database = client.db('memory-match-game');
  const users = database.collection<User>('users');
  if (_id) {
    try {
      const id = new ObjectId(_id);
      return await users.findOne({ _id: id });
    } catch {
      console.log('_id passed to getUser, but it is not of ObjectId type');
    }
  }
  if (username || email || googleId || facebookId) {
    const queryCriteria = [];
    if (username) {
      queryCriteria.push({ username });
    }
    if (email) {
      queryCriteria.push({ email });
    }
    if (googleId) {
      queryCriteria.push({ googleId });
    }
    if (facebookId) {
      queryCriteria.push({ facebookId });
    }

    return await users.findOne({ $or: queryCriteria });
  } else {
    return {
      error:
        'Bad request, please specify at least one of the search parameters.',
    };
  }
}

async function addNewUser({
  username,
  email = '',
  password,
  salt,
  name = '',
  profileImg = '',
  googleId = null,
  facebookId = null,
}) {
  const database = client.db('memory-match-game');
  const users = database.collection<User>('users');
  return await users
    .insertOne({
      username,
      email,
      password,
      salt,
      name,
      profileImg,
      registrationDate: Date.now(),
      googleId,
      facebookId,
    })
    .then((user) => user)
    .catch((err) => {
      return { error: err };
    });
}

async function updateUser(user) {
  const database = client.db('memory-match-game');
  const users = database.collection<User>('users');
  const { _id, ...newUserData } = user;
  return await users
    .updateOne({ _id: new ObjectId(_id) }, { $set: newUserData })
    .then((user) => user)
    .catch((err) => {
      return { error: err };
    });
}

async function deleteUser(user) {
  const database = client.db('memory-match-game');
  const users = database.collection<User>('users');
  return await users
    .deleteOne({ _id: new ObjectId(user._id) })
    .then((res) => res)
    .catch((err) => {
      return { error: err };
    });
}

export {
  verifyCredentials,
  getAllUsers,
  getUser,
  addNewUser,
  updateUser,
  deleteUser,
};
