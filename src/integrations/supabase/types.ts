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
      carousel_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      company_info: {
        Row: {
          created_at: string
          id: string
          logo_url: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_promotions: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          message: string | null
          product_id: string
          sent_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          message?: string | null
          product_id: string
          sent_at?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          message?: string | null
          product_id?: string
          sent_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_promotions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_promotions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          id: string
          last_promotion: string | null
          name: string
          phone: string
          received_promotions: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_promotion?: string | null
          name: string
          phone: string
          received_promotions?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_promotion?: string | null
          name?: string
          phone?: string
          received_promotions?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string | null
          customer_address: string
          customer_name: string
          customer_phone: string
          id: string
          items: Json
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
          customer_name: string
          customer_phone: string
          id?: string
          items: Json
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
          customer_name?: string
          customer_phone?: string
          id?: string
          items?: Json
          order_number?: string
          payment_method?: string
          pizzeria_id?: string | null
          status?: string
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_pizzeria_id_fkey"
            columns: ["pizzeria_id"]
            isOneToOne: false
            referencedRelation: "pizzerias"
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
      products: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string
          name: string
          regular_price: number
          sale_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          name: string
          regular_price: number
          sale_price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          name?: string
          regular_price?: number
          sale_price?: number
          updated_at?: string
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
