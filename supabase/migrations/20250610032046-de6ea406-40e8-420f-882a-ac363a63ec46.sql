
-- Drop existing tables and recreate with better structure
DROP TABLE IF EXISTS public.customer_promotions CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.company_info CASCADE;
DROP TABLE IF EXISTS public.carousel_images CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.pizzas CASCADE;
DROP TABLE IF EXISTS public.pizzerias CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;

-- Create pizzerias table (main company info)
CREATE TABLE public.pizzerias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subtitle text NOT NULL,
  logo text,
  address text NOT NULL,
  phone text NOT NULL,
  admin_password text NOT NULL DEFAULT 'gcipione',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pizzas table
CREATE TABLE public.pizzas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pizzeria_id uuid REFERENCES public.pizzerias(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  image text NOT NULL,
  price_small decimal(10,2) NOT NULL,
  price_medium decimal(10,2) NOT NULL,
  price_large decimal(10,2) NOT NULL,
  available_ingredients jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create customers table
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL UNIQUE,
  address text,
  total_orders integer DEFAULT 0,
  total_spent decimal(10,2) DEFAULT 0,
  last_order_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pizzeria_id uuid REFERENCES public.pizzerias(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  order_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_address text NOT NULL,
  customer_phone text NOT NULL,
  payment_method text NOT NULL,
  total decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
  items jsonb NOT NULL,
  notes text,
  delivery_fee decimal(10,2) DEFAULT 0,
  estimated_delivery_time timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table for better normalization
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  pizza_id uuid REFERENCES public.pizzas(id) ON DELETE SET NULL,
  pizza_name text NOT NULL,
  size text NOT NULL CHECK (size IN ('small', 'medium', 'large')),
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  custom_ingredients jsonb DEFAULT '[]'::jsonb,
  is_custom boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create ingredients table
CREATE TABLE public.ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  price_addition decimal(10,2) DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pizza_ingredients junction table
CREATE TABLE public.pizza_ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pizza_id uuid REFERENCES public.pizzas(id) ON DELETE CASCADE,
  ingredient_id uuid REFERENCES public.ingredients(id) ON DELETE CASCADE,
  is_included boolean DEFAULT true,
  UNIQUE(pizza_id, ingredient_id)
);

-- Enable RLS on all tables
ALTER TABLE public.pizzerias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pizzas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pizza_ingredients ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Public can read pizzeria info" ON public.pizzerias FOR SELECT TO public USING (true);
CREATE POLICY "Public can update pizzeria info" ON public.pizzerias FOR UPDATE TO public USING (true);

CREATE POLICY "Public can read pizzas" ON public.pizzas FOR SELECT TO public USING (true);
CREATE POLICY "Public can manage pizzas" ON public.pizzas FOR ALL TO public USING (true);

CREATE POLICY "Public can read ingredients" ON public.ingredients FOR SELECT TO public USING (true);
CREATE POLICY "Public can manage ingredients" ON public.ingredients FOR ALL TO public USING (true);

CREATE POLICY "Public can read pizza ingredients" ON public.pizza_ingredients FOR SELECT TO public USING (true);
CREATE POLICY "Public can manage pizza ingredients" ON public.pizza_ingredients FOR ALL TO public USING (true);

CREATE POLICY "Public can read customers" ON public.customers FOR SELECT TO public USING (true);
CREATE POLICY "Public can manage customers" ON public.customers FOR ALL TO public USING (true);

CREATE POLICY "Public can read orders" ON public.orders FOR SELECT TO public USING (true);
CREATE POLICY "Public can create orders" ON public.orders FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can update orders" ON public.orders FOR UPDATE TO public USING (true);

CREATE POLICY "Public can read order items" ON public.order_items FOR SELECT TO public USING (true);
CREATE POLICY "Public can manage order items" ON public.order_items FOR ALL TO public USING (true);

-- Create indexes for better performance
CREATE INDEX idx_pizzas_pizzeria_id ON public.pizzas(pizzeria_id);
CREATE INDEX idx_pizzas_is_active ON public.pizzas(is_active);
CREATE INDEX idx_orders_pizzeria_id ON public.orders(pizzeria_id);
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_pizza_id ON public.order_items(pizza_id);
CREATE INDEX idx_customers_phone ON public.customers(phone);
CREATE INDEX idx_pizza_ingredients_pizza_id ON public.pizza_ingredients(pizza_id);

-- Insert default pizzeria
INSERT INTO public.pizzerias (name, subtitle, logo, address, phone, admin_password)
VALUES (
  'PizzaFuturista',
  'A Pizzaria do Futuro',
  '',
  'Rua Futurista, 123 - São Paulo, SP',
  '+5511940704836',
  'gcipione'
);

-- Get pizzeria ID for inserting data
DO $$
DECLARE
  pizzeria_uuid uuid;
BEGIN
  SELECT id INTO pizzeria_uuid FROM public.pizzerias WHERE name = 'PizzaFuturista' LIMIT 1;
  
  -- Insert default ingredients
  INSERT INTO public.ingredients (name, price_addition) VALUES
  ('Mussarela', 0),
  ('Manjericão', 0),
  ('Tomate', 0),
  ('Azeitona', 2),
  ('Orégano', 0),
  ('Pepperoni', 5),
  ('Cogumelos', 3),
  ('Pimentão', 2),
  ('Cebola', 1),
  ('Bacon', 4),
  ('Calabresa', 4),
  ('Queijo Parmesão', 3),
  ('Gorgonzola', 4),
  ('Provolone', 3),
  ('Queijo Vegano', 3),
  ('Milho', 2),
  ('Rúcula', 2),
  ('Abobrinha', 2),
  ('Berinjela', 3);
  
  -- Insert default pizzas
  INSERT INTO public.pizzas (pizzeria_id, name, description, image, price_small, price_medium, price_large)
  VALUES 
    (
      pizzeria_uuid,
      'Margherita Futurista',
      'Molho de tomate artesanal, mussarela premium, manjericão fresco',
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      25.00,
      35.00,
      45.00
    ),
    (
      pizzeria_uuid,
      'Pepperoni Neo',
      'Molho especial, mussarela premium, pepperoni selecionado',
      'https://images.unsplash.com/photo-1574126154517-d1e0d89ef734?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      30.00,
      40.00,
      50.00
    ),
    (
      pizzeria_uuid,
      'Quattro Formaggi Cyber',
      'Molho branco, mussarela, gorgonzola, parmesão, provolone',
      'https://images.unsplash.com/photo-1552539618-7eec9b4d1796?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      35.00,
      45.00,
      55.00
    ),
    (
      pizzeria_uuid,
      'Vegana Neon',
      'Molho de tomate, queijo vegano, cogumelos, pimentões, azeitonas',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      28.00,
      38.00,
      48.00
    );
END $$;

-- Create functions for automatic customer updates
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Update customer stats when new order is created
    UPDATE public.customers 
    SET 
      total_orders = total_orders + 1,
      total_spent = total_spent + NEW.total,
      last_order_at = NEW.created_at,
      updated_at = now()
    WHERE phone = NEW.customer_phone;
    
    -- Create customer if doesn't exist
    INSERT INTO public.customers (name, phone, address, total_orders, total_spent, last_order_at)
    VALUES (NEW.customer_name, NEW.customer_phone, NEW.customer_address, 1, NEW.total, NEW.created_at)
    ON CONFLICT (phone) DO NOTHING;
    
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic customer updates
CREATE TRIGGER trigger_update_customer_stats
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_stats();

-- Create function to automatically update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_pizzerias_updated_at BEFORE UPDATE ON public.pizzerias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pizzas_updated_at BEFORE UPDATE ON public.pizzas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ingredients_updated_at BEFORE UPDATE ON public.ingredients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
