import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSupabasePizzaStore } from '../hooks/useSupabasePizzaStore';
import Header from '../components/Header';
import Carousel from '../components/Carousel';
import PizzaGrid from '../components/PizzaGrid';
import CartButton from '../components/CartButton';
import CartSidebar from '../components/CartSidebar';
import CheckoutModal from '../components/CheckoutModal';
import AdminButton from '../components/AdminButton';
import AdminPanel from '../components/AdminPanel';
import LoginModal from '../components/LoginModal';

const Index = () => {
  const { toast } = useToast();
  const store = useSupabasePizzaStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleAddToCart = (pizzaId: number, size: 'small' | 'medium' | 'large', customPizzas?: number[]) => {
    store.addToCart(pizzaId, size, customPizzas);
    const isCustom = customPizzas && customPizzas.length > 0;
    toast({
      title: isCustom ? "Pizza personalizada adicionada!" : "Adicionado ao carrinho!",
      description: isCustom ? "Sua pizza personalizada foi adicionada com sucesso." : "Pizza adicionada com sucesso.",
      duration: 2000,
    });
  };

  const handleCheckout = () => {
    if (store.cart.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho primeiro!",
        variant: "destructive",
      });
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleConfirmOrder = async (customerInfo: any, paymentMethod: string) => {
    const orderId = await store.createOrder(customerInfo, paymentMethod);
    setIsCheckoutOpen(false);
    if (orderId) {
      toast({
        title: "Pedido confirmado!",
        description: `Pedido #${orderId} realizado com sucesso. Enviando via WhatsApp...`,
        duration: 5000,
      });
    }
  };

  const handleAdminLogin = async (password: string) => {
    const isValid = await store.authenticate(password);
    if (isValid) {
      setIsLoginOpen(false);
      setIsAdminOpen(true);
      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao painel administrativo.",
      });
    } else {
      toast({
        title: "Senha incorreta",
        description: "Verifique sua senha e tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (store.loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neon-cyan mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!store.pizzeriaInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg">Erro ao carregar dados da pizzaria</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header pizzeriaInfo={store.pizzeriaInfo} />
      <Carousel />
      <PizzaGrid pizzas={store.pizzas} onAddToCart={handleAddToCart} />
      
      <CartButton 
        itemCount={store.getCartItemCount()} 
        onClick={() => setIsCartOpen(true)} 
      />
      
      <AdminButton onClick={() => setIsLoginOpen(true)} />
      
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={store.cart}
        total={store.getCartTotal()}
        onUpdateItem={store.updateCartItem}
        onRemoveItem={store.removeFromCart}
        onCheckout={handleCheckout}
      />
      
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={store.getCartTotal()}
        onConfirm={handleConfirmOrder}
      />
      
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleAdminLogin}
      />
      
      {store.isAuthenticated && (
        <AdminPanel
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          store={store}
        />
      )}
    </div>
  );
};

export default Index;