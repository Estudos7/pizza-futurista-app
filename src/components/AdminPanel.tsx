
import React, { useState } from 'react';
import { X } from 'lucide-react';
import PizzaManagement from './PizzaManagement';
import OrderManagement from './OrderManagement';
import PizzeriaSettings from './PizzeriaSettings';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  store: any;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, store }) => {
  const [activeTab, setActiveTab] = useState<'pizzas' | 'orders' | 'settings'>('pizzas');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      <div className="min-h-screen p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-montserrat text-3xl font-bold text-white">Painel Administrativo</h1>
          <button
            onClick={onClose}
            className="text-white hover:text-neon-cyan transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('pizzas')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'pizzas'
                ? 'gradient-primary text-white'
                : 'glass text-white hover:bg-white/20'
            }`}
          >
            Gerenciar Pizzas
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'orders'
                ? 'gradient-primary text-white'
                : 'glass text-white hover:bg-white/20'
            }`}
          >
            Pedidos ({store.orders.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'settings'
                ? 'gradient-primary text-white'
                : 'glass text-white hover:bg-white/20'
            }`}
          >
            Configurações
          </button>
        </div>

        {activeTab === 'pizzas' && <PizzaManagement store={store} />}
        {activeTab === 'orders' && <OrderManagement store={store} />}
        {activeTab === 'settings' && <PizzeriaSettings store={store} />}
      </div>
    </div>
  );
};

export default AdminPanel;
