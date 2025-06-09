
import { Order } from '../types/pizza';

export const getSizeLabel = (size: string) => {
  switch (size) {
    case 'small': return 'Broto';
    case 'medium': return 'Média';
    case 'large': return 'Grande';
    default: return size;
  }
};

export const sendOrderToWhatsApp = (order: Order, pizzeriaInfo: any) => {
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
