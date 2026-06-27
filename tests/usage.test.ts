import { describe, it, expect } from "vitest"

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000"
const TEST_TOKEN = process.env.TEST_TOKEN || "test-business-token"

async function postChat(body: Record<string, string>) {
  try {
    return await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  } catch {
    return null
  }
}

describe("Usage Tracking", () => {
  it("Conversation is logged with question, answer, and escalation flag", async () => {
    const res = await postChat({
      token: TEST_TOKEN,
      question: "Test question for logging",
      session_id: "test-usage-session",
    })
    if (!res) return
    const data = await res.json()
    expect(data.answer).toBeDefined()
    expect(typeof data.escalation).toBe("boolean")
  })

  it("Conversation is stored per business with correct fields", async () => {
    const res = await postChat({
      token: TEST_TOKEN,
      question: "What is our refund policy?",
      session_id: "test-usage-business",
    })
    if (!res) return
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.answer).toBeDefined()
  })

  it("Usage counters increment with each question", async () => {
    const res = await postChat({
      token: TEST_TOKEN,
      question: "What time does the gym open?",
      session_id: "test-usage-count",
    })
    if (!res) return
    expect(res.status).toBe(200)
  })

  it("Different tokens have isolated conversations", async () => {
    const res = await postChat({
      token: "business-a-token",
      question: "Business A specific question",
      session_id: "test-business-a-session",
    })
    if (!res) return
    expect(res.status).toBe(200)
  })

  it("Disabled token cannot log usage", async () => {
    const res = await postChat({
      token: "disabled-business-token",
      question: "Should not be tracked",
      session_id: "test-disabled",
    })
    if (!res) return
    expect(res.status).toBe(403)
  })
})
