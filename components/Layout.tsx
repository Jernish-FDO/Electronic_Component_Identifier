import React from 'react';
import { Outlet } from 'react-router-dom';
import { User } from 'firebase/auth';
import Navbar from './Navbar';

interface LayoutProps {
  user: User | null;
}

const Layout: React.FC<LayoutProps> = ({ user }) => {
  return (
    <>
      <Navbar user={user} />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
