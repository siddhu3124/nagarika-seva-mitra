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
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string
          table_name: string
          user_agent: string | null
          user_id: string | null
          user_role: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id: string
          table_name: string
          user_agent?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Relationships: []
      }
      citizen_feedback: {
        Row: {
          created_at: string
          district: string | null
          feedback_text: string
          id: string
          location: string | null
          location_details: string | null
          mandal: string | null
          rating: number
          sentiment: string | null
          service_type: string | null
          title: string | null
          updated_at: string
          user_id: string | null
          village: string | null
        }
        Insert: {
          created_at?: string
          district?: string | null
          feedback_text: string
          id?: string
          location?: string | null
          location_details?: string | null
          mandal?: string | null
          rating: number
          sentiment?: string | null
          service_type?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
          village?: string | null
        }
        Update: {
          created_at?: string
          district?: string | null
          feedback_text?: string
          id?: string
          location?: string | null
          location_details?: string | null
          mandal?: string | null
          rating?: number
          sentiment?: string | null
          service_type?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
          village?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "citizen_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      districts: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
          state_id: string | null
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
          state_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
          state_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "districts_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          created_at: string
          department: string
          district: string | null
          employee_id: string
          id: string
          mandal: string | null
          name: string
          phone_number: string | null
          village: string | null
        }
        Insert: {
          created_at?: string
          department: string
          district?: string | null
          employee_id: string
          id?: string
          mandal?: string | null
          name: string
          phone_number?: string | null
          village?: string | null
        }
        Update: {
          created_at?: string
          department?: string
          district?: string | null
          employee_id?: string
          id?: string
          mandal?: string | null
          name?: string
          phone_number?: string | null
          village?: string | null
        }
        Relationships: []
      }
      feedbacks: {
        Row: {
          assigned_official_id: string | null
          citizen_id: string | null
          created_at: string
          description: string
          district: string | null
          id: string
          location_details: string | null
          mandal: string | null
          priority: string | null
          rating: number | null
          resolved_at: string | null
          service_type: string
          status: string
          title: string
          updated_at: string
          village: string | null
        }
        Insert: {
          assigned_official_id?: string | null
          citizen_id?: string | null
          created_at?: string
          description: string
          district?: string | null
          id?: string
          location_details?: string | null
          mandal?: string | null
          priority?: string | null
          rating?: number | null
          resolved_at?: string | null
          service_type: string
          status?: string
          title: string
          updated_at?: string
          village?: string | null
        }
        Update: {
          assigned_official_id?: string | null
          citizen_id?: string | null
          created_at?: string
          description?: string
          district?: string | null
          id?: string
          location_details?: string | null
          mandal?: string | null
          priority?: string | null
          rating?: number | null
          resolved_at?: string | null
          service_type?: string
          status?: string
          title?: string
          updated_at?: string
          village?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedbacks_assigned_official_id_fkey"
            columns: ["assigned_official_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedbacks_citizen_id_fkey"
            columns: ["citizen_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      file_uploads: {
        Row: {
          bucket_name: string
          created_at: string
          feedback_id: string | null
          file_name: string
          file_size: number
          file_type: string
          id: string
          storage_path: string
          user_id: string | null
        }
        Insert: {
          bucket_name?: string
          created_at?: string
          feedback_id?: string | null
          file_name: string
          file_size: number
          file_type: string
          id?: string
          storage_path: string
          user_id?: string | null
        }
        Update: {
          bucket_name?: string
          created_at?: string
          feedback_id?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          storage_path?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "file_uploads_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "feedbacks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_uploads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      mandals: {
        Row: {
          code: string
          created_at: string
          district_id: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          district_id?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          district_id?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "mandals_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          district: string | null
          id: string
          mandal: string | null
          sender_id: string | null
          target_roles: string[]
          title: string
          village: string | null
        }
        Insert: {
          content: string
          created_at?: string
          district?: string | null
          id?: string
          mandal?: string | null
          sender_id?: string | null
          target_roles: string[]
          title: string
          village?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          district?: string | null
          id?: string
          mandal?: string | null
          sender_id?: string | null
          target_roles?: string[]
          title?: string
          village?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          category: string | null
          created_at: string
          data: Json | null
          id: string
          message: string
          read_at: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read_at?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      officials: {
        Row: {
          created_at: string
          department: string
          district: string | null
          employee_id: string
          id: string
          mandal: string | null
          name: string
          phone_number: string
          village: string | null
        }
        Insert: {
          created_at?: string
          department: string
          district?: string | null
          employee_id: string
          id?: string
          mandal?: string | null
          name: string
          phone_number: string
          village?: string | null
        }
        Update: {
          created_at?: string
          department?: string
          district?: string | null
          employee_id?: string
          id?: string
          mandal?: string | null
          name?: string
          phone_number?: string
          village?: string | null
        }
        Relationships: []
      }
      states: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      telangana_locations: {
        Row: {
          created_at: string | null
          district: string
          id: string
          mandal: string
          village: string
        }
        Insert: {
          created_at?: string | null
          district: string
          id?: string
          mandal: string
          village: string
        }
        Update: {
          created_at?: string | null
          district?: string
          id?: string
          mandal?: string
          village?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          age: number | null
          auth_user_id: string | null
          created_at: string
          department: string | null
          district: string | null
          employee_id: string | null
          gender: string | null
          id: string
          locality: string | null
          mandal: string | null
          name: string
          phone_number: string
          role: string
          updated_at: string
          village: string | null
        }
        Insert: {
          age?: number | null
          auth_user_id?: string | null
          created_at?: string
          department?: string | null
          district?: string | null
          employee_id?: string | null
          gender?: string | null
          id?: string
          locality?: string | null
          mandal?: string | null
          name: string
          phone_number: string
          role: string
          updated_at?: string
          village?: string | null
        }
        Update: {
          age?: number | null
          auth_user_id?: string | null
          created_at?: string
          department?: string | null
          district?: string | null
          employee_id?: string | null
          gender?: string | null
          id?: string
          locality?: string | null
          mandal?: string | null
          name?: string
          phone_number?: string
          role?: string
          updated_at?: string
          village?: string | null
        }
        Relationships: []
      }
      villages: {
        Row: {
          code: string
          created_at: string
          id: string
          mandal_id: string | null
          name: string
          population: number | null
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          mandal_id?: string | null
          name: string
          population?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          mandal_id?: string | null
          name?: string
          population?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "villages_mandal_id_fkey"
            columns: ["mandal_id"]
            isOneToOne: false
            referencedRelation: "mandals"
            referencedColumns: ["id"]
          },
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
