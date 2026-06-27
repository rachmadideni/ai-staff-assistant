import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const { data: result, error } = await supabase
      .rpc("validate_access_token", { p_token: token })

    if (error) {
      return NextResponse.json(
        { error: "Failed to validate token" },
        { status: 500 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Validate token error:", error)
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}
