import React from "react";
import "./NavBar.css";
import { Link } from "react-router-dom";

export function NavBar() {

  return (
    <header data-testid="navbar">
      <h2 className="logo">GameBling</h2>
      <nav className="navigation">
        <Link to="/" data-testid="home">Home</Link>
        <Link to="/about" data-testid="about">About</Link>
        <Link to="/contactus" data-testid="contactus"> Contact Us</Link>
        <Link to="/mainmenu" className="btnLogin-popup" data-testid="mainmenu">Play</Link>
      </nav>
    </header>
  )
}


