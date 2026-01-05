
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { taskService } from '../services/taskService';
import { authService } from '../services/authService';
import { Task, TaskStatus, User } from '../types';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        // First, try to get user from localStorage as fallback
        const savedUser = localStorage.getItem('user');
        if (savedUser && isMounted) {
          setUser(JSON.parse(savedUser));
        }

        // Then try to fetch from API - don't let errors break the page
        const profilePromise = authService.getProfile().catch((err) => {
          // If API fails (401, network error, etc), use saved user
          // Don't let 401 errors break the page if we have cached user
          const saved = localStorage.getItem('user');
          if (saved) {
            console.warn('Profile fetch failed, using cached user:', err);
            return JSON.parse(saved);
          }
          // Only throw if no cached user exists
          console.error('Profile fetch failed and no cached user:', err);
          return null;
        });

        const tasksPromise = taskService.getAllTasks().catch((err) => {
          // If tasks fetch fails, return empty array
          // Don't let API errors break the dashboard
          console.warn('Tasks fetch failed, using empty array:', err);
          return [];
        });

        const [profile, fetchedTasks] = await Promise.all([
          profilePromise,
          tasksPromise
        ]);
        
        if (isMounted) {
          if (profile) {
            setUser(profile);
            // Update localStorage with fresh data
            localStorage.setItem('user', JSON.stringify(profile));
          }
          setTasks(fetchedTasks || []);
        }
      } catch (err) {
        console.error('Failed to sync dashboard.', err);
        // Fallback to localStorage user if API completely fails
        if (isMounted) {
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
          setTasks([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
    
    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === TaskStatus.PENDING).length,
    active: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
    completed: tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
  };

  const recentTasks = tasks.slice(0, 4);

  return (
    <Layout user={user}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Operational performance metrics for {user?.name}.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Objects', value: stats.total, color: 'bg-slate-900', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { label: 'Active Pipeline', value: stats.active, color: 'bg-blue-600', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { label: 'Pending Review', value: stats.pending, color: 'bg-amber-500', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
            { label: 'Closed/Done', value: stats.completed, color: 'bg-emerald-600', icon: 'M5 13l4 4L19 7' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Recent Milestones</h3>
              <Link to="/tasks" className="text-xs font-bold text-indigo-600 hover:underline uppercase tracking-widest">View All</Link>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              {recentTasks.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {recentTasks.map(task => (
                    <div key={task.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${task.status === TaskStatus.COMPLETED ? 'bg-emerald-500' : task.status === TaskStatus.IN_PROGRESS ? 'bg-blue-500' : 'bg-amber-500'}`}></div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{task.title}</p>
                          <p className="text-xs text-slate-400">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase">ID: {task.id.slice(-4)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-slate-400 text-sm">No recent activity detected.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="space-y-4">
             <h3 className="text-lg font-bold text-slate-900">Resource Control</h3>
             <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
                <Link to="/tasks" className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50 transition-all">
                  <span className="text-sm font-bold text-slate-700">Access Task Registry</span>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </Link>
                <Link to="/profile" className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50 transition-all">
                  <span className="text-sm font-bold text-slate-700">Manage Profile</span>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </Link>
                <div className="pt-4 mt-4 border-t border-slate-100">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">System Health</p>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-bold text-slate-600 italic">API Connection Stable</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
