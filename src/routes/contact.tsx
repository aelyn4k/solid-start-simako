import { A } from "@solidjs/router";
import { AlertCircle, Clock, Mail, MessageCircle } from "lucide-solid";

const supportOptions = [
  {
    icon: <Mail size={22} />,
    title: "Email",
    description: "Kirim kendala akun, booking, atau pembayaran dengan detail singkat dan email terdaftar.",
    action: "Kirim Email",
    href: "mailto:halo@simako.id",
  },
  {
    icon: <MessageCircle size={22} />,
    title: "Instagram",
    description: "Gunakan DM Instagram untuk pertanyaan umum dan informasi terbaru seputar SIMAKO.",
    action: "Buka Instagram",
    href: "https://instagram.com/simako.id",
  }
];

export default function ContactPage() {
  return (
    <main class="pb-12">
      <section class="section-divider py-12 md:py-16">
        <div class="layout-shell max-w-4xl">
          <h1 class="ui-heading mt-5 text-4xl font-bold leading-tight md:text-5xl">
            Bantuan SIMAKO tersedia melalui email dan Instagram.
          </h1>
          <p class="ui-lead mt-5 max-w-3xl leading-8">
            Pilih kanal resmi di bawah. Sertakan email akun dan detail kendala agar proses pengecekan lebih mudah.
          </p>
          <div class="mt-7 surface-card p-5">
            <div class="flex items-start gap-3">
              <Clock class="mt-1 text-red-400" size={19} />
              <div>
                <h2 class="ui-title font-bold">Jam layanan</h2>
                <p class="ui-text mt-1 text-sm leading-7">
                  Senin - Minggu, 08.00 - 21.00 WIB. Pesan di luar jam layanan akan dibalas pada antrean berikutnya.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="layout-shell max-w-4xl py-10 md:py-14">
        <div class="grid gap-6 md:grid-cols-2">
          {supportOptions.map((item) => (
            <article class="surface-card h-full p-6">
              <div class="feature-icon mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl text-red-400">
                {item.icon}
              </div>
              <h3 class="ui-title text-lg font-bold">{item.title}</h3>
              <p class="ui-text mt-3 text-sm leading-7">{item.description}</p>
              <A href={item.href} target="_blank" rel="noreferrer" class="btn-secondary mt-5 w-full px-4 py-2 text-sm">
                {item.action}
              </A>
            </article>
          ))}
        </div>
      </section>

      <section class="layout-shell max-w-4xl">
        <div class="rounded-xl border border-red-400/30 bg-red-500/10 p-5">
          <div class="flex items-start gap-3">
            <AlertCircle class="mt-1 text-red-400" size={19} />
            <p class="ui-text text-sm leading-7">
              SIMAKO tidak melayani bantuan melalui WhatsApp atau telepon. Jangan bagikan password, OTP, atau data sensitif kepada pihak mana pun.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
