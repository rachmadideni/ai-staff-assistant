"use client"

import { DottedGlowBackground } from "@/components/ui/dotted-glow-background"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"
import Link from "next/link"

export function LandingHero() {
  return (
    <section className="relative px-6 pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <DottedGlowBackground
        className="absolute inset-0"
        gap={14}
        radius={1.5}
        opacity={0.5}
        glowColor="rgba(0, 122, 255, 0.6)"
        darkGlowColor="rgba(10, 132, 255, 0.6)"
      />
      <div className="relative z-10 max-w-[680px] mx-auto">
        <TypewriterEffect
          words={[
            { text: "Dokumen" },
            { text: "Anda," },
            { text: "Selalu" },
            { text: "Siap" },
            { text: "Ditemukan" },
          ]}
          className="text-[28px] md:text-[34px] lg:text-[42px] font-bold mb-4"
        />
        <p className="text-[17px] text-[#3C3C43] dark:text-[#EBEBF5] leading-relaxed mb-8 text-center">
          Ubah dokumen yang tersebar menjadi knowledge base yang mudah dicari
          — untuk tim, admin, dan profesional.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center h-[44px] px-6 bg-[#007AFF] dark:bg-[#0A84FF] text-white text-[17px] font-semibold rounded-lg hover:opacity-80 transition-opacity"
          >
            Mulai Gratis
          </Link>
          <Link
            href="#cara-kerja"
            className="inline-flex items-center justify-center h-[44px] px-6 text-[#007AFF] dark:text-[#0A84FF] text-[17px] font-normal hover:opacity-70 transition-opacity"
          >
            Pelajari Lebih Lanjut
          </Link>
        </div>
      </div>
    </section>
  )
}
