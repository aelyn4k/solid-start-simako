import { A } from "@solidjs/router";
import { Database, Eye, LockKeyhole, Mail, ShieldCheck, UserCheck } from "lucide-solid";

const privacySections = [
  {
    icon: <Database size={22} />,
    title: "Data yang Dikumpulkan",
    description:
      "SIMAKO dapat menyimpan data akun seperti nama, email, nomor WhatsApp, pilihan role akun, preferensi kamar, laporan kendala, serta aktivitas booking yang Anda lakukan di platform."
  },
  {
    icon: <Eye size={22} />,
    title: "Penggunaan Data",
    description:
      "Data digunakan untuk menampilkan kamar, memproses booking, menghubungkan penyewa dengan pengelola, menangani kendala akun, dan meningkatkan pengalaman penggunaan SIMAKO."
  },
  {
    icon: <LockKeyhole size={22} />,
    title: "Keamanan Akun",
    description:
      "Kami menganjurkan pengguna menjaga password dan tidak membagikan OTP, kredensial, atau akses akun kepada pihak lain. SIMAKO tidak pernah meminta password melalui chat."
  },
  {
    icon: <UserCheck size={22} />,
    title: "Kontrol Pengguna",
    description:
      "Pengguna dapat meminta pembaruan, koreksi, atau penghapusan data tertentu melalui kanal bantuan resmi selama permintaan dapat diverifikasi."
  }
];

export default function PrivacyPage() {
  return (
    <main class="pb-16">
      <section class="section-divider py-12 md:py-16">
        <div class="layout-shell grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-start">
          <div>
            <p class="eyebrow">Kebijakan Privasi</p>
            <h1 class="ui-heading mt-5 text-4xl font-bold leading-tight md:text-5xl">
              Cara SIMAKO menjaga dan menggunakan data Anda.
            </h1>
            <p class="ui-lead mt-5 max-w-2xl leading-8">
              Kebijakan ini menjelaskan jenis data yang dapat diproses, tujuan penggunaannya, dan langkah yang dapat Anda lakukan ketika
              membutuhkan bantuan terkait data akun.
            </p>
            <p class="ui-muted mt-4 text-sm">Terakhir diperbarui: 25 April 2026</p>
          </div>

          <div class="surface-card p-6">
            <div class="feature-icon mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl text-red-400">
              <ShieldCheck size={24} />
            </div>
            <h2 class="ui-heading text-2xl font-bold">Prinsip Privasi</h2>
            <p class="ui-text mt-3 leading-7">
              Data hanya digunakan untuk kebutuhan layanan SIMAKO seperti akun, pencarian kamar, booking, komunikasi pengelola, dan bantuan CS.
            </p>
          </div>
        </div>
      </section>

      <section class="layout-shell py-12">
        <div class="grid gap-6 md:grid-cols-2">
          {privacySections.map((item) => (
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
        <div class="surface-card p-6 md:p-8">
          <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="ui-heading text-2xl font-bold">Butuh bantuan privasi?</h2>
              <p class="ui-text mt-2 leading-7">
                Hubungi CS jika Anda ingin mengoreksi data akun, melaporkan akses tidak sah, atau menanyakan penggunaan data.
              </p>
            </div>
            <A href="/contact" class="btn-primary px-6 py-3 text-sm">
              <Mail size={17} />
              Hubungi CS
            </A>
          </div>
        </div>
      </section>
    </main>
  );
}
