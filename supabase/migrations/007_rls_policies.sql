-- ═══════════════════════════════════════════════════════════════════════
-- RLS POLICIES — Multi-tenant data isolation
-- Super admin: sees all rows across all tenants
-- Client admin: sees only their own tenant's rows
-- Staff (anonymous via token): limited read-only via SECURITY DEFINER functions
-- ═══════════════════════════════════════════════════════════════════════

-- Helper: get the current user's role
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT role::TEXT FROM public.users WHERE id = auth.uid()
  );
END;
$$;

-- Helper: get the current user's tenant_id
CREATE OR REPLACE FUNCTION get_current_user_tenant_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT tenant_id FROM public.users WHERE id = auth.uid()
  );
END;
$$;

-- ─── TENANTS ──────────────────────────────────────────────────────────

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all_tenants"
  ON tenants FOR ALL
  USING (get_current_user_role() = 'super_admin')
  WITH CHECK (get_current_user_role() = 'super_admin');

CREATE POLICY "client_admin_own_tenant"
  ON tenants FOR SELECT
  USING (
    get_current_user_role() = 'client_admin'
    AND id = get_current_user_tenant_id()
  );

-- ─── USERS ────────────────────────────────────────────────────────────

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all_users"
  ON users FOR ALL
  USING (get_current_user_role() = 'super_admin')
  WITH CHECK (get_current_user_role() = 'super_admin');

CREATE POLICY "client_admin_own_tenant_users"
  ON users FOR SELECT
  USING (
    get_current_user_role() = 'client_admin'
    AND tenant_id = get_current_user_tenant_id()
  );

CREATE POLICY "users_view_self"
  ON users FOR SELECT
  USING (id = auth.uid());

-- ─── BUSINESS ACCESS TOKENS ──────────────────────────────────────────

ALTER TABLE business_access_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all_tokens"
  ON business_access_tokens FOR ALL
  USING (get_current_user_role() = 'super_admin')
  WITH CHECK (get_current_user_role() = 'super_admin');

CREATE POLICY "client_admin_own_tenant_tokens"
  ON business_access_tokens FOR ALL
  USING (
    get_current_user_role() = 'client_admin'
    AND tenant_id = get_current_user_tenant_id()
  )
  WITH CHECK (
    get_current_user_role() = 'client_admin'
    AND tenant_id = get_current_user_tenant_id()
  );

-- ─── DOCUMENTS ────────────────────────────────────────────────────────

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all_documents"
  ON documents FOR ALL
  USING (get_current_user_role() = 'super_admin')
  WITH CHECK (get_current_user_role() = 'super_admin');

CREATE POLICY "client_admin_own_tenant_documents"
  ON documents FOR ALL
  USING (
    get_current_user_role() = 'client_admin'
    AND tenant_id = get_current_user_tenant_id()
  )
  WITH CHECK (
    get_current_user_role() = 'client_admin'
    AND tenant_id = get_current_user_tenant_id()
  );

-- ─── DOCUMENT CHUNKS ─────────────────────────────────────────────────

ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all_chunks"
  ON document_chunks FOR ALL
  USING (get_current_user_role() = 'super_admin')
  WITH CHECK (get_current_user_role() = 'super_admin');

CREATE POLICY "client_admin_own_tenant_chunks"
  ON document_chunks FOR ALL
  USING (
    get_current_user_role() = 'client_admin'
    AND tenant_id = get_current_user_tenant_id()
  )
  WITH CHECK (
    get_current_user_role() = 'client_admin'
    AND tenant_id = get_current_user_tenant_id()
  );

-- ─── CONVERSATIONS ───────────────────────────────────────────────────

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all_conversations"
  ON conversations FOR ALL
  USING (get_current_user_role() = 'super_admin')
  WITH CHECK (get_current_user_role() = 'super_admin');

CREATE POLICY "client_admin_own_tenant_conversations"
  ON conversations FOR SELECT
  USING (
    get_current_user_role() = 'client_admin'
    AND tenant_id = get_current_user_tenant_id()
  );

-- ─── USAGE TRACKING ──────────────────────────────────────────────────

ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all_usage"
  ON usage_tracking FOR ALL
  USING (get_current_user_role() = 'super_admin')
  WITH CHECK (get_current_user_role() = 'super_admin');

CREATE POLICY "client_admin_own_tenant_usage"
  ON usage_tracking FOR SELECT
  USING (
    get_current_user_role() = 'client_admin'
    AND tenant_id = get_current_user_tenant_id()
  );

-- ─── AUDIT LOGS ──────────────────────────────────────────────────────

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_all_audit_logs"
  ON audit_logs FOR ALL
  USING (get_current_user_role() = 'super_admin')
  WITH CHECK (get_current_user_role() = 'super_admin');

CREATE POLICY "client_admin_own_tenant_audit_logs"
  ON audit_logs FOR SELECT
  USING (
    get_current_user_role() = 'client_admin'
    AND tenant_id = get_current_user_tenant_id()
  );

-- ═══════════════════════════════════════════════════════════════════════
-- STORAGE RLS
-- ═══════════════════════════════════════════════════════════════════════

-- Documents bucket (created manually or via API)
-- Policy: only authenticated admin users can upload/read
CREATE POLICY "admin_documents_storage_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents'
    AND auth.role() = 'authenticated'
    AND (
      get_current_user_role() = 'super_admin'
      OR (
        get_current_user_role() = 'client_admin'
        AND (storage.foldername(name))[1] = get_current_user_tenant_id()::TEXT
      )
    )
  );

CREATE POLICY "admin_documents_storage_select"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents'
    AND (
      auth.role() = 'authenticated'
      OR get_current_user_role() IN ('super_admin', 'client_admin')
    )
  );

CREATE POLICY "admin_documents_storage_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'documents'
    AND auth.role() = 'authenticated'
    AND (
      get_current_user_role() = 'super_admin'
      OR (
        get_current_user_role() = 'client_admin'
        AND (storage.foldername(name))[1] = get_current_user_tenant_id()::TEXT
      )
    )
  );
