import { createClient } from '@supabase/supabase-js';

let supabase = null;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.warn('⚠️ Supabase initialization failed:', error.message);
  }
} else {
  console.warn('⚠️ Supabase credentials not found. Running in fallback mode.');
}

export { supabase };

export const isSupabaseConfigured = () => {
  return supabase !== null;
};