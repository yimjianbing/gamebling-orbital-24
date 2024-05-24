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
        <div className="mainmenu">
            <div >
                <h1 className="title">Main Menu</h1>
                <heading className='boxes'>
                    <h2 className="mahjong">Mahjong</h2>
                    <h2 className="poker">Poker</h2>
                </heading>
                
                <button onClick={() => handleSignOut()} className="signout">
                    Sign out
                </button>
            </div>
            <p className="openCloseButton">
                {chatOpen ? <ChatRoom setChatOpen={setChatOpen} /> : <ChatClose setChatOpen={setChatOpen} />}
            </p>
            
        </div>
    );
};

