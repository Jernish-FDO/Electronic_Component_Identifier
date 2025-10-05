import React, { useState } from 'react';
import { User, signOut } from 'firebase/auth';
import { NavLink, Link } from 'react-router-dom';
import { auth } from '../services/firebase';
import { CircuitBoardIcon, HamburgerIcon, CloseIcon } from './icons/AppIcons';

interface NavbarProps {
  user: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleSignOut = () => {
    signOut(auth);
    setIsOpen(false);
  };

  const activeLinkStyle = {
    backgroundColor: '#3F3F7A', // A muted, dark purple for active state
    color: '#E0E0FF',
  };

  const navLinkClass = "px-3 py-2 rounded-md text-sm font-medium text-content-200 hover:bg-base-300 hover:text-content-100 transition-colors";
  const mobileNavLinkClass = "block px-3 py-2 rounded-md text-base font-medium text-content-200 hover:bg-base-300 hover:text-content-100 transition-colors";

  return (
    <nav className="glass-card sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 text-xl font-bold text-brand-secondary" onClick={() => setIsOpen(false)}>
              <CircuitBoardIcon />
              <span>Component ID</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} className={navLinkClass}>Scanner</NavLink>
              <NavLink to="/history" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} className={navLinkClass}>History</NavLink>
            </div>
          </div>
          <div className="hidden md:block">
            {user && (
              <div className="ml-4 flex items-center md:ml-6 gap-3">
                <span className="text-content-200 text-sm">{user.email}</span>
                <button onClick={handleSignOut} className="px-3 py-2 bg-destructive text-white text-sm font-semibold rounded-lg hover:brightness-110 transition-all">
                  Sign Out
                </button>
              </div>
            )}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="bg-base-300 inline-flex items-center justify-center p-2 rounded-md text-content-200 hover:text-white hover:bg-brand-secondary focus:outline-none transition-colors">
              <span className="sr-only">Open main menu</span>
              {isOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" onClick={() => setIsOpen(false)} style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} className={mobileNavLinkClass}>Scanner</NavLink>
            <NavLink to="/history" onClick={() => setIsOpen(false)} style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} className={mobileNavLinkClass}>History</NavLink>
          </div>
          {user && (
            <div className="pt-4 pb-3 border-t border-white/10">
              <div className="flex items-center px-5">
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-content-100">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <button onClick={handleSignOut} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-content-100 hover:text-white hover:bg-destructive transition-colors">
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
