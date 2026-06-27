import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { ensureDocumentsBucket } from "@/lib/documents"

export const dynamic = "force-dynamic"

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/markdown",
]

const MAX_FILE_SIZE = 10 * 1024 * 1024

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("users")
      .select("role, tenant_id")
      .eq("id", user.id)
      .single()

    if (!profile || (profile.role !== "super_admin" && profile.role !== "client_admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const tenantId = formData.get("tenant_id") as string || profile.tenant_id

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Allowed: PDF, DOCX, TXT, MD` },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB" },
        { status: 400 }
      )
    }

    if (profile.role === "client_admin" && tenantId !== profile.tenant_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const admin = createAdminClient()
    await ensureDocumentsBucket()
    const fileExt = file.name.split(".").pop()
    const filePath = `${tenantId}/${crypto.randomUUID()}.${fileExt}`

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
        uploaded_by: user.id,
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
    console.error("Document upload error:", error)
    return NextResponse.json(
      { error: "An error occurred uploading the document" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("users")
      .select("role, tenant_id")
      .eq("id", user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get("tenant_id") || profile.tenant_id

    if (profile.role === "client_admin" && tenantId !== profile.tenant_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const admin = createAdminClient()
    let query = admin.from("documents").select("*")

    if (profile.role === "client_admin") {
      query = query.eq("tenant_id", profile.tenant_id)
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
    console.error("Document list error:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}
