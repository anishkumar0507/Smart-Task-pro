
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError('Invalid password length');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.login({ email, password });
      
      // Set localStorage first - ensure it's set synchronously
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      // Verify token was set
      const tokenCheck = localStorage.getItem('token');
      if (!tokenCheck) {
        throw new Error('Failed to save authentication token');
      }
      
      // Dispatch custom event to notify ProtectedRoute immediately
      window.dispatchEvent(new Event('auth-changed'));
      
      // Force a re-render check in ProtectedRoute
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'token',
        newValue: result.token
      }));
      
      // Small delay to ensure ProtectedRoute has updated
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Navigate to dashboard - use replace to avoid back button issues
      navigate('/dashboard', { replace: true });
      
      // Force navigation as backup if React Router doesn't work
      setTimeout(() => {
        if (window.location.hash !== '#/dashboard') {
          window.location.hash = '#/dashboard';
        }
      }, 300);
    } catch (err: any) {
      // Show proper error message
      const errorMessage = err.message || err.response?.data?.message || 'Invalid credentials. Please try again.';
      setError(errorMessage);
      console.error('Login error:', err);
      
      // Clear any mock tokens if login failed with real backend
      const token = localStorage.getItem('token');
      if (token && token.startsWith('mock-jwt-token-')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-center mb-8 gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">SmartTask Pro</span>
        </div>

        <div className="mb-8">
          <h1 className="text-xl font-bold text-slate-900">Sign in</h1>
          <p className="text-slate-500 text-sm mt-1">Enter your details to access your dashboard.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs py-3 px-4 rounded font-medium">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
              placeholder="e.g. admin@company.com"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
              <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Forgot?</a>
            </div>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-slate-900 text-white rounded font-bold hover:bg-slate-800 transition-all disabled:opacity-70 flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            {isLoading ? 'Authenticating...' : 'Login to Dashboard'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-sm">
            New here? {' '}
            <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
      
      <p className="mt-8 text-slate-400 text-xs uppercase tracking-widest font-bold">&copy; 2024 Enterprise Task Management</p>
    </div>
  );
};

export default LoginPage;
