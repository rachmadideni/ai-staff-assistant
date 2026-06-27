import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ConversationLogs } from "../../conversation-logs"

export const dynamic = "force-dynamic"

export default async function SuperAdminConversations() {
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
    .select("id, name")
    .eq("is_active", true)
    .order("name")

  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, tenant_id, session_id, question, answer, sources, escalation_flag, token_count, created_at")
    .order("created_at", { ascending: false })
    .limit(200)

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Conversation Logs</h1>
        <Link
          href="/dashboard/super-admin"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Back to Dashboard
        </Link>
      </div>

      <ConversationLogs
        conversations={conversations || []}
        tenants={tenants || []}
        isSuperAdmin
      />
    </div>
  )
}
