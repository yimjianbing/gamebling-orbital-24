import React, { useContext, useState, useEffect } from "react";
import "./ProfileModal.css";
import { AuthContext } from '../../context/AuthContext';
import defaultAvatar from '../../assets/profile/default profile avatar.svg';
import { db } from "../../auth/firebase-config"
import { doc, getDoc } from "firebase/firestore";

export function ProfileModal() {
    const { currentUserLoggedIn } = useContext(AuthContext);
    const [ elo, setElo ] = useState(0);
    const [ friendId, setFriendId ] = useState("");
    const [ friendRequest, setFriendRequest ] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUserLoggedIn) {
                let playerId = currentUserLoggedIn.uid;
                const playerRef = doc(db, "userData/" + playerId); // Corrected the path to use as parameters

                try {
                    const docSnap = await getDoc(playerRef);
                    if (docSnap.exists()) {
                        console.log("Document data:", docSnap.data());
                        setElo(docSnap.data().elo); // Set the elo value in state
                        setFriendId(docSnap.data().friendId); // Set the friendId value in state
                    } else {
                        console.log("No such document!");
                    }
                } catch (error) {
                    console.error("Error getting document:", error);
                }
            }
        };

        fetchUserData();
    }, [currentUserLoggedIn]); // Dependency array, re-run if currentUserLoggedIn changes


    const handleImgError = (e) => {
        e.target.src = "../../assets/profile/default profile avatar.svg"; // Path to your default image
    };

    return (
        currentUserLoggedIn ? (
            <div className="profileContainer">
                <div className="yourProfile">Your Profile</div>
                <img src={currentUserLoggedIn.photoURL != null ? require(currentUserLoggedIn.photoURL) : defaultAvatar} className="profilePic" onError={handleImgError} />
                <div className="name">{currentUserLoggedIn.displayName}</div>
                <div>Current Elo: </div>
                <div className="elo">{elo}</div>
                <div className="yourFriendId">Your Friend ID: {friendId}</div>
                <form>
                    <label for="addFriend">Send Friend Request!:</label>
                    <input type="text" placeholder="Friend Id" />
                    <input type="submit" value="Submit"></input>
                </form>
            </div>
        ) : (
            <div></div>
        )
    );
};