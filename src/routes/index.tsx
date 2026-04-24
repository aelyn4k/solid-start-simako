import { A } from "@solidjs/router";
import { Search, MapPin, Phone, Wifi, Wind, Tv, ShieldCheck, ReceiptText, BellRing, Users } from "lucide-solid";
import type { Component, JSX } from "solid-js";

type RoomStatus = "Tersedia" | "Terisi";

interface Facility {
  icon: JSX.Element;
  name: string;
}

interface Room {
  id: number;
  name: string;
  price: string;
  status: RoomStatus;
  image: string;
  facilities: Facility[];
}

const RoomCard: Component<{ room: Room }> = (props) => (
  <article class="surface-card relative flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-red-500/20 group">
    <img src={props.room.image} alt={props.room.name} class="w-full h-48 object-cover" />
    <div class="flex flex-1 flex-col p-5">
      <h3 class="text-lg font-bold text-white">{props.room.name}</h3>
      <p class="mt-1 text-sm font-semibold text-red-400">{props.room.price}</p>
      <div class="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-300">
        {props.room.facilities.map((facility) => (
          <span class="inline-flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900/70 px-2 py-1">
            {facility.icon}
            <span>{facility.name}</span>
          </span>
        ))}
      </div>
      <A
        href={`/room/${props.room.id}`}
        class="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-red-400/70 hover:text-white"
      >
        Lihat Detail Kamar
      </A>
    </div>
    <div class="absolute top-2 right-2">
      <span class={`px-3 py-1 text-sm font-semibold rounded-full ${props.room.status === "Tersedia" ? "bg-green-500 text-white" : "bg-yellow-500 text-gray-900"}`}>
        {props.room.status}
      </span>
    </div>
  </article>
);

interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
}

export default function Home() {
  const rooms: Room[] = [
    {
      id: 1,
      name: "Kamar 101 - Tipe Premium",
      price: "Rp 1.500.000 / bulan",
      status: "Tersedia",
      image:
        "https://images.unsplash.com/photo-1585672799395-3953a8364a32?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      facilities: [
        { icon: <Wifi size={14} />, name: "Wi-Fi Cepat" },
        { icon: <Tv size={14} />, name: "KM Dalam" }
      ]
    },
    {
      id: 2,
      name: "Kamar 102 - Tipe Reguler",
      price: "Rp 1.200.000 / bulan",
      status: "Terisi",
      image:
        "https://images.unsplash.com/photo-1595526114035-0d45ed16433d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      facilities: [
        { icon: <Wind size={14} />, name: "Kipas Angin" },
        { icon: <Tv size={14} />, name: "KM Luar" }
      ]
    },
    {
      id: 3,
      name: "Kamar 201 - Tipe Premium",
      price: "Rp 1.600.000 / bulan",
      status: "Tersedia",
      image:
        "https://images.unsplash.com/photo-1560185893-a5536c80e64d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      facilities: [
        { icon: <Wifi size={14} />, name: "Wi-Fi Cepat" },
        { icon: <Tv size={14} />, name: "KM Dalam" }
      ]
    },
    {
      id: 4,
      name: "Kamar 202 - Tipe Reguler",
      price: "Rp 1.250.000 / bulan",
      status: "Tersedia",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      facilities: [
        { icon: <Wind size={14} />, name: "Sirkulasi Udara" },
        { icon: <Tv size={14} />, name: "KM Luar" }
      ]
    }
  ];

  const features: Feature[] = [
    {
      icon: <ShieldCheck size={24} class="text-red-300" />,
      title: "Monitoring Kamar Real-time",
      description: "Cek status kamar kosong atau terisi kapan saja dengan dashboard yang selalu diperbarui."
    },
    {
      icon: <Users size={24} class="text-blue-300" />,
      title: "Manajemen Penyewa Terpusat",
      description: "Data penyewa, riwayat sewa, dan dokumen penting tersimpan rapi dalam satu sistem."
    },
    {
      icon: <ReceiptText size={24} class="text-emerald-300" />,
      title: "Tagihan Lebih Tertib",
      description: "Atur tagihan bulanan, tenggat pembayaran, hingga verifikasi bukti bayar secara mudah."
    },
    {
      icon: <BellRing size={24} class="text-amber-300" />,
      title: "Notifikasi Otomatis",
      description: "Pengingat jatuh tempo dan pembaruan status pembayaran terkirim otomatis tanpa repot."
    }
  ];

  return (
    <main class="pb-16">
      <section class="border-b border-slate-800/70 py-14 md:py-20">
        <div class="layout-shell grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p class="inline-flex rounded-full border border-red-400/40 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-red-300">
              SIMAKO
            </p>
            <h1 class="mt-5 text-4xl font-bold leading-tight text-slate-50 md:text-6xl">
              Temukan Kost Nyaman dan Kelola Semua Lebih Praktis
            </h1>
            <p class="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              SIMAKO membantu penyewa menemukan kamar ideal dan memudahkan pemilik kost mengelola kamar,
              tagihan, serta komunikasi dalam satu platform digital.
            </p>

            <div class="mt-8 flex flex-wrap items-center gap-4">
              <A href="/search" class="btn-primary px-6 py-3 text-sm">
                <Search size={18} />
                Jelajahi Kamar
              </A>
              <A
                href="/register"
                class="inline-flex items-center justify-center rounded-lg border border-slate-600 bg-[#0A1A43] px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500"
              >
                Daftar Sekarang
              </A>
            </div>

            <div class="mt-8 surface-card p-4 md:p-5">
              <form class="grid gap-3 md:grid-cols-4" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Lokasi"
                  class="rounded-lg border border-slate-700 bg-[#061736] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-red-400 focus:outline-none"
                />
                <select class="rounded-lg border border-slate-700 bg-[#061736] px-3 py-2 text-sm text-slate-100 focus:border-red-400 focus:outline-none">
                  <option>Harga</option>
                  <option>&lt; Rp 1.200.000</option>
                  <option>Rp 1.200.000 - Rp 1.500.000</option>
                  <option>&gt; Rp 1.500.000</option>
                </select>
                <select class="rounded-lg border border-slate-700 bg-[#061736] px-3 py-2 text-sm text-slate-100 focus:border-red-400 focus:outline-none">
                  <option>Tipe Kamar</option>
                  <option>Putra</option>
                  <option>Putri</option>
                  <option>Campur</option>
                </select>
                <button type="submit" class="btn-primary px-4 py-2 text-sm">
                  Cari Sekarang
                </button>
              </form>
            </div>
          </div>

          <div class="surface-card overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1668&auto=format&fit=crop"
              alt="Suasana kost modern"
              class="h-[360px] w-full object-cover md:h-[420px]"
            />
          </div>
        </div>
      </section>

      <section class="layout-shell py-14 md:py-16">
        <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 class="text-3xl font-bold text-white">Kamar Pilihan</h2>
            <p class="mt-2 text-slate-300">Pilihan kamar terbaik dengan informasi yang jelas dan status terkini.</p>
          </div>
          <A href="/search" class="text-sm font-semibold text-red-300 transition hover:text-red-200">
            Lihat Semua Kamar
          </A>
        </div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {rooms.map((room) => <RoomCard room={room} />)}
        </div>
      </section>

      <section class="layout-shell py-12 md:py-16">
        <div class="mb-8 text-center">
          <h2 class="text-3xl font-bold text-white md:text-4xl">Fitur Unggulan SIMAKO</h2>
          <p class="mx-auto mt-3 max-w-2xl text-slate-300">
            Tampilan baru yang lebih elegan untuk membantu operasional kost berjalan cepat, rapi, dan transparan.
          </p>
        </div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <article class="surface-card h-full p-6 transition duration-300 hover:-translate-y-1 hover:border-red-400/50">
              <div class="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-[#0A1A43]">
                {feature.icon}
              </div>
              <h3 class="text-lg font-semibold text-white">{feature.title}</h3>
              <p class="mt-3 text-sm leading-7 text-slate-300">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section class="layout-shell py-10 md:py-14">
        <div class="surface-card overflow-hidden p-6 md:p-10">
          <div class="grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
            <div>
              <h2 class="text-3xl font-bold text-white">Hubungi Pengelola</h2>
              <p class="mt-3 leading-8 text-slate-300">
                Ingin survei kamar atau butuh info detail fasilitas? Tim pengelola siap membantu Anda setiap hari.
              </p>
              <div class="mt-6 space-y-4 text-sm">
                <div class="flex items-start gap-3">
                  <MapPin class="mt-0.5 text-red-400" size={18} />
                  <p class="text-slate-200">
                    Telkom University Purwokerto, Jl. D.I. Panjaitan No.128, Purwokerto Selatan, Banyumas
                  </p>
                </div>
                <div class="flex items-start gap-3">
                  <Phone class="mt-0.5 text-red-400" size={18} />
                  <p class="text-slate-200">Layanan Pengelola: Senin - Minggu, 08.00 - 21.00 WIB</p>
                </div>
              </div>

              <div class="mt-8 flex flex-wrap items-center gap-4">
                <A href="https://wa.me/6281234567890" target="_blank" class="btn-primary px-6 py-3 text-sm">
                  <Phone size={16} />
                  Hubungi via WhatsApp
                </A>
                <A
                  href="https://maps.google.com/?q=Telkom+University+Purwokerto"
                  target="_blank"
                  class="inline-flex items-center justify-center rounded-lg border border-slate-600 bg-[#0A1A43] px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500"
                >
                  Buka di Google Maps
                </A>
              </div>
            </div>

            <div class="overflow-hidden rounded-xl border border-slate-700">
              <iframe
                title="Peta Telkom University Purwokerto"
                src="https://maps.google.com/maps?q=Telkom%20University%20Purwokerto&t=&z=15&ie=UTF8&iwloc=&output=embed"
                class="h-[360px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowfullscreen
              />
            </div>
          </div>
        </div>
      </section>

      <section class="layout-shell mt-4">
        <div class="rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-700/90 to-red-600/90 px-6 py-10 text-center shadow-[0_18px_40px_rgba(190,24,46,0.35)] md:px-10">
          <h2 class="text-3xl font-bold text-white">Daftar untuk Booking Sekarang</h2>
          <p class="mx-auto mt-3 max-w-2xl text-red-100">
            Mulai proses booking dengan cepat, pantau status pembayaran, dan nikmati manajemen kost yang lebih tertata.
          </p>
          <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
            <A href="/register" class="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50">
              Buat Akun
            </A>
            <A href="/about" class="rounded-lg border border-red-200/70 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500/30">
              Pelajari SIMAKO
            </A>
          </div>
        </div>
      </section>
    </main>
  );
}
