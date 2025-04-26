import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yjveaioomadcplobfmpd.supabase.co"; // replace with your URL
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqdmVhaW9vbWFkY3Bsb2JmbXBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNTAwNDMsImV4cCI6MjA2MDgyNjA0M30.ClNW2z1d1yS_tlbgJ6IEJXwPQmZzF68QOxr3eulEmVM"; // replace with your anon key
export const supabase = createClient(supabaseUrl, supabaseKey);
