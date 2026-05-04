import {
  AlertTriangle,
  Banknote,
  BedDouble,
  CheckCircle2,
  ClipboardList,
  Home,
  MessageSquareWarning,
  Users,
} from "lucide-solid";
import { createMemo, createSignal, onMount } from "solid-js";
import type { Component } from "solid-js";
import StatusBadge, { type StatusBadgeTone } from "~/components/common/StatusBadge";
import {
  ownerRooms,
  ownerTenants,
  roomBills,
  tenantComplaints,
  type OwnerTenantStatus,
} from "~/data/ownerData";
import { formatCurrency, formatDate } from "~/utils/format";
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

const getTime = (value: string) => new Date(value).getTime() || 0;

const getTenantStatus = (
  tenant: (typeof ownerTenants)[number] & { status_sewa?: OwnerTenantStatus },
) =>
  tenant.status_sewa ?? tenant.status_penyewa;

const complaintLabel = (status: "baru" | "diproses" | "selesai") => {
  switch (status) {
    case "selesai":
      return "Selesai";
    case "diproses":
      return "Diproses";
    default:
      return "Baru";
  }
};

const complaintTone = (status: "baru" | "diproses" | "selesai"): StatusBadgeTone => {
  switch (status) {
    case "selesai":
      return "success";
    case "diproses":
      return "warning";
    default:
      return "danger";
  }
};

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
  const ownerRoomIds = createMemo(() => new Set(rooms().map((room) => room.id)));
  const ownerBills = createMemo(() =>
    roomBills.filter((bill) => bill.owner_id === ownerId()),
  );
  const explicitTenants = createMemo(() =>
    ownerTenants.filter(
      (tenant) => tenant.owner_id === ownerId() && ownerRoomIds().has(tenant.room_id),
    ),
  );
  const dynamicTenants = createMemo(() => {
    const explicitRoomIds = new Set(explicitTenants().map((tenant) => tenant.room_id));
    return rooms()
      .filter((room) =>
        room.status_kost === "berpenghuni" &&
        room.nama_penghuni.trim() &&
        !explicitRoomIds.has(room.id),
      )
      .map((room) => ({
        id: 900000 + room.id,
        owner_id: room.owner_id,
        room_id: room.id,
        nama_kamar: room.nama_kamar,
        nama_penyewa: room.nama_penghuni,
        email_penyewa: room.email_penghuni,
        nomor_hp_penyewa: "-",
        tanggal_mulai_sewa: room.created_at,
        tanggal_akhir_sewa: "",
        status_pembayaran: "pending" as const,
        status_penyewa: "aktif" as const,
        status_sewa: "aktif" as const,
        created_at: room.created_at,
        updated_at: room.updated_at,
      }));
  });
  const ownerTenantRows = createMemo(() =>
    [...explicitTenants(), ...dynamicTenants()].sort(
      (first, second) => getTime(second.created_at) - getTime(first.created_at),
    ),
  );
  const activeTenants = createMemo(() =>
    ownerTenantRows().filter((tenant) => getTenantStatus(tenant) === "aktif"),
  );
  const ownerComplaints = createMemo(() =>
    tenantComplaints.filter(
      (complaint) =>
        complaint.owner_id === ownerId() && ownerRoomIds().has(complaint.room_id),
    ),
  );
  const newComplaints = createMemo(() =>
    ownerComplaints().filter((complaint) => complaint.status_keluhan === "baru"),
  );
  const inProgressComplaints = createMemo(() =>
    ownerComplaints().filter((complaint) => complaint.status_keluhan === "diproses"),
  );
  const doneComplaints = createMemo(() =>
    ownerComplaints().filter((complaint) => complaint.status_keluhan === "selesai"),
  );
  const latestTenants = createMemo(() => ownerTenantRows().slice(0, 5));
  const latestComplaints = createMemo(() =>
    [...ownerComplaints()]
      .sort((first, second) => getTime(second.created_at) - getTime(first.created_at))
      .slice(0, 5),
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
    {
      label: "Total Penyewa Aktif",
      value: formatNumber(activeTenants().length),
      tone: "blue",
      icon: Users,
    },
    {
      label: "Total Keluhan",
      value: formatNumber(ownerComplaints().length),
      tone: "red",
      icon: MessageSquareWarning,
    },
    {
      label: "Keluhan Baru",
      value: formatNumber(newComplaints().length),
      tone: "red",
      icon: AlertTriangle,
    },
    {
      label: "Keluhan Diproses",
      value: formatNumber(inProgressComplaints().length),
      tone: "orange",
      icon: AlertTriangle,
    },
    {
      label: "Keluhan Selesai",
      value: formatNumber(doneComplaints().length),
      tone: "green",
      icon: CheckCircle2,
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

      <section class="mt-8 grid gap-6 xl:grid-cols-2">
        <article class="dashboard-card overflow-hidden">
          <div class="border-b border-[var(--divider)] p-4">
            <h2 class="ui-heading text-lg font-bold">List Penyewa Terbaru</h2>
            <p class="dashboard-muted mt-1 text-sm">Maksimal 5 penyewa terbaru dari kamar milik akun ini.</p>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full min-w-[860px] text-left text-sm">
              <thead class="bg-[rgba(148,163,184,0.08)] text-xs uppercase text-[rgb(var(--text-muted-rgb))]">
                <tr>
                  <th class="px-5 py-3 font-bold">Nama Penyewa</th>
                  <th class="px-5 py-3 font-bold">Email</th>
                  <th class="px-5 py-3 font-bold">Nomor HP</th>
                  <th class="px-5 py-3 font-bold">Kamar</th>
                  <th class="px-5 py-3 font-bold">Tanggal Masuk</th>
                  <th class="px-5 py-3 font-bold">Status Sewa</th>
                </tr>
              </thead>
              <tbody>
                {latestTenants().map((tenant) => (
                  <tr class="border-t border-[var(--divider)]">
                    <td class="px-5 py-4 font-bold text-[rgb(var(--text-strong-rgb))]">{tenant.nama_penyewa}</td>
                    <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">{tenant.email_penyewa}</td>
                    <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">{tenant.nomor_hp_penyewa || "-"}</td>
                    <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">{tenant.nama_kamar}</td>
                    <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">{formatDate(tenant.tanggal_mulai_sewa)}</td>
                    <td class="px-5 py-4">
                      <StatusBadge
                        value={getTenantStatus(tenant) === "aktif" ? "Aktif" : "Nonaktif"}
                        tone={getTenantStatus(tenant) === "aktif" ? "success" : "neutral"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {latestTenants().length === 0 && (
            <div class="p-5">
              <div class="rounded-xl border border-dashed border-[var(--surface-border)] bg-[var(--control-bg)] p-6 text-center text-sm text-[rgb(var(--text-muted-rgb))]">
                Belum ada data penyewa.
              </div>
            </div>
          )}
        </article>

        <article class="dashboard-card overflow-hidden">
          <div class="border-b border-[var(--divider)] p-4">
            <h2 class="ui-heading text-lg font-bold">Keluhan Terbaru</h2>
            <p class="dashboard-muted mt-1 text-sm">Maksimal 5 keluhan terbaru dari penyewa di kamar milik akun ini.</p>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full min-w-[760px] text-left text-sm">
              <thead class="bg-[rgba(148,163,184,0.08)] text-xs uppercase text-[rgb(var(--text-muted-rgb))]">
                <tr>
                  <th class="px-5 py-3 font-bold">Judul Keluhan</th>
                  <th class="px-5 py-3 font-bold">Nama Penyewa</th>
                  <th class="px-5 py-3 font-bold">Kamar</th>
                  <th class="px-5 py-3 font-bold">Tanggal Keluhan</th>
                  <th class="px-5 py-3 font-bold">Status Keluhan</th>
                </tr>
              </thead>
              <tbody>
                {latestComplaints().map((complaint) => (
                  <tr class="border-t border-[var(--divider)]">
                    <td class="px-5 py-4">
                      <p class="font-bold text-[rgb(var(--text-strong-rgb))]">{complaint.judul_keluhan}</p>
                      <p class="dashboard-muted mt-1 text-xs">{complaint.kategori_keluhan}</p>
                    </td>
                    <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">{complaint.nama_penyewa}</td>
                    <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">{complaint.nama_kamar}</td>
                    <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">{formatDate(complaint.tanggal_keluhan)}</td>
                    <td class="px-5 py-4">
                      <StatusBadge
                        value={complaintLabel(complaint.status_keluhan)}
                        tone={complaintTone(complaint.status_keluhan)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {latestComplaints().length === 0 && (
            <div class="p-5">
              <div class="rounded-xl border border-dashed border-[var(--surface-border)] bg-[var(--control-bg)] p-6 text-center text-sm text-[rgb(var(--text-muted-rgb))]">
                Belum ada data keluhan.
              </div>
            </div>
          )}
        </article>
      </section>
    </>
  );
}
