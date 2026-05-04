import {
  Banknote,
  BedDouble,
  CheckCircle2,
  ClipboardList,
  Home,
  Settings,
} from "lucide-solid";
import { createMemo, createSignal, onMount } from "solid-js";
import type { Component } from "solid-js";
import { bankAccounts, facilities, ownerRooms, rules } from "~/data/ownerData";
import { readOwnerRooms } from "~/utils/ownerRoomsStorage";
import { getCurrentOwnerId } from "~/utils/ownerSession";

type Tone = "red" | "green" | "blue" | "orange";
type IconComponent = Component<{ size?: number; class?: string }>;

interface StatCard {
  label: string;
  value: string;
  tone: Tone;
  icon: IconComponent;
}

const formatNumber = (value: number) => new Intl.NumberFormat("id-ID").format(value);

const statTextClass = (tone: Tone) => {
  switch (tone) {
    case "green":
      return "text-emerald-400";
    case "blue":
      return "text-sky-400";
    case "orange":
      return "text-orange-400";
    default:
      return "text-red-400";
  }
};

const statIconClass = (tone: Tone) => {
  switch (tone) {
    case "green":
      return "border-emerald-400/20 bg-emerald-500/10 text-emerald-400";
    case "blue":
      return "border-sky-400/20 bg-sky-500/10 text-sky-400";
    case "orange":
      return "border-orange-400/20 bg-orange-500/10 text-orange-400";
    default:
      return "border-red-400/20 bg-red-500/10 text-red-400";
  }
};

function StatCardItem(props: { stat: StatCard }) {
  const Icon = props.stat.icon;

  return (
    <article class="dashboard-card min-h-[110px] p-5">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="dashboard-muted text-sm">{props.stat.label}</p>
          <p class={`mt-2 text-3xl font-bold ${statTextClass(props.stat.tone)}`}>
            {props.stat.value}
          </p>
        </div>
        <div class={`flex h-10 w-10 items-center justify-center rounded-xl border ${statIconClass(props.stat.tone)}`}>
          <Icon size={18} />
        </div>
      </div>
    </article>
  );
}

export default function OwnerDashboard() {
  const [roomSource, setRoomSource] = createSignal(ownerRooms);
  const ownerId = createMemo(() => getCurrentOwnerId());
  const rooms = createMemo(() => roomSource().filter((room) => room.owner_id === ownerId()));
  const ownerFacilities = createMemo(() =>
    facilities.filter((facility) => facility.owner_id === ownerId()),
  );
  const ownerRules = createMemo(() => rules.filter((rule) => rule.owner_id === ownerId()));
  const ownerBankAccounts = createMemo(() =>
    bankAccounts.filter((account) => account.owner_id === ownerId()),
  );
  const availableRooms = createMemo(() =>
    rooms().filter((room) => room.status_kost === "tersedia"),
  );
  const occupiedRooms = createMemo(() =>
    rooms().filter((room) => room.status_kost === "berpenghuni"),
  );
  const activeRules = createMemo(() => ownerRules().filter((rule) => rule.status_aktif));

  const stats = createMemo<StatCard[]>(() => [
    {
      label: "Total Jumlah Kamar",
      value: formatNumber(rooms().length),
      tone: "red",
      icon: BedDouble,
    },
    {
      label: "Jumlah Kamar Kosong",
      value: formatNumber(availableRooms().length),
      tone: "green",
      icon: CheckCircle2,
    },
    {
      label: "Jumlah Kamar Terisi",
      value: formatNumber(occupiedRooms().length),
      tone: "blue",
      icon: Home,
    },
    {
      label: "Total Fasilitas Umum",
      value: formatNumber(ownerFacilities().length),
      tone: "orange",
      icon: Settings,
    },
    {
      label: "Total Aturan Aktif",
      value: formatNumber(activeRules().length),
      tone: "green",
      icon: ClipboardList,
    },
    {
      label: "Total Rekening Pembayaran",
      value: formatNumber(ownerBankAccounts().length),
      tone: "blue",
      icon: Banknote,
    },
  ]);

  onMount(() => {
    setRoomSource(readOwnerRooms());
  });

  return (
    <>
      <section class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats().map((stat) => (
          <StatCardItem stat={stat} />
        ))}
      </section>

      <section class="mt-8 grid gap-6 lg:grid-cols-3">
        <article class="dashboard-card p-6">
          <h2 class="ui-heading text-lg font-bold">Ringkasan Kamar</h2>
          <div class="mt-5 space-y-3">
            <div class="flex items-center justify-between rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <span class="ui-heading font-bold">Total kamar</span>
              <strong class="text-red-400">{formatNumber(rooms().length)}</strong>
            </div>
            <div class="flex items-center justify-between rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <span class="ui-heading font-bold">Kamar kosong</span>
              <strong class="text-emerald-400">{formatNumber(availableRooms().length)}</strong>
            </div>
            <div class="flex items-center justify-between rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <span class="ui-heading font-bold">Kamar terisi</span>
              <strong class="text-sky-400">{formatNumber(occupiedRooms().length)}</strong>
            </div>
          </div>
        </article>

        <article class="dashboard-card p-6 lg:col-span-2">
          <h2 class="ui-heading text-lg font-bold">Data Dinamis Pemilik</h2>
          <div class="mt-5 grid gap-4 sm:grid-cols-3">
            <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <p class="dashboard-muted text-sm">owner_id aktif</p>
              <p class="mt-2 text-2xl font-bold text-red-400">{ownerId()}</p>
            </div>
            <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <p class="dashboard-muted text-sm">Aturan aktif</p>
              <p class="mt-2 text-2xl font-bold text-emerald-400">{activeRules().length}</p>
            </div>
            <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <p class="dashboard-muted text-sm">Rekening tersedia</p>
              <p class="mt-2 text-2xl font-bold text-sky-400">{ownerBankAccounts().length}</p>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}
