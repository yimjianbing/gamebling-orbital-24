import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext, useAuth } from "./AuthContext";

export function Protected ({children}) {
    const user = useContext(AuthContext);
    // const user = useAuth;

    if (!user) {
        return <Navigate to="/loginregister" replace/>
    } else {        
        console.log(user);
        return children;
    }
}