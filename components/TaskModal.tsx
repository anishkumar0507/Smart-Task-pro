
import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, Subtask } from '../types';
import { aiService } from '../services/aiService';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Task>) => Promise<void>;
  task?: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.PENDING);
  const [dueDate, setDueDate] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSuggestingSubtasks, setIsSuggestingSubtasks] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setDueDate(task.dueDate.split('T')[0]);
      setSubtasks(task.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setStatus(TaskStatus.PENDING);
      setDueDate(new Date().toISOString().split('T')[0]);
      setSubtasks([]);
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) {
      alert('Please fill in all required fields (Title and Due Date).');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), status, dueDate, subtasks });
      // Reset form only on success
      if (!task) {
        setTitle('');
        setDescription('');
        setStatus(TaskStatus.PENDING);
        setDueDate(new Date().toISOString().split('T')[0]);
        setSubtasks([]);
      }
      // Modal will be closed by parent component on success
    } catch (err: any) {
      console.error(err);
      // Error is handled by parent, don't close modal
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptimizeDescription = async () => {
    if (!title || !description) {
      alert('Please enter both title and description to optimize.');
      return;
    }
    setIsOptimizing(true);
    try {
      const optimized = await aiService.optimizeTaskDescription(title, description);
      if (optimized && optimized !== description) {
        setDescription(optimized);
      } else {
        alert('AI optimization did not produce changes. Please try again.');
      }
    } catch (err) {
      console.error('AI optimization error:', err);
      alert('Failed to optimize description. Please check your API key or try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleSuggestSubtasks = async () => {
    if (!title) {
      alert('Please enter a task title to get AI suggestions.');
      return;
    }
    setIsSuggestingSubtasks(true);
    try {
      const suggestions = await aiService.suggestSubtasks(title);
      if (suggestions && suggestions.length > 0) {
        const newSubtasks: Subtask[] = suggestions.map(s => ({
          id: 'st-' + Math.random().toString(36).substr(2, 9),
          title: s,
          isCompleted: false
        }));
        setSubtasks([...subtasks, ...newSubtasks]);
      } else {
        alert('No suggestions available. Please try again.');
      }
    } catch (err) {
      console.error('AI suggestions error:', err);
      alert('Failed to get AI suggestions. Please check your API key or try again.');
    } finally {
      setIsSuggestingSubtasks(false);
    }
  };

  const addSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const st: Subtask = {
      id: 'st-' + Date.now(),
      title: newSubtaskTitle.trim(),
      isCompleted: false
    };
    setSubtasks([...subtasks, st]);
    setNewSubtaskTitle('');
  };

  const toggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(s => s.id === id ? { ...s, isCompleted: !s.isCompleted } : s));
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-2xl shadow-2xl sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">
                {task ? 'Update Operational Objective' : 'New Operational Objective'}
              </h3>
              <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="px-6 py-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">Objective Title</label>
                <input 
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                  placeholder="e.g., Q3 Infrastructure Scaling"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest">Scope & Details</label>
                  <button 
                    type="button"
                    onClick={handleOptimizeDescription}
                    disabled={isOptimizing || !title || !description}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 disabled:opacity-50 uppercase tracking-widest"
                  >
                    {isOptimizing ? 'Optimizing...' : 'AI Professional Refine'}
                  </button>
                </div>
                <textarea 
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm resize-none"
                  placeholder="Detailed description of the objective..."
                />
              </div>

              {/* Subtasks Section */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest">Milestones & Subtasks</label>
                  <button 
                    type="button"
                    onClick={handleSuggestSubtasks}
                    disabled={isSuggestingSubtasks || !title}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 disabled:opacity-50 uppercase tracking-widest"
                  >
                    {isSuggestingSubtasks ? 'Analyzing...' : 'Gemini AI Suggestions'}
                  </button>
                </div>

                <div className="space-y-2">
                  {subtasks.map((st) => (
                    <div key={st.id} className="flex items-center gap-3 bg-white p-2 rounded border border-slate-200 group">
                      <input 
                        type="checkbox"
                        checked={st.isCompleted}
                        onChange={() => toggleSubtask(st.id)}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                      />
                      <span className={`text-sm flex-1 ${st.isCompleted ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                        {st.title}
                      </span>
                      <button 
                        type="button"
                        onClick={() => removeSubtask(st.id)}
                        className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <input 
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                    placeholder="Add a milestone..."
                    className="flex-1 px-3 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                  />
                  <button 
                    type="button"
                    onClick={addSubtask}
                    className="px-4 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold rounded hover:bg-slate-300 transition-colors uppercase tracking-widest"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">Priority Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    className="w-full px-4 py-2.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm bg-white"
                  >
                    <option value={TaskStatus.PENDING}>Pending</option>
                    <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                    <option value={TaskStatus.COMPLETED}>Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">Final Deadline</label>
                  <input 
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl">
              <button 
                type="button" 
                onClick={onClose}
                className="px-5 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 uppercase tracking-widest"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isSubmitting && <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                {task ? 'Confirm Changes' : 'Initialize Objective'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
