import React, { useContext, useState, useEffect } from "react";
import "./ProfileModal.css";
import { AuthContext } from '../../context/AuthContext';
import defaultAvatar from '../../assets/profile/default profile avatar.svg';
import { db } from "../../auth/firebase-config"
import { doc, getDoc, updateDoc, arrayUnion, query, where, collection, getDocs } from "firebase/firestore";

export function ProfileModal() {
    const { currentUserLoggedIn } = useContext(AuthContext);
    const [ elo, setElo ] = useState(0);
    const [ friendId, setFriendId ] = useState("");
    const [ friendRequest, setFriendRequest ] = useState("");
    const [ pendingFriendRequests, setPendingFriendRequests ] = useState([]);

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
                        const pendingFriendRequestsData = [];
                        docSnap.data().pendingFriendRequests.forEach((doc) => {
                            pendingFriendRequestsData.push({ 
                                username: doc.username, 
                                uid: doc.friendId,
                                id: doc.id 
                            });
                        });
                        setPendingFriendRequests(pendingFriendRequestsData);
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

    const handleSendFriendRequest = async () => {
    
            if (currentUserLoggedIn) {
                const collectionRef = collection(db, "userData"); // Corrected the path to use as parameters

                const q = query(collectionRef, where("friendId", "==", friendRequest));

                try {
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        querySnapshot.forEach(async (doc) => {
                            const docRef = doc.ref; // Get the DocumentReference from the document
                            const payload = {
                                username: currentUserLoggedIn.displayName,
                                friendId: currentUserLoggedIn.uid
                            };
                            await updateDoc(docRef, {
                                pendingFriendRequests: arrayUnion(payload)
                            });
                        });
                    } else {
                        console.log("No such document!");
                    }
                } catch (error) {
                    console.error("Error getting document:", error);
                }
            }
    
    };

    const handleAcceptReq = async (key) => {

    }

    return (
        currentUserLoggedIn ? (
            <div className="profileContainer">
                <div className="yourProfile">Your Profile</div>
                <img src={currentUserLoggedIn.photoURL != null ? require(currentUserLoggedIn.photoURL) : defaultAvatar} className="profilePic" onError={handleImgError} />
                <div className="name">{currentUserLoggedIn.displayName}</div>
                <div>Current Elo: </div>
                <div className="elo">{elo}</div>
                <div className="yourFriendId">Your Friend ID: {friendId}</div>
                <div className="addnewfriend">Add new friends using their friend ID!</div>
                <form>
                    <label for="addFriend">Send Friend Request:</label>
                    <input 
                        type="text" 
                        placeholder="Friend Id" 
                        value={friendRequest}
                        onChange={(e) => setFriendRequest(e.target.value)}
                        required/>
                </form>
                <div onClick={handleSendFriendRequest}>Send</div>
                <div>Your current friend requests:</div>
                {pendingFriendRequests.map((req) => (
                    <div key={req.id} className="message">
                        <strong>{req.username}:</strong>
                        <div className="acceptReq" onClick={handleAcceptReq(key)}> Accept </div>
                        <div className="rejectReq" onClick={handleRejectReq(key)}> Decline </div>
                    </div>
                ))}
            </div>
        ) : (
            <div></div>
        )
    );
};