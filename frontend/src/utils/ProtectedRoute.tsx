import { Navigate } from "react-router-dom";
import { getTokenFromLocalStorage } from "./utils"; // same folder import
import type { ReactElement } from "react";

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const token = getTokenFromLocalStorage();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
