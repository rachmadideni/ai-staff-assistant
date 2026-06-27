import { createServerComponentClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ConversationLogs } from "../../conversation-logs"

export const dynamic = "force-dynamic"

export default async function ClientAdminConversations() {
  const supabase = await createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("users")
    .select("role, tenant_id")
    .eq("id", user.id)
    .single()

  if (!profile || profile.role !== "client_admin" || !profile.tenant_id) redirect("/login")

  const { data: tenant } = await supabase
    .from("tenants")
    .select("name")
    .eq("id", profile.tenant_id)
    .single()

  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, tenant_id, session_id, question, answer, sources, escalation_flag, token_count, created_at")
    .eq("tenant_id", profile.tenant_id)
    .order("created_at", { ascending: false })
    .limit(200)

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Conversation Logs</h1>
        <Link
          href="/dashboard/client-admin"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Back to Dashboard
        </Link>
      </div>

      <p className="text-sm text-muted-foreground">{tenant?.name}</p>

      <ConversationLogs
        conversations={conversations || []}
        tenants={tenant ? [{ id: profile.tenant_id, name: tenant.name }] : []}
        currentTenantId={profile.tenant_id}
      />
    </div>
  )
}
