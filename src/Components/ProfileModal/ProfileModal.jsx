import React, { useContext, useState, useEffect } from "react";
import "./ProfileModal.css";
import { AuthContext } from '../../context/AuthContext';
import defaultAvatar from '../../assets/profile/default profile avatar.svg';
import { db, auth } from "../../auth/firebase-config"
import { doc, getDoc, updateDoc, arrayUnion, query, where, collection, getDocs, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";

export function ProfileModal() {
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
                <img src={currentUserLoggedIn.photoURL != null ? require(currentUserLoggedIn.photoURL) : defaultAvatar} className="profilePic" onError={handleImgError} />
                <div className="name">{currentUserLoggedIn.displayName}</div>
                <br />
                <div className="eloAndIdContainer">
                    
                    <div className="eloWrapper">Current Elo: <div className="elo">{elo}</div></div>
                    
                    <div className="eloWrapper">Your Friend ID: <h2 className="yourFriendId">{friendId}</h2></div>
                    
                </div>

                <div className="addnewfriend">Add new friends using their friend ID!</div>

                <form className="friendRequestForm">
                    <label className="addnewfriend" htmlFor="addFriend">Send Friend Request:</label>
                    <div className="inputContainer">
                        <input 
                            type="text" 
                            placeholder="Friend Id" 
                            value={friendRequest}
                            onChange={(e) => setFriendRequest(e.target.value)}
                            required
                        />
                        <button type="button" className="sendReqBtn" onClick={handleSendFriendRequest}>Send</button>
                    </div>
                </form>
                <br />

                <h3>Your current friend requests:</h3>
                {pendingFriendRequests.length > 0 
                ? pendingFriendRequests.map((req) => (
                    <div key={req.id} className="message">
                        <strong>{req.username}:</strong>
                        <div className="acceptReq" onClick={() => handleAcceptReq(req.id)}> Accept </div>
                        <div className="rejectReq" onClick={() => handleRejectReq(req.id)}> Decline </div>
                    </div>
                )) 
                : <h4 className="noFriendReq">No pending friend requests !</h4>}
                <br/>
                <h3>Your current friends:</h3>
                {friends.map((friend) => (
                    <div key={friend.id} className="message">
                        {/* <strong className="username">Username </strong> */}
                        <h3 className="friendUsername">{friend.username}</h3>
                    </div>
                ))}
                <button onClick={() => handleSignOut()} className="signout">
                    Sign out
                </button>
            </div>
        ) : (
            <div></div>
        )
    );
};