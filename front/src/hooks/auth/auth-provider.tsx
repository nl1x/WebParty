import React, {useCallback, useState} from 'react';
import { useMemo } from 'react';
import { createContext } from 'react';
import { useContext } from 'react';
import Cookies from "js-cookie";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  user: object|null;
  setUser:  React.Dispatch<React.SetStateAction<null>>;
  isLoggedIn: () => boolean;
}

const AuthContext = createContext<AuthContextType|undefined>(undefined);

export function AuthProvider(props: AuthProviderProps) {
  const [user, setUser] = useState(null);
  const isLoggedIn = useCallback(() => {
    const session = Cookies.get('session');

    return !(!session);
  }, []);

  const memoValue = useMemo(
    () => ({
      user,
      setUser,
      isLoggedIn
    }),
    [user, setUser, isLoggedIn]
  );

  return <AuthContext.Provider value={memoValue}>{props.children}</AuthContext.Provider>;
}

const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuthContext context must be use inside AuthProvider');

  return context;
};

export default useAuthContext;
