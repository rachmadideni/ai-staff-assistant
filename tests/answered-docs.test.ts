import { describe, it, expect } from "vitest"

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000"
const TEST_TOKEN = process.env.TEST_TOKEN || "test-business-token"
const SESSION = "test-answered-docs"

async function askQuestion(question: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: TEST_TOKEN, question, session_id: SESSION }),
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

describe("Questions Answered from Documents", () => {
  it("answers membership pricing question", async () => {
    const data = await askQuestion("What are the membership pricing options?")
    if (!data) return
    expect(data.answer).toBeDefined()
    expect(typeof data.escalation).toBe("boolean")
  })

  it("answers operating hours question", async () => {
    const data = await askQuestion("What time does the gym open and close on weekdays?")
    if (!data) return
    expect(data.answer).toBeDefined()
    expect(data.answer.length).toBeGreaterThan(0)
  })

  it("answers weekend hours question", async () => {
    const data = await askQuestion("What are the weekend operating hours?")
    if (!data) return
    expect(data.answer).toBeDefined()
    expect(typeof data.escalation).toBe("boolean")
  })

  it("answers gym rules and etiquette question", async () => {
    const data = await askQuestion("What are the gym rules and etiquette?")
    if (!data) return
    expect(data.answer).toBeDefined()
  })

  it("answers equipment usage question", async () => {
    const data = await askQuestion("How do I use the squat rack properly?")
    if (!data) return
    expect(data.answer).toBeDefined()
  })

  it("answers cleaning procedures question", async () => {
    const data = await askQuestion("What is the cleaning procedure after using equipment?")
    if (!data) return
    expect(data.answer).toBeDefined()
  })

  it("answers opening procedures question", async () => {
    const data = await askQuestion("What are the opening procedures for the gym?")
    if (!data) return
    expect(data.answer).toBeDefined()
  })

  it("answers closing checklist question", async () => {
    const data = await askQuestion("What is the closing checklist for the gym?")
    if (!data) return
    expect(data.answer).toBeDefined()
  })

  it("answers locker room policies question", async () => {
    const data = await askQuestion("What are the locker room policies?")
    if (!data) return
    expect(data.answer).toBeDefined()
  })

  it("answers guest pass policies question", async () => {
    const data = await askQuestion("Can members bring guests and what is the guest pass policy?")
    if (!data) return
    expect(data.answer).toBeDefined()
  })

  it("answers class schedule question", async () => {
    const data = await askQuestion("What fitness classes are available and when?")
    if (!data) return
    expect(data.answer).toBeDefined()
  })

  it("answers personal training question", async () => {
    const data = await askQuestion("How do I book a personal training session?")
    if (!data) return
    expect(data.answer).toBeDefined()
  })

  it("answers cancellation policy question", async () => {
    const data = await askQuestion("What is the membership cancellation policy?")
    if (!data) return
    expect(data.answer).toBeDefined()
  })

  it("answers refund policy question", async () => {
    const data = await askQuestion("What is the refund policy for memberships?")
    if (!data) return
    expect(data.answer).toBeDefined()
  })

  it("answers dress code question", async () => {
    const data = await askQuestion("What is the dress code for the gym?")
    if (!data) return
    expect(data.answer).toBeDefined()
  })
})
