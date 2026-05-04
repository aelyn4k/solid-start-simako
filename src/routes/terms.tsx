import { A } from "@solidjs/router";
import { AlertCircle, BadgeCheck, ClipboardCheck, Handshake, Home, Scale } from "lucide-solid";

const terms = [
  {
    icon: <BadgeCheck size={22} />,
    title: "Akun dan Identitas",
    description:
      "Pengguna bertanggung jawab memastikan data akun yang diberikan benar, termasuk email, nomor WhatsApp, dan role sebagai penyewa atau pemilik kost."
  },
  {
    icon: <Home size={22} />,
    title: "Informasi Kamar",
    description:
      "Informasi kamar seperti harga, status, fasilitas, dan foto disediakan untuk membantu calon penyewa mengambil keputusan. Ketersediaan dapat berubah sesuai konfirmasi pengelola."
  },
  {
    icon: <Handshake size={22} />,
    title: "Booking dan Komunikasi",
    description:
      "Proses booking, survei, dan kesepakatan sewa wajib dikonfirmasi dengan pengelola. SIMAKO membantu alur informasi, tetapi keputusan sewa tetap mengikuti kesepakatan pengguna dan pengelola."
  },
  {
    icon: <ClipboardCheck size={22} />,
    title: "Penggunaan yang Wajar",
    description:
      "Pengguna tidak diperbolehkan menyalahgunakan fitur, mengirim data palsu, mengganggu pengguna lain, atau mencoba mengakses akun dan data yang bukan miliknya."
  }
];

export default function TermsPage() {
  return (
    <main class="pb-16">
      <section class="section-divider py-12 md:py-16">
        <div class="layout-shell grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-start">
          <div>
            <h1 class="ui-heading mt-5 text-4xl font-bold leading-tight md:text-5xl">
              Ketentuan penggunaan layanan SIMAKO.
            </h1>
            <p class="ui-lead mt-5 max-w-2xl leading-8">
              Dengan menggunakan SIMAKO, pengguna menyetujui ketentuan layanan untuk pencarian kamar, pendaftaran akun, komunikasi dengan
              pengelola, dan penggunaan fitur bantuan.
            </p>
            <p class="ui-muted mt-4 text-sm">Terakhir diperbarui: 25 April 2026</p>
          </div>

          <div class="surface-card p-6">
            <div class="feature-icon mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl text-red-400">
              <Scale size={24} />
            </div>
            <h2 class="ui-heading text-2xl font-bold">Ringkasan Ketentuan</h2>
            <p class="ui-text mt-3 leading-7">
              Gunakan SIMAKO secara benar, jaga keamanan akun, dan pastikan setiap transaksi atau sewa dikonfirmasi dengan pihak pengelola.
            </p>
          </div>
        </div>
      </section>

      <section class="layout-shell py-12">
        <div class="grid gap-6 md:grid-cols-2">
          {terms.map((item) => (
            <article class="surface-card h-full p-6">
              <div class="feature-icon mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl text-red-400">
                {item.icon}
              </div>
              <h2 class="ui-title text-xl font-bold">{item.title}</h2>
              <p class="ui-text mt-3 leading-7">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section class="layout-shell">
        <div class="rounded-xl border border-red-400/30 bg-red-500/10 p-5">
          <div class="flex items-start gap-3">
            <AlertCircle class="mt-1 text-red-400" size={19} />
            <p class="ui-text text-sm leading-7">
              Jika ada perbedaan informasi antara halaman SIMAKO dan konfirmasi langsung pengelola, gunakan konfirmasi terbaru dari pengelola sebagai acuan sebelum melakukan pembayaran atau sewa.
            </p>
          </div>
        </div>
        <div class="mt-6 flex flex-wrap gap-4">
          <A href="/privacy" class="btn-secondary px-6 py-3 text-sm">
            Kebijakan Privasi
          </A>
        </div>
      </section>
    </main>
  );
}
