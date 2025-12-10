import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  dueDate?: number;
  tags?: string[];
}
const STORAGE_KEY = 'taskloom:tasks:v1';
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage", error);
      toast.error("Could not load your tasks. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        setTasks(JSON.parse(event.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  const saveTasks = useCallback((newTasks: Task[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
      setTasks(newTasks);
    } catch (error) {
      console.error("Failed to save tasks to localStorage", error);
      toast.error("There was a problem saving your tasks.");
    }
  }, []);
  const createTask = async (title: string, tags: string[] = []): Promise<Task> => {
    if (!title.trim()) {
      throw new Error("Task title cannot be empty.");
    }
    const newTask: Task = {
      id: uuidv4(),
      title: title.trim(),
      completed: false,
      createdAt: Date.now(),
      tags: tags,
    };
    const newTasks = [newTask, ...tasks];
    saveTasks(newTasks);
    return newTask;
  };
  const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
    let updatedTask: Task | undefined;
    const newTasks = tasks.map(task => {
      if (task.id === id) {
        updatedTask = { ...task, ...updates };
        return updatedTask;
      }
      return task;
    });
    if (!updatedTask) {
      throw new Error("Task not found.");
    }
    saveTasks(newTasks);
    return updatedTask;
  };
  const deleteTask = async (id: string): Promise<void> => {
    const newTasks = tasks.filter(task => task.id !== id);
    saveTasks(newTasks);
  };
  const reorderTasks = async (reorderedTasks: Task[]): Promise<void> => {
    saveTasks(reorderedTasks);
  };
  const toggleComplete = async (id: string): Promise<Task> => {
    let updatedTask: Task | undefined;
    const newTasks = tasks.map(task => {
      if (task.id === id) {
        updatedTask = { ...task, completed: !task.completed };
        return updatedTask;
      }
      return task;
    });
    if (!updatedTask) {
      throw new Error("Task not found.");
    }
    saveTasks(newTasks);
    return updatedTask;
  };
  const setDue = async (id: string, dueDate?: number): Promise<Task> => {
    return updateTask(id, { dueDate });
  };
  const addTag = async (id: string, tag: string): Promise<Task> => {
    const task = tasks.find(t => t.id === id);
    if (!task) throw new Error("Task not found.");
    const newTags = [...(task.tags || [])];
    if (!newTags.includes(tag.trim()) && tag.trim()) {
      newTags.push(tag.trim());
    }
    return updateTask(id, { tags: newTags });
  };
  const removeTag = async (id: string, tagToRemove: string): Promise<Task> => {
    const task = tasks.find(t => t.id === id);
    if (!task) throw new Error("Task not found.");
    const newTags = (task.tags || []).filter(tag => tag !== tagToRemove);
    return updateTask(id, { tags: newTags });
  };
  const exportJson = () => {
    try {
      const jsonString = JSON.stringify(tasks, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `taskloom_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Tasks exported successfully!");
    } catch (error) {
      console.error("Failed to export tasks", error);
      toast.error("Could not export tasks.");
    }
  };
  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const importedTasks = JSON.parse(json) as Task[];
        if (Array.isArray(importedTasks) && importedTasks.every(t => t.id && t.title)) {
          saveTasks(importedTasks);
          toast.success("Tasks imported successfully!");
        } else {
          throw new Error("Invalid file format.");
        }
      } catch (error) {
        console.error("Failed to import tasks", error);
        toast.error("Invalid JSON file or format.");
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read the file.");
    };
    reader.readAsText(file);
  };
  return {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    reorderTasks,
    toggleComplete,
    setDue,
    addTag,
    removeTag,
    exportJson,
    importJson,
    isLoading,
  };
}