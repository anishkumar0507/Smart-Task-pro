
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Check immediately on mount instead of starting with null
  const initialCheck = () => {
    const token = authService.getToken();
    const user = localStorage.getItem('user');
    return !!(token || user);
  };
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(initialCheck());
  const location = useLocation();

  useEffect(() => {
    // Check token whenever location changes (including after login)
    const checkAuth = () => {
      const token = authService.getToken();
      const user = localStorage.getItem('user');
      
      // Consider authenticated if token exists (even if API calls fail later)
      // This prevents redirect loops when API is temporarily unavailable
      const authenticated = !!(token || user);
      setIsAuthenticated(authenticated);
      
      // Debug log
      if (process.env.NODE_ENV === 'development') {
        console.log('ProtectedRoute auth check:', { token: !!token, user: !!user, authenticated });
      }
    };

    // Check immediately
    checkAuth();

    // Listen for storage changes (when token is set in another tab/component)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuth();
      }
    };

    // Listen for custom auth events (for same-tab updates)
    const handleAuthChange = () => {
      checkAuth();
    };

    // Also listen for popstate (browser back/forward)
    const handlePopState = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-changed', handleAuthChange);
    window.addEventListener('popstate', handlePopState);

    // Check multiple times to catch immediate localStorage updates
    const timeout1 = setTimeout(checkAuth, 100);
    const timeout2 = setTimeout(checkAuth, 300);
    const timeout3 = setTimeout(checkAuth, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-changed', handleAuthChange);
      window.removeEventListener('popstate', handlePopState);
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [location.pathname]);

  // Show nothing while checking (prevents flash)
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
