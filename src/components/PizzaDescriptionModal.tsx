
import React from 'react';
import { X } from 'lucide-react';
import { Pizza } from '../types/pizza';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PizzaDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  pizza: Pizza | null;
}

const PizzaDescriptionModal: React.FC<PizzaDescriptionModalProps> = ({
  isOpen,
  onClose,
  pizza,
}) => {
  if (!pizza) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/20 max-w-lg animate-scale-in">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="font-montserrat text-xl font-bold text-white pr-4">
              {pizza.name}
            </DialogTitle>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 animate-fade-in">
          <div className="relative overflow-hidden rounded-lg">
            <img 
              src={pizza.image} 
              alt={pizza.name}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-white font-semibold mb-2">Descrição</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {pizza.description}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-3 rounded-lg text-center">
                <div className="text-muted-foreground text-xs mb-1">Broto</div>
                <div className="text-neon-cyan font-bold text-lg">
                  R$ {pizza.prices.small.toFixed(2)}
                </div>
              </div>
              <div className="glass p-3 rounded-lg text-center">
                <div className="text-muted-foreground text-xs mb-1">Grande</div>
                <div className="text-neon-cyan font-bold text-lg">
                  R$ {pizza.prices.large.toFixed(2)}
                </div>
              </div>
            </div>

            {pizza.availableIngredients && pizza.availableIngredients.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-2">Ingredientes</h4>
                <div className="flex flex-wrap gap-1">
                  {pizza.availableIngredients.map((ingredient, index) => (
                    <span 
                      key={index}
                      className="bg-white/10 text-white text-xs px-2 py-1 rounded-full"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PizzaDescriptionModal;
