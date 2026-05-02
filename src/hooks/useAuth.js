import { useState } from 'react';
import { ADMIN_PASSWORD } from '../config/auth';

// Session-based: stays unlocked until the browser tab is closed.
const SESSION_KEY = 'portfolio_admin_unlocked';

export function useAuth() {
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

  return { unlocked, unlock, lock };
}
