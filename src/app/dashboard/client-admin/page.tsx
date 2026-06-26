import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function ClientAdminDashboard() {
  const supabase = await createServerSupabaseClient()
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
    .limit(10)

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

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{tenant?.name}</h1>
          <p className="text-sm text-muted-foreground">Client Admin Dashboard</p>
        </div>
        <Link
          href="/api/auth/logout"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Sign out
        </Link>
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

      {staffUrl && (
        <div className="rounded-lg border p-4 space-y-2">
          <h2 className="font-semibold">Staff Access Link</h2>
          <p className="text-sm text-muted-foreground break-all">{staffUrl}</p>
          {accessToken?.is_active === false && (
            <p className="text-sm text-destructive">Staff access is disabled</p>
          )}
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Documents</h2>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Filename</th>
                <th className="text-left px-4 py-2 font-medium">Status</th>
                <th className="text-left px-4 py-2 font-medium">Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {documents?.map((doc) => (
                <tr key={doc.id} className="border-t">
                  <td className="px-4 py-2">{doc.filename}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        doc.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : doc.status === "draft"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
