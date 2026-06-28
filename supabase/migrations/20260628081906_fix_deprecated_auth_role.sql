-- Fix deprecated auth.role() in storage policies
-- auth.role() is deprecated and breaks silently when anonymous sign-ins are enabled
-- Replace with TO authenticated clause

-- Drop existing policies
DROP POLICY IF EXISTS "admin_documents_storage_insert" ON storage.objects;
DROP POLICY IF EXISTS "admin_documents_storage_select" ON storage.objects;
DROP POLICY IF EXISTS "admin_documents_storage_delete" ON storage.objects;

-- Recreate INSERT policy with TO authenticated
CREATE POLICY "admin_documents_storage_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents'
    AND (
      get_current_user_role() = 'super_admin'
      OR (
        get_current_user_role() = 'client_admin'
        AND (storage.foldername(name))[1] = get_current_user_tenant_id()::TEXT
      )
    )
  );

-- Recreate SELECT policy with TO authenticated and tenant scoping
CREATE POLICY "admin_documents_storage_select"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documents'
    AND (
      get_current_user_role() = 'super_admin'
      OR (
        get_current_user_role() = 'client_admin'
        AND (storage.foldername(name))[1] = get_current_user_tenant_id()::TEXT
      )
    )
  );

-- Recreate DELETE policy with TO authenticated
CREATE POLICY "admin_documents_storage_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'documents'
    AND (
      get_current_user_role() = 'super_admin'
      OR (
        get_current_user_role() = 'client_admin'
        AND (storage.foldername(name))[1] = get_current_user_tenant_id()::TEXT
      )
    )
  );
