
import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Pizza } from '../types/pizza';

interface CustomPizzaModalProps {
  isOpen: boolean;
  onClose: () => void;
  pizza: Pizza;
  onAddToCart: (pizzaId: number, size: 'small' | 'large', customIngredients: string[]) => void;
}

const CustomPizzaModal: React.FC<CustomPizzaModalProps> = ({
  isOpen,
  onClose,
  pizza,
  onAddToCart
}) => {
  const [selectedSize, setSelectedSize] = useState<'small' | 'large'>('small');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleIngredientToggle = (ingredient: string) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
    } else if (selectedIngredients.length < 4) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(pizza.id, selectedSize, selectedIngredients);
    setSelectedIngredients([]);
    onClose();
  };

  const getSizeLabel = (size: 'small' | 'large') => {
    return size === 'small' ? 'Broto' : 'Grande';
  };

  const getCurrentPrice = () => {
    return pizza.prices[selectedSize];
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="glass-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-montserrat text-2xl font-bold text-white">
              Monte sua Pizza
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-neon-cyan transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <img
                src={pizza.image}
                alt={pizza.name}
                className="w-full h-48 md:h-64 object-cover rounded-lg"
              />
            </div>

            <div className="md:w-1/2 space-y-4">
              <div>
                <h3 className="font-montserrat text-xl font-bold text-white mb-2">
                  {pizza.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {pizza.description}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-3">Escolha o tamanho:</h4>
                <div className="flex gap-2">
                  {(['small', 'large'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        selectedSize === size
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
              </div>

              <div>
                <h4 className="font-semibold text-white mb-3">
                  Ingredientes ({selectedIngredients.length}/4):
                </h4>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {pizza.availableIngredients?.map((ingredient) => (
                    <button
                      key={ingredient}
                      onClick={() => handleIngredientToggle(ingredient)}
                      disabled={!selectedIngredients.includes(ingredient) && selectedIngredients.length >= 4}
                      className={`p-2 rounded-lg text-sm font-medium transition-all ${
                        selectedIngredients.includes(ingredient)
                          ? 'gradient-primary text-white shadow-lg'
                          : selectedIngredients.length >= 4
                          ? 'glass text-muted-foreground cursor-not-allowed'
                          : 'glass text-white hover:bg-white/20'
                      }`}
                    >
                      {ingredient}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-white">Total:</span>
                  <span className="font-bold text-neon-cyan text-lg">
                    R$ {getCurrentPrice().toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-full gradient-primary py-3 px-4 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPizzaModal;
