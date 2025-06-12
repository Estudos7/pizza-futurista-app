
import React from 'react';
import { Lock } from 'lucide-react';

interface AdminButtonProps {
  onClick: () => void;
}

const AdminButton: React.FC<AdminButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="gradient-secondary p-4 rounded-full shadow-2xl hover-glow transition-all duration-300 z-40"
    >
      <Lock className="w-6 h-6 text-white" />
    </button>
  );
};

export default AdminButton;
