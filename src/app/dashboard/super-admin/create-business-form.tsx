"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function CreateBusinessForm() {
  const [name, setName] = useState("")
  const [usageLimit, setUsageLimit] = useState(500)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, usage_limit_monthly: usageLimit }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to create business")
      }

      setName("")
      setUsageLimit(500)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <h2 className="font-semibold">Create New Business</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Business Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="e.g. Acme Corp"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Monthly Question Limit</label>
          <input
            type="number"
            value={usageLimit}
            onChange={(e) => setUsageLimit(Number(e.target.value))}
            min={100}
            max={10000}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Business"}
        </button>
      </form>
    </div>
  )
}
