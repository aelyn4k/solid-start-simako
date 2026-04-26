import { A } from "@solidjs/router";
import {
  Bath,
  BellRing,
  BookOpen,
  MapPin,
  Phone,
  ReceiptText,
  Search,
  ShieldCheck,
  Shirt,
  Tv,
  Users,
  Wifi,
  Wind,
  Zap,
} from "lucide-solid";
import type { Component, JSX } from "solid-js";
import {
  facilityLabels,
  rooms,
  slugifyOwner,
  type Room,
  type RoomFacilityKey,
} from "~/data/rooms";

interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
}

const facilityIcon = (facility: RoomFacilityKey, size = 14) => {
  switch (facility) {
    case "wifi":
      return <Wifi size={size} />;
    case "tv":
      return <Tv size={size} />;
    case "privateBath":
    case "sharedBath":
      return <Bath size={size} />;
    case "fan":
    case "airflow":
      return <Wind size={size} />;
    case "wardrobe":
      return <Shirt size={size} />;
    case "desk":
      return <BookOpen size={size} />;
    case "electricity":
      return <Zap size={size} />;
    case "security":
      return <ShieldCheck size={size} />;
  }
};

const RoomCard: Component<{ room: Room }> = (props) => (
  <article class="surface-card room-card relative flex h-full flex-col overflow-hidden">
    <div class="overflow-hidden">
      <img
        src={props.room.image}
        alt={props.room.name}
        class="room-card-image h-48 w-full object-cover"
      />
    </div>
    <div class="relative z-10 flex flex-1 flex-col p-5">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="ui-muted text-xs font-semibold uppercase tracking-[0.16em]">
            {props.room.type}
          </p>
          <h3 class="ui-title mt-1 text-lg font-bold">{props.room.name}</h3>
        </div>
      </div>
      <p class="mt-2 text-sm font-semibold text-red-400">{props.room.price}</p>
      <A
        href={`/owner/${slugifyOwner(props.room.ownerName)}`}
        class="mt-3 text-sm font-semibold text-red-400 transition hover:text-red-300"
      >
        {props.room.ownerName}
      </A>
      <div class="mt-4 flex flex-wrap items-center gap-2 text-xs">
        {props.room.facilities.slice(0, 3).map((facility) => (
          <span class="facility-pill">
            {facilityIcon(facility)}
            <span>{facilityLabels[facility]}</span>
          </span>
        ))}
      </div>
      <A
        href={`/room/${props.room.id}`}
        class="btn-secondary mt-6 w-full px-4 py-2 text-sm"
      >
        Lihat Detail Kamar
      </A>
    </div>
    <div class="absolute top-3 right-3 z-20">
      <span
        class={`px-3 py-1 text-sm font-semibold rounded-full ${
          props.room.status === "Tersedia"
            ? "bg-green-500 text-white"
            : "bg-yellow-500 text-gray-900"
        }`}
      >
        {props.room.status}
      </span>
    </div>
  </article>
);

export default function Home() {
  const features: Feature[] = [
    {
      icon: <ShieldCheck size={24} class="text-red-300" />,
      title: "Monitoring Kamar Real-time",
      description:
        "Cek status kamar kosong atau terisi kapan saja dengan dashboard yang selalu diperbarui.",
    },
    {
      icon: <Users size={24} class="text-blue-300" />,
      title: "Manajemen Penyewa Terpusat",
      description:
        "Data penyewa, riwayat sewa, dan dokumen penting tersimpan rapi dalam satu sistem.",
    },
    {
      icon: <ReceiptText size={24} class="text-emerald-300" />,
      title: "Tagihan Lebih Tertib",
      description:
        "Atur tagihan bulanan, tenggat pembayaran, hingga verifikasi bukti bayar secara mudah.",
    },
    {
      icon: <BellRing size={24} class="text-amber-300" />,
      title: "Notifikasi Otomatis",
      description:
        "Pengingat jatuh tempo dan pembaruan status pembayaran terkirim otomatis tanpa repot.",
    },
  ];

  return (
    <main class="pb-16">
      <section class="section-divider py-14 md:py-20">
        <div class="layout-shell grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h1 class="ui-heading mt-5 text-4xl font-bold leading-tight md:text-6xl">
              Temukan Kost Nyaman dan Kelola Semua Lebih Praktis
            </h1>
            <p class="ui-lead mt-5 max-w-xl text-lg leading-8">
              SIMAKO membantu penyewa menemukan kamar ideal dan memudahkan
              pemilik kost mengelola kamar, tagihan, serta komunikasi dalam satu
              platform digital.
            </p>

            <div class="mt-8 flex flex-wrap items-center gap-4">
              <A href="/search" class="btn-primary px-6 py-3 text-sm">
                <Search size={18} />
                Jelajahi Kamar
              </A>
              <A href="/register" class="btn-secondary px-6 py-3 text-sm">
                Daftar Sekarang
              </A>
            </div>


          </div>

          <div class="surface-card overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1560185008-b033106af5c3?q=80&w=2070&auto=format&fit=crop"
              alt="Suasana kost modern"
              class="h-[360px] w-full object-cover md:h-[420px]"
            />
          </div>
        </div>
      </section>

      <section class="layout-shell py-14 md:py-16">
        <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 class="ui-heading text-3xl font-bold">Kamar Pilihan</h2>
            <p class="ui-text mt-2">
              Pilihan kamar terbaik dengan informasi yang jelas dan status
              terkini.
            </p>
          </div>
          <A
            href="/search"
            class="text-sm font-semibold text-red-400 transition hover:text-red-300"
          >
            Lihat Semua Kamar
          </A>
        </div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {rooms.map((room) => (
            <RoomCard room={room} />
          ))}
        </div>
      </section>

      <section class="layout-shell py-12 md:py-16">
        <div class="mb-8 text-center">
          <h2 class="ui-heading text-3xl font-bold md:text-4xl">
            Fitur Unggulan SIMAKO
          </h2>
          <p class="ui-text mx-auto mt-3 max-w-3xl">
            SIMAKO dilengkapi dengan fitur-fitur yang dirancang untuk memudahkan pencarian kamar dan pengelolaan kost.
          </p>
        </div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <article class="surface-card h-full p-6">
              <div class="feature-icon mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl">
                {feature.icon}
              </div>
              <h3 class="ui-title text-lg font-semibold">{feature.title}</h3>
              <p class="ui-text mt-3 text-sm leading-7">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section class="layout-shell py-10 md:py-14">
        <div class="surface-card overflow-hidden p-6 md:p-10">
          <div class="grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
            <div>
              <h2 class="ui-heading text-3xl font-bold">Hubungi Pengelola</h2>
              <p class="ui-text mt-3 leading-8">
                Ingin survei kamar atau butuh info detail fasilitas? Tim
                pengelola siap membantu Anda setiap hari.
              </p>
              <div class="mt-6 space-y-4 text-sm">
                <div class="flex items-start gap-3">
                  <MapPin class="mt-0.5 text-red-400" size={18} />
                  <p class="ui-title">
                    Telkom University Purwokerto, Jl. D.I. Panjaitan No.128,
                    Purwokerto Selatan, Banyumas
                  </p>
                </div>
                <div class="flex items-start gap-3">
                  <Phone class="mt-0.5 text-red-400" size={18} />
                  <p class="ui-title">
                    Layanan Pengelola: Senin - Minggu, 08.00 - 21.00 WIB
                  </p>
                </div>
              </div>

              <div class="mt-8 flex flex-wrap items-center gap-4">
                <A
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  class="btn-primary px-6 py-3 text-sm"
                >
                  <Phone size={16} />
                  Hubungi via WhatsApp
                </A>
                <A
                  href="https://maps.google.com/?q=Telkom+University+Purwokerto"
                  target="_blank"
                  class="btn-secondary px-6 py-3 text-sm"
                >
                  Buka di Google Maps
                </A>
              </div>
            </div>

            <div class="map-frame overflow-hidden rounded-xl">
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
        <div class="cta-band rounded-2xl px-6 py-10 text-center md:px-10">
          <h2 class="text-3xl font-bold text-white">
            Daftar untuk Booking Sekarang
          </h2>
          <p class="mx-auto mt-3 max-w-2xl text-red-100">
            Mulai proses booking dengan cepat, pantau status pembayaran, dan
            nikmati manajemen kost yang lebih tertata.
          </p>
          <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
            <A
              href="/register"
              class="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              Buat Akun
            </A>
            <A
              href="/about"
              class="rounded-lg border border-red-200/70 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500/30"
            >
              Pelajari SIMAKO
            </A>
          </div>
        </div>
      </section>
    </main>
  );
}
