import React, { useState, useCallback, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { auth, db } from './services/firebase';
import AuthComponent from './components/Auth';
import Capture from './components/Capture';
import Result from './components/Result';
import History from './components/History';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { ComponentData } from './types';
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

  const handleIdentification = useCallback(async (imageBase64: string) => {
    if (!user) return;
    setIsProcessing(true);
    setErrorMessage('');
    try {
      const data = await identifyComponent(imageBase64);
      if (data.confidence === 'Uncertain') {
        setErrorMessage("Could not confidently identify the component.");
      } else {
        const newResult: ComponentData = {
          ...data,
          id: new Date().toISOString(),
          userId: user.uid,
          imageBase64: imageBase64,
        };
        await addDoc(collection(db, 'users', user.uid, 'history'), newResult);
        setResultData(newResult);
        navigate('/result');
      }
    } catch (error) {
      console.error('Identification or Firestore write failed:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [user, navigate]);

  const handleViewHistoryItem = useCallback((item: ComponentData) => {
    setResultData(item);
    navigate('/result');
  }, [navigate]);

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 p-4">
        <Spinner />
        <p className="mt-4 text-content-200">Identifying component...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<AuthComponent />} />
      <Route element={<ProtectedRoute user={user} isAuthLoading={isAuthLoading} />}>
        <Route element={<Layout user={user} />}>
          <Route path="/" element={<Capture onIdentify={handleIdentification} errorMessage={errorMessage} />} />
          <Route path="/history" element={<History items={history} onViewItem={handleViewHistoryItem} />} />
          <Route path="/result" element={resultData ? <Result data={resultData} /> : <Navigate to="/" />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;