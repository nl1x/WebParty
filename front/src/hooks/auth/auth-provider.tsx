import React, {useCallback, useEffect, useState} from 'react';
import { useMemo } from 'react';
import { createContext } from 'react';
import { useContext } from 'react';
import Cookies from "js-cookie";
import getMe from "@api/user.ts";
import useNavigatorContext from "@hooks/navigator/navigator-provider.tsx";
import {PATH} from "@path/path.tsx";
import {UserProfileProps} from "@api/objects.ts";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  user: object|null;
  setUser: React.Dispatch<React.SetStateAction<null>>;
  profile: UserProfileProps|null;
  updateUserProfile: () => Promise<true | false>;
  isLoggedIn: () => boolean;
  isPendingForApproval: boolean;
  hasAction: boolean;
}

const AuthContext = createContext<AuthContextType|undefined>(undefined);

export function AuthProvider(props: AuthProviderProps) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState<UserProfileProps|any|null>(null);
  const [isPendingForApproval, setIsPendingForApproval] = useState<boolean>(true);
  const [hasAction, setHasAction] = useState<boolean>(true);
  const {navigate} = useNavigatorContext();

  const isLoggedIn = useCallback(() => {
    const session = Cookies.get('session');

    return !(!session);
  }, []);

  const updateUserProfile = useCallback(async () => {
    try {
      const response = await getMe();

      if (response.status === 401) {
        navigate(PATH.LOGIN);
        return false;
      }

      const timestamp = new Date().getTime();
      response.data.me.avatarUrl += `?t=${timestamp}`;

      setProfile(response.data);
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn())
      return;

    updateUserProfile()
      .then((success) => {
        if (!success)
          return navigate(PATH.LOGIN);
      })
      .catch((error) => console.error(error));
  }, [navigate]);

  useEffect(() => {
    if (profile) {
      setHasAction(profile.me.action !== null);
      setIsPendingForApproval(profile.me.action?.status === 'pending-approval');
    }
  }, [profile])

  const memoValue = useMemo(
    () => ({
      user,
      setUser,
      profile,
      updateUserProfile,
      isPendingForApproval,
      hasAction,
      isLoggedIn
    }),
    [user, setUser, profile, updateUserProfile, isPendingForApproval, isLoggedIn]
  );

  return <AuthContext.Provider value={memoValue}>{props.children}</AuthContext.Provider>;
}

const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuthContext context must be use inside AuthProvider');

  return context;
};

export default useAuthContext;
