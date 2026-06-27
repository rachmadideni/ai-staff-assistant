# AI Staff Assistant — Admin Handover Guide

## 1. Setup Instructions

### Prerequisites
- Node.js 18+
- A Supabase account (free tier works)
- An OpenAI API key
- A Vercel account (for deployment)

### Environment Variables
Create `.env.local` with these values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-openai-key
OPENAI_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Local Development
```bash
npm install
npm run dev
# Opens at http://localhost:3000
```

### Database Migrations
Migrations live in `supabase/migrations/`. Apply them in order:
```bash
npx supabase link --project-ref your-project-ref
npx supabase db push
```

Or run each `.sql` file manually in Supabase SQL Editor.

### Deploy to Vercel
1. Push code to GitHub
2. Import repo in Vercel dashboard
3. Add all environment variables above (set `NEXT_PUBLIC_APP_URL` to production URL)
4. Deploy

After first deploy, update Supabase Auth → URL Configuration:
- Site URL: `https://your-app.vercel.app`
- Additional Redirect URLs: `https://your-app.vercel.app/**`

---

## 2. Adding a New Business

**Super Admin only.**

1. Log in as super admin at `/login`
2. Click "Create Business" button
3. Fill in:
   - Business name (e.g. "Demo Gym")
   - Slug (auto-generated, but editable)
   - Monthly question limit (default 500)
4. Submit

This automatically:
- Creates a tenant record
- Generates a staff access token (UUID)
- The token is ready for QR code generation

---

## 3. Adding/Removing Client Admin Users

**Super Admin only.**

1. Log in as super admin
2. Find the business in the business table
3. Click "Invite Admin" for that business
4. Enter the client admin's email address
5. The user receives a password reset email (if SMTP configured) or you set a temporary password

**Removing access:** The client admin signs in via `/login`. To remove access, either:
- Set the user's `is_active = false` in the `users` table
- Or delete the user from Supabase Auth dashboard

---

## 4. Staff Access Links

### Generating a Token
Tokens are auto-generated when a business is created. To generate a new one:

**Super Admin:**
1. Find the business row
2. Click the expand arrow
3. Click "Reset Token" (replaces old token, invalidates it)

**Client Admin:**
1. Log in to dashboard
2. The Staff Access Card shows the current token
3. Click "Reset" to generate a new one

### QR Code
Both admin dashboards show a QR code for the staff access URL (`/staff/{token}`). Staff scan this to access the chat.

### Disabling Access
Click "Disable" in the Staff Access Card. The token is immediately rejected by the API. Re-enable with the "Enable" button.

### PIN Protection (Optional)
Set a PIN code on the token to require staff to enter a PIN before chatting (max 5 attempts before lockout).

---

## 5. Document Management

### Upload
1. Go to the business dashboard (client admin or super admin)
2. In the Documents section, click "Upload"
3. Select a file (PDF, DOCX, TXT, MD — max 10MB)
4. The document is uploaded with status `draft`

### Approve (Index into Knowledge Base)
1. Find the draft document in the list
2. Click "Approve"
3. The system extracts text, chunks it, generates embeddings via OpenAI, and stores in pgvector
4. Status changes to `approved` — document is now searchable by staff

### Archive
1. Click "Archive" on an approved document
2. Vectors are deleted from the search index
3. Status changes to `archived` — no longer in search results

### Delete
1. Click "Delete" on any document
2. Permanently removes: storage file, vectors, and document record

### Re-index
If a document was updated (re-uploaded), click "Reindex" to re-process it. Old vectors are deleted and new ones generated.

---

## 6. Dashboards

### Super Admin (`/dashboard/super-admin`)
- View all businesses with stats
- Create new businesses
- Toggle business active/inactive
- Manage access tokens for any business
- Generate QR codes
- Invite client admin users
- View all conversation logs (filterable by business)
- View all usage statistics
- Adjust monthly question limits

### Client Admin (`/dashboard/client-admin`)
- View own business stats
- View/upload/approve/archive documents
- View and reset staff access token
- View QR code
- View own conversation logs
- View own usage with near-limit warning (amber at 80%)

---

## 7. Staff Chat Page

Staff access the chat at `/staff/{token}`. No login required.

- **No PIN:** Directly enters chat
- **With PIN:** Enter 6-digit PIN (5 attempts before lockout)
- Chat uses OpenAI to answer questions from approved documents only
- Sources shown below each answer
- Escalation flag displayed for sensitive topics
- Monthly usage tracked and enforced

---

## 8. AI Assistant Behavior

- Answers ONLY from approved documents for the requesting business
- Never invents policies, prices, or procedures
- Escalation categories: injuries, emergencies, harassment, discrimination, payroll, termination, legal, medical, refunds outside policy, customer aggression, safety incidents
- Escalation response: *"I can't find an approved answer..."*
- Urgent escalation: *"This may require immediate manager involvement..."*
- Format: "According to [Document Name]..."

---

## 9. Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Staff get "Invalid access token" | Token disabled or expired | Regenerate token in admin dashboard |
| "Monthly question limit reached" | Business hit its cap | Increase limit in super admin → edit business |
| Document stuck on "draft" | Indexing failed | Check file type/size, try re-upload or reindex |
| Chat returns no answer | No matching documents | Upload relevant docs and approve them |
| Login redirect loop | Auth URL not configured | Check Supabase Site URL setting matches app URL |
| PDF not processing | Corrupt or scanned PDF | Ensure PDF has selectable text (not scanned images) |
| "This business account is not active" | Tenant disabled | Super admin re-enables in business list |
| PIN locked out | 5 failed attempts | Reset token in admin dashboard (generates new PIN) |
| Usage not showing | Different month | Current month only; past months archive automatically |

---

## 10. Architecture Overview

```
Staff (browser) → /staff/{token} → /api/chat
  → validate token → check usage
  → embed question (OpenAI text-embedding-3-small)
  → pgvector search (filtered by tenant_id, top 10 chunks)
  → LLM completion (OpenAI gpt-4o-mini)
  → log conversation + update usage → respond

Admin (browser) → /login → Supabase Auth
  → role-based dashboard (super_admin / client_admin)
  → document upload → Storage → DB
  → approve → extract → chunk → embed → index
```

### Key Tables
- `tenants` — Business accounts with usage limits
- `users` — Admin users linked to auth.users
- `business_access_tokens` — Staff access tokens (UUID + optional PIN)
- `documents` — Uploaded files with status workflow
- `document_chunks` — Text chunks with VECTOR(1536) embeddings
- `conversations` — Every staff Q&A
- `usage_tracking` — Monthly usage per business

### Tech Stack
- **Frontend:** Next.js 14 App Router + Tailwind CSS + shadcn/ui
- **Backend:** Next.js API Routes + Supabase (PostgreSQL + Storage + Auth)
- **AI:** OpenAI gpt-4o-mini + text-embedding-3-small
- **Vector Search:** pgvector (IVFFlat, cosine similarity)
- **Hosting:** Vercel
