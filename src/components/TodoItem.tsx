import React from 'react';
import { Task } from './TodoApp';

interface TodoItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays === -1) return 'Due yesterday';
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''}`;
    if (diffDays <= 7) return `Due in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString();
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status === 'open';

  const handleSwipeDelete = (e: React.TouchEvent) => {
    // Simple swipe-to-delete gesture detection
    const touch = e.changedTouches[0];
    const element = e.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    const swipeDistance = touch.clientX - rect.left;
    
    if (swipeDistance < rect.width * 0.3) {
      onDelete(task.id);
    }
  };

  return (
    <div 
      className={`todo-item ${task.status}`}
      onTouchEnd={handleSwipeDelete}
      style={{
        borderLeft: isOverdue ? '4px solid hsl(var(--danger))' : undefined
      }}
    >
      <div className="todo-title">{task.title}</div>
      
      {task.description && (
        <div className="todo-description">{task.description}</div>
      )}
      
      <div className="todo-meta">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div className="todo-due-date">
            <span>📅</span>
            <span style={{ color: isOverdue ? 'hsl(var(--danger))' : undefined }}>
              {formatDate(task.dueDate)}
            </span>
          </div>
          
          <div className={`todo-priority priority-${task.priority}`}>
            {task.priority}
          </div>
        </div>
        
        <div className="todo-actions">
          <button
            onClick={() => onToggleComplete(task.id)}
            className="action-btn complete"
            title={task.status === 'completed' ? 'Mark as open' : 'Mark as completed'}
          >
            {task.status === 'completed' ? '↶' : '✓'}
          </button>
          
          <button
            onClick={() => onEdit(task)}
            className="action-btn edit"
            title="Edit task"
          >
            ✏️
          </button>
          
          <button
            onClick={() => onDelete(task.id)}
            className="action-btn delete"
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;