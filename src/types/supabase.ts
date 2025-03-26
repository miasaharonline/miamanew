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
      ai_configurations: {
        Row: {
          auto_pause_on_human: boolean
          created_at: string
          id: string
          max_tokens: number
          model: string
          response_delay: number
          show_typing_indicator: boolean
          system_prompt: string
          temperature: number
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_pause_on_human?: boolean
          created_at?: string
          id?: string
          max_tokens?: number
          model?: string
          response_delay?: number
          show_typing_indicator?: boolean
          system_prompt?: string
          temperature?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_pause_on_human?: boolean
          created_at?: string
          id?: string
          max_tokens?: number
          model?: string
          response_delay?: number
          show_typing_indicator?: boolean
          system_prompt?: string
          temperature?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conversation_stats: {
        Row: {
          created_at: string
          date: string
          events_created: number
          id: string
          messages_processed: number
          total_conversations: number
          updated_at: string
          user_id: string
          voice_notes_transcribed: number
        }
        Insert: {
          created_at?: string
          date: string
          events_created?: number
          id?: string
          messages_processed?: number
          total_conversations?: number
          updated_at?: string
          user_id: string
          voice_notes_transcribed?: number
        }
        Update: {
          created_at?: string
          date?: string
          events_created?: number
          id?: string
          messages_processed?: number
          total_conversations?: number
          updated_at?: string
          user_id?: string
          voice_notes_transcribed?: number
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string | null
          chat_id: string
          chat_name: string | null
          created_at: string
          from_number: string
          id: string
          is_from_me: boolean
          media_type: string | null
          message_id: string
          timestamp: string
        }
        Insert: {
          body?: string | null
          chat_id: string
          chat_name?: string | null
          created_at?: string
          from_number: string
          id?: string
          is_from_me?: boolean
          media_type?: string | null
          message_id: string
          timestamp: string
        }
        Update: {
          body?: string | null
          chat_id?: string
          chat_name?: string | null
          created_at?: string
          from_number?: string
          id?: string
          is_from_me?: boolean
          media_type?: string | null
          message_id?: string
          timestamp?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          image: string | null
          name: string | null
          token_identifier: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          image?: string | null
          name?: string | null
          token_identifier: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          image?: string | null
          name?: string | null
          token_identifier?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      whatsapp_accounts: {
        Row: {
          account_name: string
          created_at: string
          id: string
          is_active: boolean
          last_connected: string | null
          phone_number: string | null
          user_id: string
        }
        Insert: {
          account_name: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_connected?: string | null
          phone_number?: string | null
          user_id: string
        }
        Update: {
          account_name?: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_connected?: string | null
          phone_number?: string | null
          user_id?: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
