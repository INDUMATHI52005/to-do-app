import React from 'react';
import { FilterType } from './TodoApp';

interface TodoFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  taskCounts: {
    all: number;
    open: number;
    completed: number;
    high: number;
    medium: number;
    low: number;
  };
}

const TodoFilters: React.FC<TodoFiltersProps> = ({
  currentFilter,
  onFilterChange,
  taskCounts,
}) => {
  const filters: Array<{ key: FilterType; label: string; icon: string }> = [
    { key: 'all', label: 'All', icon: '📋' },
    { key: 'open', label: 'Open', icon: '🔓' },
    { key: 'completed', label: 'Done', icon: '✅' },
    { key: 'high', label: 'High', icon: '🔴' },
    { key: 'medium', label: 'Medium', icon: '🟡' },
    { key: 'low', label: 'Low', icon: '🟢' },
  ];

  return (
    <div className="todo-filters">
      {filters.map(filter => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`filter-btn ${currentFilter === filter.key ? 'active' : ''}`}
        >
          <span style={{ marginRight: 'var(--space-xs)' }}>{filter.icon}</span>
          {filter.label}
          <span style={{ 
            marginLeft: 'var(--space-xs)',
            fontSize: 'var(--text-xs)',
            opacity: 0.7,
            background: currentFilter === filter.key 
              ? 'hsl(var(--primary-foreground) / 0.2)' 
              : 'hsl(var(--muted))',
            padding: '2px 6px',
            borderRadius: '10px',
            minWidth: '20px',
            textAlign: 'center'
          }}>
            {taskCounts[filter.key]}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TodoFilters;