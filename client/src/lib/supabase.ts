import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kpbjgpdiboolqmlbhves.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwYmpncGRpYm9vbHFtbGJodmVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODE0NjMsImV4cCI6MjA4MDE1NzQ2M30.RlwNmYFqTVAP6U5dtx0rBaeGdG-JEX3UwxuDuG3QUP8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper types
export type User = {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
  };
};
