
import React, { useState } from 'react';
import { Pizza } from '../types/pizza';

interface PizzaGridProps {
  pizzas: Pizza[];
  onAddToCart: (pizzaId: number, size: 'small' | 'medium' | 'large') => void;
}

const PizzaGrid: React.FC<PizzaGridProps> = ({ pizzas, onAddToCart }) => {
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: 'small' | 'medium' | 'large' }>({});

  const handleSizeSelect = (pizzaId: number, size: 'small' | 'medium' | 'large') => {
    setSelectedSizes(prev => ({ ...prev, [pizzaId]: size }));
  };

  const handleAddToCart = (pizzaId: number) => {
    const selectedSize = selectedSizes[pizzaId] || 'medium';
    onAddToCart(pizzaId, selectedSize);
  };

  const getSizeLabel = (size: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small': return 'Broto';
      case 'medium': return 'Média';
      case 'large': return 'Grande';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {pizzas.map((pizza) => (
        <div 
          key={pizza.id} 
          className="glass-card rounded-xl overflow-hidden hover-glow transition-all duration-300 animate-fade-in"
        >
          <div className="relative overflow-hidden">
            <img 
              src={pizza.image} 
              alt={pizza.name}
              className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <div className="p-4">
            <h3 className="font-montserrat text-xl font-bold text-white mb-2">{pizza.name}</h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{pizza.description}</p>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(pizza.id, size)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                      selectedSizes[pizza.id] === size
                        ? 'gradient-primary text-white shadow-lg'
                        : 'glass text-white hover:bg-white/20'
                    }`}
                  >
                    {getSizeLabel(size)}
                    <br />
                    <span className="text-neon-cyan">R$ {pizza.prices[size].toFixed(2)}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handleAddToCart(pizza.id)}
                className="w-full gradient-primary py-3 px-4 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PizzaGrid;
