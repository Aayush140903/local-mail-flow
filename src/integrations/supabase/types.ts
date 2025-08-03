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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      automation_triggers: {
        Row: {
          campaign_id: string
          created_at: string
          id: string
          is_active: boolean
          trigger_conditions: Json
          trigger_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          trigger_conditions?: Json
          trigger_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          trigger_conditions?: Json
          trigger_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      campaign_analytics: {
        Row: {
          bounce_rate: number | null
          campaign_id: string
          click_rate: number | null
          created_at: string
          id: string
          open_rate: number | null
          recorded_at: string
          total_bounced: number | null
          total_clicked: number | null
          total_delivered: number | null
          total_opened: number | null
          total_sent: number | null
          total_unsubscribed: number | null
          unsubscribe_rate: number | null
          updated_at: string
          user_id: string
          variant_id: string | null
        }
        Insert: {
          bounce_rate?: number | null
          campaign_id: string
          click_rate?: number | null
          created_at?: string
          id?: string
          open_rate?: number | null
          recorded_at?: string
          total_bounced?: number | null
          total_clicked?: number | null
          total_delivered?: number | null
          total_opened?: number | null
          total_sent?: number | null
          total_unsubscribed?: number | null
          unsubscribe_rate?: number | null
          updated_at?: string
          user_id: string
          variant_id?: string | null
        }
        Update: {
          bounce_rate?: number | null
          campaign_id?: string
          click_rate?: number | null
          created_at?: string
          id?: string
          open_rate?: number | null
          recorded_at?: string
          total_bounced?: number | null
          total_clicked?: number | null
          total_delivered?: number | null
          total_opened?: number | null
          total_sent?: number | null
          total_unsubscribed?: number | null
          unsubscribe_rate?: number | null
          updated_at?: string
          user_id?: string
          variant_id?: string | null
        }
        Relationships: []
      }
      campaign_emails: {
        Row: {
          campaign_id: string
          content: string
          created_at: string
          delay_days: number
          delay_hours: number
          id: string
          is_active: boolean
          name: string
          sequence_order: number
          subject_line: string
          updated_at: string
          user_id: string
        }
        Insert: {
          campaign_id: string
          content: string
          created_at?: string
          delay_days?: number
          delay_hours?: number
          id?: string
          is_active?: boolean
          name: string
          sequence_order?: number
          subject_line: string
          updated_at?: string
          user_id: string
        }
        Update: {
          campaign_id?: string
          content?: string
          created_at?: string
          delay_days?: number
          delay_hours?: number
          id?: string
          is_active?: boolean
          name?: string
          sequence_order?: number
          subject_line?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      campaign_variants: {
        Row: {
          campaign_id: string
          content: string | null
          created_at: string
          from_name: string | null
          id: string
          is_winner: boolean | null
          name: string
          subject_line: string | null
          traffic_percentage: number
          updated_at: string
          user_id: string
          variant_type: string
        }
        Insert: {
          campaign_id: string
          content?: string | null
          created_at?: string
          from_name?: string | null
          id?: string
          is_winner?: boolean | null
          name: string
          subject_line?: string | null
          traffic_percentage?: number
          updated_at?: string
          user_id: string
          variant_type?: string
        }
        Update: {
          campaign_id?: string
          content?: string | null
          created_at?: string
          from_name?: string | null
          id?: string
          is_winner?: boolean | null
          name?: string
          subject_line?: string | null
          traffic_percentage?: number
          updated_at?: string
          user_id?: string
          variant_type?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          completed_at: string | null
          contact_list_id: string | null
          created_at: string
          description: string | null
          from_email: string | null
          from_name: string | null
          id: string
          name: string
          preheader: string | null
          reply_to_email: string | null
          scheduled_at: string | null
          segment_id: string | null
          settings: Json | null
          started_at: string | null
          status: string
          subject_line: string | null
          template_id: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          contact_list_id?: string | null
          created_at?: string
          description?: string | null
          from_email?: string | null
          from_name?: string | null
          id?: string
          name: string
          preheader?: string | null
          reply_to_email?: string | null
          scheduled_at?: string | null
          segment_id?: string | null
          settings?: Json | null
          started_at?: string | null
          status?: string
          subject_line?: string | null
          template_id?: string | null
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          contact_list_id?: string | null
          created_at?: string
          description?: string | null
          from_email?: string | null
          from_name?: string | null
          id?: string
          name?: string
          preheader?: string | null
          reply_to_email?: string | null
          scheduled_at?: string | null
          segment_id?: string | null
          settings?: Json | null
          started_at?: string | null
          status?: string
          subject_line?: string | null
          template_id?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contact_list_memberships: {
        Row: {
          added_at: string
          contact_id: string
          id: string
          list_id: string
        }
        Insert: {
          added_at?: string
          contact_id: string
          id?: string
          list_id: string
        }
        Update: {
          added_at?: string
          contact_id?: string
          id?: string
          list_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_list_memberships_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_list_memberships_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "contact_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_lists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          company: string | null
          consent_date: string | null
          consent_status: string | null
          created_at: string
          custom_fields: Json | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          source: string | null
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company?: string | null
          consent_date?: string | null
          consent_status?: string | null
          created_at?: string
          custom_fields?: Json | null
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          source?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string | null
          consent_date?: string | null
          consent_status?: string | null
          created_at?: string
          custom_fields?: Json | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          source?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      gdpr_requests: {
        Row: {
          completed_at: string | null
          contact_email: string
          data_export_url: string | null
          id: string
          request_type: string
          requested_at: string
          status: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          contact_email: string
          data_export_url?: string | null
          id?: string
          request_type: string
          requested_at?: string
          status?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          contact_email?: string
          data_export_url?: string | null
          id?: string
          request_type?: string
          requested_at?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string
          display_name: string | null
          id: string
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      segments: {
        Row: {
          contact_count: number | null
          created_at: string
          criteria: Json
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_count?: number | null
          created_at?: string
          criteria: Json
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_count?: number | null
          created_at?: string
          criteria?: Json
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
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
