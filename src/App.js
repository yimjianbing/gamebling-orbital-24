import { RouterProvider, createHashRouter, createBrowserRouter } from "react-router-dom";
import { useMemo } from "react";
import RouterBuilder from "./routes/Routing.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { MainMenu } from "./pages/MainMenu/MainMenu.jsx";
import { firebaseConfig } from "./auth/firebase-config.js";

function App() {
  const routes = useMemo(() => RouterBuilder(), []);

  return (
    <AuthProvider>
      <RouterProvider
        fallbackElement={<MainMenu />}
        // router={createHashRouter(routes)}
        router={createBrowserRouter(routes)}
      ></RouterProvider>
    </AuthProvider>
  );
}

export default App;
