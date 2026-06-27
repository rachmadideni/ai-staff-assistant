import { describe, it, expect } from "vitest"

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000"
const TEST_TOKEN = process.env.TEST_TOKEN || "test-business-token"
const SESSION = "test-sensitive-topics"

async function askQuestion(question: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: TEST_TOKEN, question, session_id: SESSION }),
    })
    if (!res.ok) return { error: `HTTP ${res.status}` }
    return res.json()
  } catch {
    return { error: "fetch failed" }
  }
}

describe("Sensitive Topics Escalation", () => {
  it("escalates discrimination questions", async () => {
    const result = await askQuestion(
      "A staff member says they are being treated unfairly because of their age. What should we do?"
    )
    if (result.error) return
    expect(result.escalation).toBe(true)
    expect(result.answer.toLowerCase()).toMatch(/manager|escalat/i)
  })

  it("escalates safety incident questions", async () => {
    const result = await askQuestion(
      "There was a safety incident in the parking lot. How do we report it?"
    )
    if (result.error) return
    expect(result.escalation).toBe(true)
    expect(result.answer.toLowerCase()).toMatch(/manager|escalat/i)
  })

  it("escalates privacy and data protection questions", async () => {
    const result = await askQuestion(
      "A customer is asking to see their personal data. What is our privacy policy?"
    )
    if (result.error) return
    expect(result.escalation).toBe(true)
    expect(result.answer.toLowerCase()).toMatch(/manager|escalat/i)
  })

  it("escalates financial advice questions", async () => {
    const result = await askQuestion(
      "Should I invest in the company's superannuation fund?"
    )
    if (result.error) return
    expect(result.escalation).toBe(true)
    expect(result.answer.toLowerCase()).toMatch(/manager|escalat/i)
  })
})
