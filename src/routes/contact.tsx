import { A } from "@solidjs/router";
import { AlertCircle, Clock, Mail, MessageCircle, Phone, Send } from "lucide-solid";

const supportOptions = [
  {
    icon: <MessageCircle size={22} />,
    title: "WhatsApp CS",
    description: "Untuk kendala login, verifikasi akun, atau status booking yang butuh respons cepat.",
    action: "Chat CS",
    href: "https://wa.me/6281234567890"
  },
  {
    icon: <Mail size={22} />,
    title: "Email Support",
    description: "Kirim detail masalah akun, screenshot, dan email terdaftar agar pengecekan lebih akurat.",
    action: "Kirim Email",
    href: "mailto:halo@simako.id"
  },
  {
    icon: <Phone size={22} />,
    title: "Telepon Pengelola",
    description: "Untuk jadwal survei kamar, kendala pembayaran, atau pertanyaan operasional kost.",
    action: "Hubungi",
    href: "tel:+6281234567890"
  }
];

export default function ContactPage() {
  return (
    <main class="pb-16">
      <section class="section-divider py-12 md:py-16">
        <div class="layout-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p class="eyebrow">Kontak & CS</p>
            <h1 class="ui-heading mt-5 text-4xl font-bold leading-tight md:text-5xl">
              Ada kendala akun atau booking? Tim SIMAKO siap membantu.
            </h1>
            <p class="ui-lead mt-5 max-w-2xl leading-8">
              Sampaikan masalah akun, lupa akses, status booking, atau pertanyaan seputar kamar melalui kanal bantuan resmi.
            </p>
            <div class="mt-7 surface-card p-5">
              <div class="flex items-start gap-3">
                <Clock class="mt-1 text-red-400" size={19} />
                <div>
                  <h2 class="ui-title font-bold">Jam layanan</h2>
                  <p class="ui-text mt-1 text-sm leading-7">Senin - Minggu, 08.00 - 21.00 WIB. Pesan di luar jam layanan akan diproses pada antrean berikutnya.</p>
                </div>
              </div>
            </div>
          </div>

          <form class="surface-card auth-panel p-6 md:p-8" onSubmit={(event) => event.preventDefault()}>
            <div class="mb-6">
              <h2 class="ui-heading text-2xl font-bold">Laporkan Kendala</h2>
              <p class="ui-text mt-2 text-sm">Isi ringkas agar CS bisa memahami masalah Anda sejak pesan pertama.</p>
            </div>
            <div class="grid gap-5 md:grid-cols-2">
              <label class="block">
                <span class="form-label">Nama</span>
                <input class="form-control mt-2" placeholder="Nama lengkap" />
              </label>
              <label class="block">
                <span class="form-label">Email akun</span>
                <input class="form-control mt-2" type="email" placeholder="nama@email.com" />
              </label>
              <label class="block md:col-span-2">
                <span class="form-label">Kategori kendala</span>
                <select class="form-control mt-2">
                  <option>Login atau password</option>
                  <option>Register akun</option>
                  <option>Booking kamar</option>
                  <option>Pembayaran</option>
                  <option>Lainnya</option>
                </select>
              </label>
              <label class="block md:col-span-2">
                <span class="form-label">Detail kendala</span>
                <textarea class="form-control mt-2 min-h-32 resize-y" placeholder="Tuliskan kronologi singkat dan data yang relevan." />
              </label>
              <button type="submit" class="btn-primary md:col-span-2 px-5 py-3 text-sm">
                <Send size={17} />
                Kirim Laporan
              </button>
            </div>
          </form>
        </div>
      </section>

      <section class="layout-shell py-12">
        <div class="mb-8">
          <h2 class="ui-heading text-3xl font-bold">Kanal Bantuan</h2>
          <p class="ui-text mt-3 max-w-2xl leading-7">Pilih kanal sesuai urgensi dan jenis kendala yang sedang Anda alami.</p>
        </div>
        <div class="grid gap-6 md:grid-cols-3">
          {supportOptions.map((item) => (
            <article class="surface-card h-full p-6">
              <div class="feature-icon mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl text-red-400">
                {item.icon}
              </div>
              <h3 class="ui-title text-lg font-bold">{item.title}</h3>
              <p class="ui-text mt-3 text-sm leading-7">{item.description}</p>
              <A href={item.href} target="_blank" class="btn-secondary mt-5 w-full px-4 py-2 text-sm">
                {item.action}
              </A>
            </article>
          ))}
        </div>
      </section>

      <section class="layout-shell">
        <div class="rounded-xl border border-red-400/30 bg-red-500/10 p-5">
          <div class="flex items-start gap-3">
            <AlertCircle class="mt-1 text-red-400" size={19} />
            <p class="ui-text text-sm leading-7">
              Jangan bagikan password, OTP, atau data sensitif lain kepada pihak yang mengaku sebagai CS. SIMAKO hanya meminta data yang diperlukan
              untuk verifikasi kendala.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
