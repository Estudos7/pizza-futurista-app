
import { useState } from 'react';
import { useCart } from './useCart';
import { useOrders } from './useOrders';
import { usePizzaManagement } from './usePizzaManagement';
import { usePizzeriaSettings } from './usePizzeriaSettings';

export const usePizzaStore = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const { pizzeriaInfo, updatePizzeriaInfo } = usePizzeriaSettings();
  const { pizzas, addPizza, updatePizza, deletePizza } = usePizzaManagement();
  const { 
    cart, 
    addToCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart, 
    getCartTotal, 
    getCartItemCount 
  } = useCart(pizzas);
  const { orders, createOrder, updateOrderStatus, getDayStats } = useOrders(pizzeriaInfo);

  const handleCreateOrder = (customerInfo: any, paymentMethod: string): string => {
    const orderId = createOrder(cart, customerInfo, paymentMethod, getCartTotal());
    clearCart();
    return orderId;
  };

  return {
    pizzas,
    cart,
    orders,
    isAuthenticated,
    pizzeriaInfo,
    setIsAuthenticated,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
    addPizza,
    updatePizza,
    deletePizza,
    createOrder: handleCreateOrder,
    updateOrderStatus,
    updatePizzeriaInfo,
    getDayStats
  };
};
