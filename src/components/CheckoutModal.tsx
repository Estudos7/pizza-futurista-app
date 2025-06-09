
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onConfirm: (customerInfo: any, paymentMethod: string) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, total, onConfirm }) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    address: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Pix');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(customerInfo, paymentMethod);
    setCustomerInfo({ name: '', address: '', phone: '' });
    setPaymentMethod('Pix');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full rounded-xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-montserrat text-2xl font-bold text-white">Finalizar Pedido</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-neon-cyan transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">Nome</label>
            <input
              type="text"
              required
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
              className="w-full p-3 rounded-lg glass text-white placeholder-white/50 border border-white/20 focus:border-neon-cyan focus:outline-none transition-colors"
              placeholder="Seu nome completo"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Endereço</label>
            <input
              type="text"
              required
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
              className="w-full p-3 rounded-lg glass text-white placeholder-white/50 border border-white/20 focus:border-neon-cyan focus:outline-none transition-colors"
              placeholder="Rua, número, bairro, cidade"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Telefone</label>
            <input
              type="tel"
              required
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
              className="w-full p-3 rounded-lg glass text-white placeholder-white/50 border border-white/20 focus:border-neon-cyan focus:outline-none transition-colors"
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-3">Forma de Pagamento</label>
            <div className="space-y-2">
              {['Pix', 'Cartão de Crédito', 'Dinheiro'].map((method) => (
                <label key={method} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-neon-cyan focus:ring-neon-cyan"
                  />
                  <span className="text-white">{method}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-white/20 pt-4 mt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="font-montserrat text-lg font-bold text-white">Total:</span>
              <span className="font-montserrat text-lg font-bold text-neon-cyan">R$ {total.toFixed(2)}</span>
            </div>
            <button
              type="submit"
              className="w-full gradient-primary py-3 px-4 rounded-lg text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Confirmar Pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
