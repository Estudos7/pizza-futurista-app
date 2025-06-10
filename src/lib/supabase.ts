
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Mock client for development when Supabase is not configured
const createMockClient = () => ({
  from: (table: string) => {
    const mockQuery = {
      select: (columns?: string) => ({
        ...mockQuery,
        then: (resolve: any) => resolve({ data: [], error: null })
      }),
      insert: (data: any) => ({
        ...mockQuery,
        then: (resolve: any) => resolve({ data: null, error: null })
      }),
      update: (data: any) => ({
        ...mockQuery,
        then: (resolve: any) => resolve({ data: null, error: null })
      }),
      delete: () => ({
        ...mockQuery,
        then: (resolve: any) => resolve({ data: null, error: null })
      }),
      eq: (column: string, value: any) => ({
        ...mockQuery,
        then: (resolve: any) => resolve({ data: null, error: null })
      }),
      limit: (count: number) => ({
        ...mockQuery,
        then: (resolve: any) => resolve({ data: [], error: null })
      }),
      order: (column: string, options?: any) => ({
        ...mockQuery,
        then: (resolve: any) => resolve({ data: [], error: null })
      }),
      single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
    };
    
    return mockQuery;
  }
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
