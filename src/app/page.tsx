import Link from "next/link"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Knowledge Base yang Mudah Ditemukan",
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
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 items-center justify-center px-6 py-20">
        <div className="max-w-3xl text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Dokumen Anda, Selalu Siap Ditemukan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ubah dokumen yang tersebar menjadi knowledge base yang mudah dicari
            — untuk tim, admin, dan profesional.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Mulai Gratis
            </Link>
            <Link
              href="#fitur"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Pelajari Lebih Lanjut
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="border-t bg-muted/40 px-6 py-20">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Masalah yang Anda Hadapi</h2>
            <p className="text-muted-foreground">
              Anda tidak sendirian. Ini yang dirasakan banyak profesional.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div className="space-y-3">
              <div className="text-2xl">📂</div>
              <h3 className="font-semibold">Dokumen Tersebar</h3>
              <p className="text-sm text-muted-foreground">
                Dokumen ada di email, drive, folder bersama — susah ditemukan
                saat dibutuhkan.
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-2xl">😤</div>
              <h3 className="font-semibold">Waktu Terbuang</h3>
              <p className="text-sm text-muted-foreground">
                Anda harus menelusuri banyak folder hanya untuk menemukan satu
                informasi.
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-2xl">🔍</div>
              <h3 className="font-semibold">Informasi Tersembunyi</h3>
              <p className="text-sm text-muted-foreground">
                Pengetahuan berharga terkunci di antara ratusan file yang sulit
                diakses.
              </p>
            </div>
          </div>

          <p className="text-center text-lg font-medium">
            Pengetahuan seharusnya mudah diakses, bukan tersembunyi.
          </p>
        </div>
      </section>

      {/* Guide Section */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Kami Paham Rasanya</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Kami juga pernah kehilangan waktu berjam-jam hanya untuk mencari satu
            informasi di antara puluhan dokumen. Itu sebabnya kami membangun
            solusi ini.
          </p>
          <p className="text-muted-foreground">
            Sudah membantu perusahaan mengakses pengetahuan mereka{" "}
            <span className="font-semibold text-foreground">10x lebih cepat</span>.
          </p>
        </div>
      </section>

      {/* Plan Section */}
      <section id="fitur" className="border-t bg-muted/40 px-6 py-20">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Cara Kerjanya</h2>
            <p className="text-muted-foreground">
              Tiga langkah sederhana untuk mengakses pengetahuan Anda.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                1
              </div>
              <h3 className="font-semibold">Upload</h3>
              <p className="text-sm text-muted-foreground">
                Unggah dokumen Anda — PDF, Word, atau format lainnya.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                2
              </div>
              <h3 className="font-semibold">Pahami</h3>
              <p className="text-sm text-muted-foreground">
                AI kami mengindeks dan memahami konten secara otomatis.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                3
              </div>
              <h3 className="font-semibold">Temukan</h3>
              <p className="text-sm text-muted-foreground">
                Cari informasi dengan percakapan natural, kapan saja.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Section */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Bayangkan Setelah Anda Menggunakan</h2>
          <div className="space-y-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            <p>✅ Semua pengetahuan terorganisir dan mudah diakses</p>
            <p>✅ Tim fokus pada pekerjaan produktif, bukan pencarian dokumen</p>
            <p>✅ Informasi selalu tersedia kapan saja dibutuhkan</p>
            <p>✅ Anda bisa fokus pada keahlian, bukan administrasi</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/40 px-6 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Siap Memulai?</h2>
          <p className="text-muted-foreground">
            Gratis untuk memulai. Tanpa kartu kredit. Setup 5 menit.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Mulai Gratis Sekarang
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8">
        <div className="max-w-3xl mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} [Nama Produk]. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
