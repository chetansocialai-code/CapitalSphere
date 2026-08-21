import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://ysxljtksulrtlmijcotr.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Public client (safe for frontend use)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client with full privileges (backend use only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export function checkSupabaseConnection() {
  return {
    connected: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
    projectId: 'ysxljtksulrtlmijcotr',
    supabaseUrl,
    status: supabaseAnonKey ? 'CONNECTED_V2_LIVE' : 'MISSING_CREDENTIALS'
  };
}
