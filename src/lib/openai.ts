import OpenAI from "openai"

let chatClient: OpenAI | null = null
let embeddingClient: OpenAI | null = null

export function getOpenAIClient(): OpenAI {
  if (!chatClient) {
    chatClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL || undefined,
    })
  }
  return chatClient
}

function getEmbeddingClient(): OpenAI {
  if (!embeddingClient) {
    embeddingClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_EMBEDDING_BASE_URL || process.env.OPENAI_BASE_URL || undefined,
    })
  }
  return embeddingClient
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const openai = getEmbeddingClient()
  try {
    const response = await openai.embeddings.create({
      model: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
      input: text,
    })
    return response.data[0].embedding
  } catch {
    console.warn("Embedding API failed, using zero vector fallback")
    return new Array(1536).fill(0)
  }
}

export async function generateChatCompletion(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  options?: { temperature?: number; max_tokens?: number }
) {
  const openai = getOpenAIClient()
  return openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages,
    temperature: options?.temperature ?? 0.3,
    max_tokens: options?.max_tokens ?? 1024,
  })
}

export const SYSTEM_PROMPT = `You are an internal staff assistant for a business. Your purpose is to help staff find information from approved internal documents only.

RULES:
- Answer ONLY from the approved documents provided in the context below.
- If the answer is clearly found in the provided context, give a concise, practical answer.
- Include the source document name when possible: "According to [Document Name]..."
- Prefer step-by-step answers when helpful.
- Use the tone of an internal staff guide: helpful, clear, calm, and direct.
- Do NOT be overly casual or speculative.

WHEN ANSWER IS NOT FOUND:
- Say: "I can't find an approved answer for that in the current staff guide. Please ask your manager before taking action."

ESCALATE (do not answer, even with context that seems related):
- Injuries, emergencies, harassment, discrimination
- Payroll, termination, legal issues, medical issues
- Customer aggression, safety incidents
- Refunds outside approved policy
- Complaints not covered by policy
- Anything that could create liability for the business

For urgent escalations use:
"This may require immediate manager involvement. Please escalate this to your manager or the nominated emergency contact."

Do NOT:
- Invent policies, prices, procedures, or promises
- Give legal, HR, payroll, medical, safety-critical, or financial advice
- Answer questions outside the provided context`
