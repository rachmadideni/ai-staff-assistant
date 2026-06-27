"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
  sources?: string[]
  escalation?: boolean
}

const STORAGE_KEY_PREFIX = "staff_session_"

export default function StaffChatPage({
  params,
}: {
  params: { token: string }
}) {
  const { token } = params
  const [businessName, setBusinessName] = useState<string | null>(null)
  const [requiresPin, setRequiresPin] = useState(false)
  const [pinVerified, setPinVerified] = useState(false)
  const [pin, setPin] = useState("")
  const [pinError, setPinError] = useState<string | null>(null)
  const [pinAttempts, setPinAttempts] = useState(0)
  const [pinLocked, setPinLocked] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [tokenValid, setTokenValid] = useState(true)
  const [tokenError, setTokenError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabaseRef = useRef<any>(null)

  const sessionIdKey = `${STORAGE_KEY_PREFIX}${token}`
  const storedId = typeof window !== "undefined" ? sessionStorage.getItem(sessionIdKey) ?? crypto.randomUUID() : crypto.randomUUID()
  const [sessionId, setSessionId] = useState(storedId)

  useEffect(() => {
    sessionStorage.setItem(sessionIdKey, sessionId)
  }, [sessionId, sessionIdKey])

  useEffect(() => {
    async function initSupabase() {
      const { createClient } = await import("@/lib/supabase/client")
      supabaseRef.current = createClient()
      const supabase = supabaseRef.current

      const { data, error } = await supabase.rpc("validate_access_token", {
        p_token: token,
      })

      if (error || !data?.valid) {
        setTokenValid(false)
        setTokenError(data?.error || "Invalid or expired access link")
        return
      }

      setBusinessName(data.business_name)
      if (data.requires_pin) {
        setRequiresPin(true)
      } else {
        setPinVerified(true)
      }
    }
    initSupabase()
  }, [token])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function handlePinSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (pinAttempts >= 5) {
      setPinLocked(true)
      return
    }

    setPinError(null)

    const supabase = supabaseRef.current
    if (!supabase) return
    const { data, error } = await supabase.rpc("verify_access_pin", {
      p_token: token,
      p_pin: pin,
    })

    if (error || !data?.valid) {
      const attempts = pinAttempts + 1
      setPinAttempts(attempts)
      if (attempts >= 5) {
        setPinLocked(true)
        setPinError("Too many incorrect attempts. Access locked.")
      } else {
        setPinError(`Invalid PIN. ${5 - attempts} attempt(s) remaining.`)
      }
      return
    }

    setPinVerified(true)
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const question = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: question }])
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          question,
          session_id: sessionId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to get answer")
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer, sources: data.sources, escalation: data.escalation },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process your question. Please try again.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (!tokenValid) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground mt-2">
            {tokenError || "This access link is invalid or has expired."}
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Please contact your manager for a new access link.
          </p>
        </div>
      </div>
    )
  }

  if (requiresPin && !pinVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-xl font-bold">{businessName}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Staff Assistant
            </p>
          </div>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Access PIN
              </label>
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-center text-lg tracking-widest"
                placeholder="• • • •"
                maxLength={6}
                autoFocus
                disabled={pinLocked}
              />
            </div>
            {pinError && (
              <p className="text-sm text-destructive text-center">{pinError}</p>
            )}
            {pinLocked ? (
              <p className="text-sm text-destructive text-center">
                Please contact your manager for a new access link.
              </p>
            ) : (
              <button
                type="submit"
                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Enter
              </button>
            )}
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-dvh max-w-2xl mx-auto">
      <header className="border-b px-4 py-3">
        <h1 className="text-lg font-semibold">{businessName}</h1>
        <p className="text-xs text-muted-foreground">Staff Assistant</p>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Ask a question about your workplace procedures and policies.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.sources && msg.sources.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Sources: {msg.sources.join(", ")}
                  </p>
                )}
                {msg.escalation && (
                  <p className="text-xs text-destructive font-medium mt-1">
                    This may require manager involvement.
                  </p>
                )}
              </div>
            </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-4 py-2 text-sm">
              <span className="inline-flex gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t px-4 py-3">
        <p className="text-xs text-muted-foreground mb-2">
          Answers are based on approved internal staff documents. If the answer
          is unclear, missing, or relates to a serious issue, ask your manager.
        </p>
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
