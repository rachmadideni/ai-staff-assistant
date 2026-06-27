import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function PATCH(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    if (!profile || profile.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { tenant_id, ...updates } = await request.json()

    if (!tenant_id) {
      return NextResponse.json({ error: "tenant_id is required" }, { status: 400 })
    }

    const admin = createAdminClient()
    const allowedFields: Record<string, unknown> = {}
    if (updates.name !== undefined) allowedFields.name = updates.name
    if (updates.is_active !== undefined) allowedFields.is_active = updates.is_active
    if (updates.usage_limit_monthly !== undefined)
      allowedFields.usage_limit_monthly = updates.usage_limit_monthly

    const { data: tenant, error } = await admin
      .from("tenants")
      .update(allowedFields)
      .eq("id", tenant_id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: "Failed to update business" },
        { status: 500 }
      )
    }

    return NextResponse.json({ tenant })
  } catch (error) {
    console.error("Update business error:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}
