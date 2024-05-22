import { Navigate, Outlet, Route } from 'react-router-dom';
import { useAuth } from './AuthContext'; 

const AuthenticatedRoute = ({ element: Element, ...rest }) => {
  const { userLoggedIn } = useAuth();

  return (
        userLoggedIn ? <Outlet /> : <Navigate to="/loginRegister" />
  );
};

export default AuthenticatedRoute;