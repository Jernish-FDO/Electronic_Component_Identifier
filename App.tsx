import React, { useState, useCallback, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore'; 
import { auth, db } from './services/firebase';
import AuthComponent from './components/Auth';
import Capture from './components/Capture';
import Result from './components/Result';
import History from './components/History';
import { ComponentData } from './types';
import { identifyComponent } from './services/geminiService';
import Spinner from './components/Spinner';

type View = 'auth' | 'capture' | 'loading' | 'result' | 'error' | 'history';

const App: React.FC = () => {
  const [view, setView] = useState<View>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [resultData, setResultData] = useState<ComponentData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [history, setHistory] = useState<ComponentData[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setView('capture');
      } else {
        setView('auth');
        setHistory([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const historyCollection = collection(db, 'users', user.uid, 'history');
      const q = query(historyCollection, orderBy('id', 'desc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const userHistory = snapshot.docs.map(doc => doc.data() as ComponentData);
        setHistory(userHistory);
      }, (error) => {
        console.error("Error listening to history:", error);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleIdentification = useCallback(async (imageBase64: string) => {
    if (!user) return;
    setView('loading');
    try {
      const data = await identifyComponent(imageBase64);
      if (data.confidence === 'Uncertain') {
        setErrorMessage("Could not confidently identify the component.");
        setView('error');
      } else {
        const newResult: ComponentData = { 
          ...data, 
          id: new Date().toISOString(),
          userId: user.uid
        };
        await addDoc(collection(db, 'users', user.uid, 'history'), newResult);
        setResultData(newResult);
        setView('result');
      }
    } catch (error) {
      console.error('Identification or Firestore write failed:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
      setView('error');
    }
  }, [user]);
  
  const handleReset = useCallback(() => { setView('capture') }, []);
  const handleViewHistory = useCallback(() => setView('history'), []);
  const handleViewHistoryItem = useCallback((item: ComponentData) => { setResultData(item); setView('result'); }, []);

  const renderView = () => {
    if (view === 'loading') {
      return (<div className="flex flex-col items-center justify-center min-h-screen bg-base-100 p-4"><Spinner /></div>);
    }
    if (!user) {
      return <AuthComponent />;
    }
    switch (view) {
      case 'capture':
        return <Capture user={user} onIdentify={handleIdentification} onViewHistory={handleViewHistory} />;
      case 'result':
        return resultData ? <Result data={resultData} onReset={handleReset} /> : null;
      case 'history':
        return <History items={history} onViewItem={handleViewHistoryItem} onBack={handleReset} />;
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 p-4 text-center">
            <p className="text-xl text-red-400 mb-4">{errorMessage}</p>
            <button onClick={handleReset} className="px-6 py-2 bg-brand-primary text-white rounded-lg">Try Again</button>
          </div>
        );
      default:
        return <AuthComponent />;
    }
  };

  return <div className="min-h-screen bg-base-100">{renderView()}</div>;
};

export default App;