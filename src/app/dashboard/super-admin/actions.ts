"use server"

import { randomUUID } from "crypto"
import { createAdminClient } from "@/lib/supabase/admin"

export async function inviteClientAdmin({
  email,
  tenant_id,
  accessToken,
}: {
  email: string
  tenant_id: string
  accessToken: string
}) {
  try {
    if (!email || !tenant_id) {
      return { error: "Email and tenant_id are required" }
    }

    if (!accessToken) {
      return { error: "Unauthorized" }
    }

    const admin = createAdminClient()

    const { data: { user }, error: userError } = await admin.auth.getUser(accessToken)

    if (userError || !user) {
      return { error: "Unauthorized" }
    }

    const { data: profile } = await admin
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    if (!profile || profile.role !== "super_admin") {
      return { error: "Forbidden" }
    }

    const tempPassword = randomUUID().slice(0, 16)

    const { data: authUser, error: createError } = await admin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
    })

    if (createError) {
      return { error: createError.message }
    }

    const { error: updateError } = await admin
      .from("users")
      .update({ tenant_id, role: "client_admin" })
      .eq("id", authUser.user.id)

    if (updateError) {
      return { error: "User created but failed to assign tenant" }
    }

    return {
      message: "Invitation sent",
      user: { id: authUser.user.id, email },
      temporary_password: tempPassword,
    }
  } catch (err) {
    console.error("inviteClientAdmin error:", err)
    return { error: err instanceof Error ? err.message : "An unexpected error occurred" }
  }
}
