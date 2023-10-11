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
      profiles: {
        Row: {
          account_usdc: number | null
          eth_address: string | null
          eth_private_key: string | null
          id: string
          invested_usdc: number | null
          uninvest_usdc: number | null
          username: string | null
        }
        Insert: {
          account_usdc?: number | null
          eth_address?: string | null
          eth_private_key?: string | null
          id: string
          invested_usdc?: number | null
          uninvest_usdc?: number | null
          username?: string | null
        }
        Update: {
          account_usdc?: number | null
          eth_address?: string | null
          eth_private_key?: string | null
          id?: string
          invested_usdc?: number | null
          uninvest_usdc?: number | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
