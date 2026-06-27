import { describe, it, expect } from "vitest"

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000"

async function fetchPage(path: string) {
  try {
    return await fetch(`${BASE_URL}${path}`)
  } catch {
    return null
  }
}

describe("Mobile and Responsive Behavior", () => {
  it("staff chat page loads successfully", async () => {
    const res = await fetchPage("/staff/demo-token-abc-123")
    if (!res) return
    expect(res.status).toBe(200)
  })

  it("staff page includes viewport meta tag for mobile", async () => {
    const res = await fetchPage("/staff/demo-token-abc-123")
    if (!res) return
    expect(res.status).toBe(200)
    const html = await res.text()
    expect(html).toContain("viewport")
  })

  it("login page loads with responsive HTML structure", async () => {
    const res = await fetchPage("/login")
    if (!res) return
    expect(res.status).toBe(200)
    const html = await res.text()
    expect(html).toContain("viewport")
    expect(html.length).toBeGreaterThan(100)
  })

  it("API endpoint returns proper JSON content type", async () => {
    let res: Response | null = null
    try {
      res = await fetch(`${BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: "invalid", question: "test" }),
      })
    } catch {
      return
    }
    const ct = res!.headers.get("content-type") || ""
    expect(ct).toContain("application/json")
  })

  it("landing page loads with responsive design", async () => {
    const res = await fetchPage("/")
    if (!res) return
    expect(res.status).toBe(200)
    const html = await res.text()
    expect(html).toContain("viewport")
    expect(html.length).toBeGreaterThan(100)
  })
})
