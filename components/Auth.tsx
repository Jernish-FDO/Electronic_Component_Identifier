
import React from 'react';
import { GoogleIcon, FacebookIcon, XIcon } from './icons/SocialIcons';
import { CircuitBoardIcon } from './icons/AppIcons';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const handleAuthAction = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 p-4">
      <div className="w-full max-w-sm mx-auto overflow-hidden bg-base-200 rounded-lg shadow-xl">
        <div className="px-6 py-8">
          <div className="flex justify-center mx-auto text-brand-primary">
            <CircuitBoardIcon />
          </div>

          <h3 className="mt-3 text-2xl font-bold text-center text-content-100">Welcome Back</h3>
          <p className="mt-1 text-center text-content-200">Login or sign up to continue</p>

          <form onSubmit={handleAuthAction}>
            <div className="w-full mt-6">
              <input 
                className="w-full px-4 py-3 text-content-100 bg-base-300 border-base-300 rounded-md focus:border-brand-primary focus:ring-brand-primary focus:ring-opacity-40 focus:outline-none focus:ring" 
                type="email" 
                placeholder="Email Address" 
                aria-label="Email Address"
                defaultValue="demo@example.com"
              />
            </div>

            <div className="w-full mt-4">
              <input 
                className="w-full px-4 py-3 text-content-100 bg-base-300 border-base-300 rounded-md focus:border-brand-primary focus:ring-brand-primary focus:ring-opacity-40 focus:outline-none focus:ring" 
                type="password" 
                placeholder="Password" 
                aria-label="Password" 
                defaultValue="password"
              />
            </div>

            <div className="flex items-center justify-between mt-6">
              <a href="#" className="text-sm text-content-200 hover:text-brand-primary">Forget Password?</a>

              <button 
                type="submit"
                className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-brand-primary rounded-lg hover:bg-brand-secondary focus:outline-none focus:ring focus:ring-brand-secondary focus:ring-opacity-50"
              >
                Sign In
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between mt-6">
            <span className="w-1/5 border-b border-base-300 lg:w-1/4"></span>
            <p className="text-xs text-center text-content-200 uppercase">or login with</p>
            <span className="w-1/5 border-b border-base-300 lg:w-1/4"></span>
          </div>

          <div className="flex justify-center mt-4 gap-4">
            <button onClick={onLogin} className="p-2 text-content-200 bg-base-300 rounded-full hover:bg-base-100 transition-colors duration-200"><GoogleIcon /></button>
            <button onClick={onLogin} className="p-2 text-content-200 bg-base-300 rounded-full hover:bg-base-100 transition-colors duration-200"><FacebookIcon /></button>
            <button onClick={onLogin} className="p-2 text-content-200 bg-base-300 rounded-full hover:bg-base-100 transition-colors duration-200"><XIcon /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
