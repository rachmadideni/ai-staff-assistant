"use client"

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { Upload, Brain, Search } from "lucide-react"

const steps = [
  {
    title: "Upload",
    description: "Unggah dokumen Anda — PDF, Word, atau format lainnya. Tidak perlu format khusus.",
    icon: <Upload className="h-6 w-6 text-[#007AFF]" />,
    header: (
      <div className="flex h-20 items-center justify-center rounded-xl bg-gradient-to-br from-[#007AFF]/10 to-[#007AFF]/5">
        <Upload className="h-10 w-10 text-[#007AFF]" />
      </div>
    ),
  },
  {
    title: "Pahami",
    description: "AI kami mengindeks dan memahami konten secara otomatis. Tidak perlu input manual.",
    icon: <Brain className="h-6 w-6 text-[#5856D6]" />,
    header: (
      <div className="flex h-20 items-center justify-center rounded-xl bg-gradient-to-br from-[#5856D6]/10 to-[#5856D6]/5">
        <Brain className="h-10 w-10 text-[#5856D6]" />
      </div>
    ),
  },
  {
    title: "Temukan",
    description: "Cari informasi dengan percakapan natural, kapan saja. Tanpa ribet.",
    icon: <Search className="h-6 w-6 text-[#34C759]" />,
    header: (
      <div className="flex h-20 items-center justify-center rounded-xl bg-gradient-to-br from-[#34C759]/10 to-[#34C759]/5">
        <Search className="h-10 w-10 text-[#34C759]" />
      </div>
    ),
  },
]

export function LandingBentoSteps() {
  return (
    <section id="cara-kerja" className="py-16 bg-white dark:bg-[#1C1C1E]">
      <div className="max-w-[680px] mx-auto mb-8">
        <h2 className="text-[22px] md:text-[28px] font-bold text-black dark:text-white mb-2">
          Cara Kerjanya
        </h2>
        <p className="text-[15px] text-[#3C3C43] dark:text-[#EBEBF5]">
          Tiga langkah sederhana untuk mengakses pengetahuan Anda.
        </p>
      </div>
      <div className="max-w-4xl mx-auto px-6">
        <BentoGrid className="grid-cols-1 md:grid-cols-3">
          {steps.map((step, i) => (
            <BentoGridItem
              key={i}
              title={step.title}
              description={step.description}
              icon={step.icon}
              header={step.header}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  )
}
