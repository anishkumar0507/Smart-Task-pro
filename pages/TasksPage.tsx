
import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { taskService } from '../services/taskService';
import { authService } from '../services/authService';
import { Task, TaskStatus, User } from '../types';

const TasksPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, fetchedTasks] = await Promise.all([
          authService.getProfile(),
          taskService.getAllTasks()
        ]);
        setUser(profile);
        setTasks(fetchedTasks);
      } catch (err) {
        setError('Failed to sync task registry.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || task.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [tasks, searchTerm, filterStatus]);

  const handleCreateOrUpdate = async (data: Partial<Task>) => {
    try {
      if (editingTask) {
        const updated = await taskService.updateTask(editingTask.id, data);
        setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
        setError('');
        setIsModalOpen(false);
        setEditingTask(null);
      } else {
        const created = await taskService.createTask(data);
        setTasks(prev => [created, ...prev]);
        setError('');
        setIsModalOpen(false);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to save task. Please try again.';
      setError(errorMsg);
      // Don't throw - let user fix and retry without closing modal
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Confirm deletion of this resource?')) return;
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete task. Please try again.');
      console.error(err);
    }
  };

  return (
    <Layout user={user}>
      <div className="flex flex-col gap-8">
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm py-3 px-4 rounded-lg font-medium">
            {error}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Project Registry</h1>
            <p className="text-sm text-slate-500 mt-1">Detailed repository of all assigned objectives.</p>
          </div>
          <button 
            onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Add New Task
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 py-4 border-b border-slate-200">
          <div className="flex-1 min-w-[300px] relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search registry entries..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent pl-10 pr-4 py-2 border-none focus:ring-0 text-sm placeholder:text-slate-400"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Filter</span>
            <div className="flex gap-1">
              {['all', TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${
                    filterStatus === s 
                      ? 'bg-slate-200 text-slate-900' 
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {s === 'all' ? 'All' : s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-20 text-slate-400 text-sm font-bold uppercase tracking-widest animate-pulse">
              Initializing Registry...
            </div>
          ) : filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {filteredTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onEdit={(t) => { setEditingTask(t); setIsModalOpen(true); }}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl py-16 text-center">
              <p className="text-slate-400 text-sm font-medium italic">No matching registry entries detected.</p>
            </div>
          )}
        </div>
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        task={editingTask}
      />
    </Layout>
  );
};

export default TasksPage;
