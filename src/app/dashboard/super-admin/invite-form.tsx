"use client"

import { useState } from "react"

export function InviteForm({ tenants, authPayload }: { tenants: { id: string; name: string }[]; authPayload: string }) {
  const [email, setEmail] = useState("")
  const [tenantId, setTenantId] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)

    try {
      const res = await fetch("/api/auth/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tenant_id: tenantId, authPayload }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to invite user")
        setLoading(false)
        return
      }

      setMessage(`Invitation email sent to ${email}`)
      setEmail("")
      setTenantId("")
    } catch {
      setError("Network error. Please try again.")
    }

    setLoading(false)
  }

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <h2 className="font-semibold">Invite Client Admin</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="admin@business.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Business</label>
          <select
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          >
            <option value="">Select a business...</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {message && <p className="text-sm text-green-600 break-all">{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Inviting..." : "Send Invitation"}
        </button>
      </form>
    </div>
  )
}
