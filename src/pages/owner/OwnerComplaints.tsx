import { Eye, Save } from "lucide-solid";
import { createMemo, createSignal, onMount } from "solid-js";
import DataTable, { type DataTableColumn } from "~/components/common/DataTable";
import FilterSelect from "~/components/common/FilterSelect";
import FormModal from "~/components/common/FormModal";
import SearchInput from "~/components/common/SearchInput";
import StatusBadge, { type StatusBadgeTone } from "~/components/common/StatusBadge";
import {
  ownerRooms,
  ownerTenants,
  tenantComplaints,
  type OwnerComplaintStatus,
  type OwnerTenantComplaint,
} from "~/data/ownerData";
import { formatDate } from "~/utils/format";
import { readOwnerRooms } from "~/utils/ownerRoomsStorage";
import { getCurrentOwnerId } from "~/utils/ownerSession";

type ComplaintStatusFilter = "semua" | OwnerComplaintStatus;
type ComplaintRow = OwnerTenantComplaint & {
  email_penyewa: string;
  foto_keluhan: string[];
};

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

const resolveTenantEmail = (complaint: OwnerTenantComplaint) =>
  complaint.email_penyewa ??
  ownerTenants.find((tenant) => tenant.id === complaint.tenant_id)?.email_penyewa ??
  ownerTenants.find(
    (tenant) =>
      tenant.owner_id === complaint.owner_id &&
      tenant.room_id === complaint.room_id &&
      tenant.nama_penyewa === complaint.nama_penyewa,
  )?.email_penyewa ??
  "-";

export default function OwnerComplaints() {
  const ownerId = getCurrentOwnerId();
  const [roomSource, setRoomSource] = createSignal(ownerRooms);
  const [rows, setRows] = createSignal<OwnerTenantComplaint[]>(tenantComplaints);
  const [searchQuery, setSearchQuery] = createSignal("");
  const [statusFilter, setStatusFilter] = createSignal<ComplaintStatusFilter>("semua");
  const [selectedComplaint, setSelectedComplaint] = createSignal<ComplaintRow | null>(null);
  const [updatingComplaint, setUpdatingComplaint] = createSignal<ComplaintRow | null>(null);
  const [form, setForm] = createSignal({
    status_keluhan: "" as OwnerComplaintStatus | "",
    catatan_pemilik: "",
  });
  const [formError, setFormError] = createSignal("");

  const ownerRoomIds = createMemo(
    () => new Set(roomSource().filter((room) => room.owner_id === ownerId).map((room) => room.id)),
  );
  const complaints = createMemo<ComplaintRow[]>(() =>
    rows()
      .filter((complaint) => complaint.owner_id === ownerId && ownerRoomIds().has(complaint.room_id))
      .map((complaint) => ({
        ...complaint,
        email_penyewa: resolveTenantEmail(complaint),
        foto_keluhan: complaint.foto_keluhan ?? [],
      })),
  );
  const filteredComplaints = createMemo(() => {
    const query = searchQuery().trim().toLowerCase();

    return complaints().filter((complaint) => {
      const matchesStatus =
        statusFilter() === "semua" || complaint.status_keluhan === statusFilter();
      const matchesSearch =
        !query ||
        complaint.judul_keluhan.toLowerCase().includes(query) ||
        complaint.isi_keluhan.toLowerCase().includes(query) ||
        complaint.nama_penyewa.toLowerCase().includes(query) ||
        complaint.email_penyewa.toLowerCase().includes(query) ||
        complaint.nama_kamar.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  });

  const openUpdateForm = (complaint: ComplaintRow) => {
    setUpdatingComplaint(complaint);
    setForm({
      status_keluhan: complaint.status_keluhan,
      catatan_pemilik: complaint.catatan_pemilik,
    });
    setFormError("");
  };

  const submitUpdate = () => {
    const target = updatingComplaint();

    if (!target) {
      return;
    }

    if (!form().status_keluhan) {
      setFormError("Status keluhan wajib dipilih.");
      return;
    }

    const now = new Date().toISOString();
    const nextStatus = form().status_keluhan as OwnerComplaintStatus;
    const nextNote = form().catatan_pemilik.trim();

    setRows((items) =>
      items.map((item) =>
        item.id === target.id
          ? {
              ...item,
              status_keluhan: nextStatus,
              catatan_pemilik: nextNote,
              updated_at: now,
            }
          : item,
      ),
    );
    setSelectedComplaint((current) =>
      current?.id === target.id
        ? {
            ...current,
            status_keluhan: nextStatus,
            catatan_pemilik: nextNote,
            updated_at: now,
          }
        : current,
    );
    setUpdatingComplaint(null);
    setFormError("");
  };

  const columns: DataTableColumn<ComplaintRow>[] = [
    {
      header: "Judul Keluhan",
      render: (complaint) => (
        <div>
          <p class="font-bold text-[rgb(var(--text-strong-rgb))]">{complaint.judul_keluhan}</p>
          <p class="dashboard-muted mt-1 text-xs">{complaint.kategori_keluhan}</p>
        </div>
      ),
    },
    { header: "Nama Penyewa", render: (complaint) => complaint.nama_penyewa },
    { header: "Email Penyewa", render: (complaint) => complaint.email_penyewa },
    { header: "Kamar", render: (complaint) => complaint.nama_kamar },
    { header: "Tanggal Keluhan", render: (complaint) => formatDate(complaint.tanggal_keluhan) },
    {
      header: "Status Keluhan",
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
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="btn-secondary px-3 py-2 text-xs"
            onClick={() => setSelectedComplaint(complaint)}
          >
            <Eye size={14} />
            Detail
          </button>
          <button
            type="button"
            class="btn-primary px-3 py-2 text-xs"
            onClick={() => openUpdateForm(complaint)}
          >
            Update Status
          </button>
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
              Daftar keluhan dari penyewa yang tinggal di kamar milik owner_id {ownerId}.
            </p>
          </div>
          <div class="rounded-lg border border-[var(--control-border)] bg-[var(--control-bg)] px-3 py-2 text-sm font-bold text-red-400">
            {filteredComplaints().length} keluhan
          </div>
        </div>

        <div class="grid gap-3 border-b border-[var(--divider)] p-4 lg:grid-cols-[1fr_0.3fr]">
          <SearchInput
            value={searchQuery()}
            placeholder="Cari judul, isi keluhan, penyewa, email, atau kamar"
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
          rows={filteredComplaints()}
          columns={columns}
          minWidthClass="min-w-[1120px]"
          emptyText="Belum ada keluhan dari penyewa"
        />
      </section>

      {selectedComplaint() && (
        <FormModal
          title="Detail Keluhan"
          subtitle={`${selectedComplaint()?.nama_penyewa ?? ""} - ${selectedComplaint()?.nama_kamar ?? ""}`}
          maxWidthClass="max-w-3xl"
          onClose={() => setSelectedComplaint(null)}
        >
          <div class="grid gap-4">
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Judul Keluhan</p>
                <p class="ui-heading mt-1 font-bold">{selectedComplaint()?.judul_keluhan}</p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Nama Penyewa</p>
                <p class="ui-heading mt-1 font-bold">{selectedComplaint()?.nama_penyewa}</p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Email Penyewa</p>
                <p class="ui-heading mt-1 font-bold">{selectedComplaint()?.email_penyewa}</p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Kamar</p>
                <p class="ui-heading mt-1 font-bold">{selectedComplaint()?.nama_kamar}</p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Tanggal Keluhan</p>
                <p class="ui-heading mt-1 font-bold">
                  {formatDate(selectedComplaint()?.tanggal_keluhan ?? "")}
                </p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Status Keluhan</p>
                <div class="mt-2">
                  {selectedComplaint() && (
                    <StatusBadge
                      value={complaintLabel(selectedComplaint()!.status_keluhan)}
                      tone={complaintTone(selectedComplaint()!.status_keluhan)}
                    />
                  )}
                </div>
              </div>
            </div>

            <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <p class="dashboard-muted text-xs">Isi Keluhan</p>
              <p class="ui-heading mt-2 leading-7">{selectedComplaint()?.isi_keluhan}</p>
            </div>

            <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <p class="dashboard-muted text-xs">Foto Keluhan</p>
              {selectedComplaint()?.foto_keluhan.length ? (
                <div class="mt-3 grid gap-3 sm:grid-cols-2">
                  {selectedComplaint()?.foto_keluhan.map((image) => (
                    <img
                      src={image}
                      alt={`Foto keluhan ${selectedComplaint()?.judul_keluhan ?? ""}`}
                      class="h-44 w-full rounded-xl border border-[var(--surface-border)] object-cover"
                    />
                  ))}
                </div>
              ) : (
                <p class="ui-heading mt-2 font-bold">Tidak ada foto</p>
              )}
            </div>

            <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <p class="dashboard-muted text-xs">Catatan Pemilik</p>
              <p class="ui-heading mt-2 leading-7">{selectedComplaint()?.catatan_pemilik || "-"}</p>
            </div>
          </div>
        </FormModal>
      )}

      {updatingComplaint() && (
        <FormModal
          title="Update Status Keluhan"
          subtitle={`${updatingComplaint()?.judul_keluhan ?? ""} - ${updatingComplaint()?.nama_penyewa ?? ""}`}
          onClose={() => setUpdatingComplaint(null)}
        >
          <form
            class="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              submitUpdate();
            }}
          >
            <label class="block">
              <span class="form-label">Status Keluhan</span>
              <select
                class="form-control mt-2"
                value={form().status_keluhan}
                onInput={(event) =>
                  setForm({
                    ...form(),
                    status_keluhan: event.currentTarget.value as OwnerComplaintStatus,
                  })
                }
              >
                <option value="">Pilih status keluhan</option>
                <option value="baru">Baru</option>
                <option value="diproses">Diproses</option>
                <option value="selesai">Selesai</option>
              </select>
              {formError() && <p class="mt-2 text-xs font-semibold text-red-400">{formError()}</p>}
            </label>

            <label class="block">
              <span class="form-label">Catatan Pemilik</span>
              <textarea
                class="form-control mt-2 min-h-28 resize-y"
                value={form().catatan_pemilik}
                onInput={(event) => setForm({ ...form(), catatan_pemilik: event.currentTarget.value })}
                placeholder="Opsional. Contoh: Sudah dijadwalkan perbaikan."
              />
            </label>

            <div class="flex flex-wrap justify-end gap-3 pt-2">
              <button
                type="button"
                class="btn-secondary px-5 py-3 text-sm"
                onClick={() => setUpdatingComplaint(null)}
              >
                Batal
              </button>
              <button type="submit" class="btn-primary px-5 py-3 text-sm">
                <Save size={16} />
                Simpan Perubahan
              </button>
            </div>
          </form>
        </FormModal>
      )}
    </div>
  );
}
