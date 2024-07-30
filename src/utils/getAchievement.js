import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from '../auth/firebase-config'; // Adjust the import path as needed
import { doc, setDoc, getDoc} from "firebase/firestore";

export const checkAndGiveAchievement = async () => {

    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const uid = user.uid;
            const userRef = doc(db, "userData", uid);
            const userDoc = await getDoc(userRef);
    
            if (userDoc.exists()) {
                const userAchievements = userDoc.data().achievements;
                const data = userDoc.data();
                if (data.gamesPlayed >= 1) {
                    await setDoc(userRef, {
                        achievements: {
                            ...userAchievements,
                            playFirstGame: true
                        }
                    }, { merge: true });
                } else if (data.gamesWon >= 1) {
                    await setDoc(userRef, {
                        achievements: {
                            ...userAchievements,
                            winFirstGame: true
                        }
                    }, { merge: true });
                } else if (data.gamesPlayed >= 10) {
                    await setDoc(userRef, {
                        achievements: {
                            ...userAchievements,
                            tenGames: true
                        }
                    }, { merge: true });
                } else if (data.finishedTutorial === true) {
                    await setDoc(userRef, {
                        achievements: {
                            ...userAchievements,
                            finishedTutorial: true
                        }
                    }, { merge: true });
                }
            } else {
                console.log("No such document!");
            }
        }
    });
}

