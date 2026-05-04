import {
  Banknote,
  BedDouble,
  CheckCircle2,
  Home,
  ReceiptText,
} from "lucide-solid";
import { createEffect, createMemo, createSignal, onMount } from "solid-js";
import type { Component } from "solid-js";
import Pagination, {
  getPaginatedRows,
  getTotalPages,
  type RowsPerPageOption,
} from "~/components/common/Pagination";
import StatusBadge, { type StatusBadgeTone } from "~/components/common/StatusBadge";
import {
  ownerRooms,
  roomBills,
  tenantComplaints,
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
  const valueSizeClass = props.stat.value.startsWith("Rp") ? "text-3xl leading-tight" : "text-3xl";

  return (
    <article class="dashboard-card relative min-h-[126px] overflow-hidden p-5">
      <div class="min-w-0 pr-12">
          <p class="dashboard-muted text-sm">{props.stat.label}</p>
          <p class={`mt-2 break-words font-bold ${valueSizeClass} ${statTextClass(props.stat.tone)}`}>
            {props.stat.value}
          </p>
      </div>
      <div class={`absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-xl border ${statIconClass(props.stat.tone)}`}>
        <Icon size={18} />
      </div>
    </article>
  );
}

export default function OwnerDashboard() {
  const [roomSource, setRoomSource] = createSignal(ownerRooms);
  const [complaintPage, setComplaintPage] = createSignal(1);
  const [complaintRowsPerPage, setComplaintRowsPerPage] = createSignal<RowsPerPageOption>(10);
  const ownerId = createMemo(() => getCurrentOwnerId());
  const rooms = createMemo(() => roomSource().filter((room) => room.owner_id === ownerId()));
  const ownerRoomIds = createMemo(() => new Set(rooms().map((room) => room.id)));
  const ownerBills = createMemo(() =>
    roomBills.filter((bill) => bill.owner_id === ownerId()),
  );
  const ownerComplaints = createMemo(() =>
    tenantComplaints.filter(
      (complaint) =>
        complaint.owner_id === ownerId() && ownerRoomIds().has(complaint.room_id),
    ),
  );
  const unresolvedComplaints = createMemo(() =>
    [...ownerComplaints()]
      .filter((complaint) => complaint.status_keluhan !== "selesai")
      .sort((first, second) => getTime(second.created_at) - getTime(first.created_at)),
  );
  const paginatedComplaints = createMemo(() =>
    getPaginatedRows(unresolvedComplaints(), complaintPage(), complaintRowsPerPage()),
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
  const totalBills = createMemo(() =>
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
      label: "Total Pendapatan",
      value: formatCurrency(currentRevenue()),
      tone: "orange",
      icon: Banknote,
    },
    {
      label: "Total Tagihan",
      value: formatCurrency(totalBills()),
      tone: "green",
      icon: ReceiptText,
    },
  ]);

  onMount(() => {
    setRoomSource(readOwnerRooms());
  });

  createEffect(() => {
    const totalPages = getTotalPages(unresolvedComplaints().length, complaintRowsPerPage());
    if (complaintPage() > totalPages) {
      setComplaintPage(totalPages);
    }
  });

  return (
    <>
      <section class="grid gap-5">
        <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {stats().slice(0, 3).map((stat) => (
            <StatCardItem stat={stat} />
          ))}
        </div>
        <div class="grid gap-5 xl:grid-cols-2">
          {stats().slice(3).map((stat) => (
            <StatCardItem stat={stat} />
          ))}
        </div>
      </section>

      <section class="mt-8">
        <article class="dashboard-card overflow-hidden">
          <div class="border-b border-[var(--divider)] p-4">
            <h2 class="ui-heading text-lg font-bold">Keluhan Terbaru Belum Selesai</h2>
            <p class="dashboard-muted mt-1 text-sm">Hanya menampilkan keluhan berstatus baru atau diproses.</p>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full min-w-[860px] text-left text-sm">
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
                {paginatedComplaints().map((complaint) => (
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
          {unresolvedComplaints().length === 0 && (
            <div class="p-5">
              <div class="rounded-xl border border-dashed border-[var(--surface-border)] bg-[var(--control-bg)] p-6 text-center text-sm text-[rgb(var(--text-muted-rgb))]">
                Tidak ada keluhan yang perlu ditindaklanjuti.
              </div>
            </div>
          )}
          <div class="p-4 pt-0">
            <Pagination
              ariaLabel="Pagination keluhan dashboard"
              page={complaintPage()}
              totalItems={unresolvedComplaints().length}
              rowsPerPage={complaintRowsPerPage()}
              onPageChange={setComplaintPage}
              onRowsPerPageChange={(rows) => {
                setComplaintRowsPerPage(rows);
                setComplaintPage(1);
              }}
            />
          </div>
        </article>
      </section>
    </>
  );
}
