import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useMemo } from "react";
import RouterBuilder from "./routes/Routing.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  const routes = useMemo(() => RouterBuilder(), []);

  return (
    <AuthProvider>
      <RouterProvider router={createBrowserRouter(routes)}></RouterProvider>
    </AuthProvider>
  );
}

export default App;
