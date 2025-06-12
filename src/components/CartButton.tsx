
import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface CartButtonProps {
  itemCount: number;
  onClick: () => void;
}

const CartButton: React.FC<CartButtonProps> = ({ itemCount, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="gradient-primary p-4 rounded-full shadow-2xl hover-glow transition-all duration-300 z-40"
    >
      <ShoppingCart className="w-6 h-6 text-white" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-neon-cyan text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
          {itemCount}
        </span>
      )}
    </button>
  );
};

export default CartButton;
