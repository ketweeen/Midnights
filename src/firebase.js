import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getFirestore } from "firebase/firestore";

// this is for google
import { GoogleAuthProvider } from "firebase/auth";


const app = firebase.initializeApp({
  apiKey: "AIzaSyDer7pD7X0NZ4ZPzUKVK2XUfbmCOjNRWV4",
  authDomain: "midnights-production.firebaseapp.com",
  projectId: "midnights-production",
  storageBucket: "midnights-production.appspot.com",
  messagingSenderId: "626998236498",
  appId: "1:626998236498:web:e71409a1bf4af56575568b",
  measurementId: "G-T7013Q4NZC"
});

export const auth = app.auth();
export default app;

// this is for google
export const provider = new GoogleAuthProvider();

//data collection8
export const db = getFirestore(app);
