import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import crypto from "crypto"

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

    const { tenant_id, label, pin_code } = await request.json()
    const targetTenantId = tenant_id || profile.tenant_id

    if (profile.role === "client_admin" && targetTenantId !== profile.tenant_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const admin = createAdminClient()
    const token = crypto.randomUUID()

    const { data: accessToken, error } = await admin
      .from("business_access_tokens")
      .insert({
        tenant_id: targetTenantId,
        token,
        label: label || "Staff access",
        pin_code: pin_code || null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: "Failed to generate access token" },
        { status: 500 }
      )
    }

    return NextResponse.json({ access_token: accessToken }, { status: 201 })
  } catch (error) {
    console.error("Generate token error:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
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

    const { token_id, action } = await request.json()

    if (!token_id || !action) {
      return NextResponse.json(
        { error: "token_id and action are required" },
        { status: 400 }
      )
    }

    const admin = createAdminClient()

    const { data: existing } = await admin
      .from("business_access_tokens")
      .select("tenant_id")
      .eq("id", token_id)
      .single()

    if (!existing) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 })
    }

    if (profile.role === "client_admin" && existing.tenant_id !== profile.tenant_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (action === "disable") {
      await admin
        .from("business_access_tokens")
        .update({ is_active: false })
        .eq("id", token_id)
    } else if (action === "enable") {
      await admin
        .from("business_access_tokens")
        .update({ is_active: true })
        .eq("id", token_id)
    } else if (action === "reset") {
      const newToken = crypto.randomUUID()
      await admin
        .from("business_access_tokens")
        .update({ token: newToken, is_active: true })
        .eq("id", token_id)
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Token update error:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}
