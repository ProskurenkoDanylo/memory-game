import { useContext } from 'react';
import UserContext from '../context/UserContext';

export interface User {
  id: number;
  name: string;
  email: string;
}

export const useUser = () => {
  const [currentUser, setCurrentUser] = useContext(UserContext);

  const login = (user: User) => {
    setCurrentUser ? setCurrentUser(user) : null;
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser ? setCurrentUser(null) : null;
    localStorage.removeItem('user');
  };

  return { currentUser, login, logout };
};
