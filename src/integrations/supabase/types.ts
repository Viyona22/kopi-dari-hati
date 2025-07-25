export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          category: string
          created_at: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          id: string
          new_data: Json | null
          old_data: Json | null
          operation: string
          table_name: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          operation: string
          table_name: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          operation?: string
          table_name?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          display_name: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name: string
          id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          customer_email: string
          id: string
          menu_item_id: string
        }
        Insert: {
          created_at?: string | null
          customer_email: string
          id?: string
          menu_item_id: string
        }
        Update: {
          created_at?: string | null
          customer_email?: string
          id?: string
          menu_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_analytics: {
        Row: {
          average_rating: number | null
          id: string
          last_updated: string | null
          menu_item_id: string
          total_favorites: number | null
          total_orders: number | null
          total_reviews: number | null
        }
        Insert: {
          average_rating?: number | null
          id?: string
          last_updated?: string | null
          menu_item_id: string
          total_favorites?: number | null
          total_orders?: number | null
          total_reviews?: number | null
        }
        Update: {
          average_rating?: number | null
          id?: string
          last_updated?: string | null
          menu_item_id?: string
          total_favorites?: number | null
          total_orders?: number | null
          total_reviews?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_analytics_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: true
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          badge_type: string | null
          category: string
          created_at: string | null
          description: string | null
          id: string
          image: string | null
          is_featured: boolean | null
          name: string
          price: number
          sort_order: number | null
          stock_quantity: number | null
          updated_at: string | null
        }
        Insert: {
          badge_type?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          is_featured?: boolean | null
          name: string
          price: number
          sort_order?: number | null
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Update: {
          badge_type?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          is_featured?: boolean | null
          name?: string
          price?: number
          sort_order?: number | null
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_menu_items_category"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_proofs: {
        Row: {
          id: string
          notes: string | null
          proof_image_url: string
          purchase_id: string
          status: string
          uploaded_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          id?: string
          notes?: string | null
          proof_image_url: string
          purchase_id: string
          status?: string
          uploaded_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          id?: string
          notes?: string | null
          proof_image_url?: string
          purchase_id?: string
          status?: string
          uploaded_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      purchases: {
        Row: {
          created_at: string | null
          customer_address: string | null
          customer_name: string
          customer_phone: string
          id: string
          order_items: Json
          payment_deadline: string | null
          payment_method: string
          payment_proof_id: string | null
          payment_status: string | null
          status: string
          total_amount: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_address?: string | null
          customer_name: string
          customer_phone: string
          id?: string
          order_items: Json
          payment_deadline?: string | null
          payment_method: string
          payment_proof_id?: string | null
          payment_status?: string | null
          status?: string
          total_amount: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_address?: string | null
          customer_name?: string
          customer_phone?: string
          id?: string
          order_items?: Json
          payment_deadline?: string | null
          payment_method?: string
          payment_proof_id?: string | null
          payment_status?: string | null
          status?: string
          total_amount?: number
          user_id?: string | null
        }
        Relationships: []
      }
      reservations: {
        Row: {
          created_at: string | null
          date: string
          email: string | null
          guests: number
          id: string
          name: string
          phone: string | null
          special_requests: string | null
          status: string
          time: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          email?: string | null
          guests: number
          id: string
          name: string
          phone?: string | null
          special_requests?: string | null
          status: string
          time: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          email?: string | null
          guests?: number
          id?: string
          name?: string
          phone?: string | null
          special_requests?: string | null
          status?: string
          time?: string
          user_id?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          customer_email: string | null
          customer_name: string
          id: string
          menu_item_id: string
          rating: number
          updated_at: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name: string
          id?: string
          menu_item_id: string
          rating: number
          updated_at?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string
          id?: string
          menu_item_id?: string
          rating?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      dashboard_metrics: {
        Row: {
          month_orders: number | null
          month_revenue: number | null
          period: string | null
          today_orders: number | null
          today_revenue: number | null
          week_orders: number | null
          week_revenue: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_menu_analytics: {
        Args: { item_id: string }
        Returns: {
          total_favorites: number
          total_reviews: number
          average_rating: number
          total_orders: number
        }[]
      }
      check_reservation_availability: {
        Args: {
          reservation_date: string
          reservation_time: string
          guest_count: number
        }
        Returns: boolean
      }
      delete_purchase_safely: {
        Args: { purchase_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      refresh_dashboard_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "customer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "customer"],
    },
  },
} as const
