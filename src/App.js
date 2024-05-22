import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { useMemo } from "react";
import RouterBuilder from "./Components/NavBar/Routing.jsx";


function App() {

  const routes = useMemo(() => RouterBuilder(), []);

  return (
    <div>
      <RouterProvider router={createBrowserRouter(routes)}></RouterProvider>
    </div>
  );
}

export default App;
