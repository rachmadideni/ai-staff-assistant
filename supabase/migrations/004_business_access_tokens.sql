-- Business access tokens (anonymous staff access, no individual accounts)
CREATE TABLE IF NOT EXISTS business_access_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  pin_code TEXT,
  label TEXT NOT NULL DEFAULT 'Staff access',
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_business_access_tokens_tenant ON business_access_tokens(tenant_id);
CREATE INDEX idx_business_access_tokens_token ON business_access_tokens(token);
CREATE INDEX idx_business_access_tokens_active ON business_access_tokens(is_active);

CREATE TRIGGER business_access_tokens_updated_at
  BEFORE UPDATE ON business_access_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to validate access token and return business info
CREATE OR REPLACE FUNCTION validate_access_token(p_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'valid', true,
    'business_name', t.name,
    'tenant_id', t.id,
    'requires_pin', bat.pin_code IS NOT NULL
  ) INTO result
  FROM business_access_tokens bat
  JOIN tenants t ON t.id = bat.tenant_id
  WHERE bat.token = p_token
    AND bat.is_active = true
    AND (bat.expires_at IS NULL OR bat.expires_at > now())
    AND t.is_active = true;

  IF result IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Invalid or expired access link');
  END IF;

  RETURN result;
END;
$$;

-- Function to verify PIN
CREATE OR REPLACE FUNCTION verify_access_pin(p_token TEXT, p_pin TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'valid', bat.pin_code = p_pin,
    'business_name', t.name
  ) INTO result
  FROM business_access_tokens bat
  JOIN tenants t ON t.id = bat.tenant_id
  WHERE bat.token = p_token
    AND bat.is_active = true
    AND t.is_active = true;

  IF result IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Token not found');
  END IF;

  RETURN result;
END;
$$;
