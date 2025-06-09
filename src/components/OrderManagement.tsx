import React from 'react';
import { Order } from '../types/pizza';

interface OrderManagementProps {
  store: any;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ store }) => {
  const dayStats = store.getDayStats();

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-400';
      case 'confirmed': return 'text-blue-400';
      case 'preparing': return 'text-orange-400';
      case 'delivered': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'preparing': return 'Preparando';
      case 'delivered': return 'Entregue';
      default: return status;
    }
  };

  const getSizeLabel = (size: string) => {
    switch (size) {
      case 'small': return 'Broto';
      case 'medium': return 'Média';
      case 'large': return 'Grande';
      default: return size;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-montserrat text-2xl font-bold text-white">Pedidos Recentes</h2>
      
      {/* Resumo do Dia */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="font-montserrat text-xl font-bold text-white mb-4">Resumo do Dia</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-neon-cyan">{dayStats.totalOrders}</p>
            <p className="text-muted-foreground">Total de Pedidos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-neon-cyan">{dayStats.totalPizzas}</p>
            <p className="text-muted-foreground">Total de Pizzas Vendidas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-neon-cyan">R$ {dayStats.totalValue.toFixed(2)}</p>
            <p className="text-muted-foreground">Valor Total do Dia</p>
          </div>
        </div>
      </div>
      
      {store.orders.length === 0 ? (
        <div className="glass-card p-8 text-center rounded-xl">
          <p className="text-muted-foreground">Nenhum pedido encontrado</p>
        </div>
      ) : (
        <div className="space-y-4">
          {store.orders.map((order: Order) => (
            <div key={order.id} className="glass-card p-6 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-montserrat text-lg font-bold text-white">Pedido #{order.id}</h3>
                  <p className="text-muted-foreground">
                    {new Date(order.timestamp).toLocaleString('pt-BR')}
                  </p>
                  <p className={`font-semibold ${getStatusColor(order.status)}`}>
                    Status: {getStatusLabel(order.status)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-montserrat text-xl font-bold text-neon-cyan">
                    R$ {order.total.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">{order.paymentMethod}</p>
                </div>
              </div>

              <div className="border-t border-white/20 pt-4 mb-4">
                <h4 className="text-white font-semibold mb-2">Informações do Cliente:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <p className="text-muted-foreground">
                    <span className="text-white">Nome:</span><br />
                    {order.customerInfo.name}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="text-white">Telefone:</span><br />
                    {order.customerInfo.phone}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="text-white">Endereço:</span><br />
                    {order.customerInfo.address}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/20 pt-4">
                <h4 className="text-white font-semibold mb-2">Itens do Pedido:</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-white">
                        {item.name} ({getSizeLabel(item.size)}) × {item.quantity}
                      </span>
                      <span className="text-neon-cyan font-semibold">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                {order.status !== 'delivered' && (
                  <>
                    {order.status === 'pending' && (
                      <button
                        onClick={() => store.updateOrderStatus(order.id, 'confirmed')}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                      >
                        Confirmar
                      </button>
                    )}
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => store.updateOrderStatus(order.id, 'preparing')}
                        className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                      >
                        Preparar
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => store.updateOrderStatus(order.id, 'delivered')}
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                      >
                        Entregar
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
