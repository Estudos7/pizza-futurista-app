export interface Pizza {
  id: number;
  name: string;
  description: string;
  image: string;
  prices: {
    small: number;
    medium: number;
    large: number;
  };
  availableIngredients?: string[];
}

export interface CartItem {
  pizzaId: number;
  name: string;
  size: 'small' | 'medium' | 'large';
  price: number;
  quantity: number;
  customIngredients?: string[];
  isCustom?: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  customerInfo: {
    name: string;
    address: string;
    phone: string;
  };
  paymentMethod: string;
  total: number;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered';
}
