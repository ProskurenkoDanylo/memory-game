import { createContext, useState, useEffect } from 'react';
import { checkIfAuthenticated, logoutUser } from '../api';

const AuthContext = createContext<{
  isAuthenticated?: boolean;
  user?: object | null;
  contextLoading?: boolean;
  login: () => void;
  logout: () => void;
}>({
  login: () => {},
  logout: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [contextLoading, setContextLoading] = useState(true);

  useEffect(() => {
    login();
  }, []);

  const login = async () => {
    setContextLoading(true);
    try {
      const response = await checkIfAuthenticated().then((res) => res.json());
      if (!response.error) {
        setIsAuthenticated(true);
        setUser(response);
      }
      setContextLoading(false);
    } catch (error) {
      console.error('Error checking authentication status:', error);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        contextLoading,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
