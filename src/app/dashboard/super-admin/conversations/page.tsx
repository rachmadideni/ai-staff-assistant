import Link from "next/link"
import { ConversationLogs } from "../../conversation-logs"

export const dynamic = "force-dynamic"

export default function SuperAdminConversations() {
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

      <ConversationLogs isSuperAdmin />
    </div>
  )
}
