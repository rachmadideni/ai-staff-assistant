"use client"

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"

const testimonials = [
  {
    quote: "Sebelum menggunakan produk ini, saya menghabiskan 2 jam sehari hanya untuk mencari dokumen. Sekarang? 2 menit.",
    name: "Andi Pratama",
    title: "Legal Consultant, Jakarta",
  },
  {
    quote: "Tim kami akhirnya bisa fokus pada pekerjaan produktif, bukan menghabiskan waktu mencari file di folder yang berantakan.",
    name: "Sarah Chen",
    title: "Office Manager, Surabaya",
  },
  {
    quote: "Setup-nya sangat mudah. Dalam 5 menit, semua dokumen perusahaan kami sudah bisa diakses oleh tim.",
    name: "Budi Santoso",
    title: "Business Owner, Bandung",
  },
  {
    quote: "Sebagai pengacara, saya sering membutuhkan referensi cepat dari dokumen lama. Produk ini mengubah cara kerja saya.",
    name: "Maya Indira",
    title: "Senior Partner, Bali",
  },
  {
    quote: "Klien kami terkesan dengan respons time yang lebih cepat. Semua berkat knowledge base yang terorganisir.",
    name: "Rizky Firmansyah",
    title: "Director, Yogyakarta",
  },
  {
    quote: "Ini seperti memiliki asisten digital yang selalu tahu di mana semua dokumen perusahaan berada.",
    name: "Dewi Lestari",
    title: "Admin Head, Semarang",
  },
]

export function LandingTestimonials() {
  return (
    <section className="py-16">
      <div className="max-w-[680px] mx-auto mb-8">
        <h2 className="text-[22px] md:text-[28px] font-bold text-black dark:text-white mb-2">
          Dipercaya Profesional
        </h2>
        <p className="text-[15px] text-[#3C3C43] dark:text-[#EBEBF5]">
          Mereka sudah merasakan bedanya.
        </p>
      </div>
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="normal"
      />
    </section>
  )
}
