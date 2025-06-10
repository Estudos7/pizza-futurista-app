
import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useToast } from './use-toast';
import { Pizza, CartItem, Order } from '../types/pizza';
import { initialPizzas, initialPizzeriaInfo } from '../data/initialData';

interface PizzeriaInfo {
  id: string;
  name: string;
  subtitle: string;
  logo: string;
  address: string;
  phone: string;
}

export const useSupabasePizzaStore = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pizzeriaInfo, setPizzeriaInfo] = useState<PizzeriaInfo | null>(null);
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderCounter, setOrderCounter] = useState(1);

  // Load initial data
  useEffect(() => {
    if (isSupabaseConfigured) {
      loadPizzeriaData();
      loadPizzas();
      loadOrders();
    } else {
      // Use local data when Supabase is not configured
      setPizzeriaInfo({ ...initialPizzeriaInfo, id: 'local-pizzeria' });
      setPizzas(initialPizzas);
      setOrders([]);
      setLoading(false);
    }
  }, []);

  const loadPizzeriaData = async () => {
    try {
      if (!isSupabaseConfigured) {
        setPizzeriaInfo({ ...initialPizzeriaInfo, id: 'local-pizzeria' });
        setLoading(false);
        return;
      }

      const result = await supabase
        .from('pizzerias')
        .select('*')
        .limit(1)
        .single();

      if (result.error) throw result.error;

      if (result.data) {
        setPizzeriaInfo({
          id: result.data.id,
          name: result.data.name,
          subtitle: result.data.subtitle,
          logo: result.data.logo || '',
          address: result.data.address,
          phone: result.data.phone
        });
      }
    } catch (error) {
      console.error('Error loading pizzeria data:', error);
      // Fallback to local data
      setPizzeriaInfo({ ...initialPizzeriaInfo, id: 'local-pizzeria' });
      toast({
        title: "Modo Local",
        description: "Usando dados locais. Configure o Supabase para persistência.",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPizzas = async () => {
    try {
      if (!isSupabaseConfigured) {
        setPizzas(initialPizzas);
        return;
      }

      const result = await supabase
        .from('pizzas')
        .select('*')
        .order('created_at', { ascending: true });

      if (result.error) throw result.error;

      if (result.data) {
        const formattedPizzas: Pizza[] = result.data.map(pizza => ({
          id: parseInt(pizza.id.split('-')[0], 16), // Convert UUID to number for compatibility
          name: pizza.name,
          description: pizza.description,
          image: pizza.image,
          prices: {
            small: pizza.price_small,
            medium: pizza.price_medium,
            large: pizza.price_large
          },
          availableIngredients: pizza.available_ingredients || []
        }));
        setPizzas(formattedPizzas);
      }
    } catch (error) {
      console.error('Error loading pizzas:', error);
      // Fallback to local data
      setPizzas(initialPizzas);
    }
  };

  const loadOrders = async () => {
    try {
      if (!isSupabaseConfigured) {
        setOrders([]);
        return;
      }

      const result = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (result.error) throw result.error;

      if (result.data) {
        const formattedOrders: Order[] = result.data.map(order => ({
          id: order.order_number,
          items: order.items,
          customerInfo: {
            name: order.customer_name,
            address: order.customer_address,
            phone: order.customer_phone
          },
          paymentMethod: order.payment_method,
          total: order.total,
          timestamp: new Date(order.created_at),
          status: order.status as Order['status']
        }));
        setOrders(formattedOrders);
        
        // Update order counter based on existing orders
        const maxOrderNumber = Math.max(...result.data.map(o => parseInt(o.order_number) || 0), 0);
        setOrderCounter(maxOrderNumber + 1);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    }
  };

  // Pizza management
  const addPizza = async (pizza: Omit<Pizza, 'id'>) => {
    if (!isSupabaseConfigured) {
      // Local mode - add to state
      const newPizza = { ...pizza, id: Date.now() };
      setPizzas(prev => [...prev, newPizza]);
      toast({
        title: "Sucesso",
        description: "Pizza adicionada localmente!",
      });
      return;
    }

    if (!pizzeriaInfo) return;

    try {
      const result = await supabase
        .from('pizzas')
        .insert({
          pizzeria_id: pizzeriaInfo.id,
          name: pizza.name,
          description: pizza.description,
          image: pizza.image,
          price_small: pizza.prices.small,
          price_medium: pizza.prices.medium,
          price_large: pizza.prices.large,
          available_ingredients: pizza.availableIngredients || []
        })
        .select()
        .single();

      if (result.error) throw result.error;

      await loadPizzas(); // Reload pizzas
      toast({
        title: "Sucesso",
        description: "Pizza adicionada com sucesso!",
      });
    } catch (error) {
      console.error('Error adding pizza:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar pizza",
        variant: "destructive",
      });
    }
  };

  const updatePizza = async (id: number, pizza: Omit<Pizza, 'id'>) => {
    if (!isSupabaseConfigured) {
      // Local mode - update state
      setPizzas(prev => prev.map(p => p.id === id ? { ...pizza, id } : p));
      toast({
        title: "Sucesso",
        description: "Pizza atualizada localmente!",
      });
      return;
    }

    try {
      // Find the pizza by the legacy ID
      const existingPizza = pizzas.find(p => p.id === id);
      if (!existingPizza) return;

      const pizzaResult = await supabase
        .from('pizzas')
        .select('id')
        .eq('name', existingPizza.name)
        .single();

      if (!pizzaResult.data) return;

      const result = await supabase
        .from('pizzas')
        .update({
          name: pizza.name,
          description: pizza.description,
          image: pizza.image,
          price_small: pizza.prices.small,
          price_medium: pizza.prices.medium,
          price_large: pizza.prices.large,
          available_ingredients: pizza.availableIngredients || [],
          updated_at: new Date().toISOString()
        })
        .eq('id', pizzaResult.data.id);

      if (result.error) throw result.error;

      await loadPizzas(); // Reload pizzas
      toast({
        title: "Sucesso",
        description: "Pizza atualizada com sucesso!",
      });
    } catch (error) {
      console.error('Error updating pizza:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar pizza",
        variant: "destructive",
      });
    }
  };

  const deletePizza = async (id: number) => {
    if (!isSupabaseConfigured) {
      // Local mode - remove from state
      setPizzas(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Sucesso",
        description: "Pizza removida localmente!",
      });
      return;
    }

    try {
      // Find the pizza by the legacy ID
      const existingPizza = pizzas.find(p => p.id === id);
      if (!existingPizza) return;

      const pizzaResult = await supabase
        .from('pizzas')
        .select('id')
        .eq('name', existingPizza.name)
        .single();

      if (!pizzaResult.data) return;

      const result = await supabase
        .from('pizzas')
        .delete()
        .eq('id', pizzaResult.data.id);

      if (result.error) throw result.error;

      await loadPizzas(); // Reload pizzas
      toast({
        title: "Sucesso",
        description: "Pizza removida com sucesso!",
      });
    } catch (error) {
      console.error('Error deleting pizza:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover pizza",
        variant: "destructive",
      });
    }
  };

  // Cart management
  const addToCart = (pizzaId: number, size: 'small' | 'large', customPizzas?: number[]) => {
    const pizza = pizzas.find(p => p.id === pizzaId);
    if (!pizza) return;

    let price = pizza.prices[size];
    let pizzaName = pizza.name;
    
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

  // Order management
  const createOrder = async (customerInfo: Order['customerInfo'], paymentMethod: string): Promise<string> => {
    const orderId = orderCounter.toString();
    const total = getCartTotal();

    if (!isSupabaseConfigured) {
      // Local mode - add to state
      const newOrder: Order = {
        id: orderId,
        items: [...cart],
        customerInfo,
        paymentMethod,
        total,
        timestamp: new Date(),
        status: 'pending'
      };
      setOrders(prev => [newOrder, ...prev]);
      setOrderCounter(orderCounter + 1);
      clearCart();
      
      // Send to WhatsApp
      if (pizzeriaInfo) {
        const items = cart.map(item => 
          `• ${item.name} (${getSizeLabel(item.size)}) - Qtd: ${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}`
        ).join('\n');

        const message = `🍕 *NOVO PEDIDO - ${pizzeriaInfo.name}*\n\n` +
          `📋 *Pedido:* #${orderId}\n` +
          `👤 *Cliente:* ${customerInfo.name}\n` +
          `📍 *Endereço:* ${customerInfo.address}\n` +
          `📞 *Telefone:* ${customerInfo.phone}\n` +
          `💳 *Pagamento:* ${paymentMethod}\n\n` +
          `🍕 *Itens:*\n${items}\n\n` +
          `💰 *Total:* R$ ${total.toFixed(2)}`;

        const whatsappUrl = `https://wa.me/${pizzeriaInfo.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      }
      
      return orderId;
    }

    if (!pizzeriaInfo) return '';

    try {
      const result = await supabase
        .from('orders')
        .insert({
          pizzeria_id: pizzeriaInfo.id,
          order_number: orderId,
          customer_name: customerInfo.name,
          customer_address: customerInfo.address,
          customer_phone: customerInfo.phone,
          payment_method: paymentMethod,
          total: total,
          status: 'pending',
          items: cart
        });

      if (result.error) throw result.error;

      setOrderCounter(orderCounter + 1);
      clearCart();
      await loadOrders(); // Reload orders

      // Send to WhatsApp
      const items = cart.map(item => 
        `• ${item.name} (${getSizeLabel(item.size)}) - Qtd: ${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}`
      ).join('\n');

      const message = `🍕 *NOVO PEDIDO - ${pizzeriaInfo.name}*\n\n` +
        `📋 *Pedido:* #${orderId}\n` +
        `👤 *Cliente:* ${customerInfo.name}\n` +
        `📍 *Endereço:* ${customerInfo.address}\n` +
        `📞 *Telefone:* ${customerInfo.phone}\n` +
        `💳 *Pagamento:* ${paymentMethod}\n\n` +
        `🍕 *Itens:*\n${items}\n\n` +
        `💰 *Total:* R$ ${total.toFixed(2)}`;

      const whatsappUrl = `https://wa.me/${pizzeriaInfo.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      return orderId;
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar pedido",
        variant: "destructive",
      });
      return '';
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    if (!isSupabaseConfigured) {
      // Local mode - update state
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      toast({
        title: "Sucesso",
        description: "Status do pedido atualizado localmente!",
      });
      return;
    }

    try {
      const result = await supabase
        .from('orders')
        .update({ 
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('order_number', orderId);

      if (result.error) throw result.error;

      await loadOrders(); // Reload orders
      toast({
        title: "Sucesso",
        description: "Status do pedido atualizado!",
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status do pedido",
        variant: "destructive",
      });
    }
  };

  // Pizzeria settings
  const updatePizzeriaInfo = async (info: Omit<PizzeriaInfo, 'id'>) => {
    if (!isSupabaseConfigured) {
      // Local mode - update state
      setPizzeriaInfo(prev => prev ? { ...prev, ...info } : null);
      toast({
        title: "Sucesso",
        description: "Informações atualizadas localmente!",
      });
      return;
    }

    if (!pizzeriaInfo) return;

    try {
      const result = await supabase
        .from('pizzerias')
        .update({
          name: info.name,
          subtitle: info.subtitle,
          logo: info.logo,
          address: info.address,
          phone: info.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', pizzeriaInfo.id);

      if (result.error) throw result.error;

      setPizzeriaInfo({ ...pizzeriaInfo, ...info });
      toast({
        title: "Sucesso",
        description: "Informações da pizzaria atualizadas!",
      });
    } catch (error) {
      console.error('Error updating pizzeria info:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar informações da pizzaria",
        variant: "destructive",
      });
    }
  };

  // Authentication
  const authenticate = async (password: string): Promise<boolean> => {
    if (!isSupabaseConfigured) {
      // Local mode - simple password check
      const isValid = password === "gcipione";
      setIsAuthenticated(isValid);
      return isValid;
    }

    if (!pizzeriaInfo) return false;

    try {
      const result = await supabase
        .from('pizzerias')
        .select('admin_password')
        .eq('id', pizzeriaInfo.id)
        .single();

      if (result.error) throw result.error;

      const isValid = result.data.admin_password === password;
      setIsAuthenticated(isValid);
      return isValid;
    } catch (error) {
      console.error('Error authenticating:', error);
      return false;
    }
  };

  // Password recovery
  const recoverPassword = async (recoveryKey: string): Promise<string | null> => {
    const validRecoveryKey = "PIZZA2024";
    
    if (recoveryKey !== validRecoveryKey) {
      return null;
    }

    if (!isSupabaseConfigured) {
      // Local mode - return default password
      return "gcipione";
    }

    if (!pizzeriaInfo) return null;

    try {
      const result = await supabase
        .from('pizzerias')
        .select('admin_password')
        .eq('id', pizzeriaInfo.id)
        .single();

      if (result.error) throw result.error;

      return result.data.admin_password;
    } catch (error) {
      console.error('Error recovering password:', error);
      return null;
    }
  };

  // Helper functions
  const getSizeLabel = (size: string) => {
    switch (size) {
      case 'small': return 'Broto';
      case 'large': return 'Grande';
      default: return size;
    }
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
    // State
    pizzas,
    cart,
    orders,
    isAuthenticated,
    pizzeriaInfo,
    loading,
    
    // Actions
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
    authenticate,
    recoverPassword,
    getDayStats
  };
};

export default useSupabasePizzaStore;
