// import "@babel/polyfill";

// import 'core-js/es6/map';
// import 'core-js/es6/set';

import React, { useContext } from 'react';
import { v1 as uuid } from "uuid";
import './OnlinePoker.css';
import { AuthContext } from "../../context/AuthContext";
import Exit from './Exit'; // Assuming Exit.jsx is in the same directory


function OnlinePoker() {
  const { currentUserLoggedIn } = useContext(AuthContext);

  const createPlayer = () => {  
    const player = {
      id: uuid(),
      name: currentUserLoggedIn.displayName,
      avatarURL: "https://img.icons8.com/?size=100&id=rrtYnzKMTlUr&format=png&color=000000",
      cards: [],
      showDownHand: {
        hand: [],
        descendingSortHand: [],
      },
      chips: 20000,
      roundStartChips: 20000,
      roundEndChips: 20000,
      currentRoundChipsInvested: 0,
      bet: 0,
      betReconciled: false,
      folded: false,
      allIn: false,
      canRaise: true,
      stackInvestment: 0,
      robot: false,
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
