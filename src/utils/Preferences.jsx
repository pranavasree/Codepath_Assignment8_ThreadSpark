import { supabase } from "../db/supabaseClient";

export async function getUserPreferences(user_id) {
  const { data, error } = await supabase
    .from("users_preferences")
    .select("*")
    .eq("user_id", user_id)
    .single();
  return { data, error };
}

export async function saveUserPreferences(user_id, preferences) {
  const { data, error } = await supabase
    .from("users_preferences")
    .upsert({ user_id, ...preferences }, { onConflict: "user_id" });
  return { data, error };
}
