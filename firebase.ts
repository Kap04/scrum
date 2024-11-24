// Import the necessary functions from Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // For authentication
import { getFirestore } from "firebase/firestore"; // For Firestore database
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcypsFVjSEtKc_ITXq2hyry6E85iFBCUA",
  authDomain: "scrum-652ca.firebaseapp.com",
  projectId: "scrum-652ca",
  storageBucket: "scrum-652ca.appspot.com", // Corrected `firebase.storage.app` to `.appspot.com`
  messagingSenderId: "771066384532",
  appId: "1:771066384532:web:1282f8186eca09601d6481",
  measurementId: "G-QDTTGQQZ4F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app); // Authentication service
const firestore = getFirestore(app); // Firestore database service
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null; // Analytics (only in browser environment)

// Export services for use in the app
export { app, auth, firestore, analytics };
