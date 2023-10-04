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
          eth_address: string | null
          eth_private_key: string | null
          id: string
          usdc_amount: number | null
          username: string | null
        }
        Insert: {
          eth_address?: string | null
          eth_private_key?: string | null
          id: string
          usdc_amount?: number | null
          username?: string | null
        }
        Update: {
          eth_address?: string | null
          eth_private_key?: string | null
          id?: string
          usdc_amount?: number | null
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
          amount: number | null
          from: string | null
          id: string
          timestamp: string | null
          to: string | null
          txHash: string | null
        }
        Insert: {
          amount?: number | null
          from?: string | null
          id?: string
          timestamp?: string | null
          to?: string | null
          txHash?: string | null
        }
        Update: {
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
