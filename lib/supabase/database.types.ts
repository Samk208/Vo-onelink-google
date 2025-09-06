export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: string
          avatar: string | null
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: string
          avatar?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: string
          avatar?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          original_price: number | null
          images: string[]
          category: string
          region: string[]
          in_stock: boolean
          stock_count: number
          commission: number
          active: boolean
          supplier_id: string
          created_at: string
          updated_at: string
          sku: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          original_price?: number | null
          images?: string[]
          category: string
          region?: string[]
          in_stock?: boolean
          stock_count?: number
          commission: number
          active?: boolean
          supplier_id: string
          created_at?: string
          updated_at?: string
          sku?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          original_price?: number | null
          images?: string[]
          category?: string
          region?: string[]
          in_stock?: boolean
          stock_count?: number
          commission?: number
          active?: boolean
          supplier_id?: string
          created_at?: string
          updated_at?: string
          sku?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_supplier_id_fkey"
            columns: ["supplier_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          items: Json
          total: number
          status: string
          shipping_address: Json
          billing_address: Json
          payment_method: string
          stripe_payment_intent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          items: Json
          total: number
          status?: string
          shipping_address?: Json
          billing_address?: Json
          payment_method: string
          stripe_payment_intent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          items?: Json
          total?: number
          status?: string
          shipping_address?: Json
          billing_address?: Json
          payment_method?: string
          stripe_payment_intent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      commissions: {
        Row: {
          id: string
          order_id: string
          influencer_id: string | null
          supplier_id: string
          product_id: string
          amount: number
          rate: number
          status: string
          created_at: string
          paid_at: string | null
        }
        Insert: {
          id?: string
          order_id: string
          influencer_id?: string | null
          supplier_id: string
          product_id: string
          amount: number
          rate: number
          status?: string
          created_at?: string
          paid_at?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          influencer_id?: string | null
          supplier_id?: string
          product_id?: string
          amount?: number
          rate?: number
          status?: string
          created_at?: string
          paid_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commissions_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_influencer_id_fkey"
            columns: ["influencer_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_supplier_id_fkey"
            columns: ["supplier_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      influencer_shop_products: {
        Row: {
          id: string
          influencer_id: string
          product_id: string
          sale_price: number | null
          custom_title: string | null
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          influencer_id: string
          product_id: string
          sale_price?: number | null
          custom_title?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          influencer_id?: string
          product_id?: string
          sale_price?: number | null
          custom_title?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "influencer_shop_products_influencer_id_fkey"
            columns: ["influencer_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "influencer_shop_products_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      shops: {
        Row: {
          id: string
          influencer_id: string
          handle: string
          name: string
          description: string | null
          logo: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          influencer_id: string
          handle: string
          name: string
          description?: string | null
          logo?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          influencer_id?: string
          handle?: string
          name?: string
          description?: string | null
          logo?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shops_influencer_id_fkey"
            columns: ["influencer_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      verification_documents: {
        Row: {
          id: string
          request_id: string
          doc_type: string
          storage_path: string
          mime_type: string
          size_bytes: number
          status: string
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          request_id: string
          doc_type: string
          storage_path: string
          mime_type: string
          size_bytes: number
          status?: string
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          doc_type?: string
          storage_path?: string
          mime_type?: string
          size_bytes?: number
          status?: string
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_documents_request_id_fkey"
            columns: ["request_id"]
            referencedRelation: "verification_requests"
            referencedColumns: ["id"]
          }
        ]
      }
      verification_requests: {
        Row: {
          id: string
          user_id: string
          role: string
          status: string
          rejection_reason: string | null
          submitted_at: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: string
          status?: string
          rejection_reason?: string | null
          submitted_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          status?: string
          rejection_reason?: string | null
          submitted_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_requests_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      email_verifications: {
        Row: {
          id: string
          email: string
          token: string
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          token: string
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          token?: string
          expires_at?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_stock: {
        Args: {
          product_id: string
          quantity: number
        }
        Returns: number
      }
    }
    Enums: {
      user_role: "supplier" | "influencer" | "customer" | "admin"
      order_status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
      commission_status: "pending" | "paid" | "disputed"
      verification_status: "draft" | "submitted" | "in_review" | "verified" | "rejected"
      document_type: "identity_card" | "passport" | "drivers_license" | "business_registration" | "tax_certificate" | "bank_statement" | "utility_bill" | "other"
      document_status: "pending" | "verified" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Type helpers
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
