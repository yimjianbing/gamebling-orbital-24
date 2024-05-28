import { RouterProvider, createHashRouter } from "react-router-dom";
import { useMemo } from "react";
import RouterBuilder from "./routes/Routing.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { MainMenu } from "./pages/MainMenu/MainMenu.jsx";

function App() {
  const routes = useMemo(() => RouterBuilder(), []);

  return (
    <AuthProvider>
      <RouterProvider fallbackElement = {<MainMenu />} router={createHashRouter(routes)}></RouterProvider>
      
    </AuthProvider>

  );
}

export default App;
