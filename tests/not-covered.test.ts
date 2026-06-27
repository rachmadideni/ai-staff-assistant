import { describe, it, expect } from "vitest"

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000"
const TEST_TOKEN = process.env.TEST_TOKEN || "test-business-token"
const SESSION = "test-not-covered"

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

describe("Questions Not Covered by Documents", () => {
  it("does not answer cryptocurrency policy", async () => {
    const result = await askQuestion(
      "What is the company's policy on accepting cryptocurrency as payment?"
    )
    if (result.error) return
    expect(result.escalation).toBe(true)
    expect(result.answer.toLowerCase()).toMatch(/can't find|not found|ask your manager/i)
  })

  it("does not answer stock trading policy", async () => {
    const result = await askQuestion(
      "Can staff trade stocks while on shift?"
    )
    if (result.error) return
    expect(result.escalation).toBe(true)
    expect(result.answer.toLowerCase()).toMatch(/can't find|not found|ask your manager/i)
  })

  it("does not answer pet policy", async () => {
    const result = await askQuestion(
      "Can staff bring their pets to work?"
    )
    if (result.error) return
    expect(result.escalation).toBe(true)
    expect(result.answer.toLowerCase()).toMatch(/can't find|not found|ask your manager/i)
  })

  it("does not answer child care policy", async () => {
    const result = await askQuestion(
      "Can staff bring their children to work?"
    )
    if (result.error) return
    expect(result.escalation).toBe(true)
    expect(result.answer.toLowerCase()).toMatch(/can't find|not found|ask your manager/i)
  })

  it("does not answer company car policy", async () => {
    const result = await askQuestion(
      "Is there a company car available for staff use?"
    )
    if (result.error) return
    expect(result.escalation).toBe(true)
    expect(result.answer.toLowerCase()).toMatch(/can't find|not found|ask your manager/i)
  })

  it("does not answer travel reimbursement policy", async () => {
    const result = await askQuestion(
      "What is the travel reimbursement policy for staff?"
    )
    if (result.error) return
    expect(result.escalation).toBe(true)
    expect(result.answer.toLowerCase()).toMatch(/can't find|not found|ask your manager/i)
  })

  it("does not answer company phone policy", async () => {
    const result = await askQuestion(
      "Does the company provide mobile phones for staff?"
    )
    if (result.error) return
    expect(result.escalation).toBe(true)
    expect(result.answer.toLowerCase()).toMatch(/can't find|not found|ask your manager/i)
  })

  it("does not answer remote work policy", async () => {
    const result = await askQuestion(
      "What is the remote work policy for staff?"
    )
    if (result.error) return
    expect(result.escalation).toBe(true)
    expect(result.answer.toLowerCase()).toMatch(/can't find|not found|ask your manager/i)
  })

  it("does not answer tuition reimbursement policy", async () => {
    const result = await askQuestion(
      "Does the company offer tuition reimbursement for staff?"
    )
    if (result.error) return
    expect(result.escalation).toBe(true)
    expect(result.answer.toLowerCase()).toMatch(/can't find|not found|ask your manager/i)
  })

  it("does not answer volunteer leave policy", async () => {
    const result = await askQuestion(
      "Can staff take volunteer leave during work hours?"
    )
    if (result.error) return
    expect(result.escalation).toBe(true)
    expect(result.answer.toLowerCase()).toMatch(/can't find|not found|ask your manager/i)
  })
})
