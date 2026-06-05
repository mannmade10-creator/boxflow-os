import { createClient } from "@supabase/supabase-js";

export const cannaSupabase = createClient(
  process.env.NEXT_PUBLIC_CANNAFLOW_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_CANNAFLOW_SUPABASE_ANON_KEY!
);