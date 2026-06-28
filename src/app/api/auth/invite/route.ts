import { createHmac } from "crypto"
import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { createAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const { email, tenant_id, authPayload } = await request.json()

    if (!email || !tenant_id) {
      return NextResponse.json({ error: "Email and tenant_id are required" }, { status: 400 })
    }

    if (!authPayload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let userId: string
    try {
      const parsed = JSON.parse(authPayload)
      const secret = process.env.HMAC_SECRET || ""
      const expected = createHmac("sha256", secret).update(parsed.userId).digest("hex")
      if (expected !== parsed.signature) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      userId = parsed.userId
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const admin = createAdminClient()

    const { data: profile } = await admin
      .from("users")
      .select("role")
      .eq("id", userId)
      .single()

    if (!profile || profile.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const tempPassword = randomUUID().slice(0, 16)

    const { data: authUser, error: createError } = await admin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: false,
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
    }, { status: 201 })
  } catch (error) {
    console.error("Invite user error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
