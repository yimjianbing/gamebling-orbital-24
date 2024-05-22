import LoginRegister from "./Components/LoginRegister/LoginRegister";
import NavBar from "./Components/NavBar/NavBar";
import About from "./Components/About/About";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ContactUs from "./Components/ContactUs/ContactUs";
import { AuthProvider, useAuth } from "./auth/AuthContext.jsx";
import AuthenticatedRoute from "./auth/AuthenticatedRoute.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <NavBar />
          <Routes>
            {/*<Route path="/contactus" element={<ContactUs />} />*/}
            <Route element={<AuthenticatedRoute />}>
              <Route path="/contactus" element={<ContactUs />} />
            </Route>
            <Route path="/about" element={<About />} />
            <Route path="/loginRegister" element={<LoginRegister />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
