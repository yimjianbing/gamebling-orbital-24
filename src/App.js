import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { useMemo } from "react";
import RouterBuilder from "./Components/NavBar/Routing.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import MainMenu from "./Components/MainMenu/MainMenu.jsx";


function App() {

  const routes = useMemo(() => RouterBuilder(), []);

  return (
    <AuthProvider>
      <RouterProvider router={createBrowserRouter(routes)}></RouterProvider>
    </AuthProvider>
  );
}

export default App;
