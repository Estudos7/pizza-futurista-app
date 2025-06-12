import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
    loadPizzeriaData();
    loadPizzas();
    loadOrders();
  }, []);

  const loadPizzeriaData = async () => {
    try {
      const { data, error } = await supabase
        .from('pizzerias')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;

      if (data) {
        setPizzeriaInfo({
          id: data.id,
          name: data.name,
          subtitle: data.subtitle,
          logo: data.logo || '',
          address: data.address,
          phone: data.phone
        });
      }
    } catch (error) {
      console.error('Error loading pizzeria data:', error);
      // Fallback to local data
      setPizzeriaInfo({ ...initialPizzeriaInfo, id: 'local-pizzeria' });
      toast({
        title: "Modo Local",
        description: "Usando dados locais. Verifique a conexão com o banco.",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPizzas = async () => {
    try {
      const { data, error } = await supabase
        .from('pizzas')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedPizzas: Pizza[] = data.map((pizza, index) => ({
          id: index + 1, // Legacy ID for compatibility
          name: pizza.name,
          description: pizza.description,
          image: pizza.image,
          prices: {
            small: Number(pizza.price_small),
            medium: Number(pizza.price_medium),
            large: Number(pizza.price_large)
          },
          availableIngredients: Array.isArray(pizza.available_ingredients) 
            ? pizza.available_ingredients.filter((item): item is string => typeof item === 'string')
            : []
        }));
        setPizzas(formattedPizzas);
      }
    } catch (error) {
      console.error('Error loading pizzas:', error);
      setPizzas(initialPizzas);
    }
  };

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedOrders: Order[] = data.map(order => {
          // Type guard to ensure items are CartItem[]
          const items: CartItem[] = [];
          if (Array.isArray(order.items)) {
            order.items.forEach(item => {
              if (
                typeof item === 'object' && 
                item !== null && 
                'pizzaId' in item &&
                'name' in item &&
                'size' in item &&
                'price' in item &&
                'quantity' in item
              ) {
                items.push({
                  pizzaId: Number(item.pizzaId),
                  name: String(item.name),
                  size: String(item.size) as 'small' | 'medium' | 'large',
                  price: Number(item.price),
                  quantity: Number(item.quantity),
                  customPizzas: Array.isArray(item.customPizzas) ? item.customPizzas.map(Number) : [],
                  isCustom: Boolean(item.isCustom)
                });
              }
            });
          }

          return {
            id: order.order_number,
            items,
            customerInfo: {
              name: order.customer_name,
              address: order.customer_address,
              phone: order.customer_phone
            },
            paymentMethod: order.payment_method,
            total: Number(order.total),
            timestamp: new Date(order.created_at),
            status: order.status as Order['status']
          };
        });
        setOrders(formattedOrders);
        
        // Update order counter based on existing orders
        const maxOrderNumber = Math.max(...data.map(o => parseInt(o.order_number) || 0), 0);
        setOrderCounter(maxOrderNumber + 1);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    }
  };

  // Pizza management
  const addPizza = async (pizza: Omit<Pizza, 'id'>) => {
    if (!pizzeriaInfo) return;

    try {
      const { error } = await supabase
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
        });

      if (error) throw error;

      await loadPizzas();
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
    try {
      // Find the pizza by the legacy ID (index-based)
      const { data: allPizzas, error: fetchError } = await supabase
        .from('pizzas')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      const targetPizza = allPizzas?.[id - 1]; // Convert legacy ID to array index
      if (!targetPizza) {
        toast({
          title: "Erro",
          description: "Pizza não encontrada",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('pizzas')
        .update({
          name: pizza.name,
          description: pizza.description,
          image: pizza.image,
          price_small: pizza.prices.small,
          price_medium: pizza.prices.medium,
          price_large: pizza.prices.large,
          available_ingredients: pizza.availableIngredients || []
        })
        .eq('id', targetPizza.id);

      if (error) throw error;

      await loadPizzas();
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
    try {
      // Find the pizza by the legacy ID (index-based)
      const { data: allPizzas, error: fetchError } = await supabase
        .from('pizzas')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      const targetPizza = allPizzas?.[id - 1]; // Convert legacy ID to array index
      if (!targetPizza) {
        toast({
          title: "Erro",
          description: "Pizza não encontrada",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('pizzas')
        .update({ is_active: false })
        .eq('id', targetPizza.id);

      if (error) throw error;

      await loadPizzas();
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
      const selectedPizzaPrices = customPizzas.map(id => {
        const p = pizzas.find(pizza => pizza.id === id);
        return p ? p.prices[size] : 0;
      });
      price = Math.max(...selectedPizzaPrices);
      
      const orderLabels = ['Primeira', 'Segunda', 'Terceira', 'Quarta'];
      const selectedPizzaNames = customPizzas.map((id, index) => {
        const p = pizzas.find(pizza => pizza.id === id);
        return p ? `${orderLabels[index]}: ${p.name}` : '';
      }).filter(name => name);
      
      pizzaName = `Pizza Montada pelo Cliente (${selectedPizzaNames.join(', ')})`;
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

    if (!pizzeriaInfo) return '';

    try {
      const { error } = await supabase
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
          items: cart.map(item => ({
            pizzaId: item.pizzaId,
            name: item.name,
            size: item.size,
            price: item.price,
            quantity: item.quantity,
            customPizzas: item.customPizzas || [],
            isCustom: item.isCustom || false
          }))
        });

      if (error) throw error;

      setOrderCounter(orderCounter + 1);
      clearCart();
      await loadOrders();

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
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: status })
        .eq('order_number', orderId);

      if (error) throw error;

      await loadOrders();
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
    if (!pizzeriaInfo) return;

    try {
      const { error } = await supabase
        .from('pizzerias')
        .update({
          name: info.name,
          subtitle: info.subtitle,
          logo: info.logo,
          address: info.address,
          phone: info.phone
        })
        .eq('id', pizzeriaInfo.id);

      if (error) throw error;

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
    if (!pizzeriaInfo) return false;

    try {
      const { data, error } = await supabase
        .from('pizzerias')
        .select('admin_password')
        .eq('id', pizzeriaInfo.id)
        .single();

      if (error) throw error;

      const isValid = data.admin_password === password;
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

    if (!pizzeriaInfo) return null;

    try {
      const { data, error } = await supabase
        .from('pizzerias')
        .select('admin_password')
        .eq('id', pizzeriaInfo.id)
        .single();

      if (error) throw error;

      return data.admin_password;
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
