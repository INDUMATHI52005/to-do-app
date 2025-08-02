import React from 'react';

interface TodoHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalTasks: number;
  completedTasks: number;
  isRefreshing: boolean;
  onRefresh: () => void;
}

const TodoHeader: React.FC<TodoHeaderProps> = ({
  searchQuery,
  onSearchChange,
  totalTasks,
  completedTasks,
  isRefreshing,
  onRefresh,
}) => {
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="todo-header">
      {isRefreshing && (
        <div className="pull-to-refresh">
          <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>↻</div>
          Refreshing...
        </div>
      )}
      
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
        <h1 style={{ 
          fontSize: 'var(--text-3xl)', 
          fontWeight: '700', 
          color: 'hsl(var(--foreground))',
          marginBottom: 'var(--space-sm)'
        }}>
          📋 Todo Canvas
        </h1>
        <p style={{ 
          color: 'hsl(var(--muted-foreground))', 
          fontSize: 'var(--text-base)' 
        }}>
          Stay organized and productive
        </p>
      </div>

      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="todo-search"
        />
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--space-md)'
      }}>
        <div style={{ fontSize: 'var(--text-sm)', color: 'hsl(var(--muted-foreground))' }}>
          {totalTasks === 0 ? (
            'No tasks yet'
          ) : (
            <>
              {completedTasks} of {totalTasks} completed ({completionPercentage}%)
            </>
          )}
        </div>
        
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          style={{
            padding: 'var(--space-sm) var(--space-md)',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)',
            background: 'hsl(var(--card))',
            color: 'hsl(var(--muted-foreground))',
            cursor: isRefreshing ? 'not-allowed' : 'pointer',
            fontSize: 'var(--text-sm)',
            transition: 'all var(--transition-fast)',
            opacity: isRefreshing ? 0.6 : 1
          }}
        >
          {isRefreshing ? '↻' : '⟳'} Refresh
        </button>
      </div>

      {totalTasks > 0 && (
        <div style={{ 
          marginTop: 'var(--space-md)',
          background: 'hsl(var(--muted))',
          height: '6px',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div
            style={{
              height: '100%',
              background: 'hsl(var(--task-completed))',
              width: `${completionPercentage}%`,
              transition: 'width var(--transition-normal)',
              borderRadius: '3px'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TodoHeader;