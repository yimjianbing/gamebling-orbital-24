import React from "react";
import "./PokerGame.css";

const Spinner = () => {
  return (
    <div className="loading-container">
      <div className="spinner-container">
        <img src={require("../../assets/background.svg")} alt="Loading..." />
      </div>
    </div>
  );
};

export default Spinner;
