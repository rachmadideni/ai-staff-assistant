"use client"

import { useState } from "react"

interface Conversation {
  id: string
  tenant_id: string
  session_id: string
  question: string
  answer: string
  sources: string[] | null
  escalation_flag: boolean
  token_count: number
  created_at: string
}

interface Tenant {
  id: string
  name: string
}

interface Props {
  conversations: Conversation[]
  tenants: Tenant[]
  isSuperAdmin?: boolean
  currentTenantId?: string
}

export function ConversationLogs({ conversations, tenants, isSuperAdmin, currentTenantId }: Props) {
  const [filterTenant, setFilterTenant] = useState(isSuperAdmin ? "all" : currentTenantId || "all")
  const [escalationOnly, setEscalationOnly] = useState(false)

  const tenantMap = new Map(tenants.map((t) => [t.id, t.name]))

  const filtered = conversations.filter((c) => {
    if (filterTenant !== "all" && c.tenant_id !== filterTenant) return false
    if (escalationOnly && !c.escalation_flag) return false
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center flex-wrap">
        {isSuperAdmin && (
          <select
            value={filterTenant}
            onChange={(e) => setFilterTenant(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          >
            <option value="all">All Businesses</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        )}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={escalationOnly}
            onChange={(e) => setEscalationOnly(e.target.checked)}
            className="rounded"
          />
          Escalated only
        </label>
        <span className="text-sm text-muted-foreground">
          {filtered.length} conversation(s)
        </span>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              {isSuperAdmin && <th className="text-left px-4 py-2 font-medium">Business</th>}
              <th className="text-left px-4 py-2 font-medium">Question</th>
              <th className="text-left px-4 py-2 font-medium">Answer</th>
              <th className="text-left px-4 py-2 font-medium">Escalated</th>
              <th className="text-left px-4 py-2 font-medium">Tokens</th>
              <th className="text-left px-4 py-2 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t">
                {isSuperAdmin && (
                  <td className="px-4 py-2 text-muted-foreground">
                    {tenantMap.get(c.tenant_id) || "Unknown"}
                  </td>
                )}
                <td className="px-4 py-2 max-w-xs truncate">{c.question}</td>
                <td className="px-4 py-2 max-w-xs truncate">{c.answer}</td>
                <td className="px-4 py-2">
                  {c.escalation_flag ? (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                      Yes
                    </span>
                  ) : (
                    <span className="text-muted-foreground">No</span>
                  )}
                </td>
                <td className="px-4 py-2 text-muted-foreground">{c.token_count}</td>
                <td className="px-4 py-2 text-muted-foreground whitespace-nowrap">
                  {new Date(c.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={isSuperAdmin ? 6 : 5} className="px-4 py-8 text-center text-muted-foreground">
                  No conversations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
