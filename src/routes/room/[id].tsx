import { A, useParams } from "@solidjs/router";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Home,
  Phone,
  ShieldCheck,
  Shirt,
  Tv,
  Users,
  Wifi,
  Wind,
  Zap
} from "lucide-solid";
import { createMemo } from "solid-js";
import type { JSX } from "solid-js";
import { facilityLabels, rooms, type RoomFacilityKey } from "~/data/rooms";

const facilityIcon = (facility: RoomFacilityKey, size = 18): JSX.Element => {
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

export default function RoomDetail() {
  const params = useParams();
  const room = createMemo(() => rooms.find((item) => String(item.id) === params.id));

  return (
    <main class="pb-16">
      {room() ? (
        <>
          <section class="section-divider py-8 md:py-12">
            <div class="layout-shell">
              <A href="/" class="inline-flex items-center gap-2 text-sm font-semibold text-red-400 transition hover:text-red-300">
                <ArrowLeft size={16} />
                Kembali ke Beranda
              </A>

              <div class="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
                <div class="space-y-4">
                  <div class="surface-card overflow-hidden">
                    <img src={room()!.image} alt={room()!.name} class="h-[320px] w-full object-cover md:h-[470px]" />
                  </div>
                  <div class="grid grid-cols-3 gap-3">
                    {room()!.gallery.map((image, index) => (
                      <div class="detail-thumb overflow-hidden rounded-xl">
                        <img src={image} alt={`${room()!.name} ${index + 1}`} class="h-24 w-full object-cover md:h-32" />
                      </div>
                    ))}
                  </div>
                </div>

                <aside class="surface-card p-6 md:p-7">
                  <div class="flex flex-wrap items-center gap-3">
                    <span class="eyebrow">{room()!.type}</span>
                    <span
                      class={`rounded-full px-3 py-1 text-sm font-semibold ${
                        room()!.status === "Tersedia" ? "bg-green-500 text-white" : "bg-yellow-500 text-gray-900"
                      }`}
                    >
                      {room()!.status}
                    </span>
                  </div>

                  <h1 class="ui-heading mt-5 text-3xl font-bold leading-tight md:text-4xl">{room()!.name}</h1>
                  <p class="mt-3 text-xl font-bold text-red-400">{room()!.price}</p>
                  <p class="ui-text mt-5 leading-8">{room()!.description}</p>

                  <div class="mt-6 grid grid-cols-2 gap-3">
                    <div class="info-tile">
                      <BedDouble size={18} />
                      <span>{room()!.area}</span>
                    </div>
                    <div class="info-tile">
                      <Home size={18} />
                      <span>{room()!.floor}</span>
                    </div>
                    <div class="info-tile">
                      <Users size={18} />
                      <span>{room()!.capacity}</span>
                    </div>
                    <div class="info-tile">
                      <Bath size={18} />
                      <span>{room()!.bathroom}</span>
                    </div>
                  </div>

                  <div class="mt-7 flex flex-col gap-3 sm:flex-row">
                    <A
                      href="https://wa.me/6281234567890"
                      target="_blank"
                      class={`btn-primary flex-1 px-5 py-3 text-sm ${
                        room()!.status === "Terisi" ? "pointer-events-none opacity-60" : ""
                      }`}
                    >
                      <Phone size={16} />
                      Booking Sekarang
                    </A>
                    <A href="/search" class="btn-secondary flex-1 px-5 py-3 text-sm">
                      Bandingkan Kamar
                    </A>
                  </div>
                </aside>
              </div>
            </div>
          </section>

          <section class="layout-shell py-12">
            <div class="grid gap-6 lg:grid-cols-3">
              <article class="surface-card p-6 lg:col-span-2">
                <h2 class="ui-heading text-2xl font-bold">Fasilitas Kamar</h2>
                <div class="mt-6 grid gap-3 sm:grid-cols-2">
                  {room()!.facilities.map((facility) => (
                    <div class="facility-row">
                      <span class="facility-row-icon">{facilityIcon(facility)}</span>
                      <span>{facilityLabels[facility]}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article class="surface-card p-6">
                <h2 class="ui-heading text-2xl font-bold">Ringkasan Biaya</h2>
                <div class="mt-5 space-y-4">
                  <div class="summary-row">
                    <span>Harga sewa</span>
                    <strong>{room()!.price}</strong>
                  </div>
                  <div class="summary-row">
                    <span>Listrik</span>
                    <strong>{room()!.electricity}</strong>
                  </div>
                  <div class="summary-row">
                    <span>Status</span>
                    <strong>{room()!.status}</strong>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section class="layout-shell pb-8">
            <div class="grid gap-6 lg:grid-cols-2">
              <article class="surface-card p-6">
                <h2 class="ui-heading text-2xl font-bold">Keunggulan</h2>
                <div class="mt-5 space-y-3">
                  {room()!.highlights.map((item) => (
                    <div class="check-row">
                      <CheckCircle2 size={18} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article class="surface-card p-6">
                <h2 class="ui-heading text-2xl font-bold">Ketentuan Sewa</h2>
                <div class="mt-5 space-y-3">
                  {room()!.rules.map((item) => (
                    <div class="check-row">
                      <CalendarCheck size={18} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </section>
        </>
      ) : (
        <section class="layout-shell flex min-h-[62vh] items-center justify-center py-16">
          <div class="surface-card max-w-xl p-8 text-center">
            <h1 class="ui-heading text-3xl font-bold">Kamar Tidak Ditemukan</h1>
            <p class="ui-text mt-3">Data kamar yang Anda buka tidak tersedia atau sudah dipindahkan.</p>
            <A href="/" class="btn-primary mt-6 px-6 py-3 text-sm">
              Kembali ke Beranda
            </A>
          </div>
        </section>
      )}
    </main>
  );
}
