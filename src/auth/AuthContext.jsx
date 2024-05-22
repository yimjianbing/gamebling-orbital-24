import { createContext, useContext, useState, useEffect } from 'react';
import { auth, onAuthStateChanged } from './firebase-config'; // Assuming this import is correct

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUserLoggedIn, setCurrentUserLoggedIn] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUserLoggedIn(user); // Update current user state
      setLoading(false); // Update loading state once authentication check is done
    });

    return () => { if (unsubscribe) unsubscribe()};
  }, []);

  // Render children only when loading is false

  const values = {
    currentUserLoggedIn: currentUserLoggedIn,
    setCurrentUserLoggedIn: setCurrentUserLoggedIn
  }

  return (
    <AuthContext.Provider value={{ values }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}








