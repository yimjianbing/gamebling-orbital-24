import React from "react";
import "./NavBar.css";
import { Link, BrowserRouter as Router, Route, Switch } from "react-router-dom";

const NavBar = () => (
  <header>
    <h2 className="logo">GameBling</h2>
    <nav className="navigation">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contactus"> Contact Us</Link>
      <Link to="/loginregister" className="btnLogin-popup">Play</Link>
    </nav>
  </header>
);


export default NavBar;
