
import React, { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PizzaManagementProps {
  store: any;
}

const PizzaManagement: React.FC<PizzaManagementProps> = ({ store }) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPizza, setEditingPizza] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    priceSmall: '',
    priceLarge: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
      priceSmall: '',
      priceLarge: ''
    });
    setEditingPizza(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (pizza: any) => {
    setFormData({
      name: pizza.name,
      description: pizza.description,
      image: pizza.image,
      priceSmall: pizza.prices.small.toString(),
      priceLarge: pizza.prices.large.toString()
    });
    setEditingPizza(pizza);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
      priceSmall: '',
      priceLarge: ''
    });
    setEditingPizza(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const pizzaData = {
      name: formData.name,
      description: formData.description,
      image: formData.image,
      prices: {
        small: parseFloat(formData.priceSmall),
        medium: parseFloat(formData.priceSmall) * 1.4, // Auto-calculate medium price
        large: parseFloat(formData.priceLarge)
      }
    };

    if (editingPizza) {
      store.updatePizza(editingPizza.id, pizzaData);
      toast({
        title: "Pizza atualizada!",
        description: "As informações da pizza foram atualizadas com sucesso.",
      });
    } else {
      store.addPizza(pizzaData);
      toast({
        title: "Pizza adicionada!",
        description: "Nova pizza foi adicionada ao cardápio.",
      });
    }

    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta pizza?')) {
      store.deletePizza(id);
      toast({
        title: "Pizza removida!",
        description: "A pizza foi removida do cardápio.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-montserrat text-2xl font-bold text-white">Gerenciar Pizzas</h2>
        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 gradient-primary px-4 py-2 rounded-lg text-white font-semibold hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Pizza</span>
        </button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card border-white/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-montserrat text-xl font-bold text-white">
              {editingPizza ? 'Editar Pizza' : 'Nova Pizza'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-white font-medium mb-2">Nome</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 rounded-lg glass text-white border border-white/20 focus:border-neon-cyan focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Imagem (URL)</label>
              <input
                type="url"
                required
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full p-3 rounded-lg glass text-white border border-white/20 focus:border-neon-cyan focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-white font-medium mb-2">Descrição</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 rounded-lg glass text-white border border-white/20 focus:border-neon-cyan focus:outline-none h-20"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Preço Broto (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.priceSmall}
                onChange={(e) => setFormData({ ...formData, priceSmall: e.target.value })}
                className="w-full p-3 rounded-lg glass text-white border border-white/20 focus:border-neon-cyan focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Preço Grande (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.priceLarge}
                onChange={(e) => setFormData({ ...formData, priceLarge: e.target.value })}
                className="w-full p-3 rounded-lg glass text-white border border-white/20 focus:border-neon-cyan focus:outline-none"
              />
            </div>

            <div className="md:col-span-2 flex space-x-4 pt-4">
              <button
                type="submit"
                className="gradient-primary px-6 py-3 rounded-lg text-white font-semibold hover:shadow-lg transition-all"
              >
                {editingPizza ? 'Atualizar' : 'Adicionar'} Pizza
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="glass px-6 py-3 rounded-lg text-white font-semibold hover:bg-white/20 transition-all"
              >
                Cancelar
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {store.pizzas.map((pizza: any) => (
          <div key={pizza.id} className="glass-card rounded-xl overflow-hidden">
            <img 
              src={pizza.image} 
              alt={pizza.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-montserrat text-lg font-bold text-white mb-2">{pizza.name}</h3>
              <p className="text-muted-foreground text-sm mb-3">{pizza.description}</p>
              
              <div className="text-sm text-neon-cyan mb-4">
                <p>Broto: R$ {pizza.prices.small.toFixed(2)}</p>
                <p>Grande: R$ {pizza.prices.large.toFixed(2)}</p>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(pizza)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg text-white font-medium transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleDelete(pizza.id)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-white font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Excluir</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PizzaManagement;
