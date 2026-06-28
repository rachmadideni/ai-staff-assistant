-- Restrict SECURITY DEFINER function access
-- Revoke PUBLIC EXECUTE to prevent brute-force attacks
-- Grant only to specific roles needed for Supabase RPC calls

-- verify_access_pin: used by staff to verify PIN (anon role)
REVOKE EXECUTE ON FUNCTION verify_access_pin FROM PUBLIC;
GRANT EXECUTE ON FUNCTION verify_access_pin TO anon;

-- validate_access_token: used by staff to validate access tokens (anon role)
REVOKE EXECUTE ON FUNCTION validate_access_token FROM PUBLIC;
GRANT EXECUTE ON FUNCTION validate_access_token TO anon;

-- match_document_chunks: used server-side only by chat API (restrict to authenticated)
REVOKE EXECUTE ON FUNCTION match_document_chunks FROM PUBLIC;
GRANT EXECUTE ON FUNCTION match_document_chunks TO authenticated;

-- get_current_user_role: used in RLS policies (needs to be callable by all roles in policy context)
-- Keep as-is since RLS policies execute in a special context

-- get_current_user_tenant_id: used in RLS policies (needs to be callable by all roles in policy context)
-- Keep as-is since RLS policies execute in a special context
