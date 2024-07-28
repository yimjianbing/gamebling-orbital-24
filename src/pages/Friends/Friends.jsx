import React, {useState, useEffect, useContext } from 'react';
import "./Friends.css";
import { AuthContext } from "../../context/AuthContext";
import { db, auth } from "../../auth/firebase-config"
import defaultAvatar from '../../assets/profile/default profile avatar.svg';
import { doc, getDoc, updateDoc, arrayUnion, query, where, collection, getDocs, onSnapshot } from "firebase/firestore";
import ProfilePic from '../../components/ProfilePic/ProfilePic';
import { useNavigate } from 'react-router-dom';

export const Friends = () => {
    const { currentUserLoggedIn, updateLoggedIn} = useContext(AuthContext);
    const [ elo, setElo ] = useState(0);
    const [ friendRequest, setFriendRequest ] = useState("");
    const [ pendingFriendRequests, setPendingFriendRequests ] = useState([]);
    const [ friends, setFriends ] = useState([]);
    const [profilePicPaths, setProfilePicPaths] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUserLoggedIn) {
            let playerId = currentUserLoggedIn.uid;
            const playerRef = doc(db, "userData", playerId);
    
            const unsubscribe = onSnapshot(playerRef, (docSnap) => {
                if (docSnap.exists()) {
                    console.log("Document data:", docSnap.data());
                    setElo(docSnap.data().elo); // Set the elo value in state
                    
                    const pendingFriendRequestsData = [];
                    docSnap.data().pendingFriendRequests.forEach((doc, index) => {
                        pendingFriendRequestsData.push({ 
                            username: doc.username, 
                            uid: doc.friendId,
                            id: index
                        });
                    });
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
                    console.log("friendsData");
                    console.log(friendsData);
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
    const fetchProfilePicPaths = async () => {
      const paths = {};
      for (const friend of friends) {
        const friendId = friend.uid.toString().substring(0, 5);
        const docRef = doc(db, "usersPicture", friendId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          paths[friend.uid] = docSnap.data().profilePic;
        } else {
          paths[friend.uid] = "";
        }
      }
      setProfilePicPaths(paths);
    };

    if (friends.length > 0) {
      fetchProfilePicPaths();
    }
  }, [friends]);

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
                const collectionRef = collection(db, "userData"); 

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

    const handleProfileNavigation = (friendID) => {
        return () => {
            navigate(`/profile/${friendID}`);
        }
    };

    return (
        <div className="friendsWrapper">
            <div className="friends">
                <div className="bigFont">Your Friends</div>
                <div className="friendOptions">
                    <div className="friendsListWrapper">
                        <h1>Friends</h1>
                        <div className="friendsList">
                            {friends.length > 0 
                                ? friends.map((friend, index) => {
                                        const path = profilePicPaths[friend.uid];
                                        return (
                                            <div className='friendWrapper'>
                                                <div key={index} className="friend" onClick={handleProfileNavigation(friend.uid)}>
                                                <ProfilePic key={index} filePath={path} size={"small"} className="smallProfilePic" />                                                    <h2>{friend.username}</h2>
                                                </div>
                                            </div>
                                        );
                                    })
                                : <h4 className="noFriends">No friends yet!</h4>}
                        </div>
                    </div>
                    <div className="pendingFriendRequests">
                        <h1>Pending Friend Requests</h1>
                        <div className="pendingFriendRequests">
                        {pendingFriendRequests.length > 0 
                            ? pendingFriendRequests.map((req) => (
                                <div key={req.id} className="message">
                                    <strong>{req.username}:</strong>
                                    <div className="acceptReq" onClick={() => handleAcceptReq(req.id)}> Accept </div>
                                    <div className="rejectReq" onClick={() => handleRejectReq(req.id)}> Decline </div>
                                </div>
                            )) 
                            : <h4 className="noFriendReq">No pending friend requests !</h4>}
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