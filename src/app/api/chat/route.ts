import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { generateEmbedding, generateChatCompletion, SYSTEM_PROMPT } from "@/lib/openai"

export async function POST(request: Request) {
  try {
    const { token, question, session_id } = await request.json()

    if (!token || !question) {
      return NextResponse.json(
        { error: "Missing required fields: token, question" },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const { data: accessToken, error: tokenError } = await supabase
      .from("business_access_tokens")
      .select("tenant_id, is_active")
      .eq("token", token)
      .single()

    if (tokenError || !accessToken) {
      return NextResponse.json(
        { error: "Invalid access token" },
        { status: 403 }
      )
    }

    if (!accessToken.is_active) {
      return NextResponse.json(
        { error: "Access token is disabled" },
        { status: 403 }
      )
    }

    const { data: tenant } = await supabase
      .from("tenants")
      .select("id, name, is_active, usage_limit_monthly")
      .eq("id", accessToken.tenant_id)
      .single()

    if (!tenant || !tenant.is_active) {
      return NextResponse.json(
        { error: "This business account is not active" },
        { status: 403 }
      )
    }

    const currentMonth = new Date().toISOString().slice(0, 7)
    const { data: currentUsage } = await supabase
      .from("usage_tracking")
      .select("question_count, escalation_count")
      .eq("tenant_id", tenant.id)
      .eq("month", currentMonth)
      .single()

    if (currentUsage && currentUsage.question_count >= tenant.usage_limit_monthly) {
      return NextResponse.json(
        {
          answer:
            "This business has reached its monthly question limit. Please contact your manager or the business admin.",
        },
        { status: 200 }
      )
    }

    const embedding = await generateEmbedding(question)

    const { data: chunks } = await supabase.rpc("match_document_chunks", {
      query_embedding: `[${embedding.join(",")}]`,
      match_threshold: 0.5,
      match_count: 10,
      p_tenant_id: tenant.id,
    })

    let context = ""
    const sources: string[] = []
    if (chunks && chunks.length > 0) {
      context = chunks
        .map((c: { content: string }) => c.content)
        .join("\n\n")

      const docIds: string[] = []
      const seen = new Set<string>()
      for (const c of chunks) {
        if (!seen.has(c.document_id)) {
          seen.add(c.document_id)
          docIds.push(c.document_id)
        }
      }

      const { data: docs } = await supabase
        .from("documents")
        .select("id, filename")
        .in("id", docIds)

      if (docs) {
        sources.push(...docs.map((d: { filename: string }) => d.filename))
      }
    }

    const messages: { role: "system" | "user"; content: string }[] = [
      {
        role: "system",
        content: `${SYSTEM_PROMPT}\n\nBusiness: ${tenant.name}\nToday's date: ${new Date().toLocaleDateString("en-AU")}`,
      },
    ]

    if (context) {
      messages.push({
        role: "user",
        content: `Context from approved documents:\n\n${context}\n\n---\n\nStaff question: ${question}`,
      })
    } else {
      messages.push({
        role: "user",
        content: question,
      })
    }

    const completion = await generateChatCompletion(messages)
    const answer = completion.choices[0]?.message?.content || ""
    const tokenCount = completion.usage?.total_tokens || 0
    const isEscalation =
      answer.includes("can't find an approved answer") ||
      answer.includes("ask your manager") ||
      answer.includes("manager involvement")

    await supabase.from("conversations").insert({
      tenant_id: tenant.id,
      session_id: session_id || "anonymous",
      question,
      answer,
      sources,
      escalation_flag: isEscalation,
      token_count: tokenCount,
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    })

    await supabase.from("usage_tracking").upsert(
      {
        tenant_id: tenant.id,
        month: currentMonth,
        question_count: (currentUsage?.question_count || 0) + 1,
        escalation_count: (currentUsage?.escalation_count || 0) + (isEscalation ? 1 : 0),
        token_count: tokenCount,
      },
      { onConflict: "tenant_id,month" }
    )

    return NextResponse.json({ answer, sources, escalation: isEscalation })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json(
      { error: "An error occurred processing your request" },
      { status: 500 }
    )
  }
}
