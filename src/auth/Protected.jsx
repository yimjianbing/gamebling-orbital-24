import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function Protected({ children }) {
  const user = useContext(AuthContext);
  if (!user.loggedIn) {
    return <Navigate to="/loginregister" replace />;
  } else {
    return children;
  }
}
