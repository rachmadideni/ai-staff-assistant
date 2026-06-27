"use client"

import { Fragment, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

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
  isSuperAdmin: boolean
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

function ConversationLogsTable({
  conversations,
  tenants,
  isSuperAdmin,
  currentTenantId,
}: {
  conversations: Conversation[]
  tenants: Tenant[]
  isSuperAdmin: boolean
  currentTenantId?: string
}) {
  const [filterTenant, setFilterTenant] = useState(isSuperAdmin ? "all" : currentTenantId || "all")
  const [escalationOnly, setEscalationOnly] = useState(false)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [search, setSearch] = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)

  const tenantMap = new Map(tenants.map((t) => [t.id, t.name]))

  const filtered = conversations.filter((c) => {
    if (filterTenant !== "all" && c.tenant_id !== filterTenant) return false
    if (escalationOnly && !c.escalation_flag) return false
    if (dateFrom && new Date(c.created_at) < new Date(dateFrom)) return false
    if (dateTo) {
      const end = new Date(dateTo)
      end.setDate(end.getDate() + 1)
      if (new Date(c.created_at) > end) return false
    }
    if (search) {
      const q = search.toLowerCase()
      if (!c.question.toLowerCase().includes(q) && !c.answer.toLowerCase().includes(q)) return false
    }
    return true
  })

  return (
    <>
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
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          title="From date"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          title="To date"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions & answers..."
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm min-w-[200px]"
        />
        <label className="flex items-center gap-2 text-sm whitespace-nowrap">
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
              <th className="text-left px-4 py-2 font-medium">Escalated</th>
              <th className="text-left px-4 py-2 font-medium">Tokens</th>
              <th className="text-left px-4 py-2 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <Fragment key={c.id}>
                <tr
                  className="border-t cursor-pointer hover:bg-muted/50"
                  onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                >
                  {isSuperAdmin && (
                    <td className="px-4 py-2 text-muted-foreground">
                      {tenantMap.get(c.tenant_id) || "Unknown"}
                    </td>
                  )}
                  <td className="px-4 py-2 max-w-xs truncate">{c.question}</td>
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
                    {formatDate(c.created_at)}
                  </td>
                </tr>
                {expanded === c.id && (
                  <tr>
                    <td colSpan={isSuperAdmin ? 5 : 4} className="px-4 py-3 bg-muted/30 space-y-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Question</p>
                        <p className="text-sm whitespace-pre-wrap">{c.question}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Answer</p>
                        <p className="text-sm whitespace-pre-wrap">{c.answer}</p>
                      </div>
                      {c.sources && c.sources.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Sources</p>
                          <ul className="list-disc list-inside text-sm">
                            {c.sources.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Session: {c.session_id} &middot; {formatDate(c.created_at)}
                      </p>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={isSuperAdmin ? 5 : 4} className="px-4 py-8 text-center text-muted-foreground">
                  No conversations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

export function ConversationLogs({ isSuperAdmin }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [tenantName, setTenantName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      let session = (await supabase.auth.getSession()).data.session

      if (!session) {
        await new Promise((r) => setTimeout(r, 300))
        session = (await supabase.auth.getSession()).data.session
      }

      let user = session?.user ?? null
      if (!user) {
        const { data: { user: u } } = await supabase.auth.getUser()
        user = u
      }

      if (!user) {
        router.push("/login")
        return
      }

      const { data: profile } = await supabase
        .from("users")
        .select("role, tenant_id")
        .eq("id", user.id)
        .single()

      if (!profile) {
        router.push("/login")
        return
      }

      if (isSuperAdmin && profile.role !== "super_admin") {
        router.push("/dashboard/client-admin")
        return
      }
      if (!isSuperAdmin && (profile.role !== "client_admin" || !profile.tenant_id)) {
        router.push("/login")
        return
      }

      let convoQuery = supabase
        .from("conversations")
        .select("id, tenant_id, session_id, question, answer, sources, escalation_flag, token_count, created_at")

      if (!isSuperAdmin && profile.tenant_id) {
        convoQuery = convoQuery.eq("tenant_id", profile.tenant_id)
      }

      convoQuery = convoQuery.order("created_at", { ascending: false }).limit(200)

      const [convoResult, tenantResult] = await Promise.all([
        convoQuery,
        isSuperAdmin
          ? supabase.from("tenants").select("id, name").eq("is_active", true).order("name")
          : profile.tenant_id
            ? supabase.from("tenants").select("name").eq("id", profile.tenant_id).single()
            : { data: null },
      ])

      if (cancelled) return

      if (convoResult.data) setConversations(convoResult.data)
      if (tenantResult.data) {
        if (Array.isArray(tenantResult.data)) {
          setTenants(tenantResult.data)
        } else {
          setTenantName(tenantResult.data.name)
          setTenants([{ id: profile.tenant_id!, name: tenantResult.data.name }])
        }
      }

      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [isSuperAdmin, supabase, router])

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading conversations...</p>
  }

  return (
    <div className="space-y-4">
      {tenantName && (
        <p className="text-sm text-muted-foreground">{tenantName}</p>
      )}
      <ConversationLogsTable
        conversations={conversations}
        tenants={tenants}
        isSuperAdmin={isSuperAdmin}
      />
    </div>
  )
}
