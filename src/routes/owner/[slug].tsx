import { A, useParams } from "@solidjs/router";
import { Bath, BedDouble, Building2, ChevronLeft, Home, ShieldCheck } from "lucide-solid";
import { createMemo } from "solid-js";
import { getOwnerRoomsBySlug } from "~/data/rooms";

export default function OwnerDetailPage() {
  const params = useParams();
  const ownerRooms = createMemo(() => getOwnerRoomsBySlug(params.slug || ""));
  const ownerName = createMemo(() => ownerRooms()[0]?.ownerName ?? "Pemilik Kost");
  const availableCount = createMemo(() => ownerRooms().filter((room) => room.status === "Tersedia").length);

  return (
    <main class="pb-16">
      {ownerRooms().length > 0 ? (
        <>
          <section class="section-divider py-10 md:py-14">
            <div class="layout-shell">
              <A href="/search" class="inline-flex items-center gap-2 text-sm font-semibold text-red-400 transition hover:text-red-300">
                <ChevronLeft size={16} />
                Kembali ke Cari Kost
              </A>
              <div class="mt-7 grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-start">
                <div>
                  <h1 class="ui-heading mt-4 text-4xl font-bold leading-tight md:text-5xl">{ownerName()}</h1>
                  <p class="ui-lead mt-5 max-w-2xl leading-8">
                    Lihat daftar kamar dari {ownerName()}, status ketersediaan, fasilitas utama, dan detail harga sewa sebelum menghubungi pengelola.
                  </p>
                </div>
                <div class="surface-card p-6">
                  <div class="grid gap-4">
                    <div class="info-tile">
                      <Building2 size={20} />
                      <span>{ownerRooms().length} kamar terdaftar</span>
                    </div>
                    <div class="info-tile">
                      <ShieldCheck size={20} />
                      <span>{availableCount()} kamar tersedia</span>
                    </div>
                    <div class="info-tile">
                      <Home size={20} />
                      <span>Area Purwokerto Selatan</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="layout-shell py-12">
            <div class="mb-7">
              <h2 class="ui-heading text-3xl font-bold">Daftar Kamar {ownerName()}</h2>
              <p class="ui-text mt-2">Halaman ini membantu mesin pencari memahami kamar yang dimiliki oleh setiap pemilik kost.</p>
            </div>
            <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {ownerRooms().map((room) => (
                <article class="surface-card search-room-card flex h-full flex-col overflow-hidden">
                  <img src={room.image} alt={room.name} class="search-room-image h-44 w-full object-cover" />
                  <div class="flex flex-1 flex-col p-4">
                    <div class="flex items-center justify-between gap-3">
                      <p class="eyebrow">{room.type}</p>
                      <span
                        class={`rounded-full px-3 py-1 text-xs font-semibold ${
                          room.status === "Tersedia" ? "bg-green-500 text-white" : "bg-yellow-500 text-gray-900"
                        }`}
                      >
                        {room.status}
                      </span>
                    </div>
                    <h3 class="ui-title mt-3 text-lg font-bold">{room.name}</h3>
                    <p class="mt-2 text-sm font-semibold text-red-400">{room.price}</p>
                    <div class="mt-4 space-y-2 text-sm">
                      <div class="flex items-center gap-2 ui-text">
                        <BedDouble size={16} class="text-red-400" />
                        <span>{room.area}</span>
                      </div>
                      <div class="flex items-center gap-2 ui-text">
                        <Bath size={16} class="text-red-400" />
                        <span>{room.bathroom}</span>
                      </div>
                    </div>
                    <A href={`/room/${room.id}`} class="btn-secondary mt-5 w-full px-4 py-2 text-sm">
                      Lihat Detail Kamar
                    </A>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section class="layout-shell flex min-h-[62vh] items-center justify-center py-16">
          <div class="surface-card max-w-xl p-8 text-center">
            <h1 class="ui-heading text-3xl font-bold">Pemilik Kost Tidak Ditemukan</h1>
            <p class="ui-text mt-3">Data pemilik kost untuk slug {params.slug} tidak tersedia.</p>
            <A href="/search" class="btn-primary mt-6 px-6 py-3 text-sm">
              Cari Kamar
            </A>
          </div>
        </section>
      )}
    </main>
  );
}
