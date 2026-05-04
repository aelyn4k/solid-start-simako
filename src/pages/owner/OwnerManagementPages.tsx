import { Edit3, ExternalLink, Eye, ImageOff, MapPin, Plus, Save, Search, Trash2, X } from "lucide-solid";
import { createEffect, createMemo, createSignal } from "solid-js";
import ConfirmDialog from "~/components/ConfirmDialog";
import ImageUpload from "~/components/common/ImageUpload";
import Pagination, {
  getPaginatedRows,
  getTotalPages,
  type RowsPerPageOption,
} from "~/components/common/Pagination";
import {
  bankAccounts,
  contactInfo,
  facilities,
  kostInfo,
  ownerRooms,
  ownerTenants,
  roomBills,
  rules,
  type BankAccount,
  type ContactInfo,
  type KostInfo,
  type KostRule,
  type OwnerKostType,
  type OwnerBillStatus,
  type OwnerRoom,
  type OwnerRoomStatus,
  type PublicFacility,
  type RoomBill,
} from "~/data/ownerData";
import { persistOwnerRooms, readOwnerRooms } from "~/utils/ownerRoomsStorage";
import { getCurrentOwnerId } from "~/utils/ownerSession";

type BadgeTone = "success" | "danger" | "warning" | "info" | "neutral";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const nextId = (items: { id: number }[]) =>
  items.length === 0 ? Date.now() : Math.max(...items.map((item) => item.id)) + 1;

const badgeToneClass = (tone: BadgeTone) => {
  switch (tone) {
    case "success":
      return "border-emerald-400/30 bg-emerald-500/10 text-emerald-300";
    case "danger":
      return "border-red-400/30 bg-red-500/10 text-red-300";
    case "warning":
      return "border-orange-400/30 bg-orange-500/10 text-orange-300";
    case "info":
      return "border-sky-400/30 bg-sky-500/10 text-sky-300";
    default:
      return "border-slate-400/30 bg-slate-500/10 text-slate-300";
  }
};

function StatusBadge(props: { value: string; tone: BadgeTone }) {
  return (
    <span class={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${badgeToneClass(props.tone)}`}>
      {props.value}
    </span>
  );
}

function EmptyState(props: { text: string }) {
  return (
    <div class="rounded-xl border border-dashed border-[var(--surface-border)] bg-[var(--control-bg)] p-6 text-center text-sm text-[rgb(var(--text-muted-rgb))]">
      {props.text}
    </div>
  );
}

function SectionHeader(props: { title: string; subtitle: string }) {
  return (
    <div class="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 class="ui-heading text-lg font-bold">{props.title}</h2>
        <p class="dashboard-muted mt-1 text-sm">{props.subtitle}</p>
      </div>
    </div>
  );
}

type RoomFilterStatus = "semua" | OwnerRoomStatus;
type RoomFilterKostType = "semua" | OwnerKostType;
type RoomFormErrors = Partial<
  Record<
    | "nama_kamar"
    | "spesifikasi_kamar"
    | "harga_perbulan"
    | "harga_persemester"
    | "harga_pertahun"
    | "foto_kamar"
    | "deskripsi_kamar"
    | "jenis_kost"
    | "status_kost"
    | "nama_penghuni"
    | "email_penghuni",
    string
  >
>;

interface RoomFormState {
  nama_kamar: string;
  spesifikasi_kamar: string;
  harga_perbulan: string;
  harga_persemester: string;
  harga_pertahun: string;
  foto_kamar: string[];
  deskripsi_kamar: string;
  jenis_kost: OwnerKostType | "";
  status_kost: OwnerRoomStatus | "";
  nama_penghuni: string;
  email_penghuni: string;
}

const maxPhotoSize = 2 * 1024 * 1024;
const allowedPhotoExtensions = ["jpg", "jpeg", "png", "webp"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyRoomForm = (): RoomFormState => ({
  nama_kamar: "",
  spesifikasi_kamar: "",
  harga_perbulan: "",
  harga_persemester: "",
  harga_pertahun: "",
  foto_kamar: [],
  deskripsi_kamar: "",
  jenis_kost: "",
  status_kost: "",
  nama_penghuni: "",
  email_penghuni: "",
});

function FieldError(props: { message?: string }) {
  return props.message ? <p class="mt-1 text-xs font-semibold text-red-400">{props.message}</p> : null;
}

export function OwnerRoomsPage() {
  const ownerId = getCurrentOwnerId();
  const ownerTenantRows = ownerTenants.filter((tenant) => tenant.owner_id === ownerId);
  const [rows, setRows] = createSignal<OwnerRoom[]>(
    readOwnerRooms().filter((room) => room.owner_id === ownerId),
  );
  const [form, setForm] = createSignal<RoomFormState>(emptyRoomForm());
  const [errors, setErrors] = createSignal<RoomFormErrors>({});
  const [editingId, setEditingId] = createSignal<number | null>(null);
  const [formOpen, setFormOpen] = createSignal(false);
  const [detailRoom, setDetailRoom] = createSignal<OwnerRoom | null>(null);
  const [deleteRoom, setDeleteRoom] = createSignal<OwnerRoom | null>(null);
  const [deletePhotoIndex, setDeletePhotoIndex] = createSignal<number | null>(null);
  const [statusFilter, setStatusFilter] = createSignal<RoomFilterStatus>("semua");
  const [kostTypeFilter, setKostTypeFilter] = createSignal<RoomFilterKostType>("semua");
  const [searchQuery, setSearchQuery] = createSignal("");
  const [page, setPage] = createSignal(1);
  const [rowsPerPage, setRowsPerPage] = createSignal<RowsPerPageOption>(10);

  const resetForm = () => {
    setEditingId(null);
    setErrors({});
    setForm(emptyRoomForm());
  };

  const openAddForm = () => {
    resetForm();
    setFormOpen(true);
  };

  const closeForm = () => {
    resetForm();
    setDeletePhotoIndex(null);
    setFormOpen(false);
  };

  const getOccupantPhone = (room: OwnerRoom) =>
    ownerTenantRows.find(
      (tenant) =>
        tenant.room_id === room.id &&
        tenant.status_penyewa !== "selesai" &&
        (!room.email_penghuni || tenant.email_penyewa === room.email_penghuni),
    )?.nomor_hp_penyewa ?? "-";

  const filteredRows = createMemo(() => {
    const normalizedQuery = searchQuery().trim().toLowerCase();

    return rows().filter((room) => {
      const occupantPhone = getOccupantPhone(room).toLowerCase();
      const matchesStatus = statusFilter() === "semua" || room.status_kost === statusFilter();
      const matchesType = kostTypeFilter() === "semua" || room.jenis_kost === kostTypeFilter();
      const matchesSearch =
        !normalizedQuery ||
        room.nama_kamar.toLowerCase().includes(normalizedQuery) ||
        room.nama_penghuni.toLowerCase().includes(normalizedQuery) ||
        room.email_penghuni.toLowerCase().includes(normalizedQuery) ||
        occupantPhone.includes(normalizedQuery);

      return matchesStatus && matchesType && matchesSearch;
    });
  });
  const paginatedRows = createMemo(() =>
    getPaginatedRows(filteredRows(), page(), rowsPerPage()),
  );

  createEffect(() => {
    const totalPages = getTotalPages(filteredRows().length, rowsPerPage());
    if (page() > totalPages) {
      setPage(totalPages);
    }
  });

  const updateRows = (updater: (items: OwnerRoom[]) => OwnerRoom[]) => {
    setRows((items) => {
      const nextRows = updater(items);
      persistOwnerRooms(ownerId, nextRows);
      return nextRows;
    });
  };

  const validateForm = () => {
    const nextErrors: RoomFormErrors = {};
    const currentForm = form();

    if (!currentForm.nama_kamar.trim()) {
      nextErrors.nama_kamar = "Nama/Nomor Kamar wajib diisi.";
    }

    if (!currentForm.spesifikasi_kamar.trim()) {
      nextErrors.spesifikasi_kamar = "Spesifikasi Kamar wajib diisi.";
    }

    if (!currentForm.harga_perbulan.trim() || Number.isNaN(Number(currentForm.harga_perbulan))) {
      nextErrors.harga_perbulan = "Harga Per Bulan wajib diisi dan harus angka.";
    }

    if (!currentForm.harga_persemester.trim() || Number.isNaN(Number(currentForm.harga_persemester))) {
      nextErrors.harga_persemester = "Harga Per Semester wajib diisi dan harus angka.";
    }

    if (!currentForm.harga_pertahun.trim() || Number.isNaN(Number(currentForm.harga_pertahun))) {
      nextErrors.harga_pertahun = "Harga Per Tahun wajib diisi dan harus angka.";
    }

    if (!currentForm.deskripsi_kamar.trim()) {
      nextErrors.deskripsi_kamar = "Deskripsi Kamar wajib diisi.";
    }

    if (!currentForm.jenis_kost) {
      nextErrors.jenis_kost = "Jenis Kost wajib dipilih.";
    }

    if (!currentForm.status_kost) {
      nextErrors.status_kost = "Status Kost wajib dipilih.";
    }

    if (currentForm.status_kost === "berpenghuni") {
      if (!currentForm.nama_penghuni.trim()) {
        nextErrors.nama_penghuni = "Nama penghuni wajib diisi jika kamar berpenghuni.";
      }

      if (!currentForm.email_penghuni.trim()) {
        nextErrors.email_penghuni = "Email penghuni wajib diisi jika kamar berpenghuni.";
      } else if (!emailPattern.test(currentForm.email_penghuni.trim())) {
        nextErrors.email_penghuni = "Format email penghuni tidak valid.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.readAsDataURL(file);
    });

  const handlePhotoChange = async (files?: FileList | null) => {
    const selectedFiles = Array.from(files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    if (form().foto_kamar.length + selectedFiles.length > 4) {
      setErrors({ ...errors(), foto_kamar: "Foto kamar maksimal 4 gambar." });
      return;
    }

    const oversizedFile = selectedFiles.find((file) => file.size > maxPhotoSize);

    if (oversizedFile) {
      setErrors({ ...errors(), foto_kamar: "Ukuran foto maksimal 2MB" });
      return;
    }

    const invalidFile = selectedFiles.find((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
      return !allowedPhotoExtensions.includes(extension);
    });

    if (invalidFile) {
      setErrors({ ...errors(), foto_kamar: "Format foto hanya JPG, JPEG, PNG, atau WEBP." });
      return;
    }

    const dataUrls = await Promise.all(selectedFiles.map(readFileAsDataUrl));
    setForm({ ...form(), foto_kamar: [...form().foto_kamar, ...dataUrls].slice(0, 4) });
    const { foto_kamar: _photoError, ...remainingErrors } = errors();
    setErrors(remainingErrors);
  };

  const removePhoto = (index: number) => {
    setForm({
      ...form(),
      foto_kamar: form().foto_kamar.filter((_, photoIndex) => photoIndex !== index),
    });
  };

  const confirmDeletePhoto = () => {
    const photoIndex = deletePhotoIndex();

    if (photoIndex === null) {
      return;
    }

    removePhoto(photoIndex);
    setDeletePhotoIndex(null);
  };

  const confirmDeleteRoom = () => {
    const room = deleteRoom();

    if (!room) {
      return;
    }

    updateRows((items) => items.filter((item) => item.id !== room.id));

    if (detailRoom()?.id === room.id) {
      setDetailRoom(null);
    }

    setDeleteRoom(null);
  };

  const submit = () => {
    if (!validateForm()) {
      return;
    }

    const currentForm = form();
    const existingRoom = rows().find((room) => room.id === editingId());
    const now = new Date().toISOString();
    const payload: OwnerRoom = {
      id: editingId() ?? nextId(rows()),
      owner_id: ownerId,
      nama_kamar: currentForm.nama_kamar.trim(),
      spesifikasi_kamar: currentForm.spesifikasi_kamar.trim(),
      harga_perbulan: Number(currentForm.harga_perbulan),
      harga_persemester: Number(currentForm.harga_persemester),
      harga_pertahun: Number(currentForm.harga_pertahun),
      foto_kamar: currentForm.foto_kamar,
      deskripsi_kamar: currentForm.deskripsi_kamar.trim(),
      jenis_kost: currentForm.jenis_kost as OwnerKostType,
      status_kost: currentForm.status_kost as OwnerRoomStatus,
      nama_penghuni: currentForm.status_kost === "berpenghuni" ? currentForm.nama_penghuni.trim() : "",
      email_penghuni: currentForm.status_kost === "berpenghuni" ? currentForm.email_penghuni.trim() : "",
      created_at: existingRoom?.created_at ?? now,
      updated_at: now,
    };

    updateRows((items) =>
      editingId() ? items.map((item) => (item.id === editingId() ? payload : item)) : [payload, ...items],
    );
    resetForm();
    setFormOpen(false);
  };

  const editRow = (room: OwnerRoom) => {
    setEditingId(room.id);
    setForm({
      nama_kamar: room.nama_kamar,
      spesifikasi_kamar: room.spesifikasi_kamar,
      harga_perbulan: String(room.harga_perbulan),
      harga_persemester: String(room.harga_persemester),
      harga_pertahun: String(room.harga_pertahun),
      foto_kamar: room.foto_kamar,
      deskripsi_kamar: room.deskripsi_kamar,
      jenis_kost: room.jenis_kost,
      status_kost: room.status_kost,
      nama_penghuni: room.nama_penghuni,
      email_penghuni: room.email_penghuni,
    });
    setErrors({});
    setFormOpen(true);
  };

  return (
    <div class="grid gap-6">
      {formOpen() && (
        <div class="modal-backdrop-animate fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md">
          <section class="dashboard-card modal-panel-animate my-6 w-full max-w-5xl p-6">
            <div class="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 class="ui-heading text-xl font-bold">{editingId() ? "Edit Kamar Kost" : "Tambah Kamar Kost"}</h2>
                <p class="dashboard-muted mt-2 text-sm">
                  Data akan disimpan untuk owner_id {ownerId} dan tampil di halaman publik.
                </p>
              </div>
              <button type="button" class="icon-button h-9 w-9" aria-label="Tutup form kamar" onClick={closeForm}>
                <X size={17} />
              </button>
            </div>
            <form
              class="grid gap-4 lg:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                submit();
              }}
            >
              <label class="block">
                <span class="form-label">Nama/Nomor Kamar</span>
                <input
                  class="form-control mt-2"
                  value={form().nama_kamar}
                  onInput={(event) => setForm({ ...form(), nama_kamar: event.currentTarget.value })}
                  placeholder="Contoh: Kamar 101"
                  required
                />
                <FieldError message={errors().nama_kamar} />
              </label>
              <label class="block">
                <span class="form-label">Spesifikasi Kamar</span>
                <input
                  class="form-control mt-2"
                  value={form().spesifikasi_kamar}
                  onInput={(event) => setForm({ ...form(), spesifikasi_kamar: event.currentTarget.value })}
                  placeholder="Contoh: 3 x 4 meter, KM dalam, lemari"
                  required
                />
                <FieldError message={errors().spesifikasi_kamar} />
              </label>
              <label class="block">
                <span class="form-label">Harga Per Bulan</span>
                <input
                  class="form-control mt-2"
                  type="number"
                  value={form().harga_perbulan}
                  onInput={(event) => setForm({ ...form(), harga_perbulan: event.currentTarget.value })}
                  placeholder="Contoh: 1500000"
                  required
                />
                <FieldError message={errors().harga_perbulan} />
              </label>
              <label class="block">
                <span class="form-label">Harga Per Semester</span>
                <input
                  class="form-control mt-2"
                  type="number"
                  value={form().harga_persemester}
                  onInput={(event) => setForm({ ...form(), harga_persemester: event.currentTarget.value })}
                  placeholder="Contoh: 9000000"
                  required
                />
                <FieldError message={errors().harga_persemester} />
              </label>
              <label class="block">
                <span class="form-label">Harga Per Tahun</span>
                <input
                  class="form-control mt-2"
                  type="number"
                  value={form().harga_pertahun}
                  onInput={(event) => setForm({ ...form(), harga_pertahun: event.currentTarget.value })}
                  placeholder="Contoh: 17000000"
                  required
                />
                <FieldError message={errors().harga_pertahun} />
              </label>
              <label class="block">
                <span class="form-label">Jenis Kost</span>
                <select class="form-control mt-2" value={form().jenis_kost} onInput={(event) => setForm({ ...form(), jenis_kost: event.currentTarget.value as OwnerKostType })} required>
                  <option value="">Pilih jenis kost</option>
                  <option value="putra">Putra</option>
                  <option value="putri">Putri</option>
                  <option value="campur">Campur</option>
                </select>
                <FieldError message={errors().jenis_kost} />
              </label>
              <label class="block">
                <span class="form-label">Status Kost</span>
                <select class="form-control mt-2" value={form().status_kost} onInput={(event) => setForm({ ...form(), status_kost: event.currentTarget.value as OwnerRoomStatus })} required>
                  <option value="">Pilih status kost</option>
                  <option value="tersedia">Tersedia</option>
                  <option value="berpenghuni">Berpenghuni</option>
                </select>
                <FieldError message={errors().status_kost} />
              </label>
              <div class="lg:col-span-2">
                <span class="form-label">Foto Kamar</span>
                <div class="mt-2">
                  <ImageUpload
                    value={form().foto_kamar}
                    maxFiles={4}
                    onChange={(images) => {
                      setForm({ ...form(), foto_kamar: images });
                      const { foto_kamar: _photoError, ...remainingErrors } = errors();
                      setErrors(remainingErrors);
                    }}
                  />
                </div>
                <FieldError message={errors().foto_kamar} />
              </div>
              <label class="block lg:col-span-2">
                <span class="form-label">Deskripsi Kamar</span>
                <textarea
                  class="form-control mt-2 min-h-28 resize-y"
                  value={form().deskripsi_kamar}
                  onInput={(event) => setForm({ ...form(), deskripsi_kamar: event.currentTarget.value })}
                  placeholder="Contoh: Kamar nyaman dengan pencahayaan baik dan dekat area parkir."
                  required
                />
                <FieldError message={errors().deskripsi_kamar} />
              </label>
              <label class="block">
                <span class="form-label">Nama Penghuni Kost</span>
                <input
                  class="form-control mt-2"
                  value={form().nama_penghuni}
                  onInput={(event) => setForm({ ...form(), nama_penghuni: event.currentTarget.value })}
                  placeholder="Kosongkan jika kamar tersedia"
                />
                <FieldError message={errors().nama_penghuni} />
              </label>
              <label class="block">
                <span class="form-label">Email Penghuni Kost</span>
                <input
                  class="form-control mt-2"
                  type="email"
                  value={form().email_penghuni}
                  onInput={(event) => setForm({ ...form(), email_penghuni: event.currentTarget.value })}
                  placeholder="contoh@email.com"
                />
                <FieldError message={errors().email_penghuni} />
              </label>
              <div class="flex flex-wrap justify-end gap-3 pt-2 lg:col-span-2">
                <button type="button" class="btn-secondary px-5 py-3 text-sm" onClick={closeForm}>
                  Batal
                </button>
                <button type="submit" class="btn-primary px-5 py-3 text-sm">
                  {editingId() ? <Save size={16} /> : <Plus size={16} />}
                  {editingId() ? "Simpan Perubahan" : "Tambah Kamar Kost"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {detailRoom() && (
        <div class="modal-backdrop-animate fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md">
          <section class="dashboard-card modal-panel-animate my-6 w-full max-w-4xl p-6">
            <div class="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 class="ui-heading text-xl font-bold">Detail Kamar Kost</h2>
                <p class="dashboard-muted mt-2 text-sm">
                  Informasi lengkap {detailRoom()?.nama_kamar}.
                </p>
              </div>
              <button type="button" class="icon-button h-9 w-9" aria-label="Tutup detail kamar" onClick={() => setDetailRoom(null)}>
                <X size={17} />
              </button>
            </div>

            <div class="flex flex-col gap-4 lg:flex-row">
              <div class="w-full lg:w-64">
                {(detailRoom()?.foto_kamar.length ?? 0) > 0 ? (
                  <img src={detailRoom()?.foto_kamar[0]} alt={detailRoom()?.nama_kamar} class="h-44 w-full rounded-xl object-cover" />
                ) : (
                  <div class="flex h-44 w-full flex-col items-center justify-center rounded-xl border border-dashed border-[var(--surface-border)] bg-[var(--control-bg)] text-xs text-[rgb(var(--text-muted-rgb))]">
                    <ImageOff size={20} />
                    <span class="mt-2">Tidak ada foto</span>
                  </div>
                )}
              </div>
              <div class="flex-1">
                <h3 class="ui-heading text-lg font-bold">{detailRoom()?.nama_kamar}</h3>
                <p class="dashboard-muted mt-2 text-sm">{detailRoom()?.spesifikasi_kamar}</p>
                <p class="ui-text mt-3 text-sm leading-7">{detailRoom()?.deskripsi_kamar}</p>
              </div>
            </div>

            <div class="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Jenis Kost</p>
                <p class="ui-heading mt-1 font-bold capitalize">{detailRoom()?.jenis_kost}</p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Status Kost</p>
                <div class="mt-2">
                  <StatusBadge value={detailRoom()?.status_kost === "tersedia" ? "Tersedia" : "Berpenghuni"} tone={detailRoom()?.status_kost === "tersedia" ? "success" : "info"} />
                </div>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Harga Bulan</p>
                <p class="ui-heading mt-1 font-bold">{formatCurrency(detailRoom()?.harga_perbulan ?? 0)}</p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Harga Semester</p>
                <p class="ui-heading mt-1 font-bold">{formatCurrency(detailRoom()?.harga_persemester ?? 0)}</p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Harga Tahun</p>
                <p class="ui-heading mt-1 font-bold">{formatCurrency(detailRoom()?.harga_pertahun ?? 0)}</p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Nama Penghuni</p>
                <p class="ui-heading mt-1 font-bold">{detailRoom()?.nama_penghuni || "-"}</p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Email Penghuni</p>
                <p class="ui-heading mt-1 break-all font-bold">{detailRoom()?.email_penghuni || "-"}</p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Nomor HP Penghuni</p>
                <p class="ui-heading mt-1 font-bold">{detailRoom() ? getOccupantPhone(detailRoom()!) : "-"}</p>
              </div>
            </div>

            <div class="mt-6 flex justify-end">
              <button type="button" class="btn-secondary px-4 py-2 text-sm" onClick={() => setDetailRoom(null)}>
                Tutup Detail
              </button>
            </div>
          </section>
        </div>
      )}

      <section class="dashboard-card overflow-hidden">
        <div class="grid gap-3 border-b border-[var(--divider)] p-4 lg:grid-cols-[1.3fr_0.7fr_0.7fr_auto]">
          <div class="input-with-icon">
            <Search class="input-icon" size={17} />
            <input
              class="form-control form-control-icon"
              value={searchQuery()}
              onInput={(event) => {
                setSearchQuery(event.currentTarget.value);
                setPage(1);
              }}
              placeholder="Cari nama kamar, penghuni, email, atau nomor HP"
            />
          </div>
          <select class="form-control" value={statusFilter()} onInput={(event) => {
            setStatusFilter(event.currentTarget.value as RoomFilterStatus);
            setPage(1);
          }}>
            <option value="semua">Semua status</option>
            <option value="tersedia">Tersedia</option>
            <option value="berpenghuni">Berpenghuni</option>
          </select>
          <select class="form-control" value={kostTypeFilter()} onInput={(event) => {
            setKostTypeFilter(event.currentTarget.value as RoomFilterKostType);
            setPage(1);
          }}>
            <option value="semua">Semua jenis</option>
            <option value="putra">Putra</option>
            <option value="putri">Putri</option>
            <option value="campur">Campur</option>
          </select>
          <button type="button" class="btn-primary px-5 py-3 text-sm" onClick={openAddForm}>
            <Plus size={16} />
            Tambah Kamar Kost
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[980px] text-left text-sm">
            <thead class="bg-[rgba(148,163,184,0.08)] text-xs uppercase text-[rgb(var(--text-muted-rgb))]">
              <tr>
                <th class="px-5 py-3 font-bold">Nama/Nomor Kamar</th>
                <th class="px-5 py-3 font-bold">Jenis Kost</th>
                <th class="px-5 py-3 font-bold">Status Kost</th>
                <th class="px-5 py-3 font-bold">Nama Penghuni</th>
                <th class="px-5 py-3 font-bold">Email Penghuni</th>
                <th class="px-5 py-3 font-bold">Nomor HP Penghuni</th>
                <th class="px-5 py-3 font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows().map((room) => (
                <tr class="border-t border-[var(--divider)]">
                  <td class="px-5 py-4 font-bold text-[rgb(var(--text-body-rgb))]">{room.nama_kamar}</td>
                  <td class="px-5 py-4 capitalize text-[rgb(var(--text-body-rgb))]">{room.jenis_kost}</td>
                  <td class="px-5 py-4">
                    <StatusBadge value={room.status_kost === "tersedia" ? "Tersedia" : "Berpenghuni"} tone={room.status_kost === "tersedia" ? "success" : "info"} />
                  </td>
                  <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">{room.nama_penghuni || "-"}</td>
                  <td class="px-5 py-4 break-all text-[rgb(var(--text-body-rgb))]">{room.email_penghuni || "-"}</td>
                  <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">{getOccupantPhone(room)}</td>
                  <td class="px-5 py-4">
                    <div class="flex gap-2">
                      <button type="button" class="icon-button h-9 w-9" aria-label="Detail kamar" onClick={() => setDetailRoom(room)}>
                        <Eye size={15} />
                      </button>
                      <button type="button" class="icon-button h-9 w-9" aria-label="Edit kamar" onClick={() => editRow(room)}>
                        <Edit3 size={15} />
                      </button>
                      <button type="button" class="icon-button h-9 w-9 text-red-400" aria-label="Hapus kamar" onClick={() => setDeleteRoom(room)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredRows().length === 0 && <div class="p-5"><EmptyState text="Tidak ada kamar yang cocok dengan filter." /></div>}
        <div class="p-4">
          <Pagination
            ariaLabel="Pagination data kamar"
            page={page()}
            totalItems={filteredRows().length}
            rowsPerPage={rowsPerPage()}
            onPageChange={setPage}
            onRowsPerPageChange={(rows) => {
              setRowsPerPage(rows);
              setPage(1);
            }}
          />
        </div>
      </section>

      {deletePhotoIndex() !== null && (
        <ConfirmDialog
          title="Hapus Foto Kamar?"
          message="Foto yang dihapus akan hilang dari daftar foto kamar pada form ini."
          confirmLabel="Hapus Foto"
          zIndexClass="z-[90]"
          onCancel={() => setDeletePhotoIndex(null)}
          onConfirm={confirmDeletePhoto}
        />
      )}

      {deleteRoom() && (
        <ConfirmDialog
          title="Hapus Data Kamar?"
          message={`Data kamar ${deleteRoom()?.nama_kamar ?? ""} akan dihapus dari daftar kamar milik akun ini.`}
          confirmLabel="Hapus Kamar"
          onCancel={() => setDeleteRoom(null)}
          onConfirm={confirmDeleteRoom}
        />
      )}
    </div>
  );
}

export function OwnerKostInfoPage() {
  const ownerId = getCurrentOwnerId();
  const storageKey = `simako-kost-info-${ownerId}`;
  const readInitial = (): KostInfo => {
    if (typeof localStorage !== "undefined") {
      const stored = localStorage.getItem(storageKey);

      if (stored) {
        try {
          return JSON.parse(stored) as KostInfo;
        } catch {
          // Fallback to dummy data.
        }
      }
    }

    return (
      kostInfo.find((item) => item.owner_id === ownerId) ??
      ({
        id: Date.now(),
        owner_id: ownerId,
        alamat_kost: "",
        link_google_maps: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } satisfies KostInfo)
    );
  };

  const [form, setForm] = createSignal<KostInfo>(readInitial());
  const [errors, setErrors] = createSignal<{ alamat_kost?: string; link_google_maps?: string }>({});
  const [saved, setSaved] = createSignal(false);

  const isValidUrl = (value: string) => {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const submit = () => {
    const nextErrors: { alamat_kost?: string; link_google_maps?: string } = {};
    const currentForm = form();

    if (!currentForm.alamat_kost.trim()) {
      nextErrors.alamat_kost = "Alamat Kost wajib diisi.";
    }

    if (currentForm.link_google_maps.trim() && !isValidUrl(currentForm.link_google_maps.trim())) {
      nextErrors.link_google_maps = "Format URL Google Maps tidak valid.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const nextForm = {
      ...currentForm,
      owner_id: ownerId,
      alamat_kost: currentForm.alamat_kost.trim(),
      link_google_maps: currentForm.link_google_maps.trim(),
      updated_at: new Date().toISOString(),
    };

    setForm(nextForm);
    localStorage.setItem(storageKey, JSON.stringify(nextForm));
    setSaved(true);
  };

  return (
    <div class="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section class="dashboard-card p-6">
        <SectionHeader title="Informasi Kost" subtitle={`Informasi ini hanya untuk owner_id ${ownerId}.`} />
        <form
          class="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <label class="block">
            <span class="form-label">Alamat Kost</span>
            <textarea
              class="form-control mt-2 min-h-32 resize-y"
              value={form().alamat_kost}
              onInput={(event) => setForm({ ...form(), alamat_kost: event.currentTarget.value })}
              placeholder="Contoh: Jl. D.I. Panjaitan No.128, Purwokerto Selatan, Banyumas"
              required
            />
            <FieldError message={errors().alamat_kost} />
          </label>
          <label class="block">
            <span class="form-label">Link Google Maps Kost</span>
            <input
              class="form-control mt-2"
              value={form().link_google_maps}
              onInput={(event) => setForm({ ...form(), link_google_maps: event.currentTarget.value })}
              placeholder="https://maps.google.com/?q=alamat+kost"
            />
            <FieldError message={errors().link_google_maps} />
          </label>
          <div class="flex flex-wrap items-center gap-3 pt-2">
            <button type="submit" class="btn-primary px-5 py-3 text-sm">
              <Save size={16} />
              Simpan Informasi
            </button>
            {saved() && <span class="text-sm font-bold text-emerald-400">Tersimpan untuk akun ini.</span>}
          </div>
        </form>
      </section>

      <section class="dashboard-card p-6">
        <div class="mb-5 flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 text-red-400">
            <MapPin size={20} />
          </div>
          <div>
            <h2 class="ui-heading text-lg font-bold">Preview Alamat Kost</h2>
            <p class="dashboard-muted mt-1 text-sm">Data preview berdasarkan informasi kost akun ini.</p>
          </div>
        </div>
        <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-5">
          <p class="dashboard-muted text-xs font-bold uppercase">Alamat Kost</p>
          <p class="ui-heading mt-2 leading-7">{form().alamat_kost || "Alamat kost belum diisi."}</p>
          <div class="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <p class="dashboard-muted text-xs">Dibuat</p>
              <p class="ui-heading mt-1 font-bold">{formatDate(form().created_at)}</p>
            </div>
            <div>
              <p class="dashboard-muted text-xs">Diperbarui</p>
              <p class="ui-heading mt-1 font-bold">{formatDate(form().updated_at)}</p>
            </div>
          </div>
          {form().link_google_maps && (
            <a href={form().link_google_maps} target="_blank" rel="noreferrer" class="btn-primary mt-6 inline-flex px-5 py-3 text-sm">
              <ExternalLink size={16} />
              Buka Google Maps
            </a>
          )}
        </div>
      </section>
    </div>
  );
}

export function OwnerContactPage() {
  const ownerId = getCurrentOwnerId();
  const storageKey = `simako-contact-info-${ownerId}`;
  const readInitial = (): ContactInfo => {
    if (typeof localStorage !== "undefined") {
      const stored = localStorage.getItem(storageKey);

      if (stored) {
        try {
          return JSON.parse(stored) as ContactInfo;
        } catch {
          // Fallback to dummy data.
        }
      }
    }

    return (
      contactInfo.find((item) => item.owner_id === ownerId) ??
      ({
        id: Date.now(),
        owner_id: ownerId,
        nama_pemilik: "",
        nomor_hp_pemilik: "",
        nomor_whatsapp_pemilik: "",
        email_pemilik: "",
        kontak_cadangan: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } satisfies ContactInfo)
    );
  };

  const [form, setForm] = createSignal<ContactInfo>(readInitial());
  const [errors, setErrors] = createSignal<
    Partial<Record<"nama_pemilik" | "nomor_hp_pemilik" | "nomor_whatsapp_pemilik" | "email_pemilik", string>>
  >({});
  const [saved, setSaved] = createSignal(false);

  const submit = () => {
    const currentForm = form();
    const nextErrors: Partial<
      Record<"nama_pemilik" | "nomor_hp_pemilik" | "nomor_whatsapp_pemilik" | "email_pemilik", string>
    > = {};

    if (!currentForm.nama_pemilik.trim()) {
      nextErrors.nama_pemilik = "Nama Pemilik Kost wajib diisi.";
    }

    if (!currentForm.nomor_hp_pemilik.trim()) {
      nextErrors.nomor_hp_pemilik = "Nomor HP Pemilik Kost wajib diisi.";
    }

    if (!currentForm.nomor_whatsapp_pemilik.trim()) {
      nextErrors.nomor_whatsapp_pemilik = "Nomor WhatsApp Pemilik Kost wajib diisi.";
    }

    if (!currentForm.email_pemilik.trim()) {
      nextErrors.email_pemilik = "Email Pemilik Kost wajib diisi.";
    } else if (!emailPattern.test(currentForm.email_pemilik.trim())) {
      nextErrors.email_pemilik = "Format email pemilik tidak valid.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const nextForm = {
      ...currentForm,
      owner_id: ownerId,
      nama_pemilik: currentForm.nama_pemilik.trim(),
      nomor_hp_pemilik: currentForm.nomor_hp_pemilik.trim(),
      nomor_whatsapp_pemilik: currentForm.nomor_whatsapp_pemilik.trim(),
      email_pemilik: currentForm.email_pemilik.trim(),
      kontak_cadangan: currentForm.kontak_cadangan.trim(),
      updated_at: new Date().toISOString(),
    };

    setForm(nextForm);
    localStorage.setItem(storageKey, JSON.stringify(nextForm));
    setSaved(true);
  };

  return (
    <div class="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section class="dashboard-card p-6">
        <SectionHeader title="Kontak Pemilik" subtitle={`Kontak ini hanya tampil untuk data owner_id ${ownerId}.`} />
        <form
          class="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <label class="block">
            <span class="form-label">Nama Pemilik Kost</span>
            <input
              class="form-control mt-2"
              value={form().nama_pemilik}
              onInput={(event) => setForm({ ...form(), nama_pemilik: event.currentTarget.value })}
              placeholder="Contoh: Siti Aminah"
              required
            />
            <FieldError message={errors().nama_pemilik} />
          </label>
          <label class="block">
            <span class="form-label">Nomor HP Pemilik Kost</span>
            <input
              class="form-control mt-2"
              value={form().nomor_hp_pemilik}
              onInput={(event) => setForm({ ...form(), nomor_hp_pemilik: event.currentTarget.value })}
              placeholder="Contoh: 081234567890"
              required
            />
            <FieldError message={errors().nomor_hp_pemilik} />
          </label>
          <label class="block">
            <span class="form-label">Nomor WhatsApp Pemilik Kost</span>
            <input
              class="form-control mt-2"
              value={form().nomor_whatsapp_pemilik}
              onInput={(event) => setForm({ ...form(), nomor_whatsapp_pemilik: event.currentTarget.value })}
              placeholder="Contoh: 081234567890"
              required
            />
            <FieldError message={errors().nomor_whatsapp_pemilik} />
          </label>
          <label class="block">
            <span class="form-label">Email Pemilik Kost</span>
            <input
              class="form-control mt-2"
              type="email"
              value={form().email_pemilik}
              onInput={(event) => setForm({ ...form(), email_pemilik: event.currentTarget.value })}
              placeholder="pemilik@email.com"
              required
            />
            <FieldError message={errors().email_pemilik} />
          </label>
          <label class="block">
            <span class="form-label">Kontak Cadangan yang Bisa Dihubungi</span>
            <input
              class="form-control mt-2"
              value={form().kontak_cadangan}
              onInput={(event) => setForm({ ...form(), kontak_cadangan: event.currentTarget.value })}
              placeholder="Contoh: Pak Budi - 081311112222"
            />
          </label>
          <div class="flex flex-wrap items-center gap-3 pt-2">
            <button type="submit" class="btn-primary px-5 py-3 text-sm">
              <Save size={16} />
              Simpan Kontak
            </button>
            {saved() && <span class="text-sm font-bold text-emerald-400">Tersimpan untuk akun ini.</span>}
          </div>
        </form>
      </section>

      <section class="dashboard-card p-6">
        <SectionHeader title="Preview Kontak" subtitle="Informasi kontak aktif yang terhubung dengan kost pemilik." />
        <div class="space-y-3">
          <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
            <p class="dashboard-muted text-xs">Nama Pemilik</p>
            <p class="ui-heading mt-1 font-bold">{form().nama_pemilik || "-"}</p>
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <p class="dashboard-muted text-xs">Nomor HP</p>
              <p class="ui-heading mt-1 font-bold">{form().nomor_hp_pemilik || "-"}</p>
            </div>
            <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <p class="dashboard-muted text-xs">WhatsApp</p>
              <p class="ui-heading mt-1 font-bold">{form().nomor_whatsapp_pemilik || "-"}</p>
            </div>
          </div>
          <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
            <p class="dashboard-muted text-xs">Email</p>
            <p class="ui-heading mt-1 break-all font-bold">{form().email_pemilik || "-"}</p>
          </div>
          <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
            <p class="dashboard-muted text-xs">Kontak Cadangan</p>
            <p class="ui-heading mt-1 font-bold">{form().kontak_cadangan || "-"}</p>
          </div>
          <div class="grid gap-3 text-sm sm:grid-cols-2">
            <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <p class="dashboard-muted text-xs">Dibuat</p>
              <p class="ui-heading mt-1 font-bold">{formatDate(form().created_at)}</p>
            </div>
            <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <p class="dashboard-muted text-xs">Diperbarui</p>
              <p class="ui-heading mt-1 font-bold">{formatDate(form().updated_at)}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function OwnerRoomBillsPage() {
  const ownerId = getCurrentOwnerId();
  const ownerRoomOptions = readOwnerRooms().filter((room) => room.owner_id === ownerId);
  const [rows, setRows] = createSignal<RoomBill[]>(
    roomBills.filter((bill) => bill.owner_id === ownerId),
  );
  const [form, setForm] = createSignal({
    room_id: ownerRoomOptions[0]?.id ?? 0,
    nama_kamar: ownerRoomOptions[0]?.nama_kamar ?? "",
    periode_tagihan: "",
    tanggal_tagihan: "",
    tanggal_jatuh_tempo: "",
    nominal_tagihan: "",
    status_tagihan: "" as OwnerBillStatus | "",
    catatan: "",
  });
  const [errors, setErrors] = createSignal<
    Partial<Record<"room_id" | "periode_tagihan" | "tanggal_tagihan" | "tanggal_jatuh_tempo" | "nominal_tagihan" | "status_tagihan", string>>
  >({});
  const [editingId, setEditingId] = createSignal<number | null>(null);
  const [formOpen, setFormOpen] = createSignal(false);
  const [detailBill, setDetailBill] = createSignal<RoomBill | null>(null);
  const [deleteBill, setDeleteBill] = createSignal<RoomBill | null>(null);
  const [statusFilter, setStatusFilter] = createSignal<"semua" | OwnerBillStatus>("semua");
  const [searchQuery, setSearchQuery] = createSignal("");
  const [page, setPage] = createSignal(1);
  const [rowsPerPage, setRowsPerPage] = createSignal<RowsPerPageOption>(10);

  const selectRoom = (roomId: number) => {
    const room = ownerRoomOptions.find((item) => item.id === roomId);
    setForm({ ...form(), room_id: roomId, nama_kamar: room?.nama_kamar ?? "" });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      room_id: ownerRoomOptions[0]?.id ?? 0,
      nama_kamar: ownerRoomOptions[0]?.nama_kamar ?? "",
      periode_tagihan: "",
      tanggal_tagihan: "",
      tanggal_jatuh_tempo: "",
      nominal_tagihan: "",
      status_tagihan: "",
      catatan: "",
    });
    setErrors({});
  };

  const openAddForm = () => {
    resetForm();
    setFormOpen(true);
  };

  const closeForm = () => {
    resetForm();
    setFormOpen(false);
  };

  const filteredRows = createMemo(() => {
    const normalizedQuery = searchQuery().trim().toLowerCase();

    return rows().filter((bill) => {
      const matchesStatus = statusFilter() === "semua" || bill.status_tagihan === statusFilter();
      const matchesSearch =
        !normalizedQuery ||
        bill.nama_kamar.toLowerCase().includes(normalizedQuery) ||
        bill.periode_tagihan.toLowerCase().includes(normalizedQuery) ||
        bill.catatan.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesSearch;
    });
  });
  const paginatedRows = createMemo(() =>
    getPaginatedRows(filteredRows(), page(), rowsPerPage()),
  );

  createEffect(() => {
    const totalPages = getTotalPages(filteredRows().length, rowsPerPage());
    if (page() > totalPages) {
      setPage(totalPages);
    }
  });

  const validateBill = () => {
    const currentForm = form();
    const nextErrors: Partial<
      Record<"room_id" | "periode_tagihan" | "tanggal_tagihan" | "tanggal_jatuh_tempo" | "nominal_tagihan" | "status_tagihan", string>
    > = {};
    const selectedRoom = ownerRoomOptions.find((room) => room.id === currentForm.room_id);

    if (!currentForm.room_id || !selectedRoom) {
      nextErrors.room_id = "Kamar wajib dipilih dan harus milik akun ini.";
    }

    if (!currentForm.periode_tagihan.trim()) {
      nextErrors.periode_tagihan = "Periode Tagihan wajib diisi.";
    }

    if (!currentForm.tanggal_tagihan) {
      nextErrors.tanggal_tagihan = "Tanggal Tagihan wajib diisi.";
    }

    if (!currentForm.tanggal_jatuh_tempo) {
      nextErrors.tanggal_jatuh_tempo = "Tanggal Jatuh Tempo wajib diisi.";
    }

    if (
      currentForm.tanggal_tagihan &&
      currentForm.tanggal_jatuh_tempo &&
      currentForm.tanggal_jatuh_tempo < currentForm.tanggal_tagihan
    ) {
      nextErrors.tanggal_jatuh_tempo = "Tanggal Jatuh Tempo tidak boleh lebih awal dari Tanggal Tagihan.";
    }

    if (!String(currentForm.nominal_tagihan).trim() || Number.isNaN(Number(currentForm.nominal_tagihan))) {
      nextErrors.nominal_tagihan = "Nominal Tagihan wajib diisi dan harus angka.";
    }

    if (!currentForm.status_tagihan) {
      nextErrors.status_tagihan = "Status Tagihan wajib dipilih.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = () => {
    if (!validateBill()) {
      return;
    }

    const selectedRoom = ownerRoomOptions.find((room) => room.id === form().room_id);
    const existingBill = rows().find((bill) => bill.id === editingId());
    const now = new Date().toISOString();
    const payload: RoomBill = {
      id: editingId() ?? nextId(rows()),
      owner_id: ownerId,
      room_id: selectedRoom?.id ?? form().room_id,
      nama_kamar: selectedRoom?.nama_kamar ?? form().nama_kamar,
      periode_tagihan: form().periode_tagihan.trim(),
      tanggal_tagihan: form().tanggal_tagihan,
      tanggal_jatuh_tempo: form().tanggal_jatuh_tempo,
      nominal_tagihan: Number(form().nominal_tagihan),
      status_tagihan: form().status_tagihan as OwnerBillStatus,
      catatan: form().catatan.trim(),
      created_at: existingBill?.created_at ?? now,
      updated_at: now,
    };

    setRows((items) =>
      editingId() ? items.map((item) => (item.id === editingId() ? payload : item)) : [payload, ...items],
    );
    resetForm();
    setFormOpen(false);
  };

  const editBill = (bill: RoomBill) => {
    setEditingId(bill.id);
    setForm({
      room_id: bill.room_id,
      nama_kamar: bill.nama_kamar,
      periode_tagihan: bill.periode_tagihan,
      tanggal_tagihan: bill.tanggal_tagihan,
      tanggal_jatuh_tempo: bill.tanggal_jatuh_tempo,
      nominal_tagihan: String(bill.nominal_tagihan),
      status_tagihan: bill.status_tagihan,
      catatan: bill.catatan,
    });
    setErrors({});
    setFormOpen(true);
  };

  const confirmDeleteBill = () => {
    const bill = deleteBill();

    if (!bill) {
      return;
    }

    setRows((items) => items.filter((item) => item.id !== bill.id));

    if (detailBill()?.id === bill.id) {
      setDetailBill(null);
    }

    setDeleteBill(null);
  };

  return (
    <div class="grid gap-6">
      {detailBill() && (
        <div class="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md">
          <section class="dashboard-card my-6 w-full max-w-2xl p-6">
            <div class="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 class="ui-heading text-xl font-bold">Detail Tagihan</h2>
                <p class="dashboard-muted mt-2 text-sm">
                  {detailBill()?.nama_kamar} - Periode {detailBill()?.periode_tagihan}
                </p>
              </div>
              <button type="button" class="icon-button h-9 w-9" aria-label="Tutup detail tagihan" onClick={() => setDetailBill(null)}>
                <X size={17} />
              </button>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Nama Kamar</p>
                <p class="ui-heading mt-1 font-bold">{detailBill()?.nama_kamar}</p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Periode Tagihan</p>
                <p class="ui-heading mt-1 font-bold">{detailBill()?.periode_tagihan}</p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Tanggal Tagihan</p>
                <p class="ui-heading mt-1 font-bold">{formatDate(detailBill()?.tanggal_tagihan ?? "")}</p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Jatuh Tempo</p>
                <p class="ui-heading mt-1 font-bold">{formatDate(detailBill()?.tanggal_jatuh_tempo ?? "")}</p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Nominal</p>
                <p class="ui-heading mt-1 font-bold">{formatCurrency(detailBill()?.nominal_tagihan ?? 0)}</p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Status</p>
                <div class="mt-2">
                  <StatusBadge
                    value={detailBill()?.status_tagihan === "aktif" ? "Aktif" : "Nonaktif"}
                    tone={detailBill()?.status_tagihan === "aktif" ? "success" : "neutral"}
                  />
                </div>
              </div>
            </div>

            <div class="mt-4 rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <p class="dashboard-muted text-xs">Catatan</p>
              <p class="ui-heading mt-1 leading-7">{detailBill()?.catatan || "-"}</p>
            </div>

            <div class="mt-6 flex justify-end">
              <button type="button" class="btn-secondary px-4 py-2 text-sm" onClick={() => setDetailBill(null)}>
                Tutup Detail
              </button>
            </div>
          </section>
        </div>
      )}

      {formOpen() && (
        <div class="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md">
          <section class="dashboard-card my-6 w-full max-w-2xl p-6">
            <div class="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 class="ui-heading text-xl font-bold">{editingId() ? "Edit Tagihan" : "Tambah Tagihan"}</h2>
                <p class="dashboard-muted mt-2 text-sm">Tagihan dibuat untuk owner_id {ownerId}.</p>
              </div>
              <button type="button" class="icon-button h-9 w-9" aria-label="Tutup form tagihan" onClick={closeForm}>
                <X size={17} />
              </button>
            </div>
            <form
              class="grid gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                submit();
              }}
            >
              <label class="block">
                <span class="form-label">Pilih Kamar</span>
                <select class="form-control mt-2" value={form().room_id} onInput={(event) => selectRoom(Number(event.currentTarget.value))}>
                  {ownerRoomOptions.map((room) => (
                    <option value={room.id}>{room.nama_kamar}</option>
                  ))}
                </select>
                <FieldError message={errors().room_id} />
              </label>
              <label class="block">
                <span class="form-label">Periode Tagihan</span>
                <input
                  class="form-control mt-2"
                  value={form().periode_tagihan}
                  onInput={(event) => setForm({ ...form(), periode_tagihan: event.currentTarget.value })}
                  placeholder="Contoh: Mei 2026"
                  required
                />
                <FieldError message={errors().periode_tagihan} />
              </label>
              <label class="block">
                <span class="form-label">Tanggal Tagihan</span>
                <input
                  class="form-control mt-2"
                  type="date"
                  value={form().tanggal_tagihan}
                  onInput={(event) => setForm({ ...form(), tanggal_tagihan: event.currentTarget.value })}
                  required
                />
                <FieldError message={errors().tanggal_tagihan} />
              </label>
              <label class="block">
                <span class="form-label">Tanggal Jatuh Tempo</span>
                <input
                  class="form-control mt-2"
                  type="date"
                  value={form().tanggal_jatuh_tempo}
                  onInput={(event) => setForm({ ...form(), tanggal_jatuh_tempo: event.currentTarget.value })}
                  required
                />
                <FieldError message={errors().tanggal_jatuh_tempo} />
              </label>
              <label class="block">
                <span class="form-label">Nominal Tagihan</span>
                <input
                  class="form-control mt-2"
                  type="number"
                  value={form().nominal_tagihan}
                  onInput={(event) => setForm({ ...form(), nominal_tagihan: event.currentTarget.value })}
                  placeholder="Contoh: 1500000"
                  required
                />
                <FieldError message={errors().nominal_tagihan} />
              </label>
              <label class="block">
                <span class="form-label">Status Tagihan</span>
                <select class="form-control mt-2" value={form().status_tagihan} onInput={(event) => setForm({ ...form(), status_tagihan: event.currentTarget.value as OwnerBillStatus })}>
                  <option value="">Pilih status tagihan</option>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
                <FieldError message={errors().status_tagihan} />
              </label>
              <label class="block">
                <span class="form-label">Catatan</span>
                <textarea
                  class="form-control mt-2 min-h-24 resize-y"
                  value={form().catatan}
                  onInput={(event) => setForm({ ...form(), catatan: event.currentTarget.value })}
                  placeholder="Opsional. Contoh: Notifikasi dikirim saat masa sewa habis."
                />
              </label>
              <div class="flex flex-wrap justify-end gap-3 pt-2">
                <button type="button" class="btn-secondary px-5 py-3 text-sm" onClick={closeForm}>
                  Batal
                </button>
                <button type="submit" class="btn-primary px-5 py-3 text-sm">
                  {editingId() ? <Save size={16} /> : <Plus size={16} />}
                  {editingId() ? "Simpan Perubahan" : "Tambah Tagihan"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      <section class="dashboard-card overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--divider)] p-4">
          <div>
            <h2 class="ui-heading text-lg font-bold">Daftar Tagihan Kamar</h2>
            <p class="dashboard-muted mt-1 text-sm">Semua tagihan ditampilkan berdasarkan akun pemilik login.</p>
          </div>
          <button type="button" class="btn-primary px-5 py-3 text-sm" onClick={openAddForm}>
            <Plus size={16} />
            Tambah Tagihan
          </button>
        </div>
        <div class="grid gap-3 border-b border-[var(--divider)] p-4 lg:grid-cols-[1fr_0.35fr]">
          <div class="input-with-icon">
            <Search class="input-icon" size={17} />
            <input
              class="form-control form-control-icon"
              value={searchQuery()}
              onInput={(event) => {
                setSearchQuery(event.currentTarget.value);
                setPage(1);
              }}
              placeholder="Cari nama kamar, periode tagihan, atau catatan"
            />
          </div>
          <select class="form-control" value={statusFilter()} onInput={(event) => {
            setStatusFilter(event.currentTarget.value as "semua" | OwnerBillStatus);
            setPage(1);
          }}>
            <option value="semua">Semua status</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[1080px] text-left text-sm">
            <thead class="bg-[rgba(148,163,184,0.08)] text-xs uppercase text-[rgb(var(--text-muted-rgb))]">
              <tr>
                <th class="px-5 py-3 font-bold">Nama Kamar</th>
                <th class="px-5 py-3 font-bold">Periode Tagihan</th>
                <th class="px-5 py-3 font-bold">Tanggal Tagihan</th>
                <th class="px-5 py-3 font-bold">Tanggal Jatuh Tempo</th>
                <th class="px-5 py-3 font-bold">Nominal Tagihan</th>
                <th class="px-5 py-3 font-bold">Status Tagihan</th>
                <th class="px-5 py-3 font-bold">Catatan</th>
                <th class="px-5 py-3 font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows().map((bill) => (
                <tr class="border-t border-[var(--divider)]">
                  <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">{bill.nama_kamar}</td>
                  <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">{bill.periode_tagihan}</td>
                  <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">{formatDate(bill.tanggal_tagihan)}</td>
                  <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">{formatDate(bill.tanggal_jatuh_tempo)}</td>
                  <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">{formatCurrency(bill.nominal_tagihan)}</td>
                  <td class="px-5 py-4">
                    <StatusBadge value={bill.status_tagihan === "aktif" ? "Aktif" : "Nonaktif"} tone={bill.status_tagihan === "aktif" ? "success" : "neutral"} />
                  </td>
                  <td class="max-w-[260px] px-5 py-4 text-[rgb(var(--text-body-rgb))]">{bill.catatan || "-"}</td>
                  <td class="px-5 py-4">
                    <div class="flex gap-2">
                      <button type="button" class="icon-button h-9 w-9" aria-label="Detail tagihan" onClick={() => setDetailBill(bill)}>
                        <Eye size={15} />
                      </button>
                      <button type="button" class="icon-button h-9 w-9" aria-label="Edit tagihan" onClick={() => editBill(bill)}>
                        <Edit3 size={15} />
                      </button>
                      <button type="button" class="icon-button h-9 w-9 text-red-400" aria-label="Hapus tagihan" onClick={() => setDeleteBill(bill)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredRows().length === 0 && <div class="p-5"><EmptyState text="Tidak ada tagihan yang cocok dengan filter." /></div>}
        <div class="p-4">
          <Pagination
            ariaLabel="Pagination tagihan kamar"
            page={page()}
            totalItems={filteredRows().length}
            rowsPerPage={rowsPerPage()}
            onPageChange={setPage}
            onRowsPerPageChange={(rows) => {
              setRowsPerPage(rows);
              setPage(1);
            }}
          />
        </div>
      </section>

      {deleteBill() && (
        <ConfirmDialog
          title="Hapus Tagihan Kamar?"
          message={`Tagihan ${deleteBill()?.periode_tagihan ?? ""} untuk ${deleteBill()?.nama_kamar ?? ""} akan dihapus.`}
          confirmLabel="Hapus Tagihan"
          onCancel={() => setDeleteBill(null)}
          onConfirm={confirmDeleteBill}
        />
      )}
    </div>
  );
}

function ToggleListPage<T extends { id: number; owner_id: number; status_aktif: boolean }>(props: {
  title: string;
  subtitle: string;
  label: string;
  textKey: keyof T;
  initialRows: T[];
  createRow: (id: number, ownerId: number, text: string, active: boolean) => T;
}) {
  const ownerId = getCurrentOwnerId();
  const [rows, setRows] = createSignal<T[]>(props.initialRows.filter((item) => item.owner_id === ownerId));
  const [text, setText] = createSignal("");
  const [active, setActive] = createSignal(true);
  const [editingId, setEditingId] = createSignal<number | null>(null);
  const [deleteItem, setDeleteItem] = createSignal<T | null>(null);
  const activeCount = createMemo(() => rows().filter((item) => item.status_aktif).length);

  const resetForm = () => {
    setEditingId(null);
    setText("");
    setActive(true);
  };

  const submit = () => {
    const payload = props.createRow(editingId() ?? nextId(rows()), ownerId, text(), active());
    setRows((items) =>
      editingId() ? items.map((item) => (item.id === editingId() ? payload : item)) : [payload, ...items],
    );
    resetForm();
  };

  const confirmDeleteItem = () => {
    const item = deleteItem();

    if (!item) {
      return;
    }

    setRows((items) => items.filter((row) => row.id !== item.id));

    if (editingId() === item.id) {
      resetForm();
    }

    setDeleteItem(null);
  };

  return (
    <div class="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <section class="dashboard-card p-6">
        <SectionHeader title={editingId() ? `Edit ${props.label}` : `Tambah ${props.label}`} subtitle={`${activeCount()} data aktif untuk owner_id ${ownerId}.`} />
        <form
          class="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <label class="block">
            <span class="form-label">{props.label}</span>
            <input class="form-control mt-2" value={text()} onInput={(event) => setText(event.currentTarget.value)} required />
          </label>
          <label class="block">
            <span class="form-label">Status</span>
            <select class="form-control mt-2" value={active() ? "aktif" : "nonaktif"} onInput={(event) => setActive(event.currentTarget.value === "aktif")}>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </label>
          <div class="flex flex-wrap gap-3 pt-2">
            <button type="submit" class="btn-primary px-5 py-3 text-sm">
              {editingId() ? <Save size={16} /> : <Plus size={16} />}
              {editingId() ? "Simpan Perubahan" : `Tambah ${props.label}`}
            </button>
            {editingId() && <button type="button" class="btn-secondary px-5 py-3 text-sm" onClick={resetForm}>Batal</button>}
          </div>
        </form>
      </section>

      <section class="dashboard-card p-6">
        <SectionHeader title={props.title} subtitle={props.subtitle} />
        <div class="space-y-3">
          {rows().length === 0 && <EmptyState text="Belum ada data untuk akun ini." />}
          {rows().map((item) => (
            <div class="flex items-center justify-between gap-4 rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <div>
                <p class="ui-heading font-bold">{String(item[props.textKey])}</p>
                <div class="mt-2">
                  <StatusBadge value={item.status_aktif ? "Aktif" : "Nonaktif"} tone={item.status_aktif ? "success" : "neutral"} />
                </div>
              </div>
              <div class="flex gap-2">
                <button type="button" class="icon-button h-9 w-9" aria-label={`Edit ${props.label}`} onClick={() => { setEditingId(item.id); setText(String(item[props.textKey])); setActive(item.status_aktif); }}>
                  <Edit3 size={15} />
                </button>
                <button type="button" class="icon-button h-9 w-9 text-red-400" aria-label={`Hapus ${props.label}`} onClick={() => setDeleteItem(item)}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {deleteItem() && (
        <ConfirmDialog
          title={`Hapus ${props.label}?`}
          message={`${props.label} "${String(deleteItem()?.[props.textKey] ?? "")}" akan dihapus dari data akun ini.`}
          confirmLabel={`Hapus ${props.label}`}
          onCancel={() => setDeleteItem(null)}
          onConfirm={confirmDeleteItem}
        />
      )}
    </div>
  );
}

export function OwnerRulesPage() {
  const ownerId = getCurrentOwnerId();
  const [rows, setRows] = createSignal<KostRule[]>(rules.filter((rule) => rule.owner_id === ownerId));
  const [form, setForm] = createSignal({
    judul_aturan: "",
    isi_aturan: "",
    status_aktif: "" as "aktif" | "nonaktif" | "",
  });
  const [errors, setErrors] = createSignal<Partial<Record<"judul_aturan" | "isi_aturan" | "status_aktif", string>>>({});
  const [editingId, setEditingId] = createSignal<number | null>(null);
  const [formOpen, setFormOpen] = createSignal(false);
  const [detailRule, setDetailRule] = createSignal<KostRule | null>(null);
  const [deleteRule, setDeleteRule] = createSignal<KostRule | null>(null);
  const [statusFilter, setStatusFilter] = createSignal<"semua" | "aktif" | "nonaktif">("semua");
  const [searchQuery, setSearchQuery] = createSignal("");
  const [page, setPage] = createSignal(1);
  const [rowsPerPage, setRowsPerPage] = createSignal<RowsPerPageOption>(10);

  const resetForm = () => {
    setEditingId(null);
    setForm({ judul_aturan: "", isi_aturan: "", status_aktif: "" });
    setErrors({});
  };

  const openAddForm = () => {
    resetForm();
    setFormOpen(true);
  };

  const closeForm = () => {
    resetForm();
    setFormOpen(false);
  };

  const filteredRows = createMemo(() => {
    const normalizedQuery = searchQuery().trim().toLowerCase();

    return rows().filter((rule) => {
      const ruleStatus = rule.status_aktif ? "aktif" : "nonaktif";
      const matchesStatus = statusFilter() === "semua" || ruleStatus === statusFilter();
      const matchesSearch =
        !normalizedQuery ||
        rule.judul_aturan.toLowerCase().includes(normalizedQuery) ||
        rule.isi_aturan.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesSearch;
    });
  });
  const paginatedRows = createMemo(() =>
    getPaginatedRows(filteredRows(), page(), rowsPerPage()),
  );

  createEffect(() => {
    const totalPages = getTotalPages(filteredRows().length, rowsPerPage());
    if (page() > totalPages) {
      setPage(totalPages);
    }
  });

  const validateRule = () => {
    const currentForm = form();
    const nextErrors: Partial<Record<"judul_aturan" | "isi_aturan" | "status_aktif", string>> = {};

    if (!currentForm.judul_aturan.trim()) {
      nextErrors.judul_aturan = "Judul Aturan wajib diisi.";
    }

    if (!currentForm.isi_aturan.trim()) {
      nextErrors.isi_aturan = "Isi Aturan wajib diisi.";
    }

    if (!currentForm.status_aktif) {
      nextErrors.status_aktif = "Status Aktif wajib dipilih.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = () => {
    if (!validateRule()) {
      return;
    }

    const existingRule = rows().find((rule) => rule.id === editingId());
    const now = new Date().toISOString();
    const payload: KostRule = {
      id: editingId() ?? nextId(rows()),
      owner_id: ownerId,
      judul_aturan: form().judul_aturan.trim(),
      isi_aturan: form().isi_aturan.trim(),
      status_aktif: form().status_aktif === "aktif",
      created_at: existingRule?.created_at ?? now,
      updated_at: now,
    };

    setRows((items) =>
      editingId() ? items.map((item) => (item.id === editingId() ? payload : item)) : [payload, ...items],
    );
    closeForm();
  };

  const editRule = (rule: KostRule) => {
    setEditingId(rule.id);
    setForm({
      judul_aturan: rule.judul_aturan,
      isi_aturan: rule.isi_aturan,
      status_aktif: rule.status_aktif ? "aktif" : "nonaktif",
    });
    setErrors({});
    setFormOpen(true);
  };

  const toggleRuleStatus = (rule: KostRule) => {
    const now = new Date().toISOString();
    setRows((items) =>
      items.map((item) =>
        item.id === rule.id ? { ...item, status_aktif: !item.status_aktif, updated_at: now } : item,
      ),
    );
  };

  const confirmDeleteRule = () => {
    const rule = deleteRule();

    if (!rule) {
      return;
    }

    setRows((items) => items.filter((item) => item.id !== rule.id));

    if (detailRule()?.id === rule.id) {
      setDetailRule(null);
    }

    if (editingId() === rule.id) {
      closeForm();
    }

    setDeleteRule(null);
  };

  return (
    <div class="grid gap-6">
      {formOpen() && (
        <div class="modal-backdrop-animate fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md">
          <section class="dashboard-card modal-panel-animate my-6 w-full max-w-2xl p-6">
            <div class="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 class="ui-heading text-xl font-bold">{editingId() ? "Edit Aturan Kost" : "Tambah Aturan Kost"}</h2>
                <p class="dashboard-muted mt-2 text-sm">Aturan aktif akan ditampilkan kepada penyewa.</p>
              </div>
              <button type="button" class="icon-button h-9 w-9" aria-label="Tutup form aturan" onClick={closeForm}>
                <X size={17} />
              </button>
            </div>

            <form
              class="grid gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                submit();
              }}
            >
              <label class="block">
                <span class="form-label">Judul Aturan</span>
                <input
                  class="form-control mt-2"
                  value={form().judul_aturan}
                  onInput={(event) => setForm({ ...form(), judul_aturan: event.currentTarget.value })}
                  placeholder="Contoh: Jam Tamu"
                />
                <FieldError message={errors().judul_aturan} />
              </label>

              <label class="block">
                <span class="form-label">Isi Aturan</span>
                <textarea
                  class="form-control mt-2 min-h-32 resize-y"
                  value={form().isi_aturan}
                  onInput={(event) => setForm({ ...form(), isi_aturan: event.currentTarget.value })}
                  placeholder="Contoh: Jam tamu hanya diperbolehkan sampai 21.00 WIB."
                />
                <FieldError message={errors().isi_aturan} />
              </label>

              <label class="block">
                <span class="form-label">Status Aktif</span>
                <select
                  class="form-control mt-2"
                  value={form().status_aktif}
                  onInput={(event) => setForm({ ...form(), status_aktif: event.currentTarget.value as "aktif" | "nonaktif" | "" })}
                >
                  <option value="">Pilih status</option>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
                <FieldError message={errors().status_aktif} />
              </label>

              <div class="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <button type="button" class="btn-secondary px-5 py-3 text-sm" onClick={closeForm}>
                  Batal
                </button>
                <button type="submit" class="btn-primary px-5 py-3 text-sm">
                  {editingId() ? <Save size={16} /> : <Plus size={16} />}
                  {editingId() ? "Simpan Perubahan" : "Tambah Aturan"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {detailRule() && (
        <div class="modal-backdrop-animate fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md">
          <section class="dashboard-card modal-panel-animate my-6 w-full max-w-2xl p-6">
            <div class="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 class="ui-heading text-xl font-bold">Detail Aturan Kost</h2>
                <p class="dashboard-muted mt-2 text-sm">{detailRule()?.judul_aturan}</p>
              </div>
              <button type="button" class="icon-button h-9 w-9" aria-label="Tutup detail aturan" onClick={() => setDetailRule(null)}>
                <X size={17} />
              </button>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Judul Aturan</p>
                <p class="ui-heading mt-1 font-bold">{detailRule()?.judul_aturan}</p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Status Aktif</p>
                <div class="mt-2">
                  <StatusBadge value={detailRule()?.status_aktif ? "Aktif" : "Nonaktif"} tone={detailRule()?.status_aktif ? "success" : "neutral"} />
                </div>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Dibuat</p>
                <p class="ui-heading mt-1 font-bold">{formatDate(detailRule()?.created_at ?? "")}</p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Diperbarui</p>
                <p class="ui-heading mt-1 font-bold">{formatDate(detailRule()?.updated_at ?? "")}</p>
              </div>
            </div>

            <div class="mt-4 rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <p class="dashboard-muted text-xs">Isi Aturan</p>
              <p class="ui-heading mt-1 leading-7">{detailRule()?.isi_aturan}</p>
            </div>

            <div class="mt-6 flex justify-end">
              <button type="button" class="btn-secondary px-4 py-2 text-sm" onClick={() => setDetailRule(null)}>
                Tutup Detail
              </button>
            </div>
          </section>
        </div>
      )}

      <section class="dashboard-card overflow-hidden">
        <div class="flex flex-col gap-4 border-b border-[var(--divider)] p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 class="ui-heading text-lg font-bold">Aturan Kost</h2>
            <p class="dashboard-muted mt-1 text-sm">Kelola aturan penyewa berdasarkan owner_id {ownerId}.</p>
          </div>
          <button type="button" class="btn-primary px-5 py-3 text-sm" onClick={openAddForm}>
            <Plus size={16} />
            Tambah Aturan
          </button>
        </div>

        <div class="grid gap-3 border-b border-[var(--divider)] p-4 lg:grid-cols-[1fr_0.35fr]">
          <div class="input-with-icon">
            <Search class="input-icon" size={17} />
            <input
              class="form-control form-control-icon"
              value={searchQuery()}
              onInput={(event) => {
                setSearchQuery(event.currentTarget.value);
                setPage(1);
              }}
              placeholder="Cari judul aturan atau isi aturan"
            />
          </div>
          <select class="form-control" value={statusFilter()} onInput={(event) => {
            setStatusFilter(event.currentTarget.value as "semua" | "aktif" | "nonaktif");
            setPage(1);
          }}>
            <option value="semua">Semua status</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[980px] text-left text-sm">
            <thead class="bg-[rgba(148,163,184,0.08)] text-xs uppercase text-[rgb(var(--text-muted-rgb))]">
              <tr>
                <th class="px-5 py-3 font-bold">Judul Aturan</th>
                <th class="px-5 py-3 font-bold">Isi Aturan</th>
                <th class="px-5 py-3 font-bold">Status Aktif</th>
                <th class="px-5 py-3 font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows().map((rule) => (
                <tr class="border-t border-[var(--divider)]">
                  <td class="px-5 py-4 font-bold text-[rgb(var(--text-body-rgb))]">{rule.judul_aturan}</td>
                  <td class="max-w-[420px] px-5 py-4 text-[rgb(var(--text-body-rgb))]">{rule.isi_aturan}</td>
                  <td class="px-5 py-4">
                    <StatusBadge value={rule.status_aktif ? "Aktif" : "Nonaktif"} tone={rule.status_aktif ? "success" : "neutral"} />
                  </td>
                  <td class="px-5 py-4">
                    <div class="flex flex-wrap gap-2">
                      <button type="button" class="icon-button h-9 w-9" aria-label="Detail aturan" onClick={() => setDetailRule(rule)}>
                        <Eye size={15} />
                      </button>
                      <button type="button" class="icon-button h-9 w-9" aria-label="Edit aturan" onClick={() => editRule(rule)}>
                        <Edit3 size={15} />
                      </button>
                      <button type="button" class="icon-button h-9 w-9 text-red-400" aria-label="Hapus aturan" onClick={() => setDeleteRule(rule)}>
                        <Trash2 size={15} />
                      </button>
                      <button type="button" class="btn-secondary px-3 py-2 text-xs" onClick={() => toggleRuleStatus(rule)}>
                        {rule.status_aktif ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRows().length === 0 && <div class="p-5"><EmptyState text="Tidak ada aturan yang cocok dengan filter." /></div>}
        <div class="p-4">
          <Pagination
            ariaLabel="Pagination aturan kost"
            page={page()}
            totalItems={filteredRows().length}
            rowsPerPage={rowsPerPage()}
            onPageChange={setPage}
            onRowsPerPageChange={(rows) => {
              setRowsPerPage(rows);
              setPage(1);
            }}
          />
        </div>
      </section>

      {deleteRule() && (
        <ConfirmDialog
          title="Hapus Aturan Kost?"
          message={`Aturan "${deleteRule()?.judul_aturan ?? ""}" akan dihapus dari data akun ini.`}
          confirmLabel="Hapus Aturan"
          onCancel={() => setDeleteRule(null)}
          onConfirm={confirmDeleteRule}
        />
      )}
    </div>
  );
}

export function OwnerFacilitiesPage() {
  const ownerId = getCurrentOwnerId();
  const [rows, setRows] = createSignal<PublicFacility[]>(facilities.filter((facility) => facility.owner_id === ownerId));
  const [form, setForm] = createSignal({
    nama_fasilitas: "",
    deskripsi_fasilitas: "",
    status_aktif: "" as "aktif" | "nonaktif" | "",
  });
  const [errors, setErrors] = createSignal<Partial<Record<"nama_fasilitas" | "status_aktif", string>>>({});
  const [editingId, setEditingId] = createSignal<number | null>(null);
  const [formOpen, setFormOpen] = createSignal(false);
  const [detailFacility, setDetailFacility] = createSignal<PublicFacility | null>(null);
  const [deleteFacility, setDeleteFacility] = createSignal<PublicFacility | null>(null);
  const [statusFilter, setStatusFilter] = createSignal<"semua" | "aktif" | "nonaktif">("semua");
  const [searchQuery, setSearchQuery] = createSignal("");
  const [page, setPage] = createSignal(1);
  const [rowsPerPage, setRowsPerPage] = createSignal<RowsPerPageOption>(10);

  const resetForm = () => {
    setEditingId(null);
    setForm({ nama_fasilitas: "", deskripsi_fasilitas: "", status_aktif: "" });
    setErrors({});
  };

  const openAddForm = () => {
    resetForm();
    setFormOpen(true);
  };

  const closeForm = () => {
    resetForm();
    setFormOpen(false);
  };

  const filteredRows = createMemo(() => {
    const normalizedQuery = searchQuery().trim().toLowerCase();

    return rows().filter((facility) => {
      const facilityStatus = facility.status_aktif ? "aktif" : "nonaktif";
      const matchesStatus = statusFilter() === "semua" || facilityStatus === statusFilter();
      const matchesSearch =
        !normalizedQuery ||
        facility.nama_fasilitas.toLowerCase().includes(normalizedQuery) ||
        facility.deskripsi_fasilitas.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesSearch;
    });
  });
  const paginatedRows = createMemo(() =>
    getPaginatedRows(filteredRows(), page(), rowsPerPage()),
  );

  createEffect(() => {
    const totalPages = getTotalPages(filteredRows().length, rowsPerPage());
    if (page() > totalPages) {
      setPage(totalPages);
    }
  });

  const validateFacility = () => {
    const currentForm = form();
    const nextErrors: Partial<Record<"nama_fasilitas" | "status_aktif", string>> = {};

    if (!currentForm.nama_fasilitas.trim()) {
      nextErrors.nama_fasilitas = "Nama Fasilitas wajib diisi.";
    }

    if (!currentForm.status_aktif) {
      nextErrors.status_aktif = "Status Aktif wajib dipilih.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = () => {
    if (!validateFacility()) {
      return;
    }

    const existingFacility = rows().find((facility) => facility.id === editingId());
    const now = new Date().toISOString();
    const payload: PublicFacility = {
      id: editingId() ?? nextId(rows()),
      owner_id: ownerId,
      nama_fasilitas: form().nama_fasilitas.trim(),
      deskripsi_fasilitas: form().deskripsi_fasilitas.trim(),
      status_aktif: form().status_aktif === "aktif",
      created_at: existingFacility?.created_at ?? now,
      updated_at: now,
    };

    setRows((items) =>
      editingId() ? items.map((item) => (item.id === editingId() ? payload : item)) : [payload, ...items],
    );
    closeForm();
  };

  const editFacility = (facility: PublicFacility) => {
    setEditingId(facility.id);
    setForm({
      nama_fasilitas: facility.nama_fasilitas,
      deskripsi_fasilitas: facility.deskripsi_fasilitas,
      status_aktif: facility.status_aktif ? "aktif" : "nonaktif",
    });
    setErrors({});
    setFormOpen(true);
  };

  const toggleFacilityStatus = (facility: PublicFacility) => {
    const now = new Date().toISOString();
    setRows((items) =>
      items.map((item) =>
        item.id === facility.id ? { ...item, status_aktif: !item.status_aktif, updated_at: now } : item,
      ),
    );
  };

  const confirmDeleteFacility = () => {
    const facility = deleteFacility();

    if (!facility) {
      return;
    }

    setRows((items) => items.filter((item) => item.id !== facility.id));

    if (detailFacility()?.id === facility.id) {
      setDetailFacility(null);
    }

    if (editingId() === facility.id) {
      closeForm();
    }

    setDeleteFacility(null);
  };

  return (
    <div class="grid gap-6">
      {formOpen() && (
        <div class="modal-backdrop-animate fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md">
          <section class="dashboard-card modal-panel-animate my-6 w-full max-w-2xl p-6">
            <div class="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 class="ui-heading text-xl font-bold">{editingId() ? "Edit Fasilitas Umum" : "Tambah Fasilitas Umum"}</h2>
                <p class="dashboard-muted mt-2 text-sm">Fasilitas aktif akan ditampilkan pada landing page.</p>
              </div>
              <button type="button" class="icon-button h-9 w-9" aria-label="Tutup form fasilitas" onClick={closeForm}>
                <X size={17} />
              </button>
            </div>

            <form
              class="grid gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                submit();
              }}
            >
              <label class="block">
                <span class="form-label">Nama Fasilitas</span>
                <input
                  class="form-control mt-2"
                  value={form().nama_fasilitas}
                  onInput={(event) => setForm({ ...form(), nama_fasilitas: event.currentTarget.value })}
                  placeholder="Contoh: Wi-Fi"
                />
                <FieldError message={errors().nama_fasilitas} />
              </label>

              <label class="block">
                <span class="form-label">Deskripsi Fasilitas</span>
                <textarea
                  class="form-control mt-2 min-h-32 resize-y"
                  value={form().deskripsi_fasilitas}
                  onInput={(event) => setForm({ ...form(), deskripsi_fasilitas: event.currentTarget.value })}
                  placeholder="Contoh: Akses internet tersedia untuk area kamar dan ruang bersama."
                />
                <p class="dashboard-muted mt-2 text-xs">Opsional.</p>
              </label>

              <label class="block">
                <span class="form-label">Status Aktif</span>
                <select
                  class="form-control mt-2"
                  value={form().status_aktif}
                  onInput={(event) => setForm({ ...form(), status_aktif: event.currentTarget.value as "aktif" | "nonaktif" | "" })}
                >
                  <option value="">Pilih status</option>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
                <FieldError message={errors().status_aktif} />
              </label>

              <div class="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <button type="button" class="btn-secondary px-5 py-3 text-sm" onClick={closeForm}>
                  Batal
                </button>
                <button type="submit" class="btn-primary px-5 py-3 text-sm">
                  {editingId() ? <Save size={16} /> : <Plus size={16} />}
                  {editingId() ? "Simpan Perubahan" : "Tambah Fasilitas"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {detailFacility() && (
        <div class="modal-backdrop-animate fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md">
          <section class="dashboard-card modal-panel-animate my-6 w-full max-w-2xl p-6">
            <div class="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 class="ui-heading text-xl font-bold">Detail Fasilitas Umum</h2>
                <p class="dashboard-muted mt-2 text-sm">{detailFacility()?.nama_fasilitas}</p>
              </div>
              <button type="button" class="icon-button h-9 w-9" aria-label="Tutup detail fasilitas" onClick={() => setDetailFacility(null)}>
                <X size={17} />
              </button>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Nama Fasilitas</p>
                <p class="ui-heading mt-1 font-bold">{detailFacility()?.nama_fasilitas}</p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Status Aktif</p>
                <div class="mt-2">
                  <StatusBadge value={detailFacility()?.status_aktif ? "Aktif" : "Nonaktif"} tone={detailFacility()?.status_aktif ? "success" : "neutral"} />
                </div>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Dibuat</p>
                <p class="ui-heading mt-1 font-bold">{formatDate(detailFacility()?.created_at ?? "")}</p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Diperbarui</p>
                <p class="ui-heading mt-1 font-bold">{formatDate(detailFacility()?.updated_at ?? "")}</p>
              </div>
            </div>

            <div class="mt-4 rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <p class="dashboard-muted text-xs">Deskripsi Fasilitas</p>
              <p class="ui-heading mt-1 leading-7">{detailFacility()?.deskripsi_fasilitas || "-"}</p>
            </div>

            <div class="mt-6 flex justify-end">
              <button type="button" class="btn-secondary px-4 py-2 text-sm" onClick={() => setDetailFacility(null)}>
                Tutup Detail
              </button>
            </div>
          </section>
        </div>
      )}

      <section class="dashboard-card overflow-hidden">
        <div class="flex flex-col gap-4 border-b border-[var(--divider)] p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 class="ui-heading text-lg font-bold">Fasilitas Umum</h2>
            <p class="dashboard-muted mt-1 text-sm">Kelola fasilitas umum berdasarkan owner_id {ownerId}.</p>
          </div>
          <button type="button" class="btn-primary px-5 py-3 text-sm" onClick={openAddForm}>
            <Plus size={16} />
            Tambah Fasilitas
          </button>
        </div>

        <div class="grid gap-3 border-b border-[var(--divider)] p-4 lg:grid-cols-[1fr_0.35fr]">
          <div class="input-with-icon">
            <Search class="input-icon" size={17} />
            <input
              class="form-control form-control-icon"
              value={searchQuery()}
              onInput={(event) => {
                setSearchQuery(event.currentTarget.value);
                setPage(1);
              }}
              placeholder="Cari nama fasilitas atau deskripsi fasilitas"
            />
          </div>
          <select class="form-control" value={statusFilter()} onInput={(event) => {
            setStatusFilter(event.currentTarget.value as "semua" | "aktif" | "nonaktif");
            setPage(1);
          }}>
            <option value="semua">Semua status</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[980px] text-left text-sm">
            <thead class="bg-[rgba(148,163,184,0.08)] text-xs uppercase text-[rgb(var(--text-muted-rgb))]">
              <tr>
                <th class="px-5 py-3 font-bold">Nama Fasilitas</th>
                <th class="px-5 py-3 font-bold">Deskripsi Fasilitas</th>
                <th class="px-5 py-3 font-bold">Status Aktif</th>
                <th class="px-5 py-3 font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows().map((facility) => (
                <tr class="border-t border-[var(--divider)]">
                  <td class="px-5 py-4 font-bold text-[rgb(var(--text-body-rgb))]">{facility.nama_fasilitas}</td>
                  <td class="max-w-[420px] px-5 py-4 text-[rgb(var(--text-body-rgb))]">{facility.deskripsi_fasilitas || "-"}</td>
                  <td class="px-5 py-4">
                    <StatusBadge value={facility.status_aktif ? "Aktif" : "Nonaktif"} tone={facility.status_aktif ? "success" : "neutral"} />
                  </td>
                  <td class="px-5 py-4">
                    <div class="flex flex-wrap gap-2">
                      <button type="button" class="icon-button h-9 w-9" aria-label="Detail fasilitas" onClick={() => setDetailFacility(facility)}>
                        <Eye size={15} />
                      </button>
                      <button type="button" class="icon-button h-9 w-9" aria-label="Edit fasilitas" onClick={() => editFacility(facility)}>
                        <Edit3 size={15} />
                      </button>
                      <button type="button" class="icon-button h-9 w-9 text-red-400" aria-label="Hapus fasilitas" onClick={() => setDeleteFacility(facility)}>
                        <Trash2 size={15} />
                      </button>
                      <button type="button" class="btn-secondary px-3 py-2 text-xs" onClick={() => toggleFacilityStatus(facility)}>
                        {facility.status_aktif ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRows().length === 0 && <div class="p-5"><EmptyState text="Tidak ada fasilitas yang cocok dengan filter." /></div>}
        <div class="p-4">
          <Pagination
            ariaLabel="Pagination fasilitas umum"
            page={page()}
            totalItems={filteredRows().length}
            rowsPerPage={rowsPerPage()}
            onPageChange={setPage}
            onRowsPerPageChange={(rows) => {
              setRowsPerPage(rows);
              setPage(1);
            }}
          />
        </div>
      </section>

      {deleteFacility() && (
        <ConfirmDialog
          title="Hapus Fasilitas Umum?"
          message={`Fasilitas "${deleteFacility()?.nama_fasilitas ?? ""}" akan dihapus dari data akun ini.`}
          confirmLabel="Hapus Fasilitas"
          onCancel={() => setDeleteFacility(null)}
          onConfirm={confirmDeleteFacility}
        />
      )}
    </div>
  );
}

export function OwnerBankAccountsPage() {
  const ownerId = getCurrentOwnerId();
  const [rows, setRows] = createSignal<BankAccount[]>(
    bankAccounts.filter((account) => account.owner_id === ownerId),
  );
  const [form, setForm] = createSignal({
    nama_bank: "",
    nomor_rekening: "",
    nama_pemilik_rekening: "",
    catatan_pembayaran: "",
    status_aktif: "" as "aktif" | "nonaktif" | "",
  });
  const [errors, setErrors] = createSignal<Partial<Record<"nama_bank" | "nomor_rekening" | "nama_pemilik_rekening" | "status_aktif", string>>>({});
  const [editingId, setEditingId] = createSignal<number | null>(null);
  const [formOpen, setFormOpen] = createSignal(false);
  const [detailAccount, setDetailAccount] = createSignal<BankAccount | null>(null);
  const [deleteAccount, setDeleteAccount] = createSignal<BankAccount | null>(null);
  const [statusFilter, setStatusFilter] = createSignal<"semua" | "aktif" | "nonaktif">("semua");
  const [searchQuery, setSearchQuery] = createSignal("");
  const [page, setPage] = createSignal(1);
  const [rowsPerPage, setRowsPerPage] = createSignal<RowsPerPageOption>(10);

  const resetForm = () => {
    setEditingId(null);
    setForm({ nama_bank: "", nomor_rekening: "", nama_pemilik_rekening: "", catatan_pembayaran: "", status_aktif: "" });
    setErrors({});
  };

  const openAddForm = () => {
    resetForm();
    setFormOpen(true);
  };

  const closeForm = () => {
    resetForm();
    setFormOpen(false);
  };

  const filteredRows = createMemo(() => {
    const normalizedQuery = searchQuery().trim().toLowerCase();

    return rows().filter((account) => {
      const accountStatus = account.status_aktif ? "aktif" : "nonaktif";
      const matchesStatus = statusFilter() === "semua" || accountStatus === statusFilter();
      const matchesSearch =
        !normalizedQuery ||
        account.nama_bank.toLowerCase().includes(normalizedQuery) ||
        account.nomor_rekening.toLowerCase().includes(normalizedQuery) ||
        account.nama_pemilik_rekening.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesSearch;
    });
  });
  const paginatedRows = createMemo(() =>
    getPaginatedRows(filteredRows(), page(), rowsPerPage()),
  );

  createEffect(() => {
    const totalPages = getTotalPages(filteredRows().length, rowsPerPage());
    if (page() > totalPages) {
      setPage(totalPages);
    }
  });

  const validateAccount = () => {
    const currentForm = form();
    const nextErrors: Partial<Record<"nama_bank" | "nomor_rekening" | "nama_pemilik_rekening" | "status_aktif", string>> = {};

    if (!currentForm.nama_bank.trim()) {
      nextErrors.nama_bank = "Nama Bank wajib diisi.";
    }

    if (!currentForm.nomor_rekening.trim()) {
      nextErrors.nomor_rekening = "Nomor Rekening wajib diisi.";
    }

    if (!currentForm.nama_pemilik_rekening.trim()) {
      nextErrors.nama_pemilik_rekening = "Nama Pemilik Rekening wajib diisi.";
    }

    if (!currentForm.status_aktif) {
      nextErrors.status_aktif = "Status Aktif wajib dipilih.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = () => {
    if (!validateAccount()) {
      return;
    }

    const existingAccount = rows().find((account) => account.id === editingId());
    const now = new Date().toISOString();
    const payload: BankAccount = {
      id: editingId() ?? nextId(rows()),
      owner_id: ownerId,
      nama_bank: form().nama_bank.trim(),
      nomor_rekening: form().nomor_rekening.trim(),
      nama_pemilik_rekening: form().nama_pemilik_rekening.trim(),
      catatan_pembayaran: form().catatan_pembayaran.trim(),
      status_aktif: form().status_aktif === "aktif",
      created_at: existingAccount?.created_at ?? now,
      updated_at: now,
    };

    setRows((items) =>
      editingId() ? items.map((item) => (item.id === editingId() ? payload : item)) : [payload, ...items],
    );
    closeForm();
  };

  const editAccount = (account: BankAccount) => {
    setEditingId(account.id);
    setForm({
      nama_bank: account.nama_bank,
      nomor_rekening: account.nomor_rekening,
      nama_pemilik_rekening: account.nama_pemilik_rekening,
      catatan_pembayaran: account.catatan_pembayaran,
      status_aktif: account.status_aktif ? "aktif" : "nonaktif",
    });
    setErrors({});
    setFormOpen(true);
  };

  const toggleAccountStatus = (account: BankAccount) => {
    const now = new Date().toISOString();
    setRows((items) =>
      items.map((item) =>
        item.id === account.id ? { ...item, status_aktif: !item.status_aktif, updated_at: now } : item,
      ),
    );
  };

  const confirmDeleteAccount = () => {
    const account = deleteAccount();

    if (!account) {
      return;
    }

    setRows((items) => items.filter((item) => item.id !== account.id));

    if (detailAccount()?.id === account.id) {
      setDetailAccount(null);
    }

    if (editingId() === account.id) {
      closeForm();
    }

    setDeleteAccount(null);
  };

  return (
    <div class="grid gap-6">
      {formOpen() && (
        <div class="modal-backdrop-animate fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md">
          <section class="dashboard-card modal-panel-animate my-6 w-full max-w-2xl p-6">
            <div class="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 class="ui-heading text-xl font-bold">{editingId() ? "Edit Rekening Pembayaran" : "Tambah Rekening Pembayaran"}</h2>
                <p class="dashboard-muted mt-2 text-sm">Rekening aktif akan dilihat penyewa untuk pembayaran.</p>
              </div>
              <button type="button" class="icon-button h-9 w-9" aria-label="Tutup form rekening" onClick={closeForm}>
                <X size={17} />
              </button>
            </div>

            <form
              class="grid gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                submit();
              }}
            >
              <label class="block">
                <span class="form-label">Nama Bank</span>
                <input
                  class="form-control mt-2"
                  value={form().nama_bank}
                  onInput={(event) => setForm({ ...form(), nama_bank: event.currentTarget.value })}
                  placeholder="Contoh: BCA"
                />
                <FieldError message={errors().nama_bank} />
              </label>

              <label class="block">
                <span class="form-label">Nomor Rekening</span>
                <input
                  class="form-control mt-2"
                  value={form().nomor_rekening}
                  onInput={(event) => setForm({ ...form(), nomor_rekening: event.currentTarget.value })}
                  placeholder="Contoh: 1234567890"
                />
                <FieldError message={errors().nomor_rekening} />
              </label>

              <label class="block">
                <span class="form-label">Nama Pemilik Rekening</span>
                <input
                  class="form-control mt-2"
                  value={form().nama_pemilik_rekening}
                  onInput={(event) => setForm({ ...form(), nama_pemilik_rekening: event.currentTarget.value })}
                  placeholder="Contoh: Siti Aminah"
                />
                <FieldError message={errors().nama_pemilik_rekening} />
              </label>

              <label class="block">
                <span class="form-label">Catatan Pembayaran</span>
                <textarea
                  class="form-control mt-2 min-h-28 resize-y"
                  value={form().catatan_pembayaran}
                  onInput={(event) => setForm({ ...form(), catatan_pembayaran: event.currentTarget.value })}
                  placeholder="Contoh: Cantumkan nama dan nomor kamar pada berita transfer."
                />
                <p class="dashboard-muted mt-2 text-xs">Opsional.</p>
              </label>

              <label class="block">
                <span class="form-label">Status Aktif</span>
                <select
                  class="form-control mt-2"
                  value={form().status_aktif}
                  onInput={(event) => setForm({ ...form(), status_aktif: event.currentTarget.value as "aktif" | "nonaktif" | "" })}
                >
                  <option value="">Pilih status</option>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
                <FieldError message={errors().status_aktif} />
              </label>

              <div class="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <button type="button" class="btn-secondary px-5 py-3 text-sm" onClick={closeForm}>
                  Batal
                </button>
                <button type="submit" class="btn-primary px-5 py-3 text-sm">
                  {editingId() ? <Save size={16} /> : <Plus size={16} />}
                  {editingId() ? "Simpan Perubahan" : "Tambah Rekening"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {detailAccount() && (
        <div class="modal-backdrop-animate fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md">
          <section class="dashboard-card modal-panel-animate my-6 w-full max-w-2xl p-6">
            <div class="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 class="ui-heading text-xl font-bold">Detail Rekening Pembayaran</h2>
                <p class="dashboard-muted mt-2 text-sm">{detailAccount()?.nama_bank} - {detailAccount()?.nomor_rekening}</p>
              </div>
              <button type="button" class="icon-button h-9 w-9" aria-label="Tutup detail rekening" onClick={() => setDetailAccount(null)}>
                <X size={17} />
              </button>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Nama Bank</p>
                <p class="ui-heading mt-1 font-bold">{detailAccount()?.nama_bank}</p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Nomor Rekening</p>
                <p class="ui-heading mt-1 font-bold">{detailAccount()?.nomor_rekening}</p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Nama Pemilik Rekening</p>
                <p class="ui-heading mt-1 font-bold">{detailAccount()?.nama_pemilik_rekening}</p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Status Aktif</p>
                <div class="mt-2">
                  <StatusBadge value={detailAccount()?.status_aktif ? "Aktif" : "Nonaktif"} tone={detailAccount()?.status_aktif ? "success" : "neutral"} />
                </div>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Dibuat</p>
                <p class="ui-heading mt-1 font-bold">{formatDate(detailAccount()?.created_at ?? "")}</p>
              </div>
              <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                <p class="dashboard-muted text-xs">Diperbarui</p>
                <p class="ui-heading mt-1 font-bold">{formatDate(detailAccount()?.updated_at ?? "")}</p>
              </div>
            </div>

            <div class="mt-4 rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
              <p class="dashboard-muted text-xs">Catatan Pembayaran</p>
              <p class="ui-heading mt-1 leading-7">{detailAccount()?.catatan_pembayaran || "-"}</p>
            </div>

            <div class="mt-6 flex justify-end">
              <button type="button" class="btn-secondary px-4 py-2 text-sm" onClick={() => setDetailAccount(null)}>
                Tutup Detail
              </button>
            </div>
          </section>
        </div>
      )}

      <section class="dashboard-card overflow-hidden">
        <div class="flex flex-col gap-4 border-b border-[var(--divider)] p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 class="ui-heading text-lg font-bold">Rekening Pembayaran</h2>
            <p class="dashboard-muted mt-1 text-sm">Kelola rekening pembayaran berdasarkan owner_id {ownerId}.</p>
          </div>
          <button type="button" class="btn-primary px-5 py-3 text-sm" onClick={openAddForm}>
            <Plus size={16} />
            Tambah Rekening
          </button>
        </div>

        <div class="grid gap-3 border-b border-[var(--divider)] p-4 lg:grid-cols-[1fr_0.35fr]">
          <div class="input-with-icon">
            <Search class="input-icon" size={17} />
            <input
              class="form-control form-control-icon"
              value={searchQuery()}
              onInput={(event) => {
                setSearchQuery(event.currentTarget.value);
                setPage(1);
              }}
              placeholder="Cari nama bank, nomor rekening, atau nama pemilik"
            />
          </div>
          <select class="form-control" value={statusFilter()} onInput={(event) => {
            setStatusFilter(event.currentTarget.value as "semua" | "aktif" | "nonaktif");
            setPage(1);
          }}>
            <option value="semua">Semua status</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[1120px] text-left text-sm">
            <thead class="bg-[rgba(148,163,184,0.08)] text-xs uppercase text-[rgb(var(--text-muted-rgb))]">
              <tr>
                <th class="px-5 py-3 font-bold">Nama Bank</th>
                <th class="px-5 py-3 font-bold">Nomor Rekening</th>
                <th class="px-5 py-3 font-bold">Nama Pemilik Rekening</th>
                <th class="px-5 py-3 font-bold">Catatan Pembayaran</th>
                <th class="px-5 py-3 font-bold">Status Aktif</th>
                <th class="px-5 py-3 font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows().map((account) => (
                <tr class="border-t border-[var(--divider)]">
                  <td class="px-5 py-4 font-bold text-[rgb(var(--text-body-rgb))]">{account.nama_bank}</td>
                  <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">{account.nomor_rekening}</td>
                  <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">{account.nama_pemilik_rekening}</td>
                  <td class="max-w-[300px] px-5 py-4 text-[rgb(var(--text-body-rgb))]">{account.catatan_pembayaran || "-"}</td>
                  <td class="px-5 py-4">
                    <StatusBadge value={account.status_aktif ? "Aktif" : "Nonaktif"} tone={account.status_aktif ? "success" : "neutral"} />
                  </td>
                  <td class="px-5 py-4">
                    <div class="flex flex-wrap gap-2">
                      <button type="button" class="icon-button h-9 w-9" aria-label="Detail rekening" onClick={() => setDetailAccount(account)}>
                        <Eye size={15} />
                      </button>
                      <button type="button" class="icon-button h-9 w-9" aria-label="Edit rekening" onClick={() => editAccount(account)}>
                        <Edit3 size={15} />
                      </button>
                      <button type="button" class="icon-button h-9 w-9 text-red-400" aria-label="Hapus rekening" onClick={() => setDeleteAccount(account)}>
                        <Trash2 size={15} />
                      </button>
                      <button type="button" class="btn-secondary px-3 py-2 text-xs" onClick={() => toggleAccountStatus(account)}>
                        {account.status_aktif ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRows().length === 0 && <div class="p-5"><EmptyState text="Tidak ada rekening yang cocok dengan filter." /></div>}
        <div class="p-4">
          <Pagination
            ariaLabel="Pagination rekening pembayaran"
            page={page()}
            totalItems={filteredRows().length}
            rowsPerPage={rowsPerPage()}
            onPageChange={setPage}
            onRowsPerPageChange={(rows) => {
              setRowsPerPage(rows);
              setPage(1);
            }}
          />
        </div>
      </section>

      {deleteAccount() && (
        <ConfirmDialog
          title="Hapus Rekening Pembayaran?"
          message={`Rekening ${deleteAccount()?.nama_bank ?? ""} atas nama ${deleteAccount()?.nama_pemilik_rekening ?? ""} akan dihapus.`}
          confirmLabel="Hapus Rekening"
          onCancel={() => setDeleteAccount(null)}
          onConfirm={confirmDeleteAccount}
        />
      )}
    </div>
  );
}
