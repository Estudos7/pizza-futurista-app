
import { useState } from 'react';
import { CartItem, Pizza } from '../types/pizza';

export const useCart = (pizzas: Pizza[]) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (pizzaId: number, size: 'small' | 'medium' | 'large') => {
    const pizza = pizzas.find(p => p.id === pizzaId);
    if (!pizza) return;

    const price = pizza.prices[size];
    const existingItem = cart.find(item => item.pizzaId === pizzaId && item.size === size);

    if (existingItem) {
      setCart(cart.map(item => 
        item.pizzaId === pizzaId && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        pizzaId,
        name: pizza.name,
        size,
        price,
        quantity: 1
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
