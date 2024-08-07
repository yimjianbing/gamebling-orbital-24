import React, { useState, useContext } from "react";
import "./MainMenu.css";
import { auth, signOut } from "../../auth/firebase-config.js";
import { AuthContext } from "../../context/AuthContext.jsx";
import ChatRoom from "../../components/ChatRoom/ChatRoom.jsx";
import ChatClose from "../../components/ChatClose/ChatClose.jsx";
import { useNavigate } from "react-router-dom";
import { inGameContext } from "../../context/InGameContext.jsx";



export const MainMenu = () => {
  const navigate = useNavigate();
  const { updateLoggedIn } = useContext(AuthContext);
  const [chatOpen, setChatOpen] = useState(false);

  function handleSignOut() {
    signOut(auth)
      .then(() => {
        updateLoggedIn(false); //update context to be signedout
        // alert("successful signout"); // Sign-out successful.
      }).then(() => {
        navigate("/loginregister");
      })
      .catch((error) => {
        var errorMessage = error.message;
        alert(errorMessage);
      });
  }

  function handlePoker() {
      navigate(`/pokerMenu`);
  }
    
  return (
    <div>
      <div className="mainmenu">
        <h2 className="title">Choose your gamemode to play!</h2>
        <div className="boxes">
          {/* <h2 className="mahjong">Mahjong</h2> */}
          <h2 className="poker" onClick ={() => handlePoker()}>Poker</h2>
        </div>

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