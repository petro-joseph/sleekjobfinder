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
      applications: {
        Row: {
          applied_at: string | null
          company: string
          created_at: string
          id: string
          job_id: string | null
          position: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          company: string
          created_at?: string
          id?: string
          job_id?: string | null
          position: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          applied_at?: string | null
          company?: string
          created_at?: string
          id?: string
          job_id?: string | null
          position?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      education: {
        Row: {
          created_at: string
          degree: string
          description: string
          end_date: string
          field_of_study: string
          id: string
          school: string
          start_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          degree: string
          description: string
          end_date: string
          field_of_study: string
          id?: string
          school: string
          start_date: string
          user_id: string
        }
        Update: {
          created_at?: string
          degree?: string
          description?: string
          end_date?: string
          field_of_study?: string
          id?: string
          school?: string
          start_date?: string
          user_id?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          company: string
          created_at: string
          description: string
          end_date: string | null
          id: string
          location: string
          start_date: string
          title: string
          user_id: string
        }
        Insert: {
          company: string
          created_at?: string
          description: string
          end_date?: string | null
          id?: string
          location: string
          start_date: string
          title: string
          user_id: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string
          end_date?: string | null
          id?: string
          location?: string
          start_date?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      job_alerts: {
        Row: {
          created_at: string
          frequency: string
          id: string
          keywords: string[] | null
          location: string | null
          query: string
          user_id: string
        }
        Insert: {
          created_at?: string
          frequency: string
          id?: string
          keywords?: string[] | null
          location?: string | null
          query: string
          user_id: string
        }
        Update: {
          created_at?: string
          frequency?: string
          id?: string
          keywords?: string[] | null
          location?: string | null
          query?: string
          user_id?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          company: string
          created_at: string
          description: string
          featured: boolean | null
          id: string
          industry: string
          location: string
          logo: string | null
          posted_at: string
          requirements: string[]
          salary: string
          tags: string[] | null
          title: string
          type: string
          url: string | null
        }
        Insert: {
          company: string
          created_at?: string
          description: string
          featured?: boolean | null
          id?: string
          industry: string
          location: string
          logo?: string | null
          posted_at?: string
          requirements: string[]
          salary: string
          tags?: string[] | null
          title: string
          type: string
          url?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          description?: string
          featured?: boolean | null
          id?: string
          industry?: string
          location?: string
          logo?: string | null
          posted_at?: string
          requirements?: string[]
          salary?: string
          tags?: string[] | null
          title?: string
          type?: string
          url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          company: string | null
          country: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          is_onboarding_complete: boolean | null
          last_name: string | null
          location: string | null
          onboarding_step: number | null
          phone: string | null
          skills: string[] | null
          state: string | null
          title: string | null
          updated_at: string
          website: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          is_onboarding_complete?: boolean | null
          last_name?: string | null
          location?: string | null
          onboarding_step?: number | null
          phone?: string | null
          skills?: string[] | null
          state?: string | null
          title?: string | null
          updated_at?: string
          website?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          is_onboarding_complete?: boolean | null
          last_name?: string | null
          location?: string | null
          onboarding_step?: number | null
          phone?: string | null
          skills?: string[] | null
          state?: string | null
          title?: string | null
          updated_at?: string
          website?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      resumes: {
        Row: {
          created_at: string
          file_path: string | null
          id: string
          is_primary: boolean | null
          name: string
          updated_at: string
          upload_date: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          file_path?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          updated_at?: string
          upload_date?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          file_path?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          updated_at?: string
          upload_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      saved_jobs: {
        Row: {
          created_at: string
          id: string
          job_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
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
