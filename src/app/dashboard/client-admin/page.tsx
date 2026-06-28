import { createHmac } from "crypto"
import { createServerComponentClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { StaffAccessCard } from "../staff-access-card"
import { DocumentManager } from "./document-manager"

export default async function ClientAdminDashboard() {
  const supabase = await createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("users")
    .select("role, tenant_id")
    .eq("id", user.id)
    .single()

  if (!profile || profile.role !== "client_admin") redirect("/login")
  if (!profile.tenant_id) redirect("/login")

  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("id", profile.tenant_id)
    .single()

  const { data: accessTokens } = await supabase
    .from("business_access_tokens")
    .select("*")
    .eq("tenant_id", profile.tenant_id)

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("tenant_id", profile.tenant_id)
    .order("created_at", { ascending: false })
    .limit(50)

  const { data: usage } = await supabase
    .from("usage_tracking")
    .select("*")
    .eq("tenant_id", profile.tenant_id)
    .eq("month", new Date().toISOString().slice(0, 7))
    .single()

  const accessToken = accessTokens?.[0]
  const staffUrl = accessToken
    ? `${process.env.NEXT_PUBLIC_APP_URL}/staff/${accessToken.token}`
    : null

  const secret = process.env.HMAC_SECRET || ""
  const signature = createHmac("sha256", secret).update(user.id).digest("hex")
  const authPayload = JSON.stringify({ userId: user.id, signature })

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{tenant?.name}</h1>
          <p className="text-sm text-muted-foreground">Client Admin Dashboard</p>
        </div>
        <div className="flex gap-4 items-center">
          <Link
            href="/dashboard/client-admin/conversations"
            className="text-sm text-primary hover:underline"
          >
            Conversation Logs
          </Link>
          <Link
            href="/api/auth/logout"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Sign out
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-2xl font-bold">{documents?.length || 0}</p>
          <p className="text-sm text-muted-foreground">Documents</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-2xl font-bold">{usage?.question_count || 0}</p>
          <p className="text-sm text-muted-foreground">
            Questions this month / {tenant?.usage_limit_monthly || 500}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-2xl font-bold">{usage?.escalation_count || 0}</p>
          <p className="text-sm text-muted-foreground">Escalations</p>
        </div>
      </div>

      {usage && tenant && (usage.question_count / tenant.usage_limit_monthly) >= 0.8 && (
        <div className="rounded-lg border border-amber-500 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-800">
            Usage Warning: {usage.question_count} of {tenant.usage_limit_monthly} questions used this month (
            {Math.round((usage.question_count / tenant.usage_limit_monthly) * 100)}%).
            {usage.question_count >= tenant.usage_limit_monthly
              ? " Staff questions are now blocked until next month."
              : " Staff may be blocked from asking questions soon."}
          </p>
        </div>
      )}

      {accessToken && (
        <StaffAccessCard accessToken={accessToken} tenantName={tenant?.name || ""} />
      )}

      <div>
        <h2 className="text-lg font-semibold mb-3">Documents</h2>
        <DocumentManager initialDocuments={documents || []} authPayload={authPayload} />
      </div>
    </div>
  )
}
