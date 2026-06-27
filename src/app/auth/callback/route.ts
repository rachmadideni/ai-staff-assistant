import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const next = searchParams.get("next") || "/dashboard"
  const code = searchParams.get("code")
  const type = searchParams.get("type")

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const isRecovery = next === "/reset-password" || next.startsWith("/reset-password?") || type === "recovery"
      const recoveryParam = isRecovery ? `${next.includes("?") ? "&" : "?"}recovery=true` : ""
      return NextResponse.redirect(`${origin}${next}${recoveryParam}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Auth callback failed`)
}
