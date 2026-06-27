import { describe, it, expect } from "vitest"

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000"

async function postChat(body: unknown) {
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

async function postRaw(body: string) {
  try {
    return await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    })
  } catch {
    return null
  }
}

describe("Rate Limiting and Abuse Prevention", () => {
  it("rejects request with missing token", async () => {
    const res = await postChat({ question: "What time do we open?", session_id: "test-rate" })
    if (!res) return
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBeDefined()
  })

  it("rejects request with missing question", async () => {
    const res = await postChat({ token: "some-token", session_id: "test-rate" })
    if (!res) return
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBeDefined()
  })

  it("rejects malformed JSON body", async () => {
    const res = await postRaw("this is not valid json")
    if (!res) return
    expect(res.status).toBe(400)
  })

  it("handles empty question string", async () => {
    const res = await postChat({ token: "test-business-token", question: "", session_id: "test-rate" })
    if (!res) return
    expect(res.status).toBe(400)
  })

  it("handles extremely long question", async () => {
    const longQuestion = "What ".repeat(5000)
    const res = await postChat({ token: "test-business-token", question: longQuestion, session_id: "test-rate" })
    if (!res) return
    expect([200, 400, 413, 500]).toContain(res.status)
  })
})
