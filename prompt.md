# AI Staff Assistant — Project Rules

## Security (non-negotiable)
- OpenAI API key: Server-side environment variables ONLY
- No OpenAI calls from browser/frontend code ever
- Supabase anon key for client (RLS enforced), service key for server/admin operations only
- Every table MUST have RLS enabled
- No API keys committed to git

## Staff Access (critical)
- DO NOT create individual staff accounts
- Staff access via business_access_tokens table (token + optional PIN)
- Session is anonymous — track by business, not by individual
- Access tokens must be one-business-only
- PIN attempts rate-limited (max 5 before lockout)

## Documents
- Only documents with status = 'approved' enter the vector index
- Document statuses: draft → approved → archived
- Re-indexing: delete old vectors, re-embed, re-insert
- Supported file types: PDF, DOCX, TXT, MD
- Max file size: 10MB

## AI Assistant Behavior
- Answer ONLY from the business's approved knowledge base
- NEVER invent policies, prices, procedures, or promises
- When answer not found: "I can't find an approved answer in the current staff guide. Please ask your manager before taking action."
- Escalate for: injuries, emergencies, harassment, discrimination, payroll, termination, legal, medical, customer aggression, safety incidents, refunds outside policy, complaints not covered by policy
- Keep answers clear, practical, step-by-step when helpful
- Include source document name when possible
- Use tone: helpful, calm, direct — not casual, not speculative
- For urgent: "This may require immediate manager involvement. Please escalate to your manager or the nominated emergency contact."

## Vector Search
- Use OpenAI text-embedding-3-small for embeddings
- Use Supabase pgvector for storage and similarity search
- Each business has its own isolated vector index (filtered by tenant_id)
- Retrieve top 5-10 chunks before sending to LLM
- Only approved documents included in search results

## Tech Stack
- Next.js App Router (14+)
- Supabase (Auth + PostgreSQL + RLS + Storage)
- OpenAI API (gpt-4o-mini for staff queries, text-embedding-3-small for embeddings)
- Tailwind CSS + shadcn/ui
- Deploy to Vercel

## Quality Checks
- TypeScript strict mode — no `any` types
- Run `npm run typecheck` before every commit
- Run `npm run test` before every commit
- Test data isolation: Business A token cannot access Business B data
- Test escalation: sensitive topics must return escalation response
- Test usage caps: limit reached = questions blocked

## Ralph Loop Conventions
- Each iteration implements exactly ONE story from prd.json
- After completing a story, set passes: true in prd.json
- Append learnings to progress.txt after each iteration
- Commit after each completed story with format: "story-N: title"
- If a story is too large, decompose it further in prd.json
- AI tool: opencode CLI (opencode/deepseek-v4-flash-free model)
- Run: `rtk opencode "prompt" --allow-writes --allow-reads`
