
import React from 'react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40 ml-64">
      <div className="flex items-center gap-4 text-slate-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <span className="text-sm">Search across your projects...</span>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-none">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-tighter font-semibold">Administrator</p>
          </div>
          <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 font-bold border border-slate-200">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
