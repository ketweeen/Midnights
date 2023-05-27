import firebase from "firebase/compat/app";
import 'firebase/compat/database';
import "firebase/compat/auth";
import "firebase/compat/firestore";

const app = firebase.initializeApp({
  apiKey: "AIzaSyATyplCEKUv39r2o5MLSrP4Ib8xYsV8sgU",
  authDomain: "midnights-capriuscats.firebaseapp.com",
  projectId: "midnights-capriuscats",
  storageBucket: "midnights-capriuscats.appspot.com",
  messagingSenderId: "823684049137",
  appId: "1:823684049137:web:5570aa772fd4eaf69fe150",
  measurementId: "G-M7XP6V5HK1",
});

export const auth = app.auth();
export default app;
