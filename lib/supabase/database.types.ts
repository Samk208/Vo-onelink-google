export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      brand_details: {
        Row: {
          business_type: string
          company_name: string
          created_at: string | null
          description: string | null
          id: string
          industry: string
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          business_type: string
          company_name: string
          created_at?: string | null
          description?: string | null
          id?: string
          industry: string
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          business_type?: string
          company_name?: string
          created_at?: string | null
          description?: string | null
          id?: string
          industry?: string
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      commissions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          influencer_id: string
          order_id: string
          paid_at: string | null
          product_id: string
          rate: number
          status: string
          supplier_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          influencer_id: string
          order_id: string
          paid_at?: string | null
          product_id: string
          rate: number
          status?: string
          supplier_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          influencer_id?: string
          order_id?: string
          paid_at?: string | null
          product_id?: string
          rate?: number
          status?: string
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      email_verifications: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string
          id: string
          token: string
          updated_at: string | null
          user_id: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          token: string
          updated_at?: string | null
          user_id: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          token?: string
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      influencer_payouts: {
        Row: {
          account_no_encrypted: string
          bank_holder: string
          bank_name: string
          country: string
          created_at: string | null
          iban_encrypted: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_no_encrypted: string
          bank_holder: string
          bank_name: string
          country: string
          created_at?: string | null
          iban_encrypted?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_no_encrypted?: string
          bank_holder?: string
          bank_name?: string
          country?: string
          created_at?: string | null
          iban_encrypted?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          billing_address: Json
          created_at: string | null
          customer_id: string
          id: string
          items: Json
          payment_method: string
          shipping_address: Json
          status: string
          stripe_payment_intent_id: string | null
          total: number
          updated_at: string | null
        }
        Insert: {
          billing_address: Json
          created_at?: string | null
          customer_id: string
          id?: string
          items: Json
          payment_method: string
          shipping_address: Json
          status?: string
          stripe_payment_intent_id?: string | null
          total: number
          updated_at?: string | null
        }
        Update: {
          billing_address?: Json
          created_at?: string | null
          customer_id?: string
          id?: string
          items?: Json
          payment_method?: string
          shipping_address?: Json
          status?: string
          stripe_payment_intent_id?: string | null
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          category: string
          commission: number
          created_at: string | null
          description: string
          id: string
          images: string[]
          in_stock: boolean | null
          original_price: number | null
          price: number
          region: string[]
          sku: string | null
          stock_count: number | null
          supplier_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          category: string
          commission: number
          created_at?: string | null
          description: string
          id?: string
          images?: string[]
          in_stock?: boolean | null
          original_price?: number | null
          price: number
          region?: string[]
          sku?: string | null
          stock_count?: number | null
          supplier_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          category?: string
          commission?: number
          created_at?: string | null
          description?: string
          id?: string
          images?: string[]
          in_stock?: boolean | null
          original_price?: number | null
          price?: number
          region?: string[]
          sku?: string | null
          stock_count?: number | null
          supplier_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          country: string | null
          created_at: string | null
          handle: string | null
          id: string
          language: string | null
          phone: string | null
          role: string
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          country?: string | null
          created_at?: string | null
          handle?: string | null
          id: string
          language?: string | null
          phone?: string | null
          role: string
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          country?: string | null
          created_at?: string | null
          handle?: string | null
          id?: string
          language?: string | null
          phone?: string | null
          role?: string
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      shops: {
        Row: {
          active: boolean | null
          banner: string | null
          created_at: string | null
          description: string | null
          handle: string
          id: string
          influencer_id: string
          logo: string | null
          name: string
          products: string[] | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          banner?: string | null
          created_at?: string | null
          description?: string | null
          handle: string
          id?: string
          influencer_id: string
          logo?: string | null
          name: string
          products?: string[] | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          banner?: string | null
          created_at?: string | null
          description?: string | null
          handle?: string
          id?: string
          influencer_id?: string
          logo?: string | null
          name?: string
          products?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shops_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          role: string
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          role: string
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      verification_documents: {
        Row: {
          created_at: string | null
          doc_type: string
          id: string
          mime_type: string
          original_filename: string
          rejection_reason: string | null
          request_id: string
          size_bytes: number
          status: string
          storage_path: string
          updated_at: string | null
          virus_scan_status: string | null
        }
        Insert: {
          created_at?: string | null
          doc_type: string
          id?: string
          mime_type: string
          original_filename: string
          rejection_reason?: string | null
          request_id: string
          size_bytes: number
          status?: string
          storage_path: string
          updated_at?: string | null
          virus_scan_status?: string | null
        }
        Update: {
          created_at?: string | null
          doc_type?: string
          id?: string
          mime_type?: string
          original_filename?: string
          rejection_reason?: string | null
          request_id?: string
          size_bytes?: number
          status?: string
          storage_path?: string
          updated_at?: string | null
          virus_scan_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_documents_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "verification_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_requests: {
        Row: {
          created_at: string | null
          id: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          role: string
          status: string
          submitted_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          role: string
          status?: string
          submitted_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          role?: string
          status?: string
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_email_verifications: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
