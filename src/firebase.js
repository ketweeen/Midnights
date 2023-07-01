import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getFirestore } from "firebase/firestore";

// this is for google
import { GoogleAuthProvider } from "firebase/auth";


const app = firebase.initializeApp({
  apiKey: "AIzaSyA6SGvYqKP6bhebAztRM-Sbhg_tLYY44yc",
  authDomain: "midnights-orbital.firebaseapp.com",
  projectId: "midnights-orbital",
  storageBucket: "midnights-orbital.appspot.com",
  messagingSenderId: "703840241184",
  appId: "1:703840241184:web:2e739390fcc4a9f85e1e45",
  measurementId: "G-DP1QVZ345M"
});

export const auth = app.auth();
export default app;

// this is for google
export const provider = new GoogleAuthProvider();

//data collection8
export const db = getFirestore(app);