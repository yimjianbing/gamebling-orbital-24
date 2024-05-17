import React from "react";
import "./NavBar.css";
import { Link, BrowserRouter as Router, Route, Switch } from "react-router-dom";

const NavBar = () => (
  <header>
    <h2 className="logo">GameBling</h2>
    <nav className="navigation">
      <a href="">Home</a>
      <Link to="/about">About</Link>
      <a href="">Contact Us</a>
      <button className="btnLogin-popup">Play</button>
    </nav>
  </header>
);


export default NavBar;
