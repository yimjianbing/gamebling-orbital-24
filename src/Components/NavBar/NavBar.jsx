import React from "react";
import "./NavBar.css";

const NavBar = () => (
  <header>
    <h2 class="logo">GameBling</h2>
    <nav className="navigation">
      <a href="">Home</a>
      <a href="#">About</a>
      <a href="#">Contact Us</a>
      <a href="#"></a>
      <button className="btnLogin-popup">Play</button>
    </nav>
  </header>
);

export default NavBar;
