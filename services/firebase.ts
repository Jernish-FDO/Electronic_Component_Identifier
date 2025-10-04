// services/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// IMPORTANT: Replace this with the config object you copied from the Firebase console
const firebaseConfig = {
  apiKey: process.env.apiKey ,
  authDomain: process.env.authDomain ,
  projectId: process.env.projectId ,
  storageBucket: process.env.storageBucket ,
  messagingSenderId: process.env.messagingSenderId ,
  appId: process.env.appId ,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();