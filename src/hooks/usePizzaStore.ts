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

const initialPizzeriaInfo = {
  name: "PizzaFuturista",
  subtitle: "A Pizzaria do Futuro",
  logo: "",
  address: "Rua Futurista, 123 - São Paulo, SP",
  phone: "+5511940704836"
};

export const usePizzaStore = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>(initialPizzas);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pizzeriaInfo, setPizzeriaInfo] = useState(initialPizzeriaInfo);
  const [orderCounter, setOrderCounter] = useState(1);

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
    const orderId = orderCounter.toString();
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
    setOrderCounter(orderCounter + 1);
    
    // Enviar pedido via WhatsApp
    sendOrderToWhatsApp(order);
    
    clearCart();
    return orderId;
  };

  const sendOrderToWhatsApp = (order: Order) => {
    const items = order.items.map(item => 
      `• ${item.name} (${getSizeLabel(item.size)}) - Qtd: ${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const message = `🍕 *NOVO PEDIDO - ${pizzeriaInfo.name}*\n\n` +
      `📋 *Pedido:* #${order.id}\n` +
      `👤 *Cliente:* ${order.customerInfo.name}\n` +
      `📍 *Endereço:* ${order.customerInfo.address}\n` +
      `📞 *Telefone:* ${order.customerInfo.phone}\n` +
      `💳 *Pagamento:* ${order.paymentMethod}\n\n` +
      `🍕 *Itens:*\n${items}\n\n` +
      `💰 *Total:* R$ ${order.total.toFixed(2)}`;

    const whatsappUrl = `https://wa.me/${pizzeriaInfo.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getSizeLabel = (size: string) => {
    switch (size) {
      case 'small': return 'Broto';
      case 'medium': return 'Média';
      case 'large': return 'Grande';
      default: return size;
    }
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const updatePizzeriaInfo = (info: typeof initialPizzeriaInfo) => {
    setPizzeriaInfo(info);
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
    createOrder,
    updateOrderStatus,
    updatePizzeriaInfo,
    getDayStats
  };
};
