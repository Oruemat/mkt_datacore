export interface Database {
  public: {
    Tables: {
      content: {
        Row: {
          id: string;
          task_type: string;
          platform: string | null;
          topic: string;
          copy: string;
          hashtags: string[] | null;
          visual_suggestion: string | null;
          variant_b: string | null;
          brand_verdict: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["content"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["content"]["Row"]>;
      };
      calendar_entries: {
        Row: {
          id: string;
          date: string;
          platform: string;
          format: string;
          pillar: string;
          topic: string;
          time: string;
          content_id: string | null;
          status: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["calendar_entries"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["calendar_entries"]["Row"]>;
      };
      leads: {
        Row: {
          id: string;
          name: string;
          company: string | null;
          role: string | null;
          message: string;
          temperature: string;
          next_step: string | null;
          suggested_message: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["leads"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["leads"]["Row"]>;
      };
      agent_tasks: {
        Row: {
          id: string;
          type: string;
          topic: string;
          platform: string | null;
          status: string;
          steps_json: string | null;
          result_json: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["agent_tasks"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["agent_tasks"]["Row"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
