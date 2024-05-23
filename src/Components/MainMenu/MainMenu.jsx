import React from "react";
import "./MainMenu.css";
import {auth, signOut } from "../../auth/firebase-config.js";

function handleSignOut() {
    signOut(auth).then(() => {
        alert("successful signout") // Sign-out successful.
    }).catch((error) => {
    
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
            
    });
}

const MainMenu = () => {
    return (
        <div className="mainmenu">
        <h1>Main Menu</h1>
        <p>
            Mahjong
        </p>
        <p>
            Poker
        </p>
        <button onClick={handleSignOut} className="signout">Sign out</button>
        </div>
    )
};

export default MainMenu;