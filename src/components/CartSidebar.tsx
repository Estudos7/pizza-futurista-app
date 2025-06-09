
import React from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem } from '../types/pizza';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onUpdateItem: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  items,
  total,
  onUpdateItem,
  onRemoveItem,
  onCheckout
}) => {
  const getSizeLabel = (size: string) => {
    switch (size) {
      case 'small': return 'Broto';
      case 'medium': return 'Média';
      case 'large': return 'Grande';
      default: return size;
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-96 glass-card z-50 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-montserrat text-2xl font-bold text-white">Seu Carrinho</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-neon-cyan transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Items */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {items.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>Seu carrinho está vazio</p>
              </div>
            ) : (
              items.map((item, index) => (
                <div key={index} className="glass p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{item.name}</h4>
                      <p className="text-sm text-neon-cyan">{getSizeLabel(item.size)}</p>
                      <p className="text-sm text-muted-foreground">
                        R$ {item.price.toFixed(2)} × {item.quantity} = R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-destructive hover:text-destructive/80 transition-colors ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onUpdateItem(index, item.quantity - 1)}
                        className="glass w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateItem(index, item.quantity + 1)}
                        className="glass w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-white/20 pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-montserrat text-xl font-bold text-white">Total:</span>
                <span className="font-montserrat text-xl font-bold text-neon-cyan">R$ {total.toFixed(2)}</span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full gradient-primary py-3 px-4 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Finalizar Pedido
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
