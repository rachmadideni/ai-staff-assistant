import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import crypto from "crypto"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
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

    const { name, usage_limit_monthly } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Business name is required" }, { status: 400 })
    }

    const admin = createAdminClient()
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")

    const { data: tenant, error: tenantError } = await admin
      .from("tenants")
      .insert({
        name,
        slug,
        usage_limit_monthly: usage_limit_monthly || 500,
        settings: {},
      })
      .select()
      .single()

    if (tenantError) {
      return NextResponse.json(
        { error: "Failed to create business" },
        { status: 500 }
      )
    }

    const token = crypto.randomUUID()
    const { error: tokenError } = await admin
      .from("business_access_tokens")
      .insert({
        tenant_id: tenant.id,
        token,
        label: "Default staff access",
      })

    if (tokenError) {
      return NextResponse.json(
        { error: "Business created but failed to generate access token" },
        { status: 500 }
      )
    }

    return NextResponse.json({ tenant, token }, { status: 201 })
  } catch (error) {
    console.error("Create tenant error:", error)
    return NextResponse.json(
      { error: "An error occurred" },
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
    const admin = createAdminClient()
    let query = admin.from("tenants").select("*")

    if (profile.role === "client_admin") {
      query = query.eq("id", profile.tenant_id)
    }

    const { data: tenants, error } = await query.order("created_at", {
      ascending: false,
    })

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch businesses" },
        { status: 500 }
      )
    }

    return NextResponse.json({ tenants })
  } catch (error) {
    console.error("List tenants error:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}
