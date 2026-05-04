import { CheckCircle2, Eye, PlayCircle } from "lucide-solid";
import { createMemo, createSignal, onMount } from "solid-js";
import DataTable, { type DataTableColumn } from "~/components/common/DataTable";
import FilterSelect from "~/components/common/FilterSelect";
import FormModal from "~/components/common/FormModal";
import SearchInput from "~/components/common/SearchInput";
import StatusBadge, { type StatusBadgeTone } from "~/components/common/StatusBadge";
import {
  ownerRooms,
  tenantComplaints,
  type OwnerComplaintStatus,
  type OwnerTenantComplaint,
} from "~/data/ownerData";
import { formatDate } from "~/utils/format";
import { readOwnerRooms } from "~/utils/ownerRoomsStorage";
import { getCurrentOwnerId } from "~/utils/ownerSession";

type ComplaintStatusFilter = "semua" | OwnerComplaintStatus;

const complaintLabel = (status: OwnerComplaintStatus) => {
  switch (status) {
    case "selesai":
      return "Selesai";
    case "diproses":
      return "Diproses";
    default:
      return "Baru";
  }
};

const complaintTone = (status: OwnerComplaintStatus): StatusBadgeTone => {
  switch (status) {
    case "selesai":
      return "success";
    case "diproses":
      return "warning";
    default:
      return "danger";
  }
};

export default function OwnerTenantComplaints() {
  const ownerId = getCurrentOwnerId();
  const [roomSource, setRoomSource] = createSignal(ownerRooms);
  const [rows, setRows] = createSignal<OwnerTenantComplaint[]>(tenantComplaints);
  const [statusFilter, setStatusFilter] = createSignal<ComplaintStatusFilter>("semua");
  const [searchQuery, setSearchQuery] = createSignal("");
  const [detailComplaint, setDetailComplaint] = createSignal<OwnerTenantComplaint | null>(null);

  const ownerRoomIds = createMemo(
    () => new Set(roomSource().filter((room) => room.owner_id === ownerId).map((room) => room.id)),
  );
  const ownerRows = createMemo(() =>
    rows().filter(
      (complaint) => complaint.owner_id === ownerId && ownerRoomIds().has(complaint.room_id),
    ),
  );
  const unresolvedRows = createMemo(() =>
    ownerRows().filter((complaint) => complaint.status_keluhan !== "selesai"),
  );
  const filteredRows = createMemo(() => {
    const query = searchQuery().trim().toLowerCase();

    return ownerRows().filter((complaint) => {
      const matchesStatus =
        statusFilter() === "semua" || complaint.status_keluhan === statusFilter();
      const matchesSearch =
        !query ||
        complaint.nama_penyewa.toLowerCase().includes(query) ||
        complaint.nama_kamar.toLowerCase().includes(query) ||
        complaint.kategori_keluhan.toLowerCase().includes(query) ||
        complaint.judul_keluhan.toLowerCase().includes(query) ||
        complaint.isi_keluhan.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  });

  const updateComplaintStatus = (complaintId: number, status: OwnerComplaintStatus) => {
    const now = new Date().toISOString();
    setRows((items) =>
      items.map((item) =>
        item.id === complaintId ? { ...item, status_keluhan: status, updated_at: now } : item,
      ),
    );
    setDetailComplaint((current) =>
      current?.id === complaintId ? { ...current, status_keluhan: status, updated_at: now } : current,
    );
  };

  const columns: DataTableColumn<OwnerTenantComplaint>[] = [
    {
      header: "Keluhan",
      render: (complaint) => (
        <div>
          <p class="font-bold text-[rgb(var(--text-strong-rgb))]">{complaint.judul_keluhan}</p>
          <p class="dashboard-muted mt-1 text-xs">{complaint.kategori_keluhan}</p>
        </div>
      ),
    },
    { header: "Penyewa", render: (complaint) => complaint.nama_penyewa },
    { header: "Kamar", render: (complaint) => complaint.nama_kamar },
    { header: "Tanggal", render: (complaint) => formatDate(complaint.tanggal_keluhan) },
    {
      header: "Status",
      render: (complaint) => (
        <StatusBadge
          value={complaintLabel(complaint.status_keluhan)}
          tone={complaintTone(complaint.status_keluhan)}
        />
      ),
    },
    {
      header: "Aksi",
      render: (complaint) => (
        <div class="flex gap-2">
          <button
            type="button"
            class="icon-button h-9 w-9"
            aria-label="Detail keluhan"
            onClick={() => setDetailComplaint(complaint)}
          >
            <Eye size={15} />
          </button>
          {complaint.status_keluhan === "baru" && (
            <button
              type="button"
              class="icon-button h-9 w-9 text-orange-400"
              aria-label="Proses keluhan"
              onClick={() => updateComplaintStatus(complaint.id, "diproses")}
            >
              <PlayCircle size={15} />
            </button>
          )}
          {complaint.status_keluhan !== "selesai" && (
            <button
              type="button"
              class="icon-button h-9 w-9 text-emerald-400"
              aria-label="Selesaikan keluhan"
              onClick={() => updateComplaintStatus(complaint.id, "selesai")}
            >
              <CheckCircle2 size={15} />
            </button>
          )}
        </div>
      ),
    },
  ];

  onMount(() => {
    setRoomSource(readOwnerRooms());
  });

  return (
    <div class="grid gap-6">
      <section class="dashboard-card overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--divider)] p-4">
          <div>
            <h2 class="ui-heading text-lg font-bold">Keluhan Penyewa</h2>
            <p class="dashboard-muted mt-1 text-sm">
              Keluhan ditampilkan hanya dari penyewa yang tinggal di kamar milik owner_id {ownerId}.
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <div class="rounded-lg border border-[var(--control-border)] bg-[var(--control-bg)] px-3 py-2 text-sm font-bold text-orange-400">
              {unresolvedRows().length} belum selesai
            </div>
            <div class="rounded-lg border border-[var(--control-border)] bg-[var(--control-bg)] px-3 py-2 text-sm font-bold text-red-400">
              {ownerRows().length} keluhan
            </div>
          </div>
        </div>

        <div class="grid gap-3 border-b border-[var(--divider)] p-4 lg:grid-cols-[1fr_0.3fr]">
          <SearchInput
            value={searchQuery()}
            placeholder="Cari penyewa, kamar, kategori, atau isi keluhan"
            onInput={setSearchQuery}
          />
          <FilterSelect<ComplaintStatusFilter>
            value={statusFilter()}
            ariaLabel="Filter status keluhan"
            options={[
              { label: "Semua status", value: "semua" },
              { label: "Baru", value: "baru" },
              { label: "Diproses", value: "diproses" },
              { label: "Selesai", value: "selesai" },
            ]}
            onChange={setStatusFilter}
          />
        </div>

        <DataTable
          rows={filteredRows()}
          columns={columns}
          minWidthClass="min-w-[920px]"
          emptyText="Tidak ada keluhan yang cocok dengan filter."
        />
      </section>

      {detailComplaint() && (
        <FormModal
          title="Detail Keluhan"
          subtitle={`${detailComplaint()?.nama_penyewa ?? ""} - ${detailComplaint()?.nama_kamar ?? ""}`}
          onClose={() => setDetailComplaint(null)}
        >
          <div class="grid gap-4">
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Judul Keluhan</p>
                <p class="ui-heading mt-1 font-bold">{detailComplaint()?.judul_keluhan}</p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Kategori</p>
                <p class="ui-heading mt-1 font-bold">{detailComplaint()?.kategori_keluhan}</p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Penyewa</p>
                <p class="ui-heading mt-1 font-bold">{detailComplaint()?.nama_penyewa}</p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Kamar</p>
                <p class="ui-heading mt-1 font-bold">{detailComplaint()?.nama_kamar}</p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Tanggal Keluhan</p>
                <p class="ui-heading mt-1 font-bold">
                  {formatDate(detailComplaint()?.tanggal_keluhan ?? "")}
                </p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Status</p>
                <div class="mt-2">
                  {detailComplaint() && (
                    <StatusBadge
                      value={complaintLabel(detailComplaint()!.status_keluhan)}
                      tone={complaintTone(detailComplaint()!.status_keluhan)}
                    />
                  )}
                </div>
              </div>
            </div>

            <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <p class="dashboard-muted text-xs">Isi Keluhan</p>
              <p class="ui-heading mt-2 leading-7">{detailComplaint()?.isi_keluhan}</p>
            </div>

            <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <p class="dashboard-muted text-xs">Catatan Pemilik</p>
              <p class="ui-heading mt-2 leading-7">{detailComplaint()?.catatan_pemilik || "-"}</p>
            </div>

            <div class="flex flex-wrap justify-end gap-3">
              {detailComplaint()?.status_keluhan === "baru" && (
                <button
                  type="button"
                  class="btn-secondary px-4 py-2 text-sm"
                  onClick={() => updateComplaintStatus(detailComplaint()!.id, "diproses")}
                >
                  <PlayCircle size={16} />
                  Tandai Diproses
                </button>
              )}
              {detailComplaint()?.status_keluhan !== "selesai" && (
                <button
                  type="button"
                  class="btn-primary px-4 py-2 text-sm"
                  onClick={() => updateComplaintStatus(detailComplaint()!.id, "selesai")}
                >
                  <CheckCircle2 size={16} />
                  Tandai Selesai
                </button>
              )}
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
}
