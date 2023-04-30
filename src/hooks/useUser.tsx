import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

export interface User {
  id: number;
  name: string;
  email: string;
}

export const useUser = () => {
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const navigate = useNavigate();

  const login = (user: User) => {
    setCurrentUser ? setCurrentUser(user) : null;
    localStorage.setItem('user', JSON.stringify(user));
    navigate(0);
  };

  const logout = () => {
    setCurrentUser ? setCurrentUser(null) : null;
    localStorage.removeItem('user');
    navigate(0);
  };

  return { currentUser, login, logout };
};
