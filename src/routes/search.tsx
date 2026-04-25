import { A } from "@solidjs/router";
import {
  Bath,
  BedDouble,
  Building2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  ShieldCheck,
  Shirt,
  SlidersHorizontal,
  Tv,
  Wifi,
  Wind,
} from "lucide-solid";
import { createMemo, createSignal } from "solid-js";
import type { JSX } from "solid-js";
import {
  facilityLabels,
  slugifyOwner,
  rooms,
  type Room,
  type RoomFacilityKey,
} from "~/data/rooms";

const pageSize = 8;
const allOwners = "Semua pemilik";
const allPrices = "Semua harga";
const allStatuses = "Semua status";
type PageSizeOption = 8 | 12 | "all";

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
        <img
          src={props.room.image}
          alt={props.room.name}
          class="search-room-image h-44 w-full object-cover"
        />
        <span
          class={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
            props.room.status === "Tersedia"
              ? "bg-green-500 text-white"
              : "bg-yellow-500 text-gray-900"
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
        <h2 class="ui-title mt-3 text-lg font-bold leading-snug">
          {props.room.name}
        </h2>
        <p class="mt-2 text-sm font-semibold text-red-400">
          {props.room.price}
        </p>
        <div class="mt-3 flex items-center gap-2 text-sm ui-text">
          <Building2 size={16} class="text-red-400" />
          <A href={`/owner/${slugifyOwner(props.room.ownerName)}`} class="font-semibold text-red-400 transition hover:text-red-300">
            {props.room.ownerName}
          </A>
        </div>
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
        <A
          href={`/room/${props.room.id}`}
          class="btn-secondary mt-5 w-full px-4 py-2 text-sm"
        >
          Lihat Detail
        </A>
      </div>
    </article>
  );
}

export default function SearchPage() {
  const [page, setPage] = createSignal(1);
  const [query, setQuery] = createSignal("");
  const [owner, setOwner] = createSignal(allOwners);
  const [priceRange, setPriceRange] = createSignal(allPrices);
  const [status, setStatus] = createSignal(allStatuses);
  const [rowsPerPage, setRowsPerPage] = createSignal<PageSizeOption>(pageSize);

  const ownerOptions = createMemo(() =>
    Array.from(new Set(rooms.map((room) => room.ownerName))),
  );
  const roomPrice = (room: Room) => Number(room.price.replace(/\D/g, ""));
  const filteredRooms = createMemo(() => {
    const normalizedQuery = query().trim().toLowerCase();

    return rooms.filter((room) => {
      const matchesQuery =
        !normalizedQuery ||
        room.name.toLowerCase().includes(normalizedQuery) ||
        room.type.toLowerCase().includes(normalizedQuery) ||
        room.ownerName.toLowerCase().includes(normalizedQuery);
      const matchesOwner = owner() === allOwners || room.ownerName === owner();
      const matchesStatus =
        status() === allStatuses || room.status === status();
      const price = roomPrice(room);
      const matchesPrice =
        priceRange() === allPrices ||
        (priceRange() === "< Rp 1.300.000" && price < 1300000) ||
        (priceRange() === "Rp 1.300.000 - Rp 1.600.000" &&
          price >= 1300000 &&
          price <= 1600000) ||
        (priceRange() === "> Rp 1.600.000" && price > 1600000);

      return matchesQuery && matchesOwner && matchesStatus && matchesPrice;
    });
  });
  const activePageSize = createMemo(() =>
    rowsPerPage() === "all" ? Math.max(1, filteredRooms().length) : rowsPerPage(),
  );
  const totalPages = createMemo(() =>
    Math.max(1, Math.ceil(filteredRooms().length / activePageSize())),
  );
  const visibleRooms = createMemo(() =>
    filteredRooms().slice((page() - 1) * activePageSize(), page() * activePageSize()),
  );
  const entryStart = createMemo(() =>
    filteredRooms().length === 0 ? 0 : (page() - 1) * activePageSize() + 1,
  );
  const entryEnd = createMemo(() =>
    Math.min(page() * activePageSize(), filteredRooms().length),
  );

  const updateFilter = (callback: () => void) => {
    callback();
    setPage(1);
  };

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages()) {
      return;
    }

    setPage(nextPage);
  };

  const updateRowsPerPage = (value: string) => {
    setRowsPerPage(value === "all" ? "all" : Number(value) === 12 ? 12 : 8);
    setPage(1);
  };

  return (
    <main class="pb-16">
      <section class="section-divider py-10 md:py-14">
        <div class="layout-shell">
          <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p class="eyebrow">Cari Kost</p>
              <h1 class="ui-heading mt-4 text-4xl font-bold md:text-5xl">
                Temukan Kamar yang Sesuai
              </h1>
              <p class="ui-lead mt-4 max-w-2xl leading-8">
                Lihat daftar kamar, status ketersediaan, fasilitas utama, dan
                akses detail sebelum menghubungi pengelola.
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

          <form
            class="surface-card mt-8 grid gap-3 p-4 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto]"
            onSubmit={(event) => event.preventDefault()}
          >
            <div class="input-with-icon">
              <Search class="input-icon" size={17} />
              <input
                class="form-control form-control-icon"
                value={query()}
                onInput={(event) =>
                  updateFilter(() => setQuery(event.currentTarget.value))
                }
                placeholder="Cari kamar, tipe, atau pemilik"
              />
            </div>
            <select
              class="form-control"
              value={owner()}
              onChange={(event) =>
                updateFilter(() => setOwner(event.currentTarget.value))
              }
            >
              <option>{allOwners}</option>
              {ownerOptions().map((item) => (
                <option>{item}</option>
              ))}
            </select>
            <select
              class="form-control"
              value={priceRange()}
              onChange={(event) =>
                updateFilter(() => setPriceRange(event.currentTarget.value))
              }
            >
              <option>{allPrices}</option>
              <option>&lt; Rp 1.300.000</option>
              <option>Rp 1.300.000 - Rp 1.600.000</option>
              <option>&gt; Rp 1.600.000</option>
            </select>
            <select
              class="form-control"
              value={status()}
              onChange={(event) =>
                updateFilter(() => setStatus(event.currentTarget.value))
              }
            >
              <option>{allStatuses}</option>
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
            <h2 class="ui-heading text-2xl font-bold">
              {filteredRooms().length} Kamar Tersedia
            </h2>
            <p class="ui-text mt-1 text-sm">
              Cari kamar yang sesuai dengan kebutuhan Anda.
            </p>
          </div>
          <p class="ui-muted text-sm">Filter pemilik: {owner()}</p>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {visibleRooms().map((room) => (
            <KostCard room={room} />
          ))}
        </div>

        <nav class="pagination-bar mt-10" aria-label="Pagination kamar">
          <div class="pagination-left">
            <p class="pagination-info">
              {entryStart()}-{entryEnd()} of {filteredRooms().length} entries
            </p>
            <label class="rows-control">
              <span>Rows</span>
              <select
                class="rows-select"
                value={String(rowsPerPage())}
                onChange={(event) => updateRowsPerPage(event.currentTarget.value)}
              >
                <option value="8">8</option>
                <option value="12">12</option>
                <option value="all">Semua</option>
              </select>
            </label>
          </div>
          <div class="pagination-controls">
            <button
              type="button"
              class="pagination-button pagination-button-wide"
              disabled={page() === 1}
              onClick={() => goToPage(page() - 1)}
            >
              <ChevronLeft size={14} />
              Prev
            </button>
            {Array.from({ length: totalPages() }, (_, index) => index + 1).map(
              (item) => (
                <button
                  type="button"
                  class={`pagination-button ${page() === item ? "pagination-button-active" : ""}`}
                  onClick={() => goToPage(item)}
                >
                  {item}
                </button>
              ),
            )}
            <button
              type="button"
              class="pagination-button pagination-button-wide"
              disabled={page() === totalPages()}
              onClick={() => goToPage(page() + 1)}
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </nav>
      </section>
    </main>
  );
}
