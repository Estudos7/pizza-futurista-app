import { useState } from 'react';
import { CartItem, Pizza } from '../types/pizza';

export const useCart = (pizzas: Pizza[]) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (pizzaId: number, size: 'small' | 'medium' | 'large', customPizzas?: number[]) => {
    const pizza = pizzas.find(p => p.id === pizzaId);
    if (!pizza) return;

    let price = pizza.prices[size];
    let pizzaName = pizza.name;
    
    // Se tem pizzas personalizadas, usar preço da pizza mais cara
    if (customPizzas && customPizzas.length > 0) {
      const maxPrice = Math.max(...pizzas.map(p => p.prices[size]));
      price = maxPrice;
      
      const selectedPizzaNames = customPizzas.map(id => {
        const p = pizzas.find(pizza => pizza.id === id);
        return p?.name || '';
      }).filter(name => name);
      
      pizzaName = `Pizza Personalizada (${selectedPizzaNames.join(', ')})`;
    }

    const isCustom = customPizzas && customPizzas.length > 0;

    const existingItem = cart.find(item => 
      item.pizzaId === pizzaId && 
      item.size === size && 
      JSON.stringify(item.customPizzas || []) === JSON.stringify(customPizzas || [])
    );

    if (existingItem) {
      setCart(cart.map(item => 
        item.pizzaId === pizzaId && 
        item.size === size && 
        JSON.stringify(item.customPizzas || []) === JSON.stringify(customPizzas || [])
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        pizzaId,
        name: pizzaName,
        size,
        price,
        quantity: 1,
        customPizzas: customPizzas || [],
        isCustom
      }]);
    }
  };

  const updateCartItem = (index: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter((_, i) => i !== index));
    } else {
      setCart(cart.map((item, i) => 
        i === index ? { ...item, quantity } : item
      ));
    }
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return {
    cart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount
  };
};
