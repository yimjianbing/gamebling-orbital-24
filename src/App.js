import LoginRegister from './Components/LoginRegister/LoginRegister'
import NavBar from './Components/NavBar/NavBar'
import About from './Components/About/About';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/about" element={<About />} />
          <Route
            path="/*"
            element={<>{window.location.pathname !== '/about' && <LoginRegister />}</>}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
