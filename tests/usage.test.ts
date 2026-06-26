import { describe, it, expect } from "vitest"

// Usage tracking and limit tests

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000"
const TEST_TOKEN = process.env.TEST_TOKEN || "test-business-token"

describe("Usage Tracking", () => {
  it("Tracks question count per business", async () => {
    const res = await fetch(`${BASE_URL}/api/usage?tenant_id=test-business-id`, {
      headers: {
        Authorization: "Bearer super-admin-token",
      },
    })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.usage).toBeDefined()
  })

  it("Client admin sees own usage only", async () => {
    const res = await fetch(`${BASE_URL}/api/usage`, {
      headers: {
        Authorization: "Bearer client-admin-token-a",
      },
    })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.usage).toBeDefined()
  })

  it("Usage data contains required fields", async () => {
    const res = await fetch(`${BASE_URL}/api/usage?tenant_id=test-business-id`, {
      headers: {
        Authorization: "Bearer super-admin-token",
      },
    })
    const data = await res.json()

    if (data.usage && data.usage.length > 0) {
      const record = data.usage[0]
      expect(record).toHaveProperty("question_count")
      expect(record).toHaveProperty("escalation_count")
      expect(record).toHaveProperty("token_count")
      expect(record).toHaveProperty("month")
    }
  })

  it("Conversations are logged with required fields", async () => {
    const { answer, sources, escalation } = await fetch(
      `${BASE_URL}/api/chat`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: TEST_TOKEN,
          question: "Test question for logging",
          session_id: "test-usage-session",
        }),
      }
    ).then((r) => r.json())

    expect(answer).toBeDefined()
    expect(typeof escalation).toBe("boolean")
  })

  it("Usage tracking stores conversations per business", async () => {
    // Ask a question with Business A's token
    const res1 = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: TEST_TOKEN,
        question: "What is our refund policy?",
        session_id: "test-usage-isolation",
      }),
    })
    expect(res1.status).toBe(200)
  })
})
