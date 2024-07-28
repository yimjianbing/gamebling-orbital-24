import React, { useContext, useState, useEffect } from "react";
import "./ProfileModal.css";
import { AuthContext } from '../../context/AuthContext';
import { db, auth } from "../../auth/firebase-config"
import { doc, getDoc, updateDoc, arrayUnion, query, where, collection, getDocs, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import ProfilePicUpload from "../UploadProfilePic/ProfilePicUpload";
import  ProfilePic  from "../ProfilePic/ProfilePic";

export function ProfileModal() {
    const { currentUserLoggedIn, updateLoggedIn} = useContext(AuthContext);
    const [ elo, setElo ] = useState(0);
    const [ friendId, setFriendId ] = useState("");
    const [ path, setPath ] = useState("");

    useEffect(() => {
        if (currentUserLoggedIn) {
            let playerId = currentUserLoggedIn.uid;
            const playerRef = doc(db, "userData", playerId);
    
            const unsubscribe = onSnapshot(playerRef, (docSnap) => {
                if (docSnap.exists()) {
                    console.log("Document data:", docSnap.data());
                    setElo(docSnap.data().elo); // Set the elo value in state
                    setFriendId(docSnap.data().friendId); // Set the friendId value in state
                } else {
                    console.log("No such document!");
                }
            }, (error) => {
                console.error("Error getting document:", error);
            });
    
            // Cleanup subscription on unmount
            return () => unsubscribe();
        }
    }, [currentUserLoggedIn]);

    useEffect(() => {
        if (currentUserLoggedIn) {
            const unsubscribe = onSnapshot(doc(db, "usersPicture", currentUserLoggedIn.uid.toString().substring(0, 5)), (doc) => {
                if (doc.exists()) {
                    setPath(doc.data().profilePic);
                } else {
                    console.log("No such document!");
                }
            }, (error) => {
                console.error("Error getting document:", error);
            });

            return () => unsubscribe();
        }
    }, [path]);

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
        currentUserLoggedIn ? (
            <div className="profileContainer">
                <div className="yourProfile">Your Profile</div>
                <br/>
                <ProfilePic filePath={path} size={"large"}/> 
                <div className="name">{currentUserLoggedIn.displayName}</div>
                <br />
                <div className="eloAndIdContainer">
                    
                    <div className="eloWrapper">Current Elo: <div className="elo">{elo}</div></div>
                    
                    <div className="eloWrapper">Your Friend ID: <h2 className="yourFriendId">{friendId}</h2></div>
                    
                </div>

             <ProfilePicUpload />

                <br />

                <button onClick={() => handleSignOut()} className="signout">
                    Sign out
                </button>
            </div>
        ) : (
            <div></div>
        )
    );
};