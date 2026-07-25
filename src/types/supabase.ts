/**
 * Hand-written to match supabase/migrations/000{2,3,4,5}_*.sql.
 *
 * Once a real Supabase project is linked, regenerate this file instead of
 * hand-editing it:
 *   npx supabase gen types typescript --linked > src/types/supabase.ts
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
        Relationships: [];
      };
      domain_events: {
        Row: {
          id: string;
          user_id: string;
          event_type: string;
          entity_type: string | null;
          entity_id: string | null;
          payload: Json;
          occurred_at: string;
          processed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_type: string;
          entity_type?: string | null;
          entity_id?: string | null;
          payload?: Json;
          occurred_at?: string;
          processed_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['domain_events']['Insert']>;
        Relationships: [];
      };
      capture_inbox: {
        Row: {
          id: string;
          user_id: string;
          raw_content: string;
          status: 'untriaged' | 'triaged' | 'discarded';
          ai_suggested_type: string | null;
          ai_suggested_target: Json | null;
          triaged_into_type: string | null;
          triaged_into_id: string | null;
          captured_at: string;
          triaged_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          raw_content: string;
          status?: 'untriaged' | 'triaged' | 'discarded';
          ai_suggested_type?: string | null;
          ai_suggested_target?: Json | null;
          triaged_into_type?: string | null;
          triaged_into_id?: string | null;
          captured_at?: string;
          triaged_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['capture_inbox']['Insert']>;
        Relationships: [];
      };
      ai_memories: {
        Row: {
          id: string;
          user_id: string;
          type: 'fact' | 'preference' | 'pattern';
          content: string;
          embedding: number[] | null;
          embedding_provider: string | null;
          embedded_at: string | null;
          confidence: number;
          source_event_id: string | null;
          reinforced_count: number;
          last_reinforced_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'fact' | 'preference' | 'pattern';
          content: string;
          embedding?: number[] | null;
          embedding_provider?: string | null;
          embedded_at?: string | null;
          confidence?: number;
          source_event_id?: string | null;
          reinforced_count?: number;
          last_reinforced_at?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['ai_memories']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
