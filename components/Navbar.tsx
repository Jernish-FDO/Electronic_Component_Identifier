import React from 'react';
import { User, signOut } from 'firebase/auth';
import { NavLink, Link } from 'react-router-dom';
import { auth } from '../services/firebase';
import { CircuitBoardIcon } from './icons/AppIcons';

interface NavbarProps {
  user: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const handleSignOut = () => signOut(auth);

  const activeLinkStyle = {
    backgroundColor: '#f87171', // brand-primary
    color: 'white',
  };

  return (
    <nav className="bg-base-200 shadow-md px-4 py-2">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-content-100">
          <CircuitBoardIcon />
          <span>Component ID</span>
        </Link>
        <div className="flex items-center gap-4">
          <NavLink
            to="/"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="px-3 py-2 rounded-md text-sm font-medium text-content-200 hover:bg-brand-primary hover:text-white transition-colors"
          >
            Scanner
          </NavLink>
          <NavLink
            to="/history"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="px-3 py-2 rounded-md text-sm font-medium text-content-200 hover:bg-brand-primary hover:text-white transition-colors"
          >
            History
          </NavLink>
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-content-200 text-sm hidden sm:inline">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="px-3 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;