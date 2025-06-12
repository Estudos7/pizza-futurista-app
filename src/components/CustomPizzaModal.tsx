
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Pizza } from '../types/pizza';

interface CustomPizzaModalProps {
  isOpen: boolean;
  onClose: () => void;
  pizzas: Pizza[];
  onAddToCart: (pizzaIds: number[], size: 'large') => void;
}

const CustomPizzaModal: React.FC<CustomPizzaModalProps> = ({
  isOpen,
  onClose,
  pizzas,
  onAddToCart
}) => {
  const [selectedPizzas, setSelectedPizzas] = useState<number[]>([]);
  const size = 'large';

  if (!isOpen) return null;

  const handlePizzaToggle = (pizzaId: number) => {
    if (selectedPizzas.includes(pizzaId)) {
      setSelectedPizzas(selectedPizzas.filter(id => id !== pizzaId));
    } else if (selectedPizzas.length < 4) {
      setSelectedPizzas([...selectedPizzas, pizzaId]);
    }
  };

  const handleAddToCart = () => {
    if (selectedPizzas.length < 2) {
      alert('É necessário selecionar no mínimo 2 pizzas para montar uma pizza personalizada!');
      return;
    }
    
    if (selectedPizzas.length > 0) {
      onAddToCart(selectedPizzas, size);
      setSelectedPizzas([]);
      onClose();
    }
  };

  const getCurrentPrice = () => {
    if (selectedPizzas.length === 0) return 0;
    
    const selectedPizzaPrices = selectedPizzas.map(id => {
      const pizza = pizzas.find(p => p.id === id);
      return pizza ? pizza.prices[size] : 0;
    });
    
    return Math.max(...selectedPizzaPrices);
  };

  const getSelectedPizzaNames = () => {
    const orderLabels = ['Primeira', 'Segunda', 'Terceira', 'Quarta'];
    return selectedPizzas.map((id, index) => {
      const pizza = pizzas.find(p => p.id === id);
      return pizza ? `${orderLabels[index]}: ${pizza.name}` : '';
    }).filter(name => name);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="glass-card rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-montserrat text-2xl font-bold text-white">
              Monte sua Pizza Personalizada
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-neon-cyan transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-white mb-3">Tamanho: Grande</h4>
              <div className="glass p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Pizza Grande</span>
                  <span className="text-neon-cyan font-bold text-lg">
                    R$ {getCurrentPrice().toFixed(2)}
                  </span>
                </div>
                {selectedPizzas.length > 0 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    * Preço baseado na pizza mais cara selecionada
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">
                Escolha as pizzas ({selectedPizzas.length}/4) - Mínimo: 2 pizzas
              </h4>
              {selectedPizzas.length < 2 && (
                <div className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-200 p-3 rounded-lg mb-4 text-sm">
                  ⚠️ Selecione pelo menos 2 pizzas para montar sua pizza personalizada
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {pizzas.map((pizza) => (
                  <div
                    key={pizza.id}
                    onClick={() => handlePizzaToggle(pizza.id)}
                    className={`cursor-pointer rounded-lg overflow-hidden transition-all ${
                      selectedPizzas.includes(pizza.id)
                        ? 'ring-2 ring-neon-cyan shadow-lg'
                        : selectedPizzas.length >= 4
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:ring-2 hover:ring-white/50'
                    }`}
                  >
                    <img
                      src={pizza.image}
                      alt={pizza.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2 glass">
                      <h5 className="font-medium text-white text-sm text-center">
                        {pizza.name}
                      </h5>
                      <div className="text-xs text-neon-cyan text-center mt-1">
                        R$ {pizza.prices[size].toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedPizzas.length > 0 && (
              <div className="glass p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Pizzas selecionadas:</h4>
                <div className="text-neon-cyan text-sm">
                  {getSelectedPizzaNames().map((pizzaName, index) => (
                    <div key={index}>{pizzaName}</div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-white/20">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-white">Total:</span>
                <span className="font-bold text-neon-cyan text-lg">
                  R$ {getCurrentPrice().toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={selectedPizzas.length < 2}
                className="w-full gradient-primary py-3 px-4 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selectedPizzas.length < 2 
                  ? 'Selecione pelo menos 2 pizzas' 
                  : 'Adicionar ao Carrinho'
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPizzaModal;
