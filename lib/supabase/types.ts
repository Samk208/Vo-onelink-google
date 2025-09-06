export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: string
          avatar?: string
          verified?: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: string
          avatar?: string
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: string
          avatar?: string
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          original_price?: number
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
          sku?: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          original_price?: number
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
          sku?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          original_price?: number
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
          sku?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          items: any
          total: number
          status: string
          shipping_address: any
          billing_address: any
          payment_method: string
          stripe_payment_intent_id?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          items: any
          total: number
          status?: string
          shipping_address?: any
          billing_address?: any
          payment_method: string
          stripe_payment_intent_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          items?: any
          total?: number
          status?: string
          shipping_address?: any
          billing_address?: any
          payment_method?: string
          stripe_payment_intent_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      commissions: {
        Row: {
          id: string
          order_id: string
          influencer_id?: string
          supplier_id: string
          product_id: string
          amount: number
          rate: number
          status: string
          created_at: string
          paid_at?: string
        }
        Insert: {
          id?: string
          order_id: string
          influencer_id?: string
          supplier_id: string
          product_id: string
          amount: number
          rate: number
          status?: string
          created_at?: string
          paid_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          influencer_id?: string
          supplier_id?: string
          product_id?: string
          amount?: number
          rate?: number
          status?: string
          created_at?: string
          paid_at?: string
        }
      }
      influencer_shop_products: {
        Row: {
          id: string
          influencer_id: string
          product_id: string
          sale_price?: number
          custom_title?: string
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          influencer_id: string
          product_id: string
          sale_price?: number
          custom_title?: string
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          influencer_id?: string
          product_id?: string
          sale_price?: number
          custom_title?: string
          published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      shops: {
        Row: {
          id: string
          influencer_id: string
          handle: string
          name: string
          description?: string
          logo?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          influencer_id: string
          handle: string
          name: string
          description?: string
          logo?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          influencer_id?: string
          handle?: string
          name?: string
          description?: string
          logo?: string
          created_at?: string
          updated_at?: string
        }
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
      [_ in never]: never
    }
  }
}
