import {
  Banknote,
  BedDouble,
  CheckCircle2,
  ClipboardList,
  Home,
} from "lucide-solid";
import { createMemo, createSignal, onMount } from "solid-js";
import type { Component } from "solid-js";
import { ownerRooms, roomBills } from "~/data/ownerData";
import { formatCurrency } from "~/utils/format";
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
  const ownerBills = createMemo(() =>
    roomBills.filter((bill) => bill.owner_id === ownerId()),
  );
  const availableRooms = createMemo(() =>
    rooms().filter((room) => room.status_kost === "tersedia"),
  );
  const occupiedRooms = createMemo(() =>
    rooms().filter((room) => room.status_kost === "berpenghuni"),
  );
  const currentRevenue = createMemo(() =>
    occupiedRooms().reduce((total, room) => total + room.harga_perbulan, 0),
  );
  const unpaidRevenue = createMemo(() =>
    ownerBills()
      .filter((bill) => bill.status_tagihan === "aktif")
      .reduce((total, bill) => total + bill.nominal_tagihan, 0),
  );

  const stats = createMemo<StatCard[]>(() => [
    {
      label: "Kamar yang Tersedia",
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
      label: "Total Rupiah Pendapatan Saat Ini",
      value: formatCurrency(currentRevenue()),
      tone: "orange",
      icon: Banknote,
    },
    {
      label: "Total Pendapatan Belum Dibayarkan",
      value: formatCurrency(unpaidRevenue()),
      tone: "green",
      icon: ClipboardList,
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
    </>
  );
}
