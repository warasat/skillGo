import { Navigate } from "react-router";
import { getUserFromLocalStorage } from "./utils";
import type { ReactNode } from "react";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: string[];
  fallback?: ReactNode;
}

const RoleGuard = ({ children, allowedRoles, fallback }: RoleGuardProps) => {
  const user = getUserFromLocalStorage();
  console.log(getUserFromLocalStorage());

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role.role)) {
    return fallback || <></>;
  }

  return <>{children}</>;
};

export default RoleGuard;
