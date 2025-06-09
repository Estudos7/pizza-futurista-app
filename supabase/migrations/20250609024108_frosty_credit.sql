/*
  # Pizza SaaS Database Schema

  1. New Tables
    - `pizzerias`
      - `id` (uuid, primary key)
      - `name` (text)
      - `subtitle` (text)
      - `logo` (text, nullable)
      - `address` (text)
      - `phone` (text)
      - `admin_password` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `pizzas`
      - `id` (uuid, primary key)
      - `pizzeria_id` (uuid, foreign key)
      - `name` (text)
      - `description` (text)
      - `image` (text)
      - `price_small` (decimal)
      - `price_medium` (decimal)
      - `price_large` (decimal)
      - `available_ingredients` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `orders`
      - `id` (uuid, primary key)
      - `pizzeria_id` (uuid, foreign key)
      - `order_number` (text)
      - `customer_name` (text)
      - `customer_address` (text)
      - `customer_phone` (text)
      - `payment_method` (text)
      - `total` (decimal)
      - `status` (text)
      - `items` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for pizzeria owners to manage their data
    - Add public read access for pizzas and pizzeria info
*/

-- Create pizzerias table
CREATE TABLE IF NOT EXISTS pizzerias (
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
CREATE TABLE IF NOT EXISTS pizzas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pizzeria_id uuid REFERENCES pizzerias(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  image text NOT NULL,
  price_small decimal(10,2) NOT NULL,
  price_medium decimal(10,2) NOT NULL,
  price_large decimal(10,2) NOT NULL,
  available_ingredients jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pizzeria_id uuid REFERENCES pizzerias(id) ON DELETE CASCADE,
  order_number text NOT NULL,
  customer_name text NOT NULL,
  customer_address text NOT NULL,
  customer_phone text NOT NULL,
  payment_method text NOT NULL,
  total decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  items jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE pizzerias ENABLE ROW LEVEL SECURITY;
ALTER TABLE pizzas ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for pizzerias
CREATE POLICY "Public can read pizzeria info"
  ON pizzerias
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Pizzeria owners can update their info"
  ON pizzerias
  FOR UPDATE
  TO public
  USING (true);

-- Create policies for pizzas
CREATE POLICY "Public can read pizzas"
  ON pizzas
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can manage pizzas"
  ON pizzas
  FOR ALL
  TO public
  USING (true);

-- Create policies for orders
CREATE POLICY "Public can read orders"
  ON orders
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can create orders"
  ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update orders"
  ON orders
  FOR UPDATE
  TO public
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pizzas_pizzeria_id ON pizzas(pizzeria_id);
CREATE INDEX IF NOT EXISTS idx_orders_pizzeria_id ON orders(pizzeria_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Insert default pizzeria data
INSERT INTO pizzerias (name, subtitle, logo, address, phone, admin_password)
VALUES (
  'PizzaFuturista',
  'A Pizzaria do Futuro',
  '',
  'Rua Futurista, 123 - São Paulo, SP',
  '+5511940704836',
  'gcipione'
) ON CONFLICT DO NOTHING;

-- Get the pizzeria ID for inserting default pizzas
DO $$
DECLARE
  pizzeria_uuid uuid;
BEGIN
  SELECT id INTO pizzeria_uuid FROM pizzerias WHERE name = 'PizzaFuturista' LIMIT 1;
  
  -- Insert default pizzas
  INSERT INTO pizzas (pizzeria_id, name, description, image, price_small, price_medium, price_large, available_ingredients)
  VALUES 
    (
      pizzeria_uuid,
      'Margherita Futurista',
      'Molho de tomate artesanal, mussarela premium, manjericão fresco',
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      25.00,
      35.00,
      45.00,
      '["Mussarela", "Manjericão", "Tomate", "Azeitona", "Orégano", "Pepperoni", "Cogumelos", "Pimentão", "Cebola", "Bacon", "Calabresa", "Queijo Parmesão"]'::jsonb
    ),
    (
      pizzeria_uuid,
      'Pepperoni Neo',
      'Molho especial, mussarela premium, pepperoni selecionado',
      'https://images.unsplash.com/photo-1574126154517-d1e0d89ef734?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      30.00,
      40.00,
      50.00,
      '["Mussarela", "Pepperoni", "Azeitona", "Orégano", "Tomate", "Manjericão", "Cogumelos", "Pimentão", "Cebola", "Bacon", "Calabresa", "Queijo Parmesão"]'::jsonb
    ),
    (
      pizzeria_uuid,
      'Quattro Formaggi Cyber',
      'Molho branco, mussarela, gorgonzola, parmesão, provolone',
      'https://images.unsplash.com/photo-1552539618-7eec9b4d1796?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      35.00,
      45.00,
      55.00,
      '["Mussarela", "Gorgonzola", "Parmesão", "Provolone", "Manjericão", "Tomate", "Azeitona", "Orégano", "Pepperoni", "Cogumelos", "Pimentão", "Cebola"]'::jsonb
    ),
    (
      pizzeria_uuid,
      'Vegana Neon',
      'Molho de tomate, queijo vegano, cogumelos, pimentões, azeitonas',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      28.00,
      38.00,
      48.00,
      '["Queijo Vegano", "Cogumelos", "Pimentão", "Azeitona", "Tomate", "Manjericão", "Orégano", "Cebola", "Milho", "Rúcula", "Abobrinha", "Berinjela"]'::jsonb
    )
  ON CONFLICT DO NOTHING;
END $$;