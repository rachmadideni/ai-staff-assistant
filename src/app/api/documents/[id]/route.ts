import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { processDocument, reindexDocument } from "@/lib/documents"

export const dynamic = "force-dynamic"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const admin = createAdminClient()

    const { data: existing } = await admin
      .from("documents")
      .select("id, tenant_id, status, file_path")
      .eq("id", params.id)
      .single()

    if (!existing) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    if (profile.role === "client_admin" && existing.tenant_id !== profile.tenant_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { action } = await request.json()

    if (action === "approve") {
      await processDocument(params.id, existing.tenant_id)
      return NextResponse.json({ status: "approved" })
    } else if (action === "archive") {
      await admin.from("document_chunks").delete().eq("document_id", params.id)
      await admin
        .from("documents")
        .update({ status: "archived" })
        .eq("id", params.id)
      return NextResponse.json({ status: "archived" })
    } else if (action === "draft") {
      await admin.from("document_chunks").delete().eq("document_id", params.id)
      await admin
        .from("documents")
        .update({ status: "draft" })
        .eq("id", params.id)
      return NextResponse.json({ status: "draft" })
    } else if (action === "reindex") {
      await reindexDocument(params.id)
      return NextResponse.json({ status: "approved" })
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Document update error:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
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

    if (!profile || profile.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const admin = createAdminClient()

    const { data: doc } = await admin
      .from("documents")
      .select("file_path, tenant_id")
      .eq("id", params.id)
      .single()

    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    await admin.storage.from("documents").remove([doc.file_path])
    await admin.from("document_chunks").delete().eq("document_id", params.id)
    await admin.from("documents").delete().eq("id", params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Document delete error:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}
