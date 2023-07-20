import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getFirestore } from "firebase/firestore";

// this is for google
import { GoogleAuthProvider } from "firebase/auth";


const app = firebase.initializeApp({
  apiKey: "AIzaSyCueutA6eLW6t4RUhj6tM5SaT5dH6C5dkU",
  authDomain: "midnights-final.firebaseapp.com",
  projectId: "midnights-final",
  storageBucket: "midnights-final.appspot.com",
  messagingSenderId: "971903163915",
  appId: "1:971903163915:web:aa13c8a8a4c91cfce5710e",
  measurementId: "G-VTZ7CQ54LC"
});

export const auth = app.auth();
export default app;

// this is for google
export const provider = new GoogleAuthProvider();

//data collection8
export const db = getFirestore(app);
