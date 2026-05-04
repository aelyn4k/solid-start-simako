import { Eye } from "lucide-solid";
import { createEffect, createMemo, createSignal, onMount } from "solid-js";
import DataTable, { type DataTableColumn } from "~/components/common/DataTable";
import FilterSelect from "~/components/common/FilterSelect";
import FormModal from "~/components/common/FormModal";
import Pagination, {
  getPaginatedRows,
  getTotalPages,
  type RowsPerPageOption,
} from "~/components/common/Pagination";
import SearchInput from "~/components/common/SearchInput";
import StatusBadge, { type StatusBadgeTone } from "~/components/common/StatusBadge";
import {
  ownerRooms,
  ownerTenants,
  roomBills,
  tenantComplaints,
  type OwnerTenant,
  type OwnerTenantStatus,
} from "~/data/ownerData";
import { formatDate } from "~/utils/format";
import { readOwnerRooms } from "~/utils/ownerRoomsStorage";
import { getCurrentOwnerId } from "~/utils/ownerSession";

type TenantStatusFilter = "semua" | OwnerTenantStatus;
type TenantRow = OwnerTenant & { status_sewa: OwnerTenantStatus };

const getTenantStatus = (tenant: OwnerTenant): OwnerTenantStatus =>
  tenant.status_sewa ?? tenant.status_penyewa;

const statusLabel = (status: OwnerTenantStatus) => {
  switch (status) {
    case "selesai":
      return "Selesai";
    case "pending":
      return "Pending";
    default:
      return "Aktif";
  }
};

const statusTone = (status: OwnerTenantStatus): StatusBadgeTone => {
  switch (status) {
    case "aktif":
      return "success";
    case "pending":
      return "warning";
    default:
      return "neutral";
  }
};

const createTenantFromRoom = (room: (typeof ownerRooms)[number]): TenantRow => ({
  id: 900000 + room.id,
  owner_id: room.owner_id,
  room_id: room.id,
  nama_kamar: room.nama_kamar,
  nama_penyewa: room.nama_penghuni,
  email_penyewa: room.email_penghuni,
  nomor_hp_penyewa: "-",
  tanggal_mulai_sewa: room.created_at,
  tanggal_akhir_sewa: "",
  status_sewa: "aktif",
  status_pembayaran: "pending",
  status_penyewa: "aktif",
  created_at: room.created_at,
  updated_at: room.updated_at,
});

export default function OwnerTenants() {
  const ownerId = getCurrentOwnerId();
  const [roomSource, setRoomSource] = createSignal(ownerRooms);
  const [searchQuery, setSearchQuery] = createSignal("");
  const [statusFilter, setStatusFilter] = createSignal<TenantStatusFilter>("semua");
  const [detailTenant, setDetailTenant] = createSignal<TenantRow | null>(null);
  const [page, setPage] = createSignal(1);
  const [rowsPerPage, setRowsPerPage] = createSignal<RowsPerPageOption>(10);

  const ownerRoomRows = createMemo(() =>
    roomSource().filter((room) => room.owner_id === ownerId),
  );
  const ownerRoomIds = createMemo(() => new Set(ownerRoomRows().map((room) => room.id)));
  const tenants = createMemo<TenantRow[]>(() => {
    const explicitRows = ownerTenants
      .filter((tenant) => tenant.owner_id === ownerId && ownerRoomIds().has(tenant.room_id))
      .map((tenant) => ({ ...tenant, status_sewa: getTenantStatus(tenant) }));
    const explicitRoomIds = new Set(explicitRows.map((tenant) => tenant.room_id));
    const roomRows = ownerRoomRows()
      .filter(
        (room) =>
          room.status_kost === "berpenghuni" &&
          room.nama_penghuni.trim() &&
          !explicitRoomIds.has(room.id),
      )
      .map(createTenantFromRoom);

    return [...explicitRows, ...roomRows].sort(
      (first, second) =>
        new Date(second.created_at).getTime() - new Date(first.created_at).getTime(),
    );
  });
  const filteredTenants = createMemo(() => {
    const query = searchQuery().trim().toLowerCase();

    return tenants().filter((tenant) => {
      const matchesStatus =
        statusFilter() === "semua" || tenant.status_sewa === statusFilter();
      const matchesSearch =
        !query ||
        tenant.nama_penyewa.toLowerCase().includes(query) ||
        tenant.email_penyewa.toLowerCase().includes(query) ||
        tenant.nomor_hp_penyewa.toLowerCase().includes(query) ||
        tenant.nama_kamar.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  });
  const paginatedTenants = createMemo(() =>
    getPaginatedRows(filteredTenants(), page(), rowsPerPage()),
  );
  const detailBillCount = createMemo(() => {
    const tenant = detailTenant();

    if (!tenant) {
      return 0;
    }

    return roomBills.filter(
      (bill) =>
        bill.owner_id === ownerId &&
        bill.room_id === tenant.room_id &&
        bill.nama_kamar === tenant.nama_kamar,
    ).length;
  });
  const detailComplaintCount = createMemo(() => {
    const tenant = detailTenant();

    if (!tenant) {
      return 0;
    }

    return tenantComplaints.filter(
      (complaint) =>
        complaint.owner_id === ownerId &&
        complaint.room_id === tenant.room_id &&
        complaint.nama_penyewa === tenant.nama_penyewa,
    ).length;
  });

  const columns: DataTableColumn<TenantRow>[] = [
    {
      header: "Nama Penyewa",
      render: (tenant) => (
        <span class="font-bold text-[rgb(var(--text-strong-rgb))]">{tenant.nama_penyewa}</span>
      ),
    },
    { header: "Email", render: (tenant) => tenant.email_penyewa },
    { header: "Nomor HP", render: (tenant) => tenant.nomor_hp_penyewa || "-" },
    { header: "Nama/Nomor Kamar", render: (tenant) => tenant.nama_kamar },
    { header: "Tanggal Masuk", render: (tenant) => formatDate(tenant.tanggal_mulai_sewa) },
    {
      header: "Tanggal Keluar",
      render: (tenant) =>
        tenant.tanggal_akhir_sewa ? formatDate(tenant.tanggal_akhir_sewa) : "-",
    },
    {
      header: "Status Sewa",
      render: (tenant) => (
        <StatusBadge value={statusLabel(tenant.status_sewa)} tone={statusTone(tenant.status_sewa)} />
      ),
    },
    {
      header: "Aksi",
      render: (tenant) => (
        <button
          type="button"
          class="icon-button h-9 w-9"
          aria-label="Detail penyewa"
          onClick={() => setDetailTenant(tenant)}
        >
          <Eye size={15} />
        </button>
      ),
    },
  ];

  onMount(() => {
    setRoomSource(readOwnerRooms());
  });

  createEffect(() => {
    const totalPages = getTotalPages(filteredTenants().length, rowsPerPage());
    if (page() > totalPages) {
      setPage(totalPages);
    }
  });

  return (
    <div class="grid gap-6">
      <section class="dashboard-card overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--divider)] p-4">
          <div>
            <h2 class="ui-heading text-lg font-bold">List Penyewa</h2>
            <p class="dashboard-muted mt-1 text-sm">
              Daftar penyewa kost berdasarkan kamar milik owner_id {ownerId}.
            </p>
          </div>
          <div class="rounded-lg border border-[var(--control-border)] bg-[var(--control-bg)] px-3 py-2 text-sm font-bold text-red-400">
            {filteredTenants().length} penyewa
          </div>
        </div>

        <div class="grid gap-3 border-b border-[var(--divider)] p-4 lg:grid-cols-[1fr_0.3fr]">
          <SearchInput
            value={searchQuery()}
            placeholder="Cari nama, email, nomor HP, atau kamar"
            onInput={(value) => {
              setSearchQuery(value);
              setPage(1);
            }}
          />
          <FilterSelect<TenantStatusFilter>
            value={statusFilter()}
            ariaLabel="Filter status sewa"
            options={[
              { label: "Semua status", value: "semua" },
              { label: "Aktif", value: "aktif" },
              { label: "Selesai", value: "selesai" },
              { label: "Pending", value: "pending" },
            ]}
            onChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          />
        </div>

        <DataTable
          rows={paginatedTenants()}
          columns={columns}
          minWidthClass="min-w-[1120px]"
          emptyText="Belum ada penyewa kost"
        />
        <div class="p-4">
          <Pagination
            ariaLabel="Pagination list penyewa"
            page={page()}
            totalItems={filteredTenants().length}
            rowsPerPage={rowsPerPage()}
            onPageChange={setPage}
            onRowsPerPageChange={(rows) => {
              setRowsPerPage(rows);
              setPage(1);
            }}
          />
        </div>
      </section>

      {detailTenant() && (
        <FormModal
          title="Detail Penyewa"
          subtitle={`${detailTenant()?.nama_penyewa ?? ""} - ${detailTenant()?.nama_kamar ?? ""}`}
          onClose={() => setDetailTenant(null)}
        >
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <p class="dashboard-muted text-xs">Nama Penyewa</p>
              <p class="ui-heading mt-1 font-bold">{detailTenant()?.nama_penyewa}</p>
            </div>
            <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <p class="dashboard-muted text-xs">Email Penyewa</p>
              <p class="ui-heading mt-1 font-bold">{detailTenant()?.email_penyewa}</p>
            </div>
            <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <p class="dashboard-muted text-xs">Nomor HP Penyewa</p>
              <p class="ui-heading mt-1 font-bold">{detailTenant()?.nomor_hp_penyewa || "-"}</p>
            </div>
            <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <p class="dashboard-muted text-xs">Nama/Nomor Kamar</p>
              <p class="ui-heading mt-1 font-bold">{detailTenant()?.nama_kamar}</p>
            </div>
            <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <p class="dashboard-muted text-xs">Tanggal Masuk</p>
              <p class="ui-heading mt-1 font-bold">
                {formatDate(detailTenant()?.tanggal_mulai_sewa ?? "")}
              </p>
            </div>
            <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <p class="dashboard-muted text-xs">Tanggal Keluar</p>
              <p class="ui-heading mt-1 font-bold">
                {detailTenant()?.tanggal_akhir_sewa
                  ? formatDate(detailTenant()?.tanggal_akhir_sewa ?? "")
                  : "-"}
              </p>
            </div>
            <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <p class="dashboard-muted text-xs">Status Sewa</p>
              <div class="mt-2">
                {detailTenant() && (
                  <StatusBadge
                    value={statusLabel(detailTenant()!.status_sewa)}
                    tone={statusTone(detailTenant()!.status_sewa)}
                  />
                )}
              </div>
            </div>
            <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <p class="dashboard-muted text-xs">Jumlah Tagihan</p>
              <p class="mt-1 text-2xl font-bold text-orange-400">{detailBillCount()}</p>
            </div>
            <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4 sm:col-span-2">
              <p class="dashboard-muted text-xs">Jumlah Keluhan</p>
              <p class="mt-1 text-2xl font-bold text-red-400">{detailComplaintCount()}</p>
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
}
