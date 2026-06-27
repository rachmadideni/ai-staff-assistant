import { createClient } from "@supabase/supabase-js"
import crypto from "crypto"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function seed() {
  // Upsert tenants
  const tenants = [
    { id: "00000000-0000-0000-0000-000000000001", name: "Demo Gym", slug: "demo-gym", usage_limit_monthly: 500, is_active: true },
    { id: "00000000-0000-0000-0000-000000000002", name: "Business A", slug: "business-a", usage_limit_monthly: 500, is_active: true },
    { id: "00000000-0000-0000-0000-000000000003", name: "Business B", slug: "business-b", usage_limit_monthly: 500, is_active: false },
  ]

  for (const t of tenants) {
    const { error } = await supabase.from("tenants").upsert(t, { onConflict: "id" })
    if (error) console.error("Tenant error:", error.message)
    else console.log("Tenant:", t.name)
  }

  // Upsert tokens
  const tokens = [
    { tenant_id: "00000000-0000-0000-0000-000000000001", token: "demo-token-abc-123", label: "Default staff access", is_active: true },
    { tenant_id: "00000000-0000-0000-0000-000000000001", token: "demo-token-pin-456", label: "PIN-protected access", is_active: true, pin_code: "1234" },
    { tenant_id: "00000000-0000-0000-0000-000000000001", token: "test-business-token", label: "Test business token", is_active: true },
    { tenant_id: "00000000-0000-0000-0000-000000000002", token: "business-a-token", label: "Business A token", is_active: true },
    { tenant_id: "00000000-0000-0000-0000-000000000003", token: "disabled-business-token", label: "Disabled business token", is_active: false },
    { tenant_id: "00000000-0000-0000-0000-000000000002", token: "client-admin-token-a", label: "Client Admin A token", is_active: true },
    { tenant_id: "00000000-0000-0000-0000-000000000001", token: "super-admin-token", label: "Super admin token", is_active: true },
  ]

  for (const tk of tokens) {
    const { error } = await supabase.from("business_access_tokens").upsert(tk, { onConflict: "token" })
    if (error) console.error("Token error:", error.message)
    else console.log("Token:", tk.label)
  }

  // Upsert usage tracking
  const currentMonth = new Date().toISOString().slice(0, 7)
  const { error: usageError } = await supabase.from("usage_tracking").upsert(
    { tenant_id: "00000000-0000-0000-0000-000000000001", month: currentMonth, question_count: 42, escalation_count: 3, token_count: 15000 },
    { onConflict: "tenant_id,month" }
  )
  if (usageError) console.error("Usage error:", usageError.message)
  else console.log("Usage data inserted")
}

seed().then(() => console.log("Seed complete"))
