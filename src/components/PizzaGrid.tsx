
import React, { useState } from 'react';
import { Pizza } from '../types/pizza';
import { ShoppingCart, KeyRound, Eye } from 'lucide-react';
import CustomPizzaModal from './CustomPizzaModal';
import PizzaDescriptionModal from './PizzaDescriptionModal';

interface PizzaGridProps {
  pizzas: Pizza[];
  onAddToCart: (pizzaId: number, size: 'small' | 'large', customPizzas?: number[]) => void;
}

const PizzaGrid: React.FC<PizzaGridProps> = ({ pizzas, onAddToCart }) => {
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: 'small' | 'large' }>({});
  const [customPizzaModal, setCustomPizzaModal] = useState<{ isOpen: boolean }>({
    isOpen: false
  });
  const [descriptionModal, setDescriptionModal] = useState<{ isOpen: boolean; pizza: Pizza | null }>({
    isOpen: false,
    pizza: null
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

  const handleViewDescription = (pizza: Pizza) => {
    setDescriptionModal({ isOpen: true, pizza });
  };

  const handleCustomAddToCart = (pizzaIds: number[], size: 'small' | 'large') => {
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
            className="glass-card rounded-xl overflow-hidden hover-glow transition-all duration-300 animate-fade-in relative"
          >
            <div className="relative overflow-hidden">
              <img 
                src={pizza.image} 
                alt={pizza.name}
                className="w-full h-32 md:h-48 object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Ícone de descrição piscando */}
              <button
                onClick={() => handleViewDescription(pizza)}
                className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-all duration-300 animate-pulse hover:animate-none"
              >
                <Eye className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            </div>
            
            <div className="p-2 md:p-4">
              <h3 className="font-montserrat text-sm md:text-lg font-bold text-white mb-2 md:mb-3 line-clamp-2 text-center">{pizza.name}</h3>
              
              <div className="space-y-2 md:space-y-3">
                {/* Preços */}
                <div className="flex justify-between items-center text-center">
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">Broto</div>
                    <div className="text-neon-cyan text-sm md:text-base font-bold">R$ {pizza.prices.small.toFixed(2)}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">Grande</div>
                    <div className="text-neon-cyan text-sm md:text-base font-bold">R$ {pizza.prices.large.toFixed(2)}</div>
                  </div>
                </div>

                {/* Seleção de tamanho */}
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
                      {getSizeLabel(size)}
                    </button>
                  ))}
                </div>
                
                <div className="space-y-1 md:space-y-2">
                  {/* Botão Adicionar com ícone arredondado pulsante */}
                  <button
                    onClick={() => handleAddToCart(pizza.id)}
                    className="w-full gradient-primary py-2 md:py-3 px-3 md:px-4 rounded-full text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 text-xs md:text-sm flex items-center justify-center gap-2 animate-pulse hover:animate-none"
                  >
                    <div className="bg-white/20 p-1 rounded-full">
                      <ShoppingCart className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                  </button>
                  
                  {/* Botão Montar Pizza com ícone arredondado pulsante */}
                  <button
                    onClick={handleCustomPizza}
                    className="w-full glass py-1.5 md:py-2 px-3 md:px-4 rounded-full text-white font-medium hover:bg-white/20 transition-all duration-300 text-xs md:text-sm flex items-center justify-center gap-2 animate-pulse hover:animate-none"
                  >
                    <div className="bg-white/20 p-1 rounded-full">
                      <KeyRound className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
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

      <PizzaDescriptionModal
        isOpen={descriptionModal.isOpen}
        onClose={() => setDescriptionModal({ isOpen: false, pizza: null })}
        pizza={descriptionModal.pizza}
      />
    </>
  );
};

export default PizzaGrid;
