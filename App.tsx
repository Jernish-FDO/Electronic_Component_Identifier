
import React, { useState, useCallback } from 'react';
import Auth from './components/Auth';
import Capture from './components/Capture';
import Result from './components/Result';
import { ComponentData } from './types';
import { identifyComponent } from './services/geminiService';
import Spinner from './components/Spinner';

type View = 'auth' | 'capture' | 'loading' | 'result' | 'error';

const App: React.FC = () => {
  const [view, setView] = useState<View>('auth');
  const [resultData, setResultData] = useState<ComponentData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleLogin = useCallback(() => {
    setView('capture');
  }, []);

  const handleIdentification = useCallback(async (imageBase64: string) => {
    setView('loading');
    try {
      const data = await identifyComponent(imageBase64);
      if (data.confidence === 'Uncertain') {
          setErrorMessage("Could not confidently identify the component. Please try again with a clearer image.");
          setView('error');
      } else {
          setResultData(data);
          setView('result');
      }
    } catch (error) {
      console.error('Identification failed:', error);
      setErrorMessage('An unexpected error occurred during identification. Please check the console and try again.');
      setView('error');
    }
  }, []);

  const handleReset = useCallback(() => {
    setResultData(null);
    setErrorMessage('');
    setView('capture');
  }, []);

  const renderView = () => {
    switch (view) {
      case 'auth':
        return <Auth onLogin={handleLogin} />;
      case 'capture':
        return <Capture onIdentify={handleIdentification} />;
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 p-4">
            <Spinner />
            <p className="mt-4 text-lg text-content-100 animate-pulse">Analyzing component...</p>
          </div>
        );
      case 'result':
        return resultData ? <Result data={resultData} onReset={handleReset} /> : null;
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 p-4 text-center">
            <p className="text-xl text-red-400 mb-4">{errorMessage}</p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-opacity-75"
            >
              Try Again
            </button>
          </div>
        );
      default:
        return <Auth onLogin={handleLogin} />;
    }
  };

  return <div className="min-h-screen bg-base-100">{renderView()}</div>;
};

export default App;
