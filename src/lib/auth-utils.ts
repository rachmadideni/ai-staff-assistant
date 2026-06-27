import { createHmac } from "crypto"
import { createAdminClient } from "./supabase/admin"

export function verifyHmac(authPayload: string): string | null {
  try {
    const parsed = JSON.parse(authPayload)
    const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    const expected = createHmac("sha256", secret).update(parsed.userId).digest("hex")
    if (expected !== parsed.signature) return null
    return parsed.userId
  } catch {
    return null
  }
}

export async function getAuthUser(authPayload?: string) {
  if (!authPayload) return null
  const userId = verifyHmac(authPayload)
  if (!userId) return null
  const admin = createAdminClient()
  const { data: profile } = await admin
    .from("users")
    .select("id, role, tenant_id")
    .eq("id", userId)
    .single()
  if (!profile) return null
  return { user: { id: profile.id }, profile }
}
