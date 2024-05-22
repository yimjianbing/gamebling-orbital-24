import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  onAuthStateChanged,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBp7Njz2A1qUmQK9iW0YaVf9tNgbvrBCn0",
  authDomain: "gamebling-orbital-24.firebaseapp.com",
  projectId: "gamebling-orbital-24",
  storageBucket: "gamebling-orbital-24.appspot.com",
  messagingSenderId: "1029764987985",
  appId: "1:1029764987985:web:148d0a58c28cadfa0e0c70",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export {
  auth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
};
