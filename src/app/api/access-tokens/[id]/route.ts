import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createServerSupabaseClient } from "@/lib/supabase/server"

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

    if (!profile || (profile.role !== "super_admin" && profile.role !== "client_admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const admin = createAdminClient()

    const { data: existing } = await admin
      .from("business_access_tokens")
      .select("tenant_id")
      .eq("id", params.id)
      .single()

    if (!existing) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 })
    }

    if (profile.role === "client_admin" && existing.tenant_id !== profile.tenant_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { error } = await admin
      .from("business_access_tokens")
      .update({ is_active: false })
      .eq("id", params.id)

    if (error) {
      return NextResponse.json(
        { error: "Failed to revoke access token" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Revoke token error:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}
