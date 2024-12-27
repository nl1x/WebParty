import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthContext from '@hooks/auth/auth-provider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  condition?: () => boolean;
  redirect: string;
}

export default function ProtectedRoute(props: ProtectedRouteProps)
{
  const { isLoggedIn } = useAuthContext();
  const condition = props.condition ?? isLoggedIn;

  if (!condition()) {
    return <Navigate to={props.redirect} replace />;
  }

  return <>{props.children}</>;
}
