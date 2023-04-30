import { useState, useEffect, createContext } from 'react';
import { User } from '../hooks/useUser';

type UserContextType = [
  User | null,
  React.Dispatch<React.SetStateAction<User | null>>
];

const UserContext = createContext<UserContextType | []>([]);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (localStorage.getItem('user') !== null) {
      setCurrentUser(JSON.parse(localStorage.getItem('user') as string));
    }
  }, []);

  return (
    <UserContext.Provider value={[currentUser, setCurrentUser]}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
