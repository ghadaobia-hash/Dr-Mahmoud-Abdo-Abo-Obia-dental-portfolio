import { createContext, useContext, useState } from 'react';
import { ADMIN_PASSWORD } from '../config/auth';

const SESSION_KEY = 'portfolio_admin_unlocked';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === 'true'
  );

  const unlock = (password) => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setUnlocked(true);
      return true;
    }
    return false;
  };

  const lock = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUnlocked(false);
  };

  return (
    <AuthContext.Provider value={{ unlocked, unlock, lock }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
