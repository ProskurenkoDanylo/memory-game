import { getUser } from '../../models/users.model';

async function checkIfUserExists(user) {
  const data = await getUser({ username: user.username });
  if (!data || 'error' in data) {
    return false;
  } else {
    return true;
  }
}

function validateEmail(email) {
  const emailRegex =
    /^[\w\.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
}

function validateUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
  return usernameRegex.test(username);
}

interface errorObj {
  email?: string;
  password?: string;
  username?: string;
  date?: string;
}

async function validateRegistration(user) {
  const error = <errorObj>{};
  const userExist = await checkIfUserExists(user);
  if (userExist) {
    return {
      error: 'User already exist.',
    };
  }
  if (user.email !== undefined) {
    if (!validateEmail(user.email)) {
      error.email = 'There is a problem with email format.';
    }
  }

  if (!validatePassword(user.password)) {
    error.password =
      'Password must include at least 1 uppercase symbol, 1 digit and with a minimum length of 8 characters.';
  }
  if (!validateUsername(user.username)) {
    error.username =
      'Username may include only "_" and "-" symbols and must be from 3 to 16 characters length.';
  }

  if (Object.keys(error).length === 0) {
    return true;
  }
  return error;
}

async function validateUpdate(user) {
  const error = <errorObj>{};
  if (user.username) {
    const userNameExist = await checkIfUserExists({ username: user.username });
    if (userNameExist) {
      error.username = 'This username already exist.';
      return error;
    }
    if (!validateUsername(user.username)) {
      error.username =
        'Username may include only "_" and "-" symbols and must be from 3 to 16 characters length.';
      return error;
    }
  }
  if (user.email && !validateEmail(user.email)) {
    const emailExist = await checkIfUserExists({ email: user.email });
    if (emailExist) {
      error.email = 'This email already exist.';
      return error;
    }
    if (!validateEmail(user.email)) {
      error.email = 'There is a problem with email format.';
      return error;
    }
  }
  if (user.password && !validatePassword(user.password)) {
    error.password =
      'Password must include at least 1 uppercase symbol, 1 digit and with a minimum length of 8 characters.';
  }

  if (Object.keys(error).length === 0) {
    return true;
  }
  return error;
}

export {
  checkIfUserExists,
  validateEmail,
  validatePassword,
  validateUsername,
  validateRegistration,
  validateUpdate,
};
