-- Seed data for development and integration tests

-- ─── Tenants ──────────────────────────────────────────────────────────

INSERT INTO tenants (id, name, slug, settings, usage_limit_monthly, is_active)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Demo Gym', 'demo-gym', '{}', 500, true),
  ('00000000-0000-0000-0000-000000000002', 'Business A', 'business-a', '{}', 500, true),
  ('00000000-0000-0000-0000-000000000003', 'Business B', 'business-b', '{}', 500, true)
ON CONFLICT (slug) DO NOTHING;

-- ─── Business Access Tokens ───────────────────────────────────────────

INSERT INTO business_access_tokens (tenant_id, token, label, is_active, expires_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'demo-token-abc-123', 'Default staff access', true, NULL),
  ('00000000-0000-0000-0000-000000000001', 'demo-token-pin-456', 'PIN-protected access', true, NULL),
  ('00000000-0000-0000-0000-000000000001', 'test-business-token', 'Test business token', true, NULL),
  ('00000000-0000-0000-0000-000000000002', 'business-a-token', 'Business A token', true, NULL),
  ('00000000-0000-0000-0000-000000000003', 'disabled-business-token', 'Disabled business token', false, NULL)
ON CONFLICT (token) DO NOTHING;

-- ─── Users (auth trigger auto-creates — these are for reference) ──────

-- Super admin and client admin users must be created via Supabase Auth UI
-- or API, then the trigger auto-creates the public.users row.
-- After that, update roles and tenant assignments:
--   UPDATE public.users SET role = 'super_admin' WHERE email = 'admin@example.com';
--   UPDATE public.users SET role = 'client_admin', tenant_id = '...' WHERE email = 'client@business-a.com';
-- The test tokens below are pre-inserted so admin clients can query docs.

INSERT INTO business_access_tokens (tenant_id, token, label, is_active)
VALUES
  ('00000000-0000-0000-0000-000000000002', 'client-admin-token-a', 'Client Admin A token', true),
  ('00000000-0000-0000-0000-000000000001', 'super-admin-token', 'Super admin token', true)
ON CONFLICT (token) DO NOTHING;

-- ─── Documents (approved) ─────────────────────────────────────────────
-- Documents require a valid uploaded_by user_id. Create test users via
-- the auth API / signup, then the trigger populates the public.users row.
-- After that, documents and chunks can be inserted with the real user id.

-- ─── Document Chunks (for vector search) ──────────────────────────────
-- Real embeddings are generated at ingestion time via the document upload API.
-- Without real embeddings, vector search returns no matches, so the assistant
-- correctly falls back to "can't find an approved answer" escalation.
-- Documents are seeded above so they exist for reference/counts.

-- ─── Usage Tracking (demo data) ───────────────────────────────────────

INSERT INTO usage_tracking (tenant_id, month, question_count, escalation_count, token_count)
VALUES
  ('00000000-0000-0000-0000-000000000001', '2026-06', 42, 3, 15000),
  ('00000000-0000-0000-0000-000000000002', '2026-06', 18, 1, 6200)
ON CONFLICT (id) DO NOTHING;
