import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export function Protected ({children}) {
    const user = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/loginregister" replace/>
    } else {
        return children;
    }
}