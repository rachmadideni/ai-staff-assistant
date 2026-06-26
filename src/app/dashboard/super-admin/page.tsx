import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { InviteForm } from "./invite-form"

export default async function SuperAdminDashboard() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "super_admin") redirect("/dashboard/client-admin")

  const { data: tenants } = await supabase
    .from("tenants")
    .select("*")
    .order("created_at", { ascending: false })

  const { data: usage } = await supabase
    .from("usage_tracking")
    .select("tenant_id, question_count, escalation_count, month")

  const stats = {
    total_businesses: tenants?.length || 0,
    active_businesses: tenants?.filter((t) => t.is_active).length || 0,
    total_questions: usage?.reduce((s, u) => s + (u.question_count || 0), 0) || 0,
    total_escalations: usage?.reduce((s, u) => s + (u.escalation_count || 0), 0) || 0,
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
        <div className="flex gap-2">
          <Link
            href="/api/auth/logout"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Sign out
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border p-4">
          <p className="text-2xl font-bold">{stats.total_businesses}</p>
          <p className="text-sm text-muted-foreground">Total Businesses</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-2xl font-bold">{stats.active_businesses}</p>
          <p className="text-sm text-muted-foreground">Active</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-2xl font-bold">{stats.total_questions}</p>
          <p className="text-sm text-muted-foreground">Total Questions</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-2xl font-bold">{stats.total_escalations}</p>
          <p className="text-sm text-muted-foreground">Escalations</p>
        </div>
      </div>

      {tenants && tenants.length > 0 && (
        <InviteForm tenants={tenants.map(t => ({ id: t.id, name: t.name }))} />
      )}

      <div>
        <h2 className="text-lg font-semibold mb-3">All Businesses</h2>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Name</th>
                <th className="text-left px-4 py-2 font-medium">Slug</th>
                <th className="text-left px-4 py-2 font-medium">Status</th>
                <th className="text-left px-4 py-2 font-medium">Usage Limit</th>
                <th className="text-left px-4 py-2 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {tenants?.map((tenant) => (
                <tr key={tenant.id} className="border-t">
                  <td className="px-4 py-2">{tenant.name}</td>
                  <td className="px-4 py-2 text-muted-foreground">{tenant.slug}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        tenant.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {tenant.is_active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-2">{tenant.usage_limit_monthly}/mo</td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {new Date(tenant.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {(!tenants || tenants.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No businesses yet. Create your first business to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
