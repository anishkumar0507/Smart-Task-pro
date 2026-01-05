
import React from 'react';
import { Task, TaskStatus } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 italic">Done</span>;
      case TaskStatus.IN_PROGRESS:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 italic">Active</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200 italic">Queued</span>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate progress
  const subtasks = task.subtasks || [];
  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter(s => s.isCompleted).length;
  const progressPercentage = totalSubtasks > 0 
    ? Math.round((completedSubtasks / totalSubtasks) * 100) 
    : (task.status === TaskStatus.COMPLETED ? 100 : 0);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col hover:border-indigo-300 hover:shadow-sm transition-all group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{task.title}</h3>
            {getStatusLabel(task.status)}
          </div>
          <p className="text-xs text-slate-500 line-clamp-1 max-w-md">{task.description}</p>
        </div>

        <div className="flex items-center gap-2 pl-4 border-l border-slate-100 ml-4">
          <button 
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mt-2 mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</span>
          <span className="text-[10px] font-bold text-indigo-600">{progressPercentage}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 rounded-full ${
              progressPercentage === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        {totalSubtasks > 0 && (
          <p className="text-[10px] text-slate-400 mt-1 italic">
            {completedSubtasks} of {totalSubtasks} subtasks completed
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
        <div className="flex items-center gap-2">
           <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
           <span className="text-xs font-bold text-slate-700">{formatDate(task.dueDate)}</span>
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           Ref: #{task.id.slice(-4)}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
