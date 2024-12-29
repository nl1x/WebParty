import React, {useContext} from 'react';
import { useMemo } from 'react';
import { createContext } from 'react';
import { useNavigate } from "react-router-dom";

interface NavigatorProviderProps {
  children: React.ReactNode;
}

interface NavigatorContextType {
  navigate: ReturnType<typeof useNavigate>;
}

const NavigatorContext = createContext<NavigatorContextType|undefined>(undefined);

export function NavigatorProvider(props: NavigatorProviderProps) {
  const navigate = useNavigate();

  const memoValue = useMemo(
    () => ({
      navigate
    }),
    [navigate]
  );

  return <NavigatorContext.Provider value={memoValue}>{props.children}</NavigatorContext.Provider>;
}

const useNavigatorContext = () : NavigatorContextType => {
  const context = useContext(NavigatorContext);

  if (!context) throw new Error('useNavigatorContext context must be use inside NavigatorProvider');

  return context;
};

export default useNavigatorContext;
