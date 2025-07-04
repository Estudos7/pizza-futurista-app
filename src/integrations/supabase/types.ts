export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          address: string | null
          created_at: string | null
          id: string
          last_order_at: string | null
          name: string
          phone: string
          total_orders: number | null
          total_spent: number | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          id?: string
          last_order_at?: string | null
          name: string
          phone: string
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          id?: string
          last_order_at?: string | null
          name?: string
          phone?: string
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ingredients: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          price_addition: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price_addition?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_addition?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          custom_ingredients: Json | null
          id: string
          is_custom: boolean | null
          order_id: string | null
          pizza_id: string | null
          pizza_name: string
          quantity: number
          size: string
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          custom_ingredients?: Json | null
          id?: string
          is_custom?: boolean | null
          order_id?: string | null
          pizza_id?: string | null
          pizza_name: string
          quantity?: number
          size: string
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          custom_ingredients?: Json | null
          id?: string
          is_custom?: boolean | null
          order_id?: string | null
          pizza_id?: string | null
          pizza_name?: string
          quantity?: number
          size?: string
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_pizza_id_fkey"
            columns: ["pizza_id"]
            isOneToOne: false
            referencedRelation: "pizzas"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          customer_address: string
          customer_id: string | null
          customer_name: string
          customer_phone: string
          delivery_fee: number | null
          estimated_delivery_time: string | null
          id: string
          items: Json
          notes: string | null
          order_number: string
          payment_method: string
          pizzeria_id: string | null
          status: string
          total: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_address: string
          customer_id?: string | null
          customer_name: string
          customer_phone: string
          delivery_fee?: number | null
          estimated_delivery_time?: string | null
          id?: string
          items: Json
          notes?: string | null
          order_number: string
          payment_method: string
          pizzeria_id?: string | null
          status?: string
          total: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_address?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string
          delivery_fee?: number | null
          estimated_delivery_time?: string | null
          id?: string
          items?: Json
          notes?: string | null
          order_number?: string
          payment_method?: string
          pizzeria_id?: string | null
          status?: string
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_pizzeria_id_fkey"
            columns: ["pizzeria_id"]
            isOneToOne: false
            referencedRelation: "pizzerias"
            referencedColumns: ["id"]
          },
        ]
      }
      pizza_ingredients: {
        Row: {
          id: string
          ingredient_id: string | null
          is_included: boolean | null
          pizza_id: string | null
        }
        Insert: {
          id?: string
          ingredient_id?: string | null
          is_included?: boolean | null
          pizza_id?: string | null
        }
        Update: {
          id?: string
          ingredient_id?: string | null
          is_included?: boolean | null
          pizza_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pizza_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pizza_ingredients_pizza_id_fkey"
            columns: ["pizza_id"]
            isOneToOne: false
            referencedRelation: "pizzas"
            referencedColumns: ["id"]
          },
        ]
      }
      pizzas: {
        Row: {
          available_ingredients: Json | null
          created_at: string | null
          description: string
          id: string
          image: string
          is_active: boolean | null
          name: string
          pizzeria_id: string | null
          price_large: number
          price_medium: number
          price_small: number
          updated_at: string | null
        }
        Insert: {
          available_ingredients?: Json | null
          created_at?: string | null
          description: string
          id?: string
          image: string
          is_active?: boolean | null
          name: string
          pizzeria_id?: string | null
          price_large: number
          price_medium: number
          price_small: number
          updated_at?: string | null
        }
        Update: {
          available_ingredients?: Json | null
          created_at?: string | null
          description?: string
          id?: string
          image?: string
          is_active?: boolean | null
          name?: string
          pizzeria_id?: string | null
          price_large?: number
          price_medium?: number
          price_small?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pizzas_pizzeria_id_fkey"
            columns: ["pizzeria_id"]
            isOneToOne: false
            referencedRelation: "pizzerias"
            referencedColumns: ["id"]
          },
        ]
      }
      pizzerias: {
        Row: {
          address: string
          admin_password: string
          created_at: string | null
          id: string
          logo: string | null
          name: string
          phone: string
          subtitle: string
          updated_at: string | null
        }
        Insert: {
          address: string
          admin_password?: string
          created_at?: string | null
          id?: string
          logo?: string | null
          name: string
          phone: string
          subtitle: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          admin_password?: string
          created_at?: string | null
          id?: string
          logo?: string | null
          name?: string
          phone?: string
          subtitle?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
