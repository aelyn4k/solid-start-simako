import { A } from "@solidjs/router";
import { Building2, ClipboardList, Search, ShieldCheck } from "lucide-solid";

const values = [
  {
    icon: <ShieldCheck size={22} />,
    title: "Informasi jelas",
    description:
      "Status kamar, harga, fasilitas, dan pemilik ditampilkan ringkas agar mudah dibandingkan.",
  },
  {
    icon: <Search size={22} />,
    title: "Pencarian cepat",
    description:
      "Filter membantu penyewa menemukan kamar sesuai kebutuhan tanpa membuka terlalu banyak halaman.",
  },
  {
    icon: <ClipboardList size={22} />,
    title: "Data tertata",
    description:
      "Pemilik dapat menjaga data kamar, penyewa, booking, dan tagihan dalam alur yang lebih rapi.",
  },
];

export default function About() {
  return (
    <main class="pb-12">
      <section class="section-divider py-12 md:py-16">
        <div class="layout-shell max-w-4xl">
          <h1 class="ui-heading mt-5 text-4xl font-bold leading-tight md:text-5xl">
            SIMAKO membantu pencarian kost dan pengelolaan kamar dalam satu
            tempat.
          </h1>
          <p class="ui-lead mt-5 max-w-3xl leading-8">
            Platform ini dibuat agar penyewa bisa membaca informasi kamar dengan
            cepat, sementara pemilik kost dapat menjaga data operasional tetap
            rapi.
          </p>
          <div class="mt-8 flex flex-wrap gap-4">
            <A href="/search" class="btn-primary px-6 py-3 text-sm">
              Cari Kamar
            </A>
          </div>
        </div>
      </section>

      <section class="layout-shell py-10 md:py-14">
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
    </main>
  );
}
