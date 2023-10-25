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
      balances: {
        Row: {
          account_usdc: number | null
          email: string | null
          eth_address: string | null
          id: string
          invested_usdc: number | null
          uninvest_usdc: number | null
        }
        Insert: {
          account_usdc?: number | null
          email?: string | null
          eth_address?: string | null
          id: string
          invested_usdc?: number | null
          uninvest_usdc?: number | null
        }
        Update: {
          account_usdc?: number | null
          email?: string | null
          eth_address?: string | null
          id?: string
          invested_usdc?: number | null
          uninvest_usdc?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "balances_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      config: {
        Row: {
          id: number
          key: string | null
          value: string | null
        }
        Insert: {
          id?: number
          key?: string | null
          value?: string | null
        }
        Update: {
          id?: number
          key?: string | null
          value?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          action: string | null
          amount: number | null
          from: string | null
          id: string
          timestamp: string | null
          to: string | null
          txHash: string | null
        }
        Insert: {
          action?: string | null
          amount?: number | null
          from?: string | null
          id?: string
          timestamp?: string | null
          to?: string | null
          txHash?: string | null
        }
        Update: {
          action?: string | null
          amount?: number | null
          from?: string | null
          id?: string
          timestamp?: string | null
          to?: string | null
          txHash?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          account_usdc: number | null
          avatar_url: string | null
          email: string | null
          eth_address: string | null
          eth_private_key: string | null
          full_name: string | null
          id: string
          invested_usdc: number | null
          role: string | null
          uninvest_usdc: number | null
        }
        Insert: {
          account_usdc?: number | null
          avatar_url?: string | null
          email?: string | null
          eth_address?: string | null
          eth_private_key?: string | null
          full_name?: string | null
          id: string
          invested_usdc?: number | null
          role?: string | null
          uninvest_usdc?: number | null
        }
        Update: {
          account_usdc?: number | null
          avatar_url?: string | null
          email?: string | null
          eth_address?: string | null
          eth_private_key?: string | null
          full_name?: string | null
          id?: string
          invested_usdc?: number | null
          role?: string | null
          uninvest_usdc?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
