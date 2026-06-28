import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { createAdminClient } from "@/lib/supabase/admin"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { ensureDocumentsBucket } from "@/lib/documents"
import { verifyHmac } from "@/lib/auth-utils"

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/markdown",
]

const MAX_FILE_SIZE = 10 * 1024 * 1024

async function lookupProfile(userId: string) {
  const admin = createAdminClient()
  const { data } = await admin
    .from("users")
    .select("id, role, tenant_id")
    .eq("id", userId)
    .single()
  return data
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const authPayload = formData.get("authPayload") as string | null
    const bodyTenantId = formData.get("tenant_id") as string | null

    let auth: { user: { id: string }; profile: { id: string; role: string; tenant_id: string | null } } | null = null

    if (authPayload) {
      const userId = verifyHmac(authPayload)
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      const profile = await lookupProfile(userId)
      if (!profile || (profile.role !== "super_admin" && profile.role !== "client_admin")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
      auth = { user: { id: userId }, profile }
    } else {
      const supabase = await createServerSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      const profile = await lookupProfile(user.id)
      if (!profile || (profile.role !== "super_admin" && profile.role !== "client_admin")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
      auth = { user, profile }
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Allowed: PDF, DOCX, TXT, MD" },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB" },
        { status: 400 }
      )
    }

    const tenantId = bodyTenantId || auth.profile.tenant_id

    if (auth.profile.role === "client_admin" && tenantId !== auth.profile.tenant_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const admin = createAdminClient()
    await ensureDocumentsBucket()
    const fileExt = file.name.split(".").pop()
    const filePath = `${tenantId}/${randomUUID()}.${fileExt}`

    const { error: uploadError } = await admin.storage
      .from("documents")
      .upload(filePath, file)

    if (uploadError) {
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      )
    }

    const { data: doc, error: dbError } = await admin
      .from("documents")
      .insert({
        tenant_id: tenantId,
        filename: file.name,
        file_path: filePath,
        file_type: fileExt || "",
        file_size: file.size,
        status: "draft",
        uploaded_by: auth.user.id,
      })
      .select()
      .single()

    if (dbError) {
      await admin.storage.from("documents").remove([filePath])
      return NextResponse.json(
        { error: "Failed to create document record" },
        { status: 500 }
      )
    }

    return NextResponse.json({ document: doc }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "An error occurred uploading the document"
    console.error("Document upload error:", message)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    let auth: { user: { id: string }; profile: { id: string; role: string; tenant_id: string | null } } | null = null

    // Check Authorization header first (preferred — avoids query string token leakage)
    const authHeader = request.headers.get("authorization")
    if (authHeader?.startsWith("Bearer ")) {
      const authPayload = authHeader.slice(7)
      const userId = verifyHmac(authPayload)
      if (userId) {
        const profile = await lookupProfile(userId)
        if (profile && (profile.role === "super_admin" || profile.role === "client_admin")) {
          auth = { user: { id: userId }, profile }
        }
      }
    }

    // Fallback to session-based auth
    if (!auth) {
      const supabase = await createServerSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const profile = await lookupProfile(user.id)
        if (profile && (profile.role === "super_admin" || profile.role === "client_admin")) {
          auth = { user, profile }
        }
      }
    }

    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = searchParams.get("tenant_id") || auth.profile.tenant_id

    if (auth.profile.role === "client_admin" && tenantId !== auth.profile.tenant_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const admin = createAdminClient()
    let query = admin.from("documents").select("*")

    if (auth.profile.role === "client_admin") {
      query = query.eq("tenant_id", auth.profile.tenant_id)
    } else if (tenantId) {
      query = query.eq("tenant_id", tenantId)
    }

    const { data: documents, error } = await query.order("created_at", {
      ascending: false,
    })

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch documents" },
        { status: 500 }
      )
    }

    return NextResponse.json({ documents })
  } catch (error) {
    const message = error instanceof Error ? error.message : "An error occurred"
    console.error("Document list error:", message)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
