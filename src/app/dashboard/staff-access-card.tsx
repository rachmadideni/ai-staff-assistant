"use client"

import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"

interface AccessToken {
  id: string
  tenant_id: string
  token: string
  label: string
  is_active: boolean
  pin_code: string | null
  expires_at: string | null
  created_at: string
}

interface StaffAccessCardProps {
  accessToken: AccessToken
  tenantName: string
}

export function StaffAccessCard({ accessToken, tenantName }: StaffAccessCardProps) {
  const [token, setToken] = useState(accessToken)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false)

  const baseUrl = typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL || ""

  const staffUrl = `${baseUrl}/staff/${token.token}`

  async function handleAction(action: "enable" | "disable" | "reset") {
    setActionLoading(action)
    setShowResetConfirm(false)
    setShowRevokeConfirm(false)

    try {
      const res = await fetch("/api/access-tokens", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token_id: token.id, action }),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || "Action failed")
        return
      }

      if (action === "reset") {
        const listRes = await fetch(`/api/access-tokens?tenant_id=${token.tenant_id || ""}`)
        const listData = await listRes.json()
        const updated = listData.access_tokens?.find((t: AccessToken) => t.id === token.id)
        if (updated) setToken(updated)
      } else {
        setToken((prev) => ({ ...prev, is_active: action === "enable" }))
      }
    } catch {
      alert("Network error. Please try again.")
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="rounded-lg border p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-semibold">Staff Access</h2>
          <p className="text-xs text-muted-foreground">{token.label}</p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            token.is_active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {token.is_active ? "Active" : "Disabled"}
        </span>
      </div>

      <div className="flex justify-center">
        <div className="bg-white p-2 rounded-lg inline-block">
          <QRCodeSVG value={staffUrl} size={160} />
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-xs text-muted-foreground break-all">{staffUrl}</p>
        <button
          onClick={() => navigator.clipboard.writeText(staffUrl)}
          className="text-xs text-primary hover:underline"
        >
          Copy link
        </button>
      </div>

      <div className="flex gap-2">
        {token.is_active ? (
          <button
            onClick={() => setShowRevokeConfirm(true)}
            disabled={actionLoading !== null}
            className="flex-1 rounded-md border border-destructive px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
          >
            {actionLoading === "disable" ? "Disabling..." : "Disable"}
          </button>
        ) : (
          <button
            onClick={() => handleAction("enable")}
            disabled={actionLoading !== null}
            className="flex-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {actionLoading === "enable" ? "Enabling..." : "Enable"}
          </button>
        )}
        <button
          onClick={() => setShowResetConfirm(true)}
          disabled={actionLoading !== null}
          className="flex-1 rounded-md border border-input px-3 py-1.5 text-xs font-medium hover:bg-accent disabled:opacity-50"
        >
          {actionLoading === "reset" ? "Resetting..." : "Reset"}
        </button>
      </div>

      {showRevokeConfirm && (
        <div className="rounded-lg border border-destructive bg-destructive/5 p-3 space-y-2">
          <p className="text-sm font-medium">Disable staff access?</p>
          <p className="text-xs text-muted-foreground">
            Staff will no longer be able to use this access link.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleAction("disable")}
              className="rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:bg-destructive/90"
            >
              Confirm Disable
            </button>
            <button
              onClick={() => setShowRevokeConfirm(false)}
              className="rounded-md border border-input px-3 py-1.5 text-xs font-medium hover:bg-accent"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showResetConfirm && (
        <div className="rounded-lg border border-amber-500 bg-amber-50 p-3 space-y-2">
          <p className="text-sm font-medium">Reset access link?</p>
          <p className="text-xs text-muted-foreground">
            A new link will be generated. The old link will stop working. You will need to redistribute the new link to staff.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleAction("reset")}
              className="rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700"
            >
              Confirm Reset
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="rounded-md border border-input px-3 py-1.5 text-xs font-medium hover:bg-accent"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
