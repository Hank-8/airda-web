import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = "https://apncpvvgvysgtjrvnxbw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwbmNwdnZndnlzZ3RqcnZueGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NzMzNjIsImV4cCI6MjA5MjE0OTM2Mn0.5sElk1V01SZs1umKEO4lS-Or-0OnfOkeePw5MPlrvo4";

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
