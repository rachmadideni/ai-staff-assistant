import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

async function getAuthProfile() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase
    .from("users")
    .select("role, tenant_id")
    .eq("id", user.id)
    .single()
  return profile
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const profile = await getAuthProfile()
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const admin = createAdminClient()
    const { data: tenant, error } = await admin
      .from("tenants")
      .select("*")
      .eq("id", id)
      .single()

    if (error || !tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    if (profile.role === "client_admin" && tenant.id !== profile.tenant_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({ tenant })
  } catch (error) {
    console.error("Get tenant error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const profile = await getAuthProfile()
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const allowedFields: Record<string, unknown> = {}

    if (profile.role === "super_admin") {
      if (body.name !== undefined) allowedFields.name = body.name
      if (body.slug !== undefined) allowedFields.slug = body.slug
      if (body.settings !== undefined) allowedFields.settings = body.settings
      if (body.usage_limit_monthly !== undefined) allowedFields.usage_limit_monthly = body.usage_limit_monthly
      if (body.is_active !== undefined) allowedFields.is_active = body.is_active
    } else if (profile.role === "client_admin") {
      if (profile.tenant_id !== id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
      if (body.name !== undefined) allowedFields.name = body.name
      if (body.settings !== undefined) allowedFields.settings = body.settings
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (Object.keys(allowedFields).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    const admin = createAdminClient()
    const { data: tenant, error } = await admin
      .from("tenants")
      .update(allowedFields)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to update tenant" }, { status: 500 })
    }

    return NextResponse.json({ tenant })
  } catch (error) {
    console.error("Update tenant error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const profile = await getAuthProfile()
    if (!profile || profile.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    const admin = createAdminClient()
    const { data: tenant, error: fetchError } = await admin
      .from("tenants")
      .select("id")
      .eq("id", id)
      .single()

    if (fetchError || !tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    const { error } = await admin
      .from("tenants")
      .update({ is_active: false })
      .eq("id", id)

    if (error) {
      return NextResponse.json({ error: "Failed to deactivate tenant" }, { status: 500 })
    }

    return NextResponse.json({ message: "Tenant deactivated" })
  } catch (error) {
    console.error("Deactivate tenant error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
