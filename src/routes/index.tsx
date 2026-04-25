import { A } from "@solidjs/router";
import {
  Bath,
  BellRing,
  BookOpen,
  MapPin,
  Phone,
  ReceiptText,
  Search,
  Send,
  ShieldCheck,
  Shirt,
  Star,
  Tv,
  Users,
  Wifi,
  Wind,
  Zap,
} from "lucide-solid";
import { createSignal, onMount } from "solid-js";
import type { Component, JSX } from "solid-js";
import {
  facilityLabels,
  rooms,
  slugifyOwner,
  type Room,
  type RoomFacilityKey,
} from "~/data/rooms";
import { initialTestimonials, type Testimonial } from "~/data/testimonials";

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

const handleRoomPointerMove: JSX.EventHandler<HTMLElement, PointerEvent> = (
  event,
) => {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const rotateX = (y / rect.height - 0.5) * -5;
  const rotateY = (x / rect.width - 0.5) * 5;

  card.style.setProperty("--mouse-x", `${x}px`);
  card.style.setProperty("--mouse-y", `${y}px`);
  card.style.setProperty("--tilt-x", `${rotateX}deg`);
  card.style.setProperty("--tilt-y", `${rotateY}deg`);
};

const handleRoomPointerLeave: JSX.EventHandler<HTMLElement, PointerEvent> = (
  event,
) => {
  const card = event.currentTarget;
  card.style.setProperty("--mouse-x", "50%");
  card.style.setProperty("--mouse-y", "0%");
  card.style.setProperty("--tilt-x", "0deg");
  card.style.setProperty("--tilt-y", "0deg");
};

const RoomCard: Component<{ room: Room }> = (props) => (
  <article
    onPointerMove={handleRoomPointerMove}
    onPointerLeave={handleRoomPointerLeave}
    class="surface-card room-card relative flex h-full flex-col overflow-hidden transition duration-300"
  >
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
  const [testimonials, setTestimonials] = createSignal<Testimonial[]>(initialTestimonials);
  const [testimonialName, setTestimonialName] = createSignal("");
  const [testimonialRoom, setTestimonialRoom] = createSignal("");
  const [testimonialMessage, setTestimonialMessage] = createSignal("");

  onMount(() => {
    try {
      const savedTestimonials = localStorage.getItem("simako-testimonials");

      if (savedTestimonials) {
        const parsedTestimonials = JSON.parse(savedTestimonials) as Testimonial[];

        if (Array.isArray(parsedTestimonials)) {
          setTestimonials([...initialTestimonials, ...parsedTestimonials]);
        }
      }
    } catch {
      setTestimonials(initialTestimonials);
    }
  });

  const addTestimonial = () => {
    const name = testimonialName().trim();
    const room = testimonialRoom().trim();
    const message = testimonialMessage().trim();

    if (!name || !room || !message) {
      return;
    }

    const newTestimonial: Testimonial = {
      name,
      room,
      message,
      role: "Penyewa"
    };

    const userTestimonials = [newTestimonial, ...testimonials().filter((item) => !initialTestimonials.includes(item))];
    setTestimonials([...initialTestimonials, ...userTestimonials]);
    setTestimonialName("");
    setTestimonialRoom("");
    setTestimonialMessage("");

    try {
      localStorage.setItem("simako-testimonials", JSON.stringify(userTestimonials));
    } catch {
      // Testimonial tetap tampil pada sesi saat ini jika penyimpanan browser tidak tersedia.
    }
  };

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
            <p class="eyebrow">SIMAKO</p>
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

            <div class="mt-8 surface-card p-4 md:p-5">
              <form
                class="grid gap-3 md:grid-cols-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <input type="text" placeholder="Lokasi" class="form-control" />
                <select class="form-control">
                  <option>Harga</option>
                  <option>&lt; Rp 1.200.000</option>
                  <option>Rp 1.200.000 - Rp 1.500.000</option>
                  <option>&gt; Rp 1.500.000</option>
                </select>
                <select class="form-control">
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
            <article class="surface-card h-full p-6 transition duration-300 hover:-translate-y-1 hover:border-red-400/50">
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

      <section class="layout-shell py-12 md:py-16">
        <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 class="ui-heading text-3xl font-bold md:text-4xl">Testimoni Penyewa</h2>
            <p class="ui-text mt-3 max-w-2xl">
              Cerita dari penyewa dan pengelola yang sudah menggunakan SIMAKO untuk mencari atau mengelola kamar.
            </p>
          </div>
          <p class="ui-muted text-sm">{testimonials().length} testimoni tampil</p>
        </div>

        <div class="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div class="grid gap-5 md:grid-cols-2">
            {testimonials().map((item) => (
              <article class="surface-card testimonial-card p-5">
                <div class="mb-4 flex items-center gap-1 text-red-400">
                  {Array.from({ length: 5 }).map(() => (
                    <Star size={15} fill="currentColor" />
                  ))}
                </div>
                <p class="ui-text leading-7">"{item.message}"</p>
                <div class="mt-5 border-t border-[var(--divider)] pt-4">
                  <h3 class="ui-title font-bold">{item.name}</h3>
                  <p class="ui-muted mt-1 text-sm">
                    {item.role} - {item.room}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <form class="surface-card auth-panel p-6" onSubmit={(event) => event.preventDefault()}>
            <h3 class="ui-heading text-2xl font-bold">Tambah Testimoni</h3>
            <p class="ui-text mt-2 text-sm leading-7">
              Testimoni baru akan langsung tampil dan tersimpan di browser Anda.
            </p>
            <div class="mt-5 space-y-4">
              <label class="block">
                <span class="form-label">Nama penyewa</span>
                <input
                  class="form-control mt-2"
                  value={testimonialName()}
                  onInput={(event) => setTestimonialName(event.currentTarget.value)}
                  placeholder="Nama lengkap"
                />
              </label>
              <label class="block">
                <span class="form-label">Kamar / kost</span>
                <input
                  class="form-control mt-2"
                  value={testimonialRoom()}
                  onInput={(event) => setTestimonialRoom(event.currentTarget.value)}
                  placeholder="Contoh: Kamar 101"
                />
              </label>
              <label class="block">
                <span class="form-label">Testimoni</span>
                <textarea
                  class="form-control mt-2 min-h-28 resize-y"
                  value={testimonialMessage()}
                  onInput={(event) => setTestimonialMessage(event.currentTarget.value)}
                  placeholder="Ceritakan pengalaman Anda menggunakan SIMAKO."
                />
              </label>
              <button type="button" class="btn-primary w-full px-5 py-3 text-sm" onClick={addTestimonial}>
                <Send size={17} />
                Tambahkan Testimoni
              </button>
            </div>
          </form>
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
