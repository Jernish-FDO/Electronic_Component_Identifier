import React from 'react';
import { User } from 'firebase/auth';
import { Navigate, Outlet } from 'react-router-dom';
import Spinner from './Spinner';

interface ProtectedRouteProps {
  user: User | null;
  isAuthLoading: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, isAuthLoading }) => {
  if (isAuthLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 p-4">
        <Spinner />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;