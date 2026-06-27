import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized - no session" }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    if (!profile || profile.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { email, tenant_id, password } = await request.json()

    if (!email || !tenant_id) {
      return NextResponse.json({ error: "Email and tenant_id are required" }, { status: 400 })
    }

    const admin = createAdminClient()

    const tempPassword = password || crypto.randomUUID().slice(0, 16)

    const { data: authUser, error: createError } = await admin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
    })

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 400 })
    }

    const { error: updateError } = await admin
      .from("users")
      .update({ tenant_id, role: "client_admin" })
      .eq("id", authUser.user.id)

    if (updateError) {
      return NextResponse.json({ error: "User created but failed to assign tenant" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Invitation sent",
      user: { id: authUser.user.id, email },
      temporary_password: tempPassword,
    }, { status: 201 })
  } catch (error) {
    console.error("Invite user error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
