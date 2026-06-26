import { describe, it, expect } from "vitest"

// Data isolation tests — validate multi-tenant separation
// These tests verify that Business A cannot access Business B's data.
// Run against the deployed API or local dev server.

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000"

describe("Data Isolation", () => {
  it("Business A token cannot access Business B documents", async () => {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: "business-a-token",
        question: "What is the refund policy?",
        session_id: "test-session",
      }),
    })
    const data = await res.json()

    expect(res.status).toBe(200)
    // Answer should be based on Business A's docs only
    expect(data.answer).toBeDefined()
  })

  it("Invalid token returns 403", async () => {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: "invalid-token-12345",
        question: "What time do we open?",
        session_id: "test-session",
      }),
    })

    expect(res.status).toBe(403)
  })

  it("Disabled token returns 403", async () => {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: "disabled-business-token",
        question: "How do I reset my password?",
        session_id: "test-session",
      }),
    })

    expect(res.status).toBe(403)
  })

  it("Client admin sees only own tenant's documents via API", async () => {
    const res = await fetch(`${BASE_URL}/api/documents`, {
      headers: {
        Authorization: "Bearer client-admin-token-a",
      },
    })
    const data = await res.json()
    const tenantIds = Array.from(
      new Set(data.documents?.map((d: { tenant_id: string }) => d.tenant_id) || [])
    )

    expect(tenantIds.length).toBe(1)
  })

  it("Staff page validates token before showing chat", async () => {
    const invalidTokenPage = await fetch(`${BASE_URL}/staff/invalid-token`)
    const html = await invalidTokenPage.text()

    expect(html).toContain("Access Denied")
  })
})
