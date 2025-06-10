
import React, { useState } from 'react';
import { Pizza } from '../types/pizza';
import CustomPizzaModal from './CustomPizzaModal';

interface PizzaGridProps {
  pizzas: Pizza[];
  onAddToCart: (pizzaId: number, size: 'small' | 'large', customPizzas?: number[]) => void;
}

const PizzaGrid: React.FC<PizzaGridProps> = ({ pizzas, onAddToCart }) => {
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: 'small' | 'large' }>({});
  const [customPizzaModal, setCustomPizzaModal] = useState<{ isOpen: boolean }>({
    isOpen: false
  });

  const handleSizeSelect = (pizzaId: number, size: 'small' | 'large') => {
    setSelectedSizes(prev => ({ ...prev, [pizzaId]: size }));
  };

  const handleAddToCart = (pizzaId: number) => {
    const selectedSize = selectedSizes[pizzaId] || 'small';
    onAddToCart(pizzaId, selectedSize);
  };

  const handleCustomPizza = () => {
    setCustomPizzaModal({ isOpen: true });
  };

  const handleCustomAddToCart = (pizzaIds: number[], size: 'small' | 'large') => {
    // Use the first pizza as base and pass the selected pizzas as custom data
    onAddToCart(pizzaIds[0], size, pizzaIds);
  };

  const getSizeLabel = (size: 'small' | 'large') => {
    switch (size) {
      case 'small': return 'Broto';
      case 'large': return 'Grande';
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 p-3 md:p-6">
        {pizzas.map((pizza) => (
          <div 
            key={pizza.id} 
            className="glass-card rounded-xl overflow-hidden hover-glow transition-all duration-300 animate-fade-in"
          >
            <div className="relative overflow-hidden">
              <img 
                src={pizza.image} 
                alt={pizza.name}
                className="w-full h-32 md:h-48 object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div className="p-2 md:p-4">
              <h3 className="font-montserrat text-sm md:text-xl font-bold text-white mb-1 md:mb-2 line-clamp-2">{pizza.name}</h3>
              <p className="text-muted-foreground text-xs md:text-sm mb-2 md:mb-4 line-clamp-2">{pizza.description}</p>
              
              <div className="space-y-2 md:space-y-3">
                <div className="flex gap-1 md:gap-2">
                  {(['small', 'large'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(pizza.id, size)}
                      className={`flex-1 py-1.5 md:py-2 px-2 md:px-3 rounded-lg text-xs font-medium transition-all ${
                        selectedSizes[pizza.id] === size
                          ? 'gradient-primary text-white shadow-lg'
                          : 'glass text-white hover:bg-white/20'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-xs">{getSizeLabel(size)}</div>
                        <div className="text-neon-cyan text-xs md:text-sm font-bold">R$ {pizza.prices[size].toFixed(2)}</div>
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="space-y-1 md:space-y-2">
                  <button
                    onClick={() => handleAddToCart(pizza.id)}
                    className="w-full gradient-primary py-2 md:py-3 px-3 md:px-4 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 text-xs md:text-sm"
                  >
                    Adicionar ao Carrinho
                  </button>
                  
                  <button
                    onClick={handleCustomPizza}
                    className="w-full glass py-1.5 md:py-2 px-3 md:px-4 rounded-lg text-white font-medium hover:bg-white/20 transition-all duration-300 text-xs md:text-sm"
                  >
                    Monte sua Pizza
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CustomPizzaModal
        isOpen={customPizzaModal.isOpen}
        onClose={() => setCustomPizzaModal({ isOpen: false })}
        pizzas={pizzas}
        onAddToCart={handleCustomAddToCart}
      />
    </>
  );
};

export default PizzaGrid;
