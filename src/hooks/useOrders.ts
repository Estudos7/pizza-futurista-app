
import { useState } from 'react';
import { Order, CartItem } from '../types/pizza';
import { sendOrderToWhatsApp } from '../utils/whatsappUtils';

export const useOrders = (pizzeriaInfo: any) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderCounter, setOrderCounter] = useState(1);

  const createOrder = (
    cart: CartItem[], 
    customerInfo: Order['customerInfo'], 
    paymentMethod: string,
    cartTotal: number
  ): string => {
    const orderId = orderCounter.toString();
    const order: Order = {
      id: orderId,
      items: [...cart],
      customerInfo,
      paymentMethod,
      total: cartTotal,
      timestamp: new Date(),
      status: 'pending'
    };
    setOrders([order, ...orders]);
    setOrderCounter(orderCounter + 1);
    
    sendOrderToWhatsApp(order, pizzeriaInfo);
    
    return orderId;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const getDayStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayOrders = orders.filter(order => {
      const orderDate = new Date(order.timestamp);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });

    const totalOrders = todayOrders.length;
    const totalPizzas = todayOrders.reduce((total, order) => 
      total + order.items.reduce((orderTotal, item) => orderTotal + item.quantity, 0), 0
    );
    const totalValue = todayOrders.reduce((total, order) => total + order.total, 0);

    return {
      totalOrders,
      totalPizzas,
      totalValue
    };
  };

  return {
    orders,
    createOrder,
    updateOrderStatus,
    getDayStats
  };
};
