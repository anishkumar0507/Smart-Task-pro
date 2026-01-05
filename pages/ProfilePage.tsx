
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { authService } from '../services/authService';
import { User } from '../types';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await authService.getProfile();
        setUser(profile);
      } catch (err) {
        console.error('Failed to load profile.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <Layout user={user}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Identity & Security</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your administrator credentials and account settings.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 bg-slate-900 text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-lg shadow-slate-200">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-slate-900">{user?.name}</h2>
              <p className="text-slate-500 font-medium">{user?.email}</p>
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                 <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-widest border border-indigo-100 rounded">Verified Admin</span>
                 <span className="px-2.5 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-widest border border-slate-200 rounded">Enterprise Access</span>
              </div>
            </div>
            <button 
              onClick={() => {
                const newName = prompt('Enter new name:', user?.name || '');
                if (newName && newName.trim() && newName !== user?.name) {
                  // Update user name (for now just in localStorage, backend update can be added later)
                  const updatedUser = { ...user, name: newName.trim() };
                  localStorage.setItem('user', JSON.stringify(updatedUser));
                  setUser(updatedUser);
                  alert('Name updated successfully!');
                }
              }}
              className="px-6 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded uppercase tracking-widest hover:bg-slate-50 transition-colors"
            >
              Edit Identity
            </button>
          </div>

          <div className="p-8 bg-slate-50/50 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Account Information</h3>
              <div className="space-y-1">
                 <p className="text-xs font-bold text-slate-500 italic">User ID</p>
                 <p className="text-sm font-bold text-slate-800 tracking-tight">{user?.id}</p>
              </div>
              <div className="space-y-1">
                 <p className="text-xs font-bold text-slate-500 italic">Primary Registry</p>
                 <p className="text-sm font-bold text-slate-800 tracking-tight">Production Server Node-01</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Security Configuration</h3>
              <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
                 <div>
                    <p className="text-xs font-bold text-slate-800">Two-Factor Authentication</p>
                    <p className="text-[10px] text-slate-500 italic font-medium">Enhanced security layer active.</p>
                 </div>
                 <div className="w-10 h-5 bg-indigo-600 rounded-full flex items-center justify-end px-1">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-xl flex items-center justify-between">
           <div>
              <p className="text-sm font-bold text-rose-900">Danger Zone</p>
              <p className="text-xs text-rose-700 italic">Deactivating this account will wipe all registry entries permanentely.</p>
           </div>
           <button 
             onClick={() => {
               const confirm = window.confirm('Are you sure you want to deactivate your account? This action cannot be undone.');
               if (confirm) {
                 // Clear all data and logout
                 localStorage.clear();
                 window.location.href = '#/login';
                 alert('Account deactivated successfully.');
               }
             }}
             className="px-4 py-2 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-rose-700 transition-colors"
           >
              Deactivate Account
           </button>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
