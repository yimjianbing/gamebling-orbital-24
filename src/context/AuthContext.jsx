import { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Assuming this import is correct

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const auth = getAuth(); // Get the auth object from firebase
  const [currentUserLoggedIn, setCurrentUserLoggedIn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUserLoggedIn(user); // Update current user state
      setLoading(false); // Update loading state once authentication check is done
      setLoggedIn(user ? true : false);
    });

    return () => { if (unsubscribe) unsubscribe()};
  }, [auth]);

  // Render children only when loading is false

  const updateLoggedIn = (bool) => {
    setLoggedIn(bool);
  };

  const values = {
    currentUserLoggedIn: currentUserLoggedIn,
    setCurrentUserLoggedIn: setCurrentUserLoggedIn,
    updateLoggedIn: updateLoggedIn,
    loggedIn: loggedIn,
    
  }

  return (
    <AuthContext.Provider value={ values }>
      {!loading && children}
    </AuthContext.Provider>
  );
}








