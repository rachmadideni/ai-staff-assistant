import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

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
    const tenantId = searchParams.get("tenant_id")
    const month = searchParams.get("month") || new Date().toISOString().slice(0, 7)

    let query = supabase.from("usage_tracking").select("*")

    if (profile.role === "client_admin") {
      query = query.eq("tenant_id", profile.tenant_id)
    } else if (tenantId) {
      query = query.eq("tenant_id", tenantId)
    }

    query = query.eq("month", month)

    const { data: usage, error } = await query

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch usage data" },
        { status: 500 }
      )
    }

    return NextResponse.json({ usage })
  } catch (error) {
    console.error("Usage fetch error:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}
