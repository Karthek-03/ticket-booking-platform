import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rsvzwjfjnsktpkgsbadd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdnp3amZqbnNrdHBrZ3NiYWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2Mzg2NjUsImV4cCI6MjEwMjIxNDY2NX0.ZPw-6BElftSfCkiQhHEKyIvTPCvtU-Iz7EehHrYpSWk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
