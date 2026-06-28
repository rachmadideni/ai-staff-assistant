import Link from "next/link"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@/lib/supabase/server"
import { LandingNavbar } from "@/components/landing/navbar"
import { LandingHero } from "@/components/landing/hero"
import { LandingBentoSteps } from "@/components/landing/bento-steps"
import { LandingTestimonials } from "@/components/landing/testimonials"

export const metadata = {
  title: "[Nama Produk] — Knowledge Base yang Mudah Ditemukan",
  description:
    "Ubah dokumen yang tersebar menjadi knowledge base yang mudah dicari. Untuk admin, pengacara, legal consultant, dan profesional.",
}

export default async function HomePage() {
  const supabase = await createServerComponentClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black">
      <LandingNavbar />

      <LandingHero />

      {/* Problem Section */}
      <section className="px-6 py-16 bg-white dark:bg-[#1C1C1E]">
        <div className="max-w-[680px] mx-auto">
          <h2 className="text-[22px] md:text-[28px] font-bold text-black dark:text-white mb-2">
            Masalah yang Anda Hadapi
          </h2>
          <p className="text-[15px] text-[#3C3C43] dark:text-[#EBEBF5] mb-12">
            Anda tidak sendirian. Ini yang dirasakan banyak profesional.
          </p>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-[#FF3B30]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[17px] font-semibold text-black dark:text-white mb-1">
                  Dokumen Tersebar
                </h3>
                <p className="text-[15px] text-[#3C3C43] dark:text-[#EBEBF5]">
                  Dokumen ada di email, drive, folder bersama — susah ditemukan
                  saat dibutuhkan.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-[#FF9500]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
              </div>
              <div>
                <h3 className="text-[17px] font-semibold text-black dark:text-white mb-1">
                  Waktu Terbuang
                </h3>
                <p className="text-[15px] text-[#3C3C43] dark:text-[#EBEBF5]">
                  Anda harus menelusuri banyak folder hanya untuk menemukan satu
                  informasi.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-[#8E8E93]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <div>
                <h3 className="text-[17px] font-semibold text-black dark:text-white mb-1">
                  Informasi Tersembunyi
                </h3>
                <p className="text-[15px] text-[#3C3C43] dark:text-[#EBEBF5]">
                  Pengetahuan berharga terkunci di antara ratusan file yang sulit
                  diakses.
                </p>
              </div>
            </div>
          </div>

          <p className="text-[17px] font-medium text-black dark:text-white mt-12">
            Pengetahuan seharusnya mudah diakses, bukan tersembunyi.
          </p>
        </div>
      </section>

      {/* Guide Section */}
      <section className="px-6 py-16">
        <div className="max-w-[680px] mx-auto">
          <h2 className="text-[22px] md:text-[28px] font-bold text-black dark:text-white mb-4">
            Kami Paham Rasanya
          </h2>
          <p className="text-[17px] text-[#3C3C43] dark:text-[#EBEBF5] leading-relaxed mb-6">
            Kami juga pernah kehilangan waktu berjam-jam hanya untuk mencari satu
            informasi di antara puluhan dokumen. Itu sebabnya kami membangun
            solusi ini.
          </p>
          <p className="text-[17px] text-[#3C3C43] dark:text-[#EBEBF5]">
            Sudah membantu perusahaan mengakses pengetahuan mereka{" "}
            <span className="font-semibold text-black dark:text-white">10x lebih cepat</span>.
          </p>
        </div>
      </section>

      <LandingBentoSteps />

      {/* Success Section */}
      <section className="px-6 py-16">
        <div className="max-w-[680px] mx-auto">
          <h2 className="text-[22px] md:text-[28px] font-bold text-black dark:text-white mb-8">
            Bayangkan Setelah Anda Menggunakan
          </h2>
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-5 h-5 mt-0.5 text-[#34C759]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-[17px] text-[#3C3C43] dark:text-[#EBEBF5]">
                Semua pengetahuan terorganisir dan mudah diakses
              </p>
            </div>
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-5 h-5 mt-0.5 text-[#34C759]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-[17px] text-[#3C3C43] dark:text-[#EBEBF5]">
                Tim fokus pada pekerjaan produktif, bukan pencarian dokumen
              </p>
            </div>
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-5 h-5 mt-0.5 text-[#34C759]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-[17px] text-[#3C3C43] dark:text-[#EBEBF5]">
                Informasi selalu tersedia kapan saja dibutuhkan
              </p>
            </div>
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-5 h-5 mt-0.5 text-[#34C759]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-[17px] text-[#3C3C43] dark:text-[#EBEBF5]">
                Anda bisa fokus pada keahlian, bukan administrasi
              </p>
            </div>
          </div>
        </div>
      </section>

      <LandingTestimonials />

      {/* CTA Section */}
      <section className="px-6 py-16 bg-white dark:bg-[#1C1C1E]">
        <div className="max-w-[680px] mx-auto">
          <h2 className="text-[22px] md:text-[28px] font-bold text-black dark:text-white mb-4">
            Siap Memulai?
          </h2>
          <p className="text-[17px] text-[#3C3C43] dark:text-[#EBEBF5] mb-8">
            Gratis untuk memulai. Tanpa kartu kredit. Setup 5 menit.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center h-[44px] px-6 bg-[#007AFF] dark:bg-[#0A84FF] text-white text-[17px] font-semibold rounded-lg hover:opacity-80 transition-opacity"
          >
            Mulai Gratis Sekarang
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-[#C6C6C8] dark:border-[#38383A]">
        <div className="max-w-[680px] mx-auto text-center text-[13px] text-[#8E8E93]">
          &copy; {new Date().getFullYear()} [Nama Produk]. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
