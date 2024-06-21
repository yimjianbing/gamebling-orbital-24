// import "@babel/polyfill";

// import 'core-js/es6/map';
// import 'core-js/es6/set';

import React, { useContext } from 'react';
import './OnlinePoker.css';
import { AuthContext } from "../../context/AuthContext";
import Exit from './Exit'; // Assuming Exit.jsx is in the same directory
//import { addPlayerToQueue } from './server.js'; // Import the addPlayerToQueue method

function OnlinePoker() {
  const { currentUserLoggedIn } = useContext(AuthContext);

  const createPlayer = () => {  
    const player = {
      name: currentUserLoggedIn.displayName || "Anonymous",
    };
  
    console.log('Player object:', player); // Debugging log
  
    fetch('http://localhost:5000/enqueue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ player }), // Convert player object to JSON string
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log(`${player.name} added to the queue.`);
       // alert(`${player.name} added to the queue.`);
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Failed to add player to the queue. Please try again.');
      });
  };

  const deque = () => {
    fetch('http://localhost:5000/dequeue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.player) {
          console.log(`Player dequeued: ${data.player.name}`);
        } else {
          console.log('No player data received');
        }
      })
      .catch((error) => console.error('Error:', error));
  };
  return (
    <div className="Poker">
        <button onClick={() => createPlayer()}> Test Multiplayer </button>
        <button onClick={() => deque()}> Test Deque </button>
        <Exit />
      </div>
  );
}


export default OnlinePoker;
