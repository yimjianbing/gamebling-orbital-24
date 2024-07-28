import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, onSnapshot} from 'firebase/firestore';
import { db } from '../../auth/firebase-config'; 
import ProfilePic from '../../components/ProfilePic/ProfilePic';
import './Profile.css';

const Profile = () => {
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [path, setPath] = useState('');
    const [friends, setFriends] = useState([]);
    const [profilePicPaths, setProfilePicPaths] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = await getDoc(doc(db, 'userData', id));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUserData(data);
                    const friendsData = [];
                    userDoc.data().friends.forEach((doc, index) => {
                        friendsData.push({ 
                            username: doc.username, 
                            uid: doc.friendId,
                            id: index
                        });
                    });
                    setFriends(friendsData);
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [id]);

    useEffect(() => {
            const unsubscribe = onSnapshot(doc(db, "usersPicture", id.toString().substring(0, 5)), (doc) => {
                if (doc.exists()) {
                    setPath(doc.data().profilePic);
                } else {
                    setPath('');
                }
            }, (error) => {
                console.error("Error getting document:", error);
            });

            return () => unsubscribe();
        }, [path, id]);

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
        }, [friends, id]);

    const handleProfileNavigation = (friendID) => {
        return () => {
            navigate(`/profile/${friendID}`);
        }
    };

    if (!userData) {
        return <div>Loading...</div>;
    }
    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Profile</h1>
                <h1><ProfilePic filePath={path} size={"verylarge"} className='largeProfilePicture'/></h1>
            </div>
            <div className="profile-info">
                <h3>Name: <span>{userData.username}</span></h3>
                <h3>Games Won: <span>{userData.gamesWon}</span></h3>
                <h3>Elo: <span>{userData.elo}</span></h3>
            </div>
            <div className="friendsListWrapper">
                <h3>User's Friends</h3>
                {friends.length > 0 
                    ? friends.map((friend, index) => {
                            const path = profilePicPaths[friend.uid];
                            return (
                                <div className='friendWrapper'>
                                    <div key={index} className="friend" onClick={handleProfileNavigation(friend.uid)}>
                                    <ProfilePic key={index} filePath={path} size={"small"}className="smallProfilePic" />                                                    <h2>{friend.username}</h2>
                                    </div>
                                </div>
                            );
                        })
                    : <h4 className="noFriends">No friends yet!</h4>}
            </div>
        </div>
    );
}

export default Profile;