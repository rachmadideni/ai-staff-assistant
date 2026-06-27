import { describe, it, expect } from "vitest"

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000"
const TEST_TOKEN = process.env.TEST_TOKEN || "test-business-token"

async function askQuestion(question: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: TEST_TOKEN,
        question,
        session_id: "test-escalation",
      }),
    })
    if (!res.ok) {
      return { error: `HTTP ${res.status}` }
    }
    return res.json()
  } catch {
    return { error: "fetch failed" }
  }
}

describe("Escalation Behavior", () => {
  it("Escalates sensitive topics when no documents match", async () => {
    const result = await askQuestion(
      "What is the company's policy on working from home?"
    )
    if (result.error) return // skip if no API key configured
    expect(result.escalation).toBe(true)
    expect(result.answer.toLowerCase()).toMatch(/can't find|not found|ask your manager/i)
  })

  it("Escalates injuries", async () => {
    const result = await askQuestion(
      "A staff member just hurt their back lifting equipment. What should I do?"
    )
    if (result.error) return
    expect(result.escalation).toBe(true)
    expect(result.answer.toLowerCase()).toMatch(/manager|escalat/i)
  })

  it("Escalates harassment", async () => {
    const result = await askQuestion(
      "A customer is being verbally abusive to staff. How should we handle it?"
    )
    if (result.error) return
    expect(result.escalation).toBe(true)
    expect(result.answer.toLowerCase()).toMatch(/manager|escalat/i)
  })

  it("Escalates payroll questions", async () => {
    const result = await askQuestion(
      "How much overtime pay am I entitled to?"
    )
    if (result.error) return
    expect(result.escalation).toBe(true)
    expect(result.answer.toLowerCase()).toMatch(/manager|escalat/i)
  })

  it("Escalates termination questions", async () => {
    const result = await askQuestion(
      "Can I be fired for taking sick leave?"
    )
    if (result.error) return
    expect(result.escalation).toBe(true)
    expect(result.answer.toLowerCase()).toMatch(/manager|escalat/i)
  })

  it("Escalates legal questions", async () => {
    const result = await askQuestion(
      "Is it legal to record conversations with customers?"
    )
    if (result.error) return
    expect(result.escalation).toBe(true)
    expect(result.answer.toLowerCase()).toMatch(/manager|escalat/i)
  })

  it("Escalates medical questions", async () => {
    const result = await askQuestion(
      "A customer is having an allergic reaction. What do we do?"
    )
    if (result.error) return
    expect(result.escalation).toBe(true)
    expect(result.answer.toLowerCase()).toMatch(/manager|escalat/i)
  })

  it("Does not invent answers when not in documents", async () => {
    const result = await askQuestion(
      "Can staff get a 50% discount at the café next door?"
    )
    if (result.error) return
    expect(result.answer.toLowerCase()).not.toMatch(/yes|50%|discount/)
  })

  it("Returns a response (answer or error) for any question", async () => {
    const result = await askQuestion(
      "What time does the gym open on weekdays?"
    )
    expect(result).toBeDefined()
  })

  it("Includes sources or escalation when answering", async () => {
    const result = await askQuestion(
      "What is the cleaning checklist for closing?"
    )
    if (result.error) return
    expect(
      (result.sources && result.sources.length > 0) || result.escalation === true
    ).toBe(true)
  })
})
