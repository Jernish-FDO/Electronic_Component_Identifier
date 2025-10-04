import React from 'react';

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
      <div className="w-full max-w-sm mx-auto border-2 border-content-100 rounded-lg p-8 shadow-[8px_8px_0_0_#111827]">
        <h3 className="text-3xl font-bold text-center text-content-100 tracking-widest uppercase">
          Login
        </h3>

        <form onSubmit={handleAuthAction} className="mt-8">
          <div className="mb-6">
            <label className="block text-content-100 text-sm font-bold tracking-wider uppercase mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="w-full px-4 py-3 text-content-100 bg-base-100 border-2 border-content-100 focus:outline-none focus:ring-2 focus:ring-content-100"
              type="email"
              placeholder="your@email.com"
              defaultValue="demo@example.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-content-100 text-sm font-bold tracking-wider uppercase mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="w-full px-4 py-3 text-content-100 bg-base-100 border-2 border-content-100 focus:outline-none focus:ring-2 focus:ring-content-100"
              type="password"
              placeholder="••••••••"
              defaultValue="password"
            />
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full px-6 py-3 text-lg font-bold tracking-wider text-content-100 uppercase bg-brand-primary border-2 border-content-100 hover:bg-brand-secondary transition-colors"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between mt-8">
          <span className="w-1/3 border-b border-content-100"></span>
          <p className="text-xs text-center text-content-100 uppercase">Or</p>
          <span className="w-1/3 border-b border-content-100"></span>
        </div>

        <div className="flex justify-center mt-6 gap-4">
          <button onClick={onLogin} className="flex items-center justify-center w-12 h-12 text-content-100 border-2 border-content-100 hover:bg-gray-100 font-bold">G</button>
          <button onClick={onLogin} className="flex items-center justify-center w-12 h-12 text-content-100 border-2 border-content-100 hover:bg-gray-100 font-bold">F</button>
          <button onClick={onLogin} className="flex items-center justify-center w-12 h-12 text-content-100 border-2 border-content-100 hover:bg-gray-100 font-bold">X</button>
        </div>
        
        <p className="mt-8 text-center text-sm text-content-200">
          Don't have an account?{' '}
          <a href="#" className="font-bold text-content-100 underline hover:text-brand-primary">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Auth;