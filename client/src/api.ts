import User from './types/user';

const API_URL = 'https://localhost:3000';

const checkIfAuthenticated = async () => {
  return await fetch(`${API_URL}/auth/authenticated`);
};

const logoutUser = async () => {
  return await fetch(`${API_URL}/auth/logout`);
};

const getUser = async (username = '', email = '') => {
  return await fetch(`${API_URL}/users/user`, {
    body: JSON.stringify({
      username,
      email,
    }),
  });
};

const addUser = async (user: User) => {
  console.log(user);
  return await fetch(`${API_URL}/users/addNew`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
};

const updateUser = async (user: User) => {
  return await fetch(`${API_URL}/users/updateUser`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
};

const loginUserByCredentials = async (username: string, password: string) => {
  return await fetch(`${API_URL}/auth`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
};

const searchCategory = async (title: string) => {
  return await fetch(`${API_URL}/categories/categories/${title}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

export {
  logoutUser,
  checkIfAuthenticated,
  getUser,
  addUser,
  updateUser,
  loginUserByCredentials,
  searchCategory,
};
