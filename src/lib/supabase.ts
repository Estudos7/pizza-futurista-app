
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Mock client for development when Supabase is not configured
const createMockClient = () => ({
  from: () => ({
    select: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    update: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    delete: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    eq: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }),
    limit: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }),
    order: () => Promise.resolve({ data: [], error: null }),
    single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
  })
});

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      pizzerias: {
        Row: {
          id: string;
          name: string;
          subtitle: string;
          logo: string | null;
          address: string;
          phone: string;
          admin_password: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          subtitle: string;
          logo?: string | null;
          address: string;
          phone: string;
          admin_password?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          subtitle?: string;
          logo?: string | null;
          address?: string;
          phone?: string;
          admin_password?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      pizzas: {
        Row: {
          id: string;
          pizzeria_id: string;
          name: string;
          description: string;
          image: string;
          price_small: number;
          price_medium: number;
          price_large: number;
          available_ingredients: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pizzeria_id: string;
          name: string;
          description: string;
          image: string;
          price_small: number;
          price_medium: number;
          price_large: number;
          available_ingredients?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          pizzeria_id?: string;
          name?: string;
          description?: string;
          image?: string;
          price_small?: number;
          price_medium?: number;
          price_large?: number;
          available_ingredients?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          pizzeria_id: string;
          order_number: string;
          customer_name: string;
          customer_address: string;
          customer_phone: string;
          payment_method: string;
          total: number;
          status: string;
          items: any[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pizzeria_id: string;
          order_number: string;
          customer_name: string;
          customer_address: string;
          customer_phone: string;
          payment_method: string;
          total: number;
          status?: string;
          items: any[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          pizzeria_id?: string;
          order_number?: string;
          customer_name?: string;
          customer_address?: string;
          customer_phone?: string;
          payment_method?: string;
          total?: number;
          status?: string;
          items?: any[];
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
