import React, {useState, useEffect, useContext } from 'react';
import "./Friends.css";
import { AuthContext } from "../../context/AuthContext";
import { db, auth } from "../../auth/firebase-config"
import { doc, getDoc, updateDoc, arrayUnion, query, where, collection, getDocs, onSnapshot } from "firebase/firestore";

export const Friends = () => {
    const { currentUserLoggedIn, updateLoggedIn} = useContext(AuthContext);
    const [ elo, setElo ] = useState(0);
    const [ friendId, setFriendId ] = useState("");
    const [ friendRequest, setFriendRequest ] = useState("");
    const [ pendingFriendRequests, setPendingFriendRequests ] = useState([]);
    const [ friends, setFriends ] = useState([]);

    useEffect(() => {
        if (currentUserLoggedIn) {
            let playerId = currentUserLoggedIn.uid;
            const playerRef = doc(db, "userData", playerId);
    
            const unsubscribe = onSnapshot(playerRef, (docSnap) => {
                if (docSnap.exists()) {
                    console.log("Document data:", docSnap.data());
                    setElo(docSnap.data().elo); // Set the elo value in state
                    setFriendId(docSnap.data().friendId); // Set the friendId value in state
                    
                    const pendingFriendRequestsData = [];
                    docSnap.data().pendingFriendRequests.forEach((doc, index) => {
                        pendingFriendRequestsData.push({ 
                            username: doc.username, 
                            uid: doc.friendId,
                            id: index
                        });
                    });
                    console.log(pendingFriendRequestsData);
                    setPendingFriendRequests(pendingFriendRequestsData);
    
                    const friendsData = [];
                    docSnap.data().friends.forEach((doc, index) => {
                        friendsData.push({ 
                            username: doc.username, 
                            uid: doc.friendId,
                            id: index
                        });
                    });
                    setFriends(friendsData);
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

    const handleImgError = (e) => {
        e.target.src = "../../assets/profile/default profile avatar.svg"; // Path to your default image
    };

    const checkIfAlreadyFriends = (friends, friendRequest) => {
        let alreadyFriends = false;
        friends.forEach((friend) => {
            if (friend.uid.toString().substring(0, 5) == friendRequest) {
                alreadyFriends = true;
            }
            console.log(friend.uid.toString().substring(0, 5), friendRequest, alreadyFriends);
        });
        return alreadyFriends;
    }

    const handleSendFriendRequest = async () => {
    
            if (currentUserLoggedIn && friendRequest !== currentUserLoggedIn.uid.toString().substring(0, 5)){
                const collectionRef = collection(db, "userData"); // Corrected the path to use as parameters

                const q = query(collectionRef, where("friendId", "==", friendRequest));

                try {
                    const querySnapshot = await getDocs(q);
                    // console.log(querySnapshot.empty);
                    if (!querySnapshot.empty){
                        querySnapshot.forEach(async (doc) => {
                            if (!checkIfAlreadyFriends(friends, friendRequest)) {
                                const docRef = doc.ref; // Get the DocumentReference from the document
                                const payload = {
                                    username: currentUserLoggedIn.displayName,
                                    friendId: currentUserLoggedIn.uid
                                };
                                await updateDoc(docRef, {
                                    pendingFriendRequests: arrayUnion(payload)
                                });
                            } else {
                                alert("you are already friends with this user!");
                            } 
                        });
                    } else {
                        console.log("No such document!!");
                    }
                } catch (error) {
                    console.error("Error getting document:", error);
                }
            }
    
    };

    const handleAcceptReq = async (index) => {
        if (currentUserLoggedIn) {
            const playerRef = doc(db, "userData/" + currentUserLoggedIn.uid); // Corrected the path to use as parameters

            try {
                const docSnap = await getDoc(playerRef);
                if (docSnap.exists()) {
                    const pendingFriendRequestsData = docSnap.data().pendingFriendRequests;
                    const friendToAdd = pendingFriendRequestsData[index];
                    const friendsData = docSnap.data().friends;
                    friendsData.push(friendToAdd);
                    pendingFriendRequestsData.splice(index, 1);
                    // console.log(friendsData, pendingFriendRequestsData);

                    await updateDoc(playerRef, {
                        friends: friendsData,
                        pendingFriendRequests: pendingFriendRequestsData
                    });

                    //update the sender freind list too!

                    const senderRef = doc(db, "userData/" + friendToAdd.friendId); 
                    const senderDocSnap = await getDoc(senderRef);
                    if (senderDocSnap.exists()) {
                        const senderFriendsData = senderDocSnap.data().friends;
                        const userToAdd = {
                            username: currentUserLoggedIn.displayName,
                            friendId: currentUserLoggedIn.uid
                        };
                        senderFriendsData.push(userToAdd);

                        await updateDoc(senderRef, {
                            friends: senderFriendsData
                        });
                    } else {
                        console.log("No such document!");
                    }
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error getting document:", error);
            }
        }
    }

    const handleRejectReq = async (index) => {
        if (currentUserLoggedIn) {
            const playerRef = doc(db, "userData/" + currentUserLoggedIn.uid); // Corrected the path to use as parameters

            try {
                const docSnap = await getDoc(playerRef);
                if (docSnap.exists()) {
                    const pendingFriendRequestsData = docSnap.data().pendingFriendRequests;
                    pendingFriendRequestsData.splice(index, 1);

                    await updateDoc(playerRef, {
                        pendingFriendRequests: pendingFriendRequestsData
                    });
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error getting document:", error);
            }
        }
    };

    return (
        <div className="friendsWrapper">
            <div className="friends">
                <div className="bigFont">Your Friends</div>
                <div className="friendOptions">
                    <div className="friendsList">
                        <h1>Friends</h1>
                        <div className="friendsList">
                            {friends.map((friend, index) => {
                                return (
                                    <div key={index} className="friend">
                                        <img src="../../assets/profile/default profile avatar.svg" alt="profile" onError={handleImgError} />
                                        <p>{friend.username}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="pendingFriendRequests">
                        <h1>Pending Friend Requests</h1>
                        <div className="pendingFriendRequests">
                            {pendingFriendRequests.map((friend, index) => {
                                return (
                                    <div key={index} className="friend">
                                        <img src="../../assets/profile/default profile avatar.svg" alt="profile" onError={handleImgError} />
                                        <p>{friend.username}</p>
                                        <button onClick={() => handleAcceptReq(index)}>Accept</button>
                                        <button onClick={() => handleRejectReq(index)}>Reject</button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="sendFriendRequest">
                        <h1>Send Friend Request</h1>
                        <input type="text" placeholder="Friend ID" value={friendRequest} onChange={(e) => setFriendRequest(e.target.value)} />
                        <button onClick={handleSendFriendRequest}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}