import {React, useContext} from "react";
import "./ProfileModal.css";
import { AuthContext } from '../../context/AuthContext';
import defaultAvater from '../../assets/profile/default profile avatar.svg';
// import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Assuming this import is correct


export function ProfileModal() {
    // const auth = getAuth();
    const {currentUserLoggedIn} = useContext(AuthContext);
    console.log(currentUserLoggedIn);

    const handleImgError = (e) => {
        e.target.src = "../../assets/profile/default profile avatar.svg"; // Path to your default image
    };


    return <div className="profileContainer">
        <div className="name">{currentUserLoggedIn.displayName}</div>
        {/* <img className="profilePic" /> */}
        <img src={currentUserLoggedIn.photoURL != null ? require(currentUserLoggedIn.photoURL) : defaultAvater} className="profilePic" onError={handleImgError}/>
        <div> </div>
    </div>
};