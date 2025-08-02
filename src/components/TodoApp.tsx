import React, { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import TodoHeader from './TodoHeader';
import TodoFilters from './TodoFilters';
import TodoList from './TodoList';
import TodoModal from './TodoModal';
import FloatingActionButton from './FloatingActionButton';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export type FilterType = 'all' | 'open' | 'completed' | 'high' | 'medium' | 'low';

const TodoApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('todoTasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        }));
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Failed to load tasks from localStorage:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
  }, [tasks]);

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        task =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      );
    }

    // Apply status/priority filter
    switch (currentFilter) {
      case 'open':
        filtered = filtered.filter(task => task.status === 'open');
        break;
      case 'completed':
        filtered = filtered.filter(task => task.status === 'completed');
        break;
      case 'high':
        filtered = filtered.filter(task => task.priority === 'high');
        break;
      case 'medium':
        filtered = filtered.filter(task => task.priority === 'medium');
        break;
      case 'low':
        filtered = filtered.filter(task => task.priority === 'low');
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    // Sort by priority and due date
    return filtered.sort((a, b) => {
      // Completed tasks go to bottom
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (b.status === 'completed' && a.status !== 'completed') return -1;

      // Sort by priority
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Sort by due date
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return dateA - dateB;
    });
  }, [tasks, searchQuery, currentFilter]);

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTasks(prev => [newTask, ...prev]);
    setIsModalOpen(false);
    
    toast({
      title: "Task Created",
      description: `"${newTask.title}" has been added to your todo list.`,
    });
  };

  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingTask) return;

    const updatedTask: Task = {
      ...editingTask,
      ...taskData,
      updatedAt: new Date(),
    };

    setTasks(prev => prev.map(task => 
      task.id === editingTask.id ? updatedTask : task
    ));
    
    setEditingTask(null);
    setIsModalOpen(false);
    
    toast({
      title: "Task Updated",
      description: `"${updatedTask.title}" has been updated.`,
    });
  };

  const handleToggleComplete = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { 
            ...task, 
            status: task.status === 'completed' ? 'open' : 'completed',
            updatedAt: new Date()
          }
        : task
    ));

    const task = tasks.find(t => t.id === id);
    if (task) {
      const isCompleting = task.status === 'open';
      toast({
        title: isCompleting ? "Task Completed" : "Task Reopened",
        description: `"${task.title}" has been ${isCompleting ? 'completed' : 'reopened'}.`,
      });
    }
  };

  const handleDeleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(task => task.id !== id));
    
    if (task) {
      toast({
        title: "Task Deleted",
        description: `"${task.title}" has been removed from your todo list.`,
        variant: "destructive",
      });
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handlePullToRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    
    toast({
      title: "Refreshed",
      description: "Your todo list has been refreshed.",
    });
  };

  const completedCount = tasks.filter(task => task.status === 'completed').length;
  const totalCount = tasks.length;

  return (
    <div className="todo-container">
      <TodoHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalTasks={totalCount}
        completedTasks={completedCount}
        isRefreshing={isRefreshing}
        onRefresh={handlePullToRefresh}
      />

      <TodoFilters
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
        taskCounts={{
          all: totalCount,
          open: tasks.filter(t => t.status === 'open').length,
          completed: completedCount,
          high: tasks.filter(t => t.priority === 'high').length,
          medium: tasks.filter(t => t.priority === 'medium').length,
          low: tasks.filter(t => t.priority === 'low').length,
        }}
      />

      <TodoList
        tasks={filteredTasks}
        onToggleComplete={handleToggleComplete}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />

      <FloatingActionButton onClick={() => setIsModalOpen(true)} />

      {isModalOpen && (
        <TodoModal
          task={editingTask}
          onSave={editingTask ? handleUpdateTask : handleCreateTask}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default TodoApp;