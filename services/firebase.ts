// services/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// IMPORTANT: Replace this with the config object you copied from the Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyDDBw1njhQlmBG2VdRvXeyc6cANp4DxaxI",
  authDomain: "component-identifier-app.firebaseapp.com",
  projectId: "component-identifier-app",
  storageBucket: "component-identifier-app.firebasestorage.app",
  messagingSenderId: "966047101977",
  appId: "1:966047101977:web:e78267b481384f5a816688",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();