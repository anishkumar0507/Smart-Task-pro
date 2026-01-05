
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { User } from '../types';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
}

const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar onLogout={handleLogout} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <Navbar user={user} />

        {/* Dynamic Page Content */}
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
