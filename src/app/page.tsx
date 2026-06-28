import Link from "next/link"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@/lib/supabase/server"

export const metadata = {
  title: "AI Staff Assistant",
}

export default async function HomePage() {
  const supabase = await createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">AI Staff Assistant</h1>
        <p className="text-muted-foreground">
          Internal staff assistant — powered by your approved documents
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  )
}
