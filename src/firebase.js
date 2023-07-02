import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getFirestore } from "firebase/firestore";

// this is for google
import { GoogleAuthProvider } from "firebase/auth";


const app = firebase.initializeApp({
  apiKey: "AIzaSyDyRDD3Yf0CCf58ZvxPLCDGZfupw0IqYTo",
  authDomain: "midnights-1e900.firebaseapp.com",
  projectId: "midnights-1e900",
  storageBucket: "midnights-1e900.appspot.com",
  messagingSenderId: "974615648482",
  appId: "1:974615648482:web:7870dc846208ba89d0e6bb",
  measurementId: "G-TF01GXZ4PS"
});

export const auth = app.auth();
export default app;

// this is for google
export const provider = new GoogleAuthProvider();

//data collection8
export const db = getFirestore(app);
