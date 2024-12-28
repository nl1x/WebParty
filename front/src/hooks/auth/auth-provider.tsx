import React, {useCallback, useState} from 'react';
import { useMemo } from 'react';
import { createContext } from 'react';
import { useContext } from 'react';
import Cookies from "js-cookie";
import getMe from "@api/user.ts";
import useNavigatorContext from "@hooks/navigator/navigator-provider.tsx";
import {PATH} from "@path/path.tsx";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  user: object|null;
  setUser: React.Dispatch<React.SetStateAction<null>>;
  profile: UserProfileProps|null;
  updateUserProfile: () => Promise<true | false>;
  isLoggedIn: () => boolean;
}


export interface RoleProps {
    name: string;
    displayName: string;
    weight: number;
}

export interface ActionProps {
    id: number;
    proofPicture: string;
    status: string;
    action: {
        description: string;
        difficulty: number;
        requireProof: boolean;
    };
}

export interface UserProfileProps {
    me: {
        id: number;
        username: string;
        avatarUrl: string;
        createdAt: string;
        updatedAt: string;
        role: RoleProps;
        history: ActionProps[];
        action?: ActionProps;
    }
}

const AuthContext = createContext<AuthContextType|undefined>(undefined);

export function AuthProvider(props: AuthProviderProps) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState<UserProfileProps|any|null>(null);
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

      setProfile(response.data);
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  const memoValue = useMemo(
    () => ({
      user,
      setUser,
      profile,
      updateUserProfile,
      isLoggedIn,
    }),
    [user, setUser, profile, updateUserProfile, isLoggedIn]
  );

  return <AuthContext.Provider value={memoValue}>{props.children}</AuthContext.Provider>;
}

const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuthContext context must be use inside AuthProvider');

  return context;
};

export default useAuthContext;
