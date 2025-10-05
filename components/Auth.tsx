import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { motion } from 'framer-motion';
import { auth } from '../services/firebase';
import Spinner from './Spinner';

const AuthComponent: React.FC = () => {
  // ... (keep existing state and handlers)
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      if (isLoginView) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // onAuthStateChanged in App.tsx will handle the rest
    } catch (err: any) {
      // Provide user-friendly error messages
      switch (err.code) {
        case 'auth/wrong-password':
        case 'auth/user-not-found':
        case 'auth/invalid-credential':
          setError("Invalid email or password.");
          break;
        case 'auth/email-already-in-use':
          setError("An account with this email already exists.");
          break;
        case 'auth/weak-password':
          setError("Password should be at least 6 characters.");
          break;
        default:
          setError("An error occurred. Please try again.");
      }
      console.error("Firebase auth error:", err);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm mx-auto"
      >
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-content-100">Component Identifier</h1>
            <p className="mt-2 text-content-200">{isLoginView ? "Sign in to continue" : "Create an account"}</p>
        </div>

        <form onSubmit={handleAuthAction} className="bg-base-200 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-content-200 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 bg-base-300 text-content-100 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label className="block text-content-200 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="shadow-sm appearance-none border rounded w-full py-2 px-3 bg-base-300 text-content-100 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex justify-center items-center disabled:opacity-50"
            >
              {isLoading ? <Spinner /> : (isLoginView ? 'Sign In' : 'Sign Up')}
            </motion.button>
          </div>
        </form>
        <p className="text-center text-content-200 text-sm">
          {isLoginView ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => { setIsLoginView(!isLoginView); setError(null); }} className="font-bold text-brand-primary hover:text-brand-secondary ml-2">
            {isLoginView ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthComponent;