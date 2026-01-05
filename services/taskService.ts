
import api from './api';
import { Task, TaskStatus } from '../types';

// Helper to manage local tasks for demo/fallback mode
const getLocalTasks = (): Task[] => {
  const saved = localStorage.getItem('tasks');
  return saved ? JSON.parse(saved) : [];
};

const saveLocalTasks = (tasks: Task[]) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Helper to transform MongoDB task to frontend Task format
const transformTask = (task: any): Task => {
  return {
    id: task._id || task.id,
    title: task.title,
    description: task.description || '',
    status: task.status as TaskStatus,
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : new Date().toISOString(),
    createdAt: task.createdAt ? new Date(task.createdAt).toISOString() : new Date().toISOString(),
  };
};

export const taskService = {
  async getAllTasks(): Promise<Task[]> {
    try {
      const response = await api.get<{ success: boolean; count: number; tasks: any[] }>('/tasks');
      // Backend returns { success, count, tasks }
      return response.data.tasks.map(transformTask);
    } catch (error) {
      console.warn("Backend not found, using local storage for tasks", error);
      return getLocalTasks();
    }
  },

  async createTask(taskData: Partial<Task>): Promise<Task> {
    try {
      const response = await api.post<{ success: boolean; task: any }>('/tasks', taskData);
      // Backend returns { success, task }
      return transformTask(response.data.task);
    } catch (error) {
      console.warn("Backend not found, using local storage", error);
      const newTask: Task = {
        id: 'task-' + Date.now(),
        title: taskData.title || '',
        description: taskData.description || '',
        status: taskData.status || TaskStatus.PENDING,
        dueDate: taskData.dueDate || new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      
      const tasks = getLocalTasks();
      const updatedTasks = [newTask, ...tasks];
      saveLocalTasks(updatedTasks);
      return newTask;
    }
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    try {
      const response = await api.put<{ success: boolean; task: any }>(`/tasks/${id}`, updates);
      // Backend returns { success, task }
      return transformTask(response.data.task);
    } catch (error) {
      console.warn("Backend not found, using local storage", error);
      const tasks = getLocalTasks();
      const taskIndex = tasks.findIndex(t => t.id === id);
      if (taskIndex === -1) throw new Error("Task not found");
      
      const updatedTask = { ...tasks[taskIndex], ...updates };
      tasks[taskIndex] = updatedTask;
      saveLocalTasks(tasks);
      return updatedTask;
    }
  },

  async deleteTask(id: string): Promise<void> {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      const tasks = getLocalTasks();
      const updatedTasks = tasks.filter(t => t.id !== id);
      saveLocalTasks(updatedTasks);
    }
  }
};
