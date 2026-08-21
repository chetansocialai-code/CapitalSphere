import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://capitalsphere_ref.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'capitalsphere_supabase_anon_key_demo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function checkSupabaseConnection() {
  return {
    connected: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
    supabaseUrl,
    status: 'ACTIVE_V2_LIVE'
  };
}
