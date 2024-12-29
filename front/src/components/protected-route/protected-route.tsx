import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthContext from '@hooks/auth/auth-provider';
import {ROLE, Roles} from "@config/variables.ts";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: ROLE;
  redirect: string;
}

export default function ProtectedRoute(props: ProtectedRouteProps)
{
  const { profile, isLoggedIn } = useAuthContext();

  if (!isLoggedIn() || (!!props.requiredRole && profile
    && profile.me.role.weight < Roles[props.requiredRole])) {
    return <Navigate to={props.redirect} replace />;
  }

  return <>{props.children}</>;
}
