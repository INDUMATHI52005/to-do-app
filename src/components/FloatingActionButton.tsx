import React from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fab"
      title="Add new task"
      aria-label="Add new task"
    >
      <span style={{ fontSize: '1.5rem', lineHeight: '1' }}>+</span>
    </button>
  );
};

export default FloatingActionButton;