import { A } from "@solidjs/router";
import {
  Bath,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  ShieldCheck,
  Shirt,
  SlidersHorizontal,
  Tv,
  Wifi,
  Wind
} from "lucide-solid";
import { createMemo, createSignal } from "solid-js";
import type { JSX } from "solid-js";
import { facilityLabels, rooms, type Room, type RoomFacilityKey } from "~/data/rooms";

const pageSize = 8;

const facilityIcon = (facility: RoomFacilityKey): JSX.Element => {
  switch (facility) {
    case "wifi":
      return <Wifi size={14} />;
    case "tv":
      return <Tv size={14} />;
    case "privateBath":
    case "sharedBath":
      return <Bath size={14} />;
    case "fan":
    case "airflow":
      return <Wind size={14} />;
    case "wardrobe":
      return <Shirt size={14} />;
    default:
      return <ShieldCheck size={14} />;
  }
};

function KostCard(props: { room: Room }) {
  return (
    <article class="surface-card search-room-card flex h-full flex-col overflow-hidden">
      <div class="relative overflow-hidden">
        <img src={props.room.image} alt={props.room.name} class="search-room-image h-44 w-full object-cover" />
        <span
          class={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
            props.room.status === "Tersedia" ? "bg-green-500 text-white" : "bg-yellow-500 text-gray-900"
          }`}
        >
          {props.room.status}
        </span>
      </div>
      <div class="flex flex-1 flex-col p-4">
        <div class="flex items-center justify-between gap-3">
          <p class="eyebrow">{props.room.type}</p>
          <span class="ui-muted text-xs">{props.room.floor}</span>
        </div>
        <h2 class="ui-title mt-3 text-lg font-bold leading-snug">{props.room.name}</h2>
        <p class="mt-2 text-sm font-semibold text-red-400">{props.room.price}</p>
        <div class="mt-4 flex items-center gap-2 text-sm ui-text">
          <BedDouble size={16} class="text-red-400" />
          <span>{props.room.area}</span>
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          {props.room.facilities.slice(0, 3).map((facility) => (
            <span class="facility-pill text-xs">
              {facilityIcon(facility)}
              {facilityLabels[facility]}
            </span>
          ))}
        </div>
        <A href={`/room/${props.room.id}`} class="btn-secondary mt-5 w-full px-4 py-2 text-sm">
          Lihat Detail
        </A>
      </div>
    </article>
  );
}

export default function SearchPage() {
  const [page, setPage] = createSignal(1);
  const totalPages = createMemo(() => Math.ceil(rooms.length / pageSize));
  const visibleRooms = createMemo(() => rooms.slice((page() - 1) * pageSize, page() * pageSize));

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages()) {
      return;
    }

    setPage(nextPage);
  };

  return (
    <main class="pb-16">
      <section class="section-divider py-10 md:py-14">
        <div class="layout-shell">
          <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p class="eyebrow">Cari Kost</p>
              <h1 class="ui-heading mt-4 text-4xl font-bold md:text-5xl">Temukan Kamar yang Sesuai</h1>
              <p class="ui-lead mt-4 max-w-2xl leading-8">
                Lihat daftar kamar, status ketersediaan, fasilitas utama, dan akses detail sebelum menghubungi pengelola.
              </p>
            </div>
            <div class="surface-card flex items-center gap-3 px-4 py-3">
              <MapPin size={18} class="text-red-400" />
              <div>
                <p class="ui-muted text-xs">Area pencarian</p>
                <p class="ui-title text-sm font-semibold">Purwokerto Selatan</p>
              </div>
            </div>
          </div>

          <form class="surface-card mt-8 grid gap-3 p-4 md:grid-cols-[1.4fr_1fr_1fr_auto]" onSubmit={(event) => event.preventDefault()}>
            <div class="relative">
              <Search class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-red-400" size={17} />
              <input class="form-control pl-10" placeholder="Cari nomor kamar atau tipe" />
            </div>
            <select class="form-control">
              <option>Semua harga</option>
              <option>&lt; Rp 1.300.000</option>
              <option>Rp 1.300.000 - Rp 1.600.000</option>
              <option>&gt; Rp 1.600.000</option>
            </select>
            <select class="form-control">
              <option>Semua status</option>
              <option>Tersedia</option>
              <option>Terisi</option>
            </select>
            <button type="submit" class="btn-primary px-5 py-2 text-sm">
              <SlidersHorizontal size={16} />
              Terapkan
            </button>
          </form>
        </div>
      </section>

      <section class="layout-shell py-12">
        <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="ui-heading text-2xl font-bold">8 Kamar Tersedia untuk Dicek</h2>
            <p class="ui-text mt-1 text-sm">Ditampilkan dalam susunan 4 kartu di atas dan 4 kartu di bawah pada layar desktop.</p>
          </div>
          <p class="ui-muted text-sm">Halaman {page()} dari {totalPages()}</p>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {visibleRooms().map((room) => (
            <KostCard room={room} />
          ))}
        </div>

        <nav class="mt-10 flex items-center justify-center gap-2" aria-label="Pagination kamar">
          <button
            type="button"
            class="pagination-button"
            disabled={page() === 1}
            onClick={() => goToPage(page() - 1)}
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages() }, (_, index) => index + 1).map((item) => (
            <button
              type="button"
              class={`pagination-button ${page() === item ? "pagination-button-active" : ""}`}
              onClick={() => goToPage(item)}
            >
              {item}
            </button>
          ))}
          <button
            type="button"
            class="pagination-button"
            disabled={page() === totalPages()}
            onClick={() => goToPage(page() + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </nav>
      </section>
    </main>
  );
}
