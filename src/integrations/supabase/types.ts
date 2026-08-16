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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      availability: {
        Row: {
          care_partner_id: string
          created_at: string
          date: string
          end_time: string
          id: string
          is_available: boolean
          start_time: string
        }
        Insert: {
          care_partner_id: string
          created_at?: string
          date: string
          end_time: string
          id?: string
          is_available?: boolean
          start_time: string
        }
        Update: {
          care_partner_id?: string
          created_at?: string
          date?: string
          end_time?: string
          id?: string
          is_available?: boolean
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_care_partner_id_fkey"
            columns: ["care_partner_id"]
            isOneToOne: false
            referencedRelation: "care_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          address: string
          cancel_reason: string | null
          cancelled_by: string | null
          care_partner_id: string
          created_at: string
          customer_id: string
          date: string
          duration_hours: number
          end_time: string
          hourly_rate: number
          id: string
          instructions: string | null
          slot: unknown
          start_time: string
          status: Database["public"]["Enums"]["booking_status"]
          terms_accepted: boolean
          total_amount: number
          updated_at: string
        }
        Insert: {
          address: string
          cancel_reason?: string | null
          cancelled_by?: string | null
          care_partner_id: string
          created_at?: string
          customer_id: string
          date: string
          duration_hours: number
          end_time: string
          hourly_rate: number
          id?: string
          instructions?: string | null
          slot?: unknown
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"]
          terms_accepted?: boolean
          total_amount: number
          updated_at?: string
        }
        Update: {
          address?: string
          cancel_reason?: string | null
          cancelled_by?: string | null
          care_partner_id?: string
          created_at?: string
          customer_id?: string
          date?: string
          duration_hours?: number
          end_time?: string
          hourly_rate?: number
          id?: string
          instructions?: string | null
          slot?: unknown
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"]
          terms_accepted?: boolean
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_cancelled_by_fkey"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_care_partner_id_fkey"
            columns: ["care_partner_id"]
            isOneToOne: false
            referencedRelation: "care_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      care_partner_tasks: {
        Row: {
          care_partner_id: string
          care_task_id: string
        }
        Insert: {
          care_partner_id: string
          care_task_id: string
        }
        Update: {
          care_partner_id?: string
          care_task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "care_partner_tasks_care_partner_id_fkey"
            columns: ["care_partner_id"]
            isOneToOne: false
            referencedRelation: "care_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_partner_tasks_care_task_id_fkey"
            columns: ["care_task_id"]
            isOneToOne: false
            referencedRelation: "care_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      care_partners: {
        Row: {
          admin_notes: string | null
          approval_status: Database["public"]["Enums"]["approval_status"]
          bio: string
          created_at: string
          experience_years: number
          hourly_rate: number
          id: string
          languages: string
          profile_id: string
          service_area: string
          training_status: Database["public"]["Enums"]["training_status"]
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          admin_notes?: string | null
          approval_status?: Database["public"]["Enums"]["approval_status"]
          bio?: string
          created_at?: string
          experience_years?: number
          hourly_rate?: number
          id?: string
          languages?: string
          profile_id: string
          service_area?: string
          training_status?: Database["public"]["Enums"]["training_status"]
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          admin_notes?: string | null
          approval_status?: Database["public"]["Enums"]["approval_status"]
          bio?: string
          created_at?: string
          experience_years?: number
          hourly_rate?: number
          id?: string
          languages?: string
          profile_id?: string
          service_area?: string
          training_status?: Database["public"]["Enums"]["training_status"]
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "care_partners_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      care_tasks: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      complaints: {
        Row: {
          against_user: string | null
          booking_id: string | null
          created_at: string
          description: string
          id: string
          reported_by: string
          resolution: string | null
          status: Database["public"]["Enums"]["complaint_status"]
        }
        Insert: {
          against_user?: string | null
          booking_id?: string | null
          created_at?: string
          description: string
          id?: string
          reported_by: string
          resolution?: string | null
          status?: Database["public"]["Enums"]["complaint_status"]
        }
        Update: {
          against_user?: string | null
          booking_id?: string | null
          created_at?: string
          description?: string
          id?: string
          reported_by?: string
          resolution?: string | null
          status?: Database["public"]["Enums"]["complaint_status"]
        }
        Relationships: [
          {
            foreignKeyName: "complaints_against_user_fkey"
            columns: ["against_user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          currency: string
          default_hourly_rate: number
          id: number
          max_duration_hours: number
          min_duration_hours: number
          updated_at: string
        }
        Insert: {
          currency?: string
          default_hourly_rate?: number
          id?: number
          max_duration_hours?: number
          min_duration_hours?: number
          updated_at?: string
        }
        Update: {
          currency?: string
          default_hourly_rate?: number
          id?: number
          max_duration_hours?: number
          min_duration_hours?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string
          care_partner_id: string
          comment: string | null
          created_at: string
          customer_id: string
          id: string
          rating: number
        }
        Insert: {
          booking_id: string
          care_partner_id: string
          comment?: string | null
          created_at?: string
          customer_id: string
          id?: string
          rating: number
        }
        Update: {
          booking_id?: string
          care_partner_id?: string
          comment?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_care_partner_id_fkey"
            columns: ["care_partner_id"]
            isOneToOne: false
            referencedRelation: "care_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      training_records: {
        Row: {
          care_partner_id: string
          completed_at: string | null
          created_at: string
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["record_status"]
          training_name: string
        }
        Insert: {
          care_partner_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          training_name: string
        }
        Update: {
          care_partner_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          training_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_records_care_partner_id_fkey"
            columns: ["care_partner_id"]
            isOneToOne: false
            referencedRelation: "care_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      verification_records: {
        Row: {
          care_partner_id: string
          created_at: string
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["record_status"]
          verification_type: string
          verified_at: string | null
        }
        Insert: {
          care_partner_id: string
          created_at?: string
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          verification_type: string
          verified_at?: string | null
        }
        Update: {
          care_partner_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["record_status"]
          verification_type?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_records_care_partner_id_fkey"
            columns: ["care_partner_id"]
            isOneToOne: false
            referencedRelation: "care_partners"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "customer" | "care_partner" | "admin"
      approval_status: "not_submitted" | "pending" | "approved" | "rejected"
      booking_status:
        | "pending"
        | "accepted"
        | "rejected"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
      complaint_status: "open" | "investigating" | "resolved" | "dismissed"
      record_status: "pending" | "in_progress" | "completed" | "failed"
      training_status: "not_started" | "in_progress" | "completed"
      verification_status: "pending" | "in_review" | "verified" | "rejected"
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
    Enums: {
      app_role: ["customer", "care_partner", "admin"],
      approval_status: ["not_submitted", "pending", "approved", "rejected"],
      booking_status: [
        "pending",
        "accepted",
        "rejected",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
      ],
      complaint_status: ["open", "investigating", "resolved", "dismissed"],
      record_status: ["pending", "in_progress", "completed", "failed"],
      training_status: ["not_started", "in_progress", "completed"],
      verification_status: ["pending", "in_review", "verified", "rejected"],
    },
  },
} as const
