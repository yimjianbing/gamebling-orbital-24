import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../auth/firebase-config";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const updateTutorialPlayed = async () => {
    console.log("updateTutorialPlayed called");
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const userRef = doc(db, "userData", uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          await setDoc(
            userRef,
            { finishedTutorial: true },
            { merge: true }
          );

          console.log(userDoc.data());
        } else {
          console.log("No such document!");
        }
      } else {
        console.log("No user is signed in.");
      }
    });
  };