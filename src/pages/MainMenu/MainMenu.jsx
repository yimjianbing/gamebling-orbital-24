import React, { useState, useContext } from "react";
import "./MainMenu.css";
import { auth, signOut } from "../../auth/firebase-config.js";
import { AuthContext } from  "../../context/AuthContext.jsx";
import ChatRoom from "../../components/ChatRoom/ChatRoom.jsx";
import ChatClose from "../../components/ChatClose/ChatClose.jsx";

export const MainMenu = () => {
  const { updateLoggedIn } = useContext(AuthContext);
  const [chatOpen, setChatOpen] = useState(false);

  function handleSignOut() {
    signOut(auth)
      .then(() => {
        updateLoggedIn(false); //update context to be signedout
        // alert("successful signout"); // Sign-out successful.
      })
      .catch((error) => {
        var errorMessage = error.message;
        alert(errorMessage);
      });
  }

  return (
    <div>
      <div className="mainmenu">
        {/* <h1 className="title">Main Menu</h1> */}
        <h2 className="title">Choose your gamemode to play!</h2>
        <heading className="boxes">
          <h2 className="mahjong">Mahjong</h2>
          <h2 className="poker">Poker</h2>
        </heading>
        <button onClick={() => handleSignOut()} className="signout">
          Sign out
        </button>
      </div>
      <p>
        {chatOpen ? (
          <ChatRoom setChatOpen={setChatOpen} />
        ) : (
          <ChatClose setChatOpen={setChatOpen} />
        )}
      </p>
    </div>
  );
};
