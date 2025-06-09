
import { useState } from 'react';
import { CartItem, Pizza } from '../types/pizza';

export const useCart = (pizzas: Pizza[]) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (pizzaId: number, size: 'small' | 'medium' | 'large', customIngredients?: string[]) => {
    const pizza = pizzas.find(p => p.id === pizzaId);
    if (!pizza) return;

    let price = pizza.prices[size];
    
    // Se tem ingredientes personalizados, usar preço da pizza mais cara
    if (customIngredients && customIngredients.length > 0) {
      const maxPrice = Math.max(...pizzas.map(p => p.prices[size]));
      price = maxPrice;
    }

    const isCustom = customIngredients && customIngredients.length > 0;
    const pizzaName = isCustom ? `${pizza.name} (Personalizada)` : pizza.name;

    const existingItem = cart.find(item => 
      item.pizzaId === pizzaId && 
      item.size === size && 
      JSON.stringify(item.customIngredients || []) === JSON.stringify(customIngredients || [])
    );

    if (existingItem) {
      setCart(cart.map(item => 
        item.pizzaId === pizzaId && 
        item.size === size && 
        JSON.stringify(item.customIngredients || []) === JSON.stringify(customIngredients || [])
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
        customIngredients: customIngredients || [],
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
