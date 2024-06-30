// import "@babel/polyfill";

// import 'core-js/es6/map';
// import 'core-js/es6/set';

import React, { useContext, useState } from 'react';
import { v1 as uuid } from "uuid";
import './OnlinePoker.css';
import { AuthContext } from "../../context/AuthContext";
import Exit from './Exit'; // Assuming Exit.jsx is in the same directory
import axios from 'axios';


function OnlinePoker() {
  const { currentUserLoggedIn } = useContext(AuthContext);
  const [ queue, setQueue ] = useState([]); // [ { id: 'uuid', name: 'playerName' }, ...

  const createPlayer = async() => {  
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
    // console.log('Player object:', player); // Debugging log
    console.log('Player playerncwrijnonouincowuieonwe');



    try {
      setQueue([...queue, player]);
      const response = await axios.post('http://localhost:5000/enqueue', { player }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log("queue:" + queue);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add player to the queue. Please try again.');
    }
  };

  const checkAndCreateRoom = async (player) => {
    try {
      const roomResponse = await axios.post('http://localhost:5000/checkAndCreateRoom', { player }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('Player data received:', roomResponse.data);
    } catch (error) {
      console.error('Error in room creation or check:', error);
    }
  };

  const deque = async () => {
    try {

      const response = await axios.post('http://localhost:5000/dequeue', {}, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = response.data;
      if (data) {
        console.log(`Player dequeued: ${data.name}`);
        try {
          const roomResponse = await axios.post('http://localhost:5000/checkAndCreateRoom', { player: data }, {
            headers: {
              'Content-Type': 'application/json',
            }
          });
          setQueue([]);
          console.log('Player data received:', roomResponse.data);
        } catch (error) {
          console.error('Error in room creation or check:', error);
        }
      } else {
        console.log('No player data received');
      }
    } catch (error) {
      console.error('Error dequeuing player:', error);
    }
  };
  return (
    <div className="Poker">
        <button className="joinqueuebtn" onClick={() => createPlayer()}> Join queue </button>

        <button className="joinqueuebtn" onClick={() => deque()}> Test Deque </button>

        <div className="playerQueue">
          {queue.map((player) => {
            return <div>
                  <div key={player.id} className='playerBlock'>{player.name}</div>
                  </div>;
          })}
        </div>
        <Exit />
      </div>
  );
}


export default OnlinePoker;
