import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { currentUser, token } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // Determine if user is authenticated based on having both user and token
  const isAuthenticated = !!(currentUser && token);

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If user is authenticated but trying to access auth pages
  if (!requireAuth && isAuthenticated) {
    const from =
      (location.state as { from?: { pathname: string } })?.from?.pathname ||
      "/";
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}
