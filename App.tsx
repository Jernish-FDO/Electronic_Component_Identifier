import React, { useState, useCallback, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from './services/firebase';
import AuthComponent from './components/Auth';
import Capture from './components/Capture';
import Result from './components/Result';
import History from './components/History';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { ComponentData, AnalysisLevel } from './types'; // Import AnalysisLevel
import { identifyComponent } from './services/geminiService';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultData, setResultData] = useState<ComponentData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [history, setHistory] = useState<ComponentData[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
      if (currentUser && location.pathname === '/login') {
        navigate('/');
      }
      if (!currentUser) {
        setHistory([]);
      }
    });
    return () => unsubscribe();
  }, [navigate, location.pathname]);

  useEffect(() => {
    if (user) {
      const historyCollection = collection(db, 'users', user.uid, 'history');
      const q = query(historyCollection, orderBy('id', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const userHistory = snapshot.docs.map(doc => doc.data() as ComponentData);
        setHistory(userHistory);
      }, (error) => console.error("Error listening to history:", error));
      return () => unsubscribe();
    }
  }, [user]);

  // UPDATED: handleIdentification now accepts the analysis level
  const handleIdentification = useCallback(async (imageBase64: string, level: AnalysisLevel) => {
    if (!user) return;
    setIsProcessing(true);
    setErrorMessage('');
    try {
      // Pass the level to the AI service
      const data = await identifyComponent(imageBase64, level);
      
      if (data.confidence === 'Uncertain') {
        setErrorMessage(data.commonUsage || "Could not confidently identify the component.");
      } else {
        const newResult: ComponentData = {
          ...data,
          id: new Date().toISOString(),
          userId: user.uid,
          imageBase64: imageBase64,
        };
        await addDoc(collection(db, 'users', user.uid, 'history'), newResult);
        setResultData(newResult);
        setErrorMessage('');
        navigate('/result');
      }
    } catch (error) {
      console.error('Identification or Firestore write failed:', error);
      const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setErrorMessage(message);
    } finally {
      setIsProcessing(false);
    }
  }, [user, navigate]);

  const handleViewHistoryItem = useCallback((item: ComponentData) => {
    setResultData(item);
    navigate('/result');
  }, [navigate]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isProcessing && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-base-100/90 backdrop-blur-sm"
          >
            <Spinner />
            <p className="mt-4 text-content-100">Analyzing component...</p>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<AuthComponent />} />
          <Route element={<ProtectedRoute user={user} isAuthLoading={isAuthLoading} />}>
            <Route element={<Layout user={user} />}>
              <Route path="/" element={<Capture onIdentify={handleIdentification} errorMessage={errorMessage} />} />
              <Route path="/history" element={<History items={history} onViewItem={handleViewHistoryItem} />} />
              <Route path="/result" element={resultData ? <Result data={resultData} /> : <Navigate to="/" />} />
            </Route>
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default App;
