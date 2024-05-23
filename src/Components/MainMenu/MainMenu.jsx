import React from "react";
import "./MainMenu.css";
import { auth, signOut } from "../../auth/firebase-config.js";
import { AuthContext } from "../../auth/AuthContext.jsx";
import { useContext } from "react";
import ChatRoom from '../ChatRoom/ChatRoom';

const MainMenu = () => {
    const { updateLoggedIn } = useContext(AuthContext);

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
        <div className="mainmenu">
            <h1>Main Menu</h1>
            <p>Mahjong</p>
            <p>Poker</p>
            <button onClick={() => handleSignOut()} className="signout">
                Sign out
            </button>
            <ChatRoom />

        </div>
    );
};

export default MainMenu;