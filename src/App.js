import { RouterProvider, createHashRouter, createBrowserRouter } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import RouterBuilder from "./routes/Routing.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { MainMenu } from "./pages/MainMenu/MainMenu.jsx";
import axios from "axios";

function App() {
  const routes = useMemo(() => RouterBuilder(), []);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get('http://localhost:5000/api')
      .then(response => {
        setMessage(response.data);
      })
      .catch(error => {
        console.error(`There was an error retrieving the data: ${error}`);
      });
  }, []);

  return (
    <AuthProvider>
      <RouterProvider
        fallbackElement={<MainMenu />}
        router={createHashRouter(routes)}
        >
      </RouterProvider>
      {/* <header>{message ? message : "i failed"}</header> */}
    </AuthProvider>
  );
}

export default App;
