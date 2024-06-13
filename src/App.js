import { RouterProvider, createHashRouter } from "react-router-dom";
import { useMemo } from "react";
import RouterBuilder from "./routes/Routing.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { MainMenu } from "./pages/MainMenu/MainMenu.jsx";
import io from "socket.io-client";
import { firebaseConfig } from "./auth/firebase-config.js";
const socket = io.connect("firebaseConfig");

function App() {
  const routes = useMemo(() => RouterBuilder(), []);

  return (
    <AuthProvider>
      <RouterProvider
        fallbackElement={<MainMenu />}
        router={createHashRouter(routes)}
      ></RouterProvider>
    </AuthProvider>
  );
}

export default App;
