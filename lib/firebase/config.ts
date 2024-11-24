// lib/firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAcypsFVjSEtKc_ITXq2hyry6E85iFBCUA",
  authDomain: "scrum-652ca.firebaseapp.com",
  projectId: "scrum-652ca",
  storageBucket: "scrum-652ca.appspot.com",
  messagingSenderId: "771066384532",
  appId: "1:771066384532:web:1282f8186eca09601d6481",
  measurementId: "G-QDTTGQQZ4F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export { app, auth, db, analytics };