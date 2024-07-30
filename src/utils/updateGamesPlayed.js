import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../auth/firebase-config";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const updateGamesPlayed = async () => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const userRef = doc(db, "userData", uid);
        const userDoc = await getDoc(userRef);
  
        if (userDoc.exists()) {
          const userGamesPlayed = userDoc.data().gamesPlayed || 0;
          await setDoc(
            userRef,
            {
              gamesPlayed: userGamesPlayed + 1,
            },
            { merge: true }
          );
        } else {
          console.log("No such document!");
        }
      } else {
        console.log("No user is signed in.");
      }
    });
  };