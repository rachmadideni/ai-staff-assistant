-- Seed data for development

-- Create a test tenant
INSERT INTO tenants (id, name, slug, usage_limit_monthly)
VALUES ('00000000-0000-0000-0000-000000000001', 'Demo Gym', 'demo-gym', 500)
ON CONFLICT (slug) DO NOTHING;

-- Create a test access token
INSERT INTO business_access_tokens (tenant_id, token, label)
VALUES ('00000000-0000-0000-0000-000000000001', 'demo-token-abc-123', 'Default staff access')
ON CONFLICT (token) DO NOTHING;

-- Create a test access token with PIN
INSERT INTO business_access_tokens (tenant_id, token, pin_code, label)
VALUES ('00000000-0000-0000-0000-000000000001', 'demo-token-pin-456', '1234', 'PIN-protected access')
ON CONFLICT (token) DO NOTHING;

-- Note: Super admin user must be created via Supabase Auth UI or API first,
-- then the trigger will auto-create the public.users row.
-- After that, update the role:
-- UPDATE public.users SET role = 'super_admin' WHERE email = 'admin@example.com';
