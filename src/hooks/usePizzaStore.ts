
import { useState } from 'react';
import { Pizza, CartItem, Order } from '../types/pizza';

const initialPizzas: Pizza[] = [
  {
    id: 1,
    name: "Margherita Futurista",
    description: "Molho de tomate artesanal, mussarela premium, manjericão fresco",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    prices: {
      small: 25.00,
      medium: 35.00,
      large: 45.00
    }
  },
  {
    id: 2,
    name: "Pepperoni Neo",
    description: "Molho especial, mussarela premium, pepperoni selecionado",
    image: "https://images.unsplash.com/photo-1574126154517-d1e0d89ef734?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    prices: {
      small: 30.00,
      medium: 40.00,
      large: 50.00
    }
  },
  {
    id: 3,
    name: "Quattro Formaggi Cyber",
    description: "Molho branco, mussarela, gorgonzola, parmesão, provolone",
    image: "https://images.unsplash.com/photo-1552539618-7eec9b4d1796?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    prices: {
      small: 35.00,
      medium: 45.00,
      large: 55.00
    }
  },
  {
    id: 4,
    name: "Vegana Neon",
    description: "Molho de tomate, queijo vegano, cogumelos, pimentões, azeitonas",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    prices: {
      small: 28.00,
      medium: 38.00,
      large: 48.00
    }
  }
];

export const usePizzaStore = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>(initialPizzas);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const createOrder = (customerInfo: Order['customerInfo'], paymentMethod: string): string => {
    const orderId = `ORDER-${Date.now()}`;
    const order: Order = {
      id: orderId,
      items: [...cart],
      customerInfo,
      paymentMethod,
      total: getCartTotal(),
      timestamp: new Date(),
      status: 'pending'
    };
    setOrders([order, ...orders]);
    clearCart();
    return orderId;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  return {
    pizzas,
    cart,
    orders,
    isAuthenticated,
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
    createOrder,
    updateOrderStatus
  };
};
