import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      alerts: {
        Row: {
          id: string;
          title: string;
          description: string;
          source: string;
          created_at: string;
          severity: 'critical' | 'high' | 'medium' | 'low';
          state: 'open' | 'resolved';
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          source: string;
          created_at?: string;
          severity: 'critical' | 'high' | 'medium' | 'low';
          state?: 'open' | 'resolved';
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          source?: string;
          created_at?: string;
          severity?: 'critical' | 'high' | 'medium' | 'low';
          state?: 'open' | 'resolved';
        };
      };
      settings: {
        Row: {
          id: string;
          require_dual_approval: boolean;
          enable_high_risk_block: boolean;
          send_fraud_alerts: boolean;
          daily_transfer_limit: string;
          auto_freeze_threshold: string;
          default_settlement_rail: 'ACH' | 'SWIFT' | 'Wire';
          updated_at: string;
        };
        Insert: {
          id?: string;
          require_dual_approval?: boolean;
          enable_high_risk_block?: boolean;
          send_fraud_alerts?: boolean;
          daily_transfer_limit?: string;
          auto_freeze_threshold?: string;
          default_settlement_rail?: 'ACH' | 'SWIFT' | 'Wire';
          updated_at?: string;
        };
        Update: {
          id?: string;
          require_dual_approval?: boolean;
          enable_high_risk_block?: boolean;
          send_fraud_alerts?: boolean;
          daily_transfer_limit?: string;
          auto_freeze_threshold?: string;
          default_settlement_rail?: 'ACH' | 'SWIFT' | 'Wire';
          updated_at?: string;
        };
      };
      transfers: {
        Row: {
          id: string;
          sender: string;
          sender_account: string;
          receiver: string;
          receiver_account: string;
          amount: number;
          fee: number;
          currency: string;
          method: string;
          status: 'completed' | 'pending' | 'pending_review' | 'processing' | 'failed' | 'reversed';
          risk: number;
          initiated_by: string;
          initiated_at: string;
          settled_at: string | null;
        };
        Insert: {
          id?: string;
          sender: string;
          sender_account: string;
          receiver: string;
          receiver_account: string;
          amount: number;
          fee: number;
          currency: string;
          method: string;
          status?: 'completed' | 'pending' | 'pending_review' | 'processing' | 'failed' | 'reversed';
          risk: number;
          initiated_by: string;
          initiated_at?: string;
          settled_at?: string | null;
        };
        Update: {
          id?: string;
          sender?: string;
          sender_account?: string;
          receiver?: string;
          receiver_account?: string;
          amount?: number;
          fee?: number;
          currency?: string;
          method?: string;
          status?: 'completed' | 'pending' | 'pending_review' | 'processing' | 'failed' | 'reversed';
          risk?: number;
          initiated_by?: string;
          initiated_at?: string;
          settled_at?: string | null;
        };
      };
    };
  };
}