import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://dxlbgiifiesmbreedxhf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4bGJnaWlmaWVzbWJyZWVkeGhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyMTk5NDcsImV4cCI6MjEwMzc5NTk0N30.jQdWep7rYWWa_QCLzyVqAbaCUhaZpf_ETaJL-JS9oFc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

