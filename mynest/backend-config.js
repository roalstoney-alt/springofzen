/*
 * Public browser configuration for anonymous MyNest pilot inserts.
 * The Supabase anon key is designed to be public. Never place a service-role
 * key here. Database RLS must be enabled with the policy in
 * supabase/migrations/20261004_create_mynest_pilot_events.sql.
 */
window.MYNEST_BACKEND = Object.freeze({
  supabaseUrl: "",
  supabaseAnonKey: ""
});
