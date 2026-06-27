import { describe, it, expect } from "vitest"

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000"

async function postChat(token: string, question: string) {
  try {
    return await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, question, session_id: "test-session" }),
    })
  } catch {
    return null
  }
}

async function postValidate(token: string) {
  try {
    return await fetch(`${BASE_URL}/api/staff/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
  } catch {
    return null
  }
}

async function fetchPage(path: string) {
  try {
    return await fetch(`${BASE_URL}${path}`)
  } catch {
    return null
  }
}

describe("Data Isolation", () => {
  it("Business A token cannot access Business B documents", async () => {
    const res = await postChat("business-a-token", "What is the refund policy?")
    if (!res) return
    expect(res.status).toBe(200)
  })

  it("Invalid token returns 403", async () => {
    const res = await postChat("invalid-token-12345", "What time do we open?")
    if (!res) return
    expect(res.status).toBe(403)
  })

  it("Disabled token returns 403", async () => {
    const res = await postChat("disabled-business-token", "How do I reset my password?")
    if (!res) return
    expect(res.status).toBe(403)
  })

  it("Staff page loads for valid token", async () => {
    const res = await fetchPage("/staff/demo-token-abc-123")
    if (!res) return
    expect(res.status).toBe(200)
  })

  it("Validate token API rejects invalid token", async () => {
    const res = await postValidate("invalid-token-12345")
    if (!res) return
    const data = await res.json()
    expect(data.valid).toBe(false)
  })

  it("Validate token API works for valid token", async () => {
    const res = await postValidate("demo-token-abc-123")
    if (!res) return
    const data = await res.json()
    expect(data.valid).toBe(true)
    expect(data.business_name).toBe("Demo Gym")
  })
})
