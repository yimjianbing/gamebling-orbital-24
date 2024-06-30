import {React, useContext, useState, useEffect} from "react";
import "./NavBar.css";
import { Link } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import { ProfileModal } from "../ProfileModal/ProfileModal";

export function NavBar() {

  const { loggedIn, currentUserLoggedIn } = useContext(AuthContext);
  const [ profileOpen, setProfileOpen ] = useState(false);
  const [ action, setAction ] = useState("");

  const handleProfileModal = () => {
    setProfileOpen(!profileOpen);
  }

  useEffect(() => {
    if (currentUserLoggedIn) {
      setAction(" active");
    } else {
      setAction("");
    }
  }, [currentUserLoggedIn]); // Dependency array, re-run the effect when loggedIn changes


  return (
    <div>
      <header data-testid="navbar">
        <h2 className="logo">GameBling</h2>
        <div className="navigation">      
          <nav className={`links${action}`}>
          <Link to="/" data-testid="home">Home</Link>
          <Link to="/about" data-testid="about">About</Link>
          <Link to="/contactus" data-testid="contactus"> Contact Us</Link>
          <Link to="/mainmenu" className="btnLogin-popup" data-testid="mainmenu">Play</Link>
        </nav>
        {loggedIn ? <p className="profileBtn" onClick={() => handleProfileModal()}> Profile </p> : <></>}</div>

      </header>

      {profileOpen ? <ProfileModal /> : <></>} 
    </div>
    
  )
}


