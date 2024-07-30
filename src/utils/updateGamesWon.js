import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../auth/firebase-config";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const updateGamesWon = async () => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const userRef = doc(db, "userData", uid);
        const userDoc = await getDoc(userRef);
  
        if (userDoc.exists()) {
          const userGamesWon = userDoc.data().gamesWon || 0;
          await setDoc(
            userRef,
            {
              gamesWon: userGamesWon + 1,
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