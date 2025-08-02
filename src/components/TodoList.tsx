import React from 'react';
import { Task } from './TodoApp';
import TodoItem from './TodoItem';

interface TodoListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📝</div>
        <h3 style={{ 
          fontSize: 'var(--text-xl)', 
          marginBottom: 'var(--space-md)',
          color: 'hsl(var(--muted-foreground))'
        }}>
          No tasks found
        </h3>
        <p style={{ fontSize: 'var(--text-base)' }}>
          Create your first task to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {tasks.map(task => (
        <TodoItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TodoList;