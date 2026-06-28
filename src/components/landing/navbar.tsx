"use client"

import { FloatingNav } from "@/components/ui/floating-navbar"
import { Home, FileText, HelpCircle, MessageSquare } from "lucide-react"

export function LandingNavbar() {
  const navItems = [
    { name: "Home", link: "/", icon: <Home className="h-4 w-4" /> },
    { name: "Cara Kerja", link: "#cara-kerja", icon: <FileText className="h-4 w-4" /> },
    { name: "FAQ", link: "#faq", icon: <HelpCircle className="h-4 w-4" /> },
    { name: "Kontak", link: "#kontak", icon: <MessageSquare className="h-4 w-4" /> },
  ]

  return <FloatingNav navItems={navItems} className="bg-white/80 dark:bg-black/50" />
}
