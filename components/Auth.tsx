// components/Auth.tsx

import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { GoogleIcon } from './icons/SocialIcons'; // Re-using the Google Icon

const AuthComponent: React.FC = () => {
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // The onAuthStateChanged listener in App.tsx will handle the redirect.
    } catch (error) {
      console.error("Authentication failed:", error);
      alert("Could not log you in. Please check the console for more details.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 p-4">
      <div className="w-full max-w-sm mx-auto text-center">
        <h1 className="text-3xl font-bold text-content-100">Component Identifier</h1>
        <p className="mt-2 text-content-200">Sign in to save and view your identification history.</p>
        <div className="mt-8">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 focus:outline-none transition-colors"
          >
            <GoogleIcon />
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;