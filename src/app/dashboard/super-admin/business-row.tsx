"use client"

import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"

interface AccessToken {
  id: string
  token: string
  label: string
  is_active: boolean
}

interface BusinessRowProps {
  tenant: {
    id: string
    name: string
    slug: string
    is_active: boolean
    usage_limit_monthly: number
    created_at: string
  }
  accessToken: AccessToken | null
}

export function BusinessRow({ tenant, accessToken }: BusinessRowProps) {
  const [expanded, setExpanded] = useState(false)
  const [token, setToken] = useState<AccessToken | null>(accessToken)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const staffUrl = token ? `${baseUrl}/staff/${token.token}` : ""

  async function handleAction(action: "enable" | "disable" | "reset") {
    if (!token) return
    setActionLoading(action)

    try {
      await fetch("/api/access-tokens", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token_id: token.id, action }),
      })

      if (action === "reset") {
        const res = await fetch(`/api/access-tokens?tenant_id=${tenant.id}`)
        const data = await res.json()
        const updated = data.access_tokens?.find((t: AccessToken) => t.id === token.id)
        if (updated) setToken(updated)
      } else {
        setToken((prev) => prev ? { ...prev, is_active: action === "enable" } : null)
      }
    } catch {
      alert("Action failed")
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <>
      <tr className="border-t">
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
        <td className="px-4 py-2">
          {token && (
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                token.is_active
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {token.is_active ? "Active" : "Disabled"}
            </span>
          )}
        </td>
        <td className="px-4 py-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-primary hover:underline"
          >
            {expanded ? "Hide" : "Manage"}
          </button>
        </td>
        <td className="px-4 py-2 text-muted-foreground">
          {new Date(tenant.created_at).toLocaleDateString()}
        </td>
      </tr>
      {expanded && token && (
        <tr>
          <td colSpan={7} className="px-4 py-3 bg-muted/30">
            <div className="flex items-start gap-6">
              <div className="bg-white p-2 rounded-lg">
                <QRCodeSVG value={staffUrl} size={120} />
              </div>
              <div className="space-y-2 flex-1">
                <p className="text-xs text-muted-foreground break-all">{staffUrl}</p>
                <div className="flex gap-2">
                  {token.is_active ? (
                    <button
                      onClick={() => handleAction("disable")}
                      disabled={actionLoading !== null}
                      className="rounded-md border border-destructive px-3 py-1 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
                    >
                      {actionLoading === "disable" ? "..." : "Disable"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAction("enable")}
                      disabled={actionLoading !== null}
                      className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    >
                      {actionLoading === "enable" ? "..." : "Enable"}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (confirm("Reset access link? The old link will stop working.")) {
                        handleAction("reset")
                      }
                    }}
                    disabled={actionLoading !== null}
                    className="rounded-md border border-input px-3 py-1 text-xs font-medium hover:bg-accent disabled:opacity-50"
                  >
                    {actionLoading === "reset" ? "..." : "Reset"}
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(staffUrl)}
                    className="rounded-md border border-input px-3 py-1 text-xs font-medium hover:bg-accent"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
