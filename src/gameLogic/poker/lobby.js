import { getDatabase, ref, onValue, push, set, update, get } from "firebase/database";
import { getAuth } from "firebase/auth";

export const handleEnterRoom = () => {
  let user = getAuth().currentUser;
  let playerId = user.uid;

  let data = "";

  const db = getDatabase();
  const lobbyRef = ref(db, "lobby");
  // Read the data at our posts reference
  return get(lobbyRef).then((snapshot) => {
    
    data = snapshot.val();

    if (!data || Object.keys(data).length === 0) {
      // Create new lobby
      const newLobbyKey = push(lobbyRef).key;
      const inGameLobbyRef = ref(db, `lobby/${newLobbyKey}`);
      const newLobby = {
        players: [playerId],
        game: null,
        noOfPlayers: 1,
      };
      set(inGameLobbyRef, newLobby);
    } else {
      // Find a lobby with less than 6 players
      const existingLobbyKey = Object.keys(data).find(key => data[key].players.length < 6);
  
      if (existingLobbyKey) {
        // Join existing lobby
        const existingLobbyRef = ref(db, `lobby/${existingLobbyKey}`);
        const updatedPlayers = [...data[existingLobbyKey].players, playerId];
        update(existingLobbyRef, { players: updatedPlayers });
      } else {
        // Create new lobby
        const newLobbyKey = push(lobbyRef).key;
        const inGameLobbyRef = ref(db, `lobby/${newLobbyKey}`);
        const newLobby = {
          players: [playerId],
          game: null,
          noOfPlayers: 1,
        };
        set(inGameLobbyRef, newLobby);
      }
    }
    
  }).then(() => {
    return Object
      .keys(data)
      .find(key => data[key].players.includes(playerId));
  });

}

