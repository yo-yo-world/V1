window.APP_CONFIG = {
  SUPABASE_URL: "https://tnxaybkqyffrnhrrxocc.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRueGF5YmtxeWZmcm5ocnJ4b2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMjk5NTMsImV4cCI6MjA4OTkwNTk1M30.J_E9kyP9xswFvlayAJ2qMq5Wa0rsn87oTT0pw1ydy_8"
};

let _supabaseClient;
function getSupabase() {
  if (_supabaseClient) return _supabaseClient;
  if (!window.supabase) {
    throw new Error("Supabase SDK is not loaded.");
  }
  _supabaseClient = window.supabase.createClient(
    window.APP_CONFIG.SUPABASE_URL,
    window.APP_CONFIG.SUPABASE_ANON_KEY
  );
  return _supabaseClient;
}
