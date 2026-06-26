export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type UserRole = "super_admin" | "client_admin"

export type DocumentStatus = "draft" | "approved" | "archived"

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          name: string
          slug: string
          settings: Json
          usage_limit_monthly: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          settings?: Json
          usage_limit_monthly?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          settings?: Json
          usage_limit_monthly?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          role: UserRole
          tenant_id: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role: UserRole
          tenant_id?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: UserRole
          tenant_id?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      business_access_tokens: {
        Row: {
          id: string
          tenant_id: string
          token: string
          pin_code: string | null
          label: string
          is_active: boolean
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          token: string
          pin_code?: string | null
          label: string
          is_active?: boolean
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          token?: string
          pin_code?: string | null
          label?: string
          is_active?: boolean
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          tenant_id: string
          filename: string
          file_path: string
          file_type: string
          file_size: number
          status: DocumentStatus
          uploaded_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          filename: string
          file_path: string
          file_type: string
          file_size: number
          status?: DocumentStatus
          uploaded_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          filename?: string
          file_path?: string
          file_type?: string
          file_size?: number
          status?: DocumentStatus
          uploaded_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      document_chunks: {
        Row: {
          id: string
          document_id: string
          tenant_id: string
          content: string
          chunk_index: number
          embedding: string
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          tenant_id: string
          content: string
          chunk_index: number
          embedding: string
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          tenant_id?: string
          content?: string
          chunk_index?: number
          embedding?: string
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          tenant_id: string
          session_id: string
          question: string
          answer: string
          sources: Json
          escalation_flag: boolean
          token_count: number
          model: string
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          session_id: string
          question: string
          answer: string
          sources?: Json
          escalation_flag?: boolean
          token_count?: number
          model?: string
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          session_id?: string
          question?: string
          answer?: string
          sources?: Json
          escalation_flag?: boolean
          token_count?: number
          model?: string
          created_at?: string
        }
      }
      usage_tracking: {
        Row: {
          id: string
          tenant_id: string
          month: string
          question_count: number
          escalation_count: number
          token_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          month: string
          question_count?: number
          escalation_count?: number
          token_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          month?: string
          question_count?: number
          escalation_count?: number
          token_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          tenant_id: string | null
          user_id: string | null
          action: string
          details: Json
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id?: string | null
          user_id?: string | null
          action: string
          details?: Json
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string | null
          user_id?: string | null
          action?: string
          details?: Json
          created_at?: string
        }
      }
    }
    Functions: {
      match_document_chunks: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
          p_tenant_id: string
        }
        Returns: {
          id: string
          document_id: string
          content: string
          similarity: number
        }[]
      }
    }
  }
}
