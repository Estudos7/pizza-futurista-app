
import { useState } from 'react';
import { Pizza } from '../types/pizza';
import { initialPizzas } from '../data/initialData';

export const usePizzaManagement = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>(initialPizzas);

  const addPizza = (pizza: Omit<Pizza, 'id'>) => {
    const newId = pizzas.length > 0 ? Math.max(...pizzas.map(p => p.id)) + 1 : 1;
    setPizzas([...pizzas, { ...pizza, id: newId }]);
  };

  const updatePizza = (id: number, pizza: Omit<Pizza, 'id'>) => {
    setPizzas(pizzas.map(p => p.id === id ? { ...pizza, id } : p));
  };

  const deletePizza = (id: number) => {
    setPizzas(pizzas.filter(p => p.id !== id));
  };

  return {
    pizzas,
    addPizza,
    updatePizza,
    deletePizza
  };
};
