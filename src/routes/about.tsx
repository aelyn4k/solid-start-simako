import { A } from "@solidjs/router";
import { Building2, CheckCircle2, ClipboardList, HeartHandshake, ShieldCheck, Users } from "lucide-solid";

const values = [
  {
    icon: <ShieldCheck size={22} />,
    title: "Transparan",
    description: "Status kamar, harga, dan fasilitas ditampilkan jelas agar calon penyewa tidak menebak-nebak."
  },
  {
    icon: <ClipboardList size={22} />,
    title: "Tertata",
    description: "Informasi kamar, penyewa, dan proses booking dibuat rapi supaya operasional kost lebih mudah dipantau."
  },
  {
    icon: <HeartHandshake size={22} />,
    title: "Responsif",
    description: "Akses kontak dan bantuan dibuat mudah ketika penyewa atau pemilik kost mengalami kendala akun."
  }
];

export default function About() {
  return (
    <main class="pb-16">
      <section class="section-divider py-12 md:py-16">
        <div class="layout-shell grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p class="eyebrow">Tentang SIMAKO</p>
            <h1 class="ui-heading mt-5 text-4xl font-bold leading-tight md:text-5xl">
              Platform kost digital untuk pencarian kamar dan pengelolaan yang lebih rapi.
            </h1>
            <p class="ui-lead mt-5 max-w-2xl leading-8">
              SIMAKO dirancang untuk mempertemukan calon penyewa dengan kamar yang sesuai, sekaligus membantu pemilik kost menjaga data kamar,
              penyewa, tagihan, dan komunikasi tetap terpusat.
            </p>
            <div class="mt-8 flex flex-wrap gap-4">
              <A href="/search" class="btn-primary px-6 py-3 text-sm">
                Cari Kamar
              </A>
              <A href="/contact" class="btn-secondary px-6 py-3 text-sm">
                Hubungi CS
              </A>
            </div>
          </div>

          <div class="surface-card p-6 md:p-7">
            <div class="grid gap-4">
              <div class="info-tile">
                <Building2 size={20} />
                <span>Data kamar dan pemilik kost tersusun dalam satu alur.</span>
              </div>
              <div class="info-tile">
                <Users size={20} />
                <span>Penyewa dapat membandingkan pilihan sebelum survei.</span>
              </div>
              <div class="info-tile">
                <CheckCircle2 size={20} />
                <span>Proses booking dibuat lebih mudah dipantau dari awal.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="layout-shell py-12 md:py-16">
        <div class="mb-8">
          <h2 class="ui-heading text-3xl font-bold">Cara SIMAKO Membantu</h2>
          <p class="ui-text mt-3 max-w-2xl leading-7">
            Fokus SIMAKO adalah membuat informasi kost lebih mudah dipercaya dan operasional harian lebih ringan untuk dikelola.
          </p>
        </div>
        <div class="grid gap-6 md:grid-cols-3">
          {values.map((item) => (
            <article class="surface-card h-full p-6">
              <div class="feature-icon mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl text-red-400">
                {item.icon}
              </div>
              <h3 class="ui-title text-lg font-bold">{item.title}</h3>
              <p class="ui-text mt-3 text-sm leading-7">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section class="layout-shell">
        <div class="surface-card p-6 md:p-8">
          <h2 class="ui-heading text-2xl font-bold">Untuk Penyewa dan Pemilik Kost</h2>
          <p class="ui-text mt-4 leading-8">
            Bagi penyewa, SIMAKO membantu membaca pilihan kamar dengan lebih cepat: fasilitas, status ketersediaan, harga, lokasi, dan kontak
            pengelola. Bagi pemilik kost, SIMAKO menjadi pondasi awal untuk menyusun katalog kamar, menerima calon penyewa, dan menjaga
            komunikasi tetap jelas.
          </p>
        </div>
      </section>
    </main>
  );
}
