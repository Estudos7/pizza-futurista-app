
import { Pizza } from '../types/pizza';

export const initialPizzas: Pizza[] = [
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

export const initialPizzeriaInfo = {
  name: "PizzaFuturista",
  subtitle: "A Pizzaria do Futuro",
  logo: "",
  address: "Rua Futurista, 123 - São Paulo, SP",
  phone: "+5511940704836"
};
