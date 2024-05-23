import React, { useState, useContext } from "react";
import "./MainMenu.css";
import { auth, signOut } from "../../auth/firebase-config.js";
import { AuthContext } from "../../auth/AuthContext.jsx";
import ChatRoom from '../ChatRoom/ChatRoom';
import ChatClose from '../ChatRoom/ChatClose';


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
        <>
            <div className="mainmenu">
                <h1>Main Menu</h1>
                <p>Mahjong</p>
                <p>Poker</p>
                <button onClick={() => handleSignOut()} className="signout">
                    Sign out
                </button>
            </div>
            {chatOpen ? <ChatRoom setChatOpen={setChatOpen} /> : <ChatClose setChatOpen={setChatOpen} />}
        </>
    );
};

