// import "@babel/polyfill";

// import 'core-js/es6/map';
// import 'core-js/es6/set';

import React, { useContext } from 'react';
import './OnlinePoker.css';
import { AuthContext } from "../../context/AuthContext";
import Exit from './Exit'; // Assuming Exit.jsx is in the same directory
import { addPlayerToQueue } from './server.js'; // Import the addPlayerToQueue method

function OnlinePoker() {
  const { currentUserLoggedIn } = useContext(AuthContext);

  const createPlayer = () => {
    const player = {
      name: currentUserLoggedIn.displayName || "Anonymous",
    };
    addPlayerToQueue(player); // Call the addPlayerToQueue method
    console.log(`${player.name} added to the queue.`);
    alert(`${player.name} added to the queue.`);
  }
  
  return (
    <div className="Poker">
        <button onClick={() => createPlayer()}> Test Multiplayer </button>
        <Exit />
      </div>
  );
}

export default OnlinePoker;
