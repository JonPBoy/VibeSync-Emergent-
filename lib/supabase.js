import { createClient } from '@supabase/supabase-js';

let supabase = null;
let databaseReady = false;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    // Silently initialize without database
  }
}

export { supabase };

export const isSupabaseConfigured = () => {
  return supabase !== null;
};

export const setDatabaseReady = (ready) => {
  databaseReady = ready;
};

export const isDatabaseReady = () => {
  return databaseReady;
};