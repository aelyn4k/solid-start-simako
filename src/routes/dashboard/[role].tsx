import { A, Navigate, useNavigate, useParams } from "@solidjs/router";
import {
  AlertTriangle,
  BedDouble,
  Building2,
  CheckCircle2,
  CreditCard,
  Database,
  Edit3,
  FileText,
  Globe2,
  Home,
  ListChecks,
  LogOut,
  Mail,
  Menu,
  Moon,
  Plus,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  Trash2,
  Upload,
  UserCog,
  Users,
  Wrench,
} from "lucide-solid";
import { createEffect, createMemo, createSignal, onMount } from "solid-js";
import type { Component } from "solid-js";
import ConfirmDialog from "~/components/ConfirmDialog";
import { rooms as roomCatalog } from "~/data/rooms";
import OwnerDashboard from "~/pages/owner/OwnerDashboard";

type RoleKey = "admin" | "pemilik" | "penyewa";
type ThemeMode = "dark" | "light";
type Tone = "red" | "green" | "orange" | "blue";
type BadgeTone = "success" | "danger" | "warning" | "info" | "neutral";
type IconComponent = Component<{ size?: number; class?: string }>;

interface MenuItem {
  label: string;
  icon: IconComponent;
}

interface StatCard {
  label: string;
  value: string;
  tone: Tone;
  icon: IconComponent;
}

interface QuickStat {
  label: string;
  value: string;
  tone: Tone;
}

interface TableColumn {
  key: string;
  label: string;
}

interface FormField {
  key: string;
  label: string;
  placeholder: string;
  type?: "text" | "email" | "number" | "textarea" | "select";
  options?: string[];
}

interface CrudResource {
  key: string;
  menuLabel: string;
  title: string;
  description: string;
  actionLabel: string;
  columns: TableColumn[];
  fields: FormField[];
  initialRows: Record<string, string>[];
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

interface RoleConfig {
  key: RoleKey;
  label: string;
  title: string;
  subtitle: string;
  userName: string;
  userRole: string;
  menus: MenuItem[];
  stats: StatCard[];
  statusTitle: string;
  statusItems: { label: string; value: string; tone: BadgeTone }[];
  quickStats: QuickStat[];
  resources: CrudResource[];
}

type ResourceRows = Record<string, Record<string, string>[]>;

const adminOwnerRows = [
  {
    name: "Siti Aminah",
    email: "siti@simako.id",
    phone: "0812 3456 7890",
    kost: "Kost Melati",
    status: "Aktif",
  },
  {
    name: "Rudi Hartono",
    email: "rudi@simako.id",
    phone: "0821 4455 7788",
    kost: "Kost Anggrek",
    status: "Aktif",
  },
  {
    name: "Dewi Lestari",
    email: "dewi@simako.id",
    phone: "0857 1122 3344",
    kost: "Kost Purnama",
    status: "Pending",
  },
];

const adminTenantRows = [
  {
    name: "Nadia Putri",
    email: "nadia@mail.com",
    phone: "0813 9000 1122",
    room: "Melati 102",
    status: "Aktif",
  },
  {
    name: "Raka Pratama",
    email: "raka@mail.com",
    phone: "0822 1122 7788",
    room: "Melati 103",
    status: "Aktif",
  },
  {
    name: "Fajar Maulana",
    email: "fajar@mail.com",
    phone: "0852 8877 2211",
    room: "Anggrek 201",
    status: "Nonaktif",
  },
];

const ownerRoomRows = [
  {
    room: "Kamar 101",
    type: "Premium",
    price: "Rp 1.500.000",
    tenant: "-",
    status: "Tersedia",
  },
  {
    room: "Kamar 102",
    type: "Reguler",
    price: "Rp 1.200.000",
    tenant: "Nadia Putri",
    status: "Berpenghuni",
  },
  {
    room: "Kamar 103",
    type: "Reguler",
    price: "Rp 1.350.000",
    tenant: "Raka Pratama",
    status: "Berpenghuni",
  },
];

const ownerTenantRows = [
  {
    name: "Nadia Putri",
    room: "Kamar 102",
    startDate: "01 Okt 2025",
    payment: "Belum Dibayar",
    status: "Aktif",
  },
  {
    name: "Raka Pratama",
    room: "Kamar 103",
    startDate: "15 Jan 2026",
    payment: "Pending",
    status: "Aktif",
  },
  {
    name: "Aulia Rahma",
    room: "Kamar 108",
    startDate: "03 Feb 2026",
    payment: "Lunas",
    status: "Aktif",
  },
];

const ownerBillRows = [
  {
    tenant: "Nadia Putri",
    room: "Kamar 102",
    amount: "Rp 1.200.000",
    dueDate: "30 Apr 2026",
    status: "Belum Dibayar",
  },
  {
    tenant: "Raka Pratama",
    room: "Kamar 103",
    amount: "Rp 1.350.000",
    dueDate: "30 Apr 2026",
    status: "Pending",
  },
  {
    tenant: "Aulia Rahma",
    room: "Kamar 108",
    amount: "Rp 1.500.000",
    dueDate: "30 Apr 2026",
    status: "Lunas",
  },
];

const tenantBillRows = [
  {
    period: "April 2026",
    room: "Kamar 102",
    amount: "Rp 1.200.000",
    dueDate: "30 Apr 2026",
    status: "Belum Dibayar",
  },
  {
    period: "Maret 2026",
    room: "Kamar 102",
    amount: "Rp 1.200.000",
    dueDate: "30 Mar 2026",
    status: "Lunas",
  },
  {
    period: "Februari 2026",
    room: "Kamar 102",
    amount: "Rp 1.200.000",
    dueDate: "28 Feb 2026",
    status: "Lunas",
  },
];

const tenantReportRows = [
  {
    type: "AC",
    date: "22 Apr 2026",
    description: "AC kurang dingin",
    status: "Diproses",
  },
  {
    type: "Lampu",
    date: "18 Mar 2026",
    description: "Lampu kamar mati",
    status: "Selesai",
  },
  {
    type: "Air",
    date: "10 Feb 2026",
    description: "Tekanan air kecil",
    status: "Selesai",
  },
];

const adminApplicantRows = [
  {
    owner: "Dewi Lestari",
    kost: "Kost Cendana Baru",
    submittedAt: "04 Mei 2026",
    status: "Pending",
  },
  {
    owner: "Agus Pranata",
    kost: "Kost Semesta",
    submittedAt: "03 Mei 2026",
    status: "Disetujui",
  },
  {
    owner: "Maya Salsabila",
    kost: "Kost Pelangi",
    submittedAt: "02 Mei 2026",
    status: "Pending",
  },
  {
    owner: "Indra Wijaya",
    kost: "Kost Mandiri",
    submittedAt: "29 Apr 2026",
    status: "Ditolak",
  },
];

const adminRoomRows = roomCatalog.map((room) => ({
  room: room.name,
  type: room.type,
  owner: room.ownerName,
  price: room.price,
  status: room.status,
}));

const adminComplaintRows = [
  {
    reporter: "Nadia Putri",
    title: "Air kamar mandi kecil",
    date: "04 Mei 2026",
    status: "Masuk",
  },
  {
    reporter: "Raka Pratama",
    title: "Lampu lorong mati",
    date: "03 Mei 2026",
    status: "Diproses",
  },
  {
    reporter: "Aulia Rahma",
    title: "Wi-Fi tidak stabil",
    date: "02 Mei 2026",
    status: "Masuk",
  },
  {
    reporter: "Fajar Maulana",
    title: "Kunci kamar macet",
    date: "28 Apr 2026",
    status: "Selesai",
  },
];

const adminSettingRows = [
  {
    setting: "Registrasi Pemilik",
    value: "Manual verification",
    status: "Aktif",
  },
  { setting: "Email Notifikasi", value: "Enabled", status: "Aktif" },
  { setting: "Maintenance Mode", value: "Disabled", status: "Nonaktif" },
];

const adminLogRows = [
  {
    time: "04 Mei 2026 09:12",
    user: "admin@simako.id",
    action: "Membuka dashboard admin",
    status: "Selesai",
  },
  {
    time: "04 Mei 2026 08:44",
    user: "dewi@simako.id",
    action: "Mengirim pendaftaran kost",
    status: "Pending",
  },
  {
    time: "03 Mei 2026 21:10",
    user: "raka@mail.com",
    action: "Mengirim keluhan",
    status: "Masuk",
  },
];

const accountFields: FormField[] = [
  { key: "name", label: "Nama", placeholder: "Nama lengkap" },
  {
    key: "email",
    label: "Email",
    placeholder: "nama@email.com",
    type: "email",
  },
  { key: "phone", label: "Nomor HP", placeholder: "08xxxxxxxxxx" },
  {
    key: "status",
    label: "Status",
    placeholder: "Pilih status",
    type: "select",
    options: ["Aktif", "Pending", "Nonaktif"],
  },
];

const roleConfigs: Record<RoleKey, RoleConfig> = {
  admin: {
    key: "admin",
    label: "Admin",
    title: "Dashboard",
    subtitle: "Kelola akun pemilik dan penyewa SIMAKO dari satu panel.",
    userName: "admin",
    userRole: "superadmin",
    menus: [
      { label: "Dashboard", icon: Home },
      { label: "Akun Pemilik", icon: UserCog },
      { label: "Akun Penyewa", icon: Users },
      { label: "Pendaftar Kost", icon: ListChecks },
      { label: "Semua Kamar", icon: BedDouble },
      { label: "Tagihan", icon: ReceiptText },
      { label: "Keluhan", icon: AlertTriangle },
      { label: "Settings", icon: Settings },
      { label: "Logs", icon: FileText },
    ],
    stats: [
      { label: "Total Akun", value: "717", tone: "red", icon: Users },
      { label: "Akun Aktif", value: "692", tone: "green", icon: CheckCircle2 },
      { label: "Pemilik Kost", value: "42", tone: "orange", icon: UserCog },
      { label: "Penyewa Kost", value: "675", tone: "red", icon: Globe2 },
    ],
    statusTitle: "System Status",
    statusItems: [
      { label: "Auth Service", value: "Operational", tone: "success" },
      { label: "Database", value: "Operational", tone: "success" },
      { label: "Email Service", value: "Operational", tone: "success" },
    ],
    quickStats: [
      { label: "Active Accounts Rate", value: "96.5%", tone: "red" },
      { label: "New Owners This Month", value: "6", tone: "green" },
      { label: "Pending Verification", value: "25", tone: "orange" },
    ],
    resources: [
      {
        key: "owners",
        menuLabel: "Akun Pemilik",
        title: "CRUD Akun Pemilik",
        description:
          "Admin hanya mengelola akun pemilik kost, bukan data kamar atau tagihan milik pemilik.",
        actionLabel: "Tambah Pemilik",
        columns: [
          { key: "name", label: "Nama" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Nomor HP" },
          { key: "kost", label: "Kost" },
          { key: "status", label: "Status" },
        ],
        fields: [
          ...accountFields,
          {
            key: "kost",
            label: "Nama Kost",
            placeholder: "Contoh: Kost Melati",
          },
        ],
        initialRows: adminOwnerRows,
        canCreate: true,
        canEdit: true,
        canDelete: true,
      },
      {
        key: "tenants",
        menuLabel: "Akun Penyewa",
        title: "CRUD Akun Penyewa",
        description: "Admin hanya mengelola akun penyewa dan status akunnya.",
        actionLabel: "Tambah Penyewa",
        columns: [
          { key: "name", label: "Nama" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Nomor HP" },
          { key: "room", label: "Kamar" },
          { key: "status", label: "Status" },
        ],
        fields: [
          ...accountFields,
          { key: "room", label: "Kamar", placeholder: "Contoh: Melati 102" },
        ],
        initialRows: adminTenantRows,
        canCreate: true,
        canEdit: true,
        canDelete: true,
      },
      {
        key: "applicants",
        menuLabel: "Pendaftar Kost",
        title: "Data Pendaftar Kost",
        description:
          "Admin melihat semua pendaftaran kost yang masuk untuk proses verifikasi.",
        actionLabel: "Tambah Pendaftar",
        columns: [
          { key: "owner", label: "Pemilik" },
          { key: "kost", label: "Nama Kost" },
          { key: "submittedAt", label: "Tanggal Daftar" },
          { key: "status", label: "Status" },
        ],
        fields: [],
        initialRows: adminApplicantRows,
        canCreate: false,
        canEdit: false,
        canDelete: false,
      },
      {
        key: "all-rooms",
        menuLabel: "Semua Kamar",
        title: "Semua Kamar Kost",
        description:
          "Admin melihat semua kamar dari seluruh pemilik kost di SIMAKO.",
        actionLabel: "Tambah Kamar",
        columns: [
          { key: "room", label: "Kamar" },
          { key: "type", label: "Tipe" },
          { key: "owner", label: "Pemilik" },
          { key: "price", label: "Harga" },
          { key: "status", label: "Status" },
        ],
        fields: [],
        initialRows: adminRoomRows,
        canCreate: false,
        canEdit: false,
        canDelete: false,
      },
      {
        key: "all-bills",
        menuLabel: "Tagihan",
        title: "Semua Tagihan",
        description:
          "Admin melihat semua tagihan penyewa dari seluruh pemilik kost.",
        actionLabel: "Buat Tagihan",
        columns: [
          { key: "tenant", label: "Penyewa" },
          { key: "room", label: "Kamar" },
          { key: "amount", label: "Nominal" },
          { key: "dueDate", label: "Jatuh Tempo" },
          { key: "status", label: "Status" },
        ],
        fields: [],
        initialRows: ownerBillRows,
        canCreate: false,
        canEdit: false,
        canDelete: false,
      },
      {
        key: "complaints",
        menuLabel: "Keluhan",
        title: "Semua Keluhan",
        description:
          "Admin melihat semua keluhan yang masuk dari penyewa dan pemilik kost.",
        actionLabel: "Tambah Keluhan",
        columns: [
          { key: "reporter", label: "Pelapor" },
          { key: "title", label: "Keluhan" },
          { key: "date", label: "Tanggal" },
          { key: "status", label: "Status" },
        ],
        fields: [],
        initialRows: adminComplaintRows,
        canCreate: false,
        canEdit: false,
        canDelete: false,
      },
      {
        key: "settings",
        menuLabel: "Settings",
        title: "Settings",
        description: "Admin mengakses konfigurasi sistem utama SIMAKO.",
        actionLabel: "Tambah Setting",
        columns: [
          { key: "setting", label: "Setting" },
          { key: "value", label: "Value" },
          { key: "status", label: "Status" },
        ],
        fields: [],
        initialRows: adminSettingRows,
        canCreate: false,
        canEdit: false,
        canDelete: false,
      },
      {
        key: "logs",
        menuLabel: "Logs",
        title: "System Logs",
        description: "Admin mengakses log aktivitas sistem SIMAKO.",
        actionLabel: "Tambah Log",
        columns: [
          { key: "time", label: "Waktu" },
          { key: "user", label: "User" },
          { key: "action", label: "Aktivitas" },
          { key: "status", label: "Status" },
        ],
        fields: [],
        initialRows: adminLogRows,
        canCreate: false,
        canEdit: false,
        canDelete: false,
      },
    ],
  },
  pemilik: {
    key: "pemilik",
    label: "Pemilik",
    title: "Dashboard",
    subtitle:
      "Kelola kamar, penyewa, tagihan, pembayaran, dan laporan kendala kost sendiri.",
    userName: "Siti Aminah",
    userRole: "pemilik kost",
    menus: [
      { label: "Dashboard", icon: Home },
      { label: "Kamar", icon: BedDouble },
      { label: "Penyewa", icon: Users },
      { label: "Tagihan", icon: ReceiptText },
      { label: "Pembayaran", icon: CreditCard },
      { label: "Laporan", icon: Wrench },
      { label: "Settings", icon: Settings },
    ],
    stats: [
      { label: "Total Kamar", value: "32", tone: "red", icon: BedDouble },
      { label: "Kamar Kosong", value: "7", tone: "green", icon: Home },
      {
        label: "Tagihan Aktif",
        value: "18",
        tone: "orange",
        icon: ReceiptText,
      },
      { label: "Laporan Aktif", value: "3", tone: "red", icon: Wrench },
    ],
    statusTitle: "Kost Status",
    statusItems: [
      { label: "Kost Melati", value: "Operational", tone: "success" },
      { label: "Pembayaran", value: "4 Pending", tone: "warning" },
      { label: "Kendala", value: "Diproses", tone: "info" },
    ],
    quickStats: [
      { label: "Occupancy Rate", value: "78.1%", tone: "red" },
      { label: "Monthly Revenue", value: "37.8jt", tone: "green" },
      { label: "Unpaid Rooms", value: "6", tone: "orange" },
    ],
    resources: [
      {
        key: "rooms",
        menuLabel: "Kamar",
        title: "CRUD Data Kamar",
        description:
          "Pemilik dapat menambah, mengedit, dan menghapus data kamar miliknya sendiri.",
        actionLabel: "Tambah Kamar",
        columns: [
          { key: "room", label: "Kamar" },
          { key: "type", label: "Tipe" },
          { key: "price", label: "Harga" },
          { key: "tenant", label: "Penghuni" },
          { key: "status", label: "Status" },
        ],
        fields: [
          {
            key: "room",
            label: "Nomor Kamar",
            placeholder: "Contoh: Kamar 104",
          },
          {
            key: "type",
            label: "Tipe",
            placeholder: "Pilih tipe",
            type: "select",
            options: ["Premium", "Reguler", "Ekonomis"],
          },
          { key: "price", label: "Harga", placeholder: "Rp 0" },
          {
            key: "tenant",
            label: "Penghuni",
            placeholder: "Kosongkan jika belum terisi",
          },
          {
            key: "status",
            label: "Status",
            placeholder: "Pilih status",
            type: "select",
            options: ["Tersedia", "Berpenghuni"],
          },
        ],
        initialRows: ownerRoomRows,
        canCreate: true,
        canEdit: true,
        canDelete: true,
      },
      {
        key: "owner-tenants",
        menuLabel: "Penyewa",
        title: "Data Penyewa",
        description: "Pemilik hanya melihat penyewa dari kamar miliknya.",
        actionLabel: "Tambah Penyewa",
        columns: [
          { key: "name", label: "Nama" },
          { key: "room", label: "Kamar" },
          { key: "startDate", label: "Mulai Sewa" },
          { key: "payment", label: "Pembayaran" },
          { key: "status", label: "Status" },
        ],
        fields: [
          { key: "name", label: "Nama", placeholder: "Nama penyewa" },
          { key: "room", label: "Kamar", placeholder: "Contoh: Kamar 102" },
          { key: "startDate", label: "Mulai Sewa", placeholder: "01 Mei 2026" },
          {
            key: "payment",
            label: "Pembayaran",
            placeholder: "Pilih status",
            type: "select",
            options: ["Belum Dibayar", "Pending", "Lunas"],
          },
          {
            key: "status",
            label: "Status",
            placeholder: "Pilih status",
            type: "select",
            options: ["Aktif", "Nonaktif"],
          },
        ],
        initialRows: ownerTenantRows,
        canCreate: true,
        canEdit: true,
        canDelete: false,
      },
      {
        key: "owner-bills",
        menuLabel: "Tagihan",
        title: "Data Tagihan",
        description: "Daftar tagihan penyewa dari kost milik pemilik.",
        actionLabel: "Buat Tagihan",
        columns: [
          { key: "tenant", label: "Penyewa" },
          { key: "room", label: "Kamar" },
          { key: "amount", label: "Nominal" },
          { key: "dueDate", label: "Jatuh Tempo" },
          { key: "status", label: "Status" },
        ],
        fields: [
          { key: "tenant", label: "Penyewa", placeholder: "Nama penyewa" },
          { key: "room", label: "Kamar", placeholder: "Contoh: Kamar 102" },
          { key: "amount", label: "Nominal", placeholder: "Rp 0" },
          { key: "dueDate", label: "Jatuh Tempo", placeholder: "30 Mei 2026" },
          {
            key: "status",
            label: "Status",
            placeholder: "Pilih status",
            type: "select",
            options: ["Belum Dibayar", "Pending", "Lunas"],
          },
        ],
        initialRows: ownerBillRows,
        canCreate: true,
        canEdit: true,
        canDelete: false,
      },
    ],
  },
  penyewa: {
    key: "penyewa",
    label: "Penyewa",
    title: "Dashboard",
    subtitle:
      "Lihat kamar, tagihan, pembayaran, dan laporan kendala milik sendiri.",
    userName: "Nadia Putri",
    userRole: "penyewa kost",
    menus: [
      { label: "Dashboard", icon: Home },
      { label: "Kamar Saya", icon: BedDouble },
      { label: "Tagihan", icon: ReceiptText },
      { label: "Pembayaran", icon: Upload },
      { label: "Riwayat", icon: CreditCard },
      { label: "Laporan", icon: Wrench },
      { label: "Settings", icon: Settings },
    ],
    stats: [
      { label: "Kamar Saya", value: "102", tone: "red", icon: BedDouble },
      { label: "Tagihan Aktif", value: "1", tone: "orange", icon: ReceiptText },
      {
        label: "Pembayaran Pending",
        value: "0",
        tone: "green",
        icon: CreditCard,
      },
      { label: "Laporan Aktif", value: "1", tone: "red", icon: Wrench },
    ],
    statusTitle: "Rental Status",
    statusItems: [
      { label: "Kamar 102", value: "Aktif", tone: "success" },
      { label: "Tagihan April", value: "Belum Dibayar", tone: "danger" },
      { label: "Laporan AC", value: "Diproses", tone: "info" },
    ],
    quickStats: [
      { label: "Days Until Due", value: "5d", tone: "red" },
      { label: "Total Bill", value: "1.2jt", tone: "orange" },
      { label: "Paid History", value: "8x", tone: "green" },
    ],
    resources: [
      {
        key: "tenant-bills",
        menuLabel: "Tagihan",
        title: "Tagihan Saya",
        description: "Penyewa hanya melihat tagihan miliknya sendiri.",
        actionLabel: "Upload Bukti",
        columns: [
          { key: "period", label: "Periode" },
          { key: "room", label: "Kamar" },
          { key: "amount", label: "Nominal" },
          { key: "dueDate", label: "Jatuh Tempo" },
          { key: "status", label: "Status" },
        ],
        fields: [
          { key: "period", label: "Periode", placeholder: "April 2026" },
          { key: "room", label: "Kamar", placeholder: "Kamar 102" },
          { key: "amount", label: "Nominal", placeholder: "Rp 0" },
          { key: "dueDate", label: "Jatuh Tempo", placeholder: "30 Apr 2026" },
          {
            key: "status",
            label: "Status",
            placeholder: "Pilih status",
            type: "select",
            options: ["Belum Dibayar", "Pending", "Lunas"],
          },
        ],
        initialRows: tenantBillRows,
        canCreate: false,
        canEdit: false,
        canDelete: false,
      },
      {
        key: "tenant-reports",
        menuLabel: "Laporan",
        title: "Laporan Kendala Saya",
        description:
          "Penyewa dapat membuat laporan kendala dan melihat status penanganannya.",
        actionLabel: "Buat Laporan",
        columns: [
          { key: "type", label: "Jenis" },
          { key: "date", label: "Tanggal" },
          { key: "description", label: "Deskripsi" },
          { key: "status", label: "Status" },
        ],
        fields: [
          { key: "type", label: "Jenis Kendala", placeholder: "Contoh: AC" },
          { key: "date", label: "Tanggal", placeholder: "25 Apr 2026" },
          {
            key: "description",
            label: "Deskripsi",
            placeholder: "Jelaskan kendala",
            type: "textarea",
          },
          {
            key: "status",
            label: "Status",
            placeholder: "Pilih status",
            type: "select",
            options: ["Pending", "Diproses", "Selesai"],
          },
        ],
        initialRows: tenantReportRows,
        canCreate: true,
        canEdit: false,
        canDelete: false,
      },
    ],
  },
};

const isRoleKey = (value: string | undefined): value is RoleKey =>
  value === "admin" || value === "pemilik" || value === "penyewa";

const cloneRows = (rows: Record<string, string>[]) =>
  rows.map((row) => ({ ...row }));

const createInitialRows = (config: RoleConfig): ResourceRows =>
  config.resources.reduce((rows, resource) => {
    rows[resource.key] = cloneRows(resource.initialRows);
    return rows;
  }, {} as ResourceRows);

const getStoredTheme = (): ThemeMode => {
  if (typeof document === "undefined") {
    return "dark";
  }

  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
};

const applyTheme = (mode: ThemeMode) => {
  document.documentElement.dataset.theme = mode;

  try {
    localStorage.setItem("simako-theme", mode);
  } catch {
    // Theme remains active for this session.
  }
};

const statTextClass = (tone: Tone) => {
  switch (tone) {
    case "green":
      return "text-emerald-400";
    case "orange":
      return "text-orange-400";
    case "blue":
      return "text-sky-400";
    default:
      return "text-red-400";
  }
};

const statIconClass = (tone: Tone) => {
  switch (tone) {
    case "green":
      return "border-emerald-400/20 bg-emerald-500/10 text-emerald-400";
    case "orange":
      return "border-orange-400/20 bg-orange-500/10 text-orange-400";
    case "blue":
      return "border-sky-400/20 bg-sky-500/10 text-sky-400";
    default:
      return "border-red-400/20 bg-red-500/10 text-red-400";
  }
};

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

const statusTone = (value: string): BadgeTone => {
  const status = value.toLowerCase();

  if (status.includes("belum") || status.includes("nonaktif")) {
    return "danger";
  }

  if (status.includes("pending")) {
    return "warning";
  }

  if (status.includes("diproses") || status.includes("berpenghuni")) {
    return "info";
  }

  if (
    status.includes("aktif") ||
    status.includes("lunas") ||
    status.includes("selesai") ||
    status.includes("tersedia") ||
    status.includes("operational")
  ) {
    return "success";
  }

  return "neutral";
};

function StatusBadge(props: { value: string; tone?: BadgeTone }) {
  const tone = () => props.tone ?? statusTone(props.value);

  return (
    <span
      class={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${badgeToneClass(tone())}`}
    >
      {props.value}
    </span>
  );
}

function rowMatches(row: Record<string, string>, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return Object.values(row).some((value) =>
    value.toLowerCase().includes(normalizedQuery),
  );
}

export default function RoleDashboardPage() {
  const navigate = useNavigate();
  const params = useParams();

  if (params.role === "admin") {
    return <Navigate href="/admin/dashboard" />;
  }

  if (params.role === "pemilik") {
    return <Navigate href="/pemilik/dashboard" />;
  }

  const config = createMemo(() =>
    isRoleKey(params.role) ? roleConfigs[params.role] : roleConfigs.pemilik,
  );
  const [activeMenu, setActiveMenu] = createSignal("Dashboard");
  const [sidebarOpen, setSidebarOpen] = createSignal(false);
  const [theme, setTheme] = createSignal<ThemeMode>("dark");
  const [sessionRole, setSessionRole] = createSignal<RoleKey | null>(null);
  const [rows, setRows] = createSignal<ResourceRows>(
    createInitialRows(roleConfigs.pemilik),
  );
  const [query, setQuery] = createSignal("");
  const [modalOpen, setModalOpen] = createSignal(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = createSignal(false);
  const [editingIndex, setEditingIndex] = createSignal<number | null>(null);
  const [deleteTarget, setDeleteTarget] = createSignal<{
    resourceKey: string;
    resourceTitle: string;
    index: number;
    label: string;
  } | null>(null);
  const [draft, setDraft] = createSignal<Record<string, string>>({});

  createEffect(() => {
    const nextConfig = config();
    setActiveMenu("Dashboard");
    setRows(createInitialRows(nextConfig));
    setQuery("");
    setModalOpen(false);
    setEditingIndex(null);
    setDraft({});
    setSidebarOpen(false);
  });

  onMount(() => {
    const savedRole = localStorage.getItem("simako-session-role");

    if (!isRoleKey(savedRole ?? undefined)) {
      navigate("/login", { replace: true });
      return;
    }

    const authorizedRole = savedRole as RoleKey;
    setSessionRole(authorizedRole);

    if (authorizedRole !== config().key) {
      navigate(`/dashboard/${authorizedRole}`, { replace: true });
    }

    const savedTheme = localStorage.getItem("simako-theme");
    const initialTheme =
      savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : getStoredTheme();
    setTheme(initialTheme);
    applyTheme(initialTheme);
  });

  createEffect(() => {
    const role = sessionRole();

    if (role && role !== config().key) {
      navigate(`/dashboard/${role}`, { replace: true });
    }
  });

  const activeResource = createMemo(() =>
    config().resources.find((resource) => resource.menuLabel === activeMenu()),
  );

  const activeRows = createMemo(() => {
    const resource = activeResource();
    return resource ? (rows()[resource.key] ?? []) : [];
  });

  const filteredRows = createMemo(() =>
    activeRows().filter((row) => rowMatches(row, query())),
  );

  const openCreate = () => {
    const resource = activeResource();

    if (!resource || !resource.canCreate) {
      return;
    }

    setEditingIndex(null);
    setDraft(
      resource.fields.reduce(
        (value, field) => ({ ...value, [field.key]: "" }),
        {},
      ),
    );
    setModalOpen(true);
  };

  const openEdit = (row: Record<string, string>, index: number) => {
    const resource = activeResource();

    if (!resource || !resource.canEdit) {
      return;
    }

    setEditingIndex(index);
    setDraft(
      resource.fields.reduce(
        (value, field) => ({ ...value, [field.key]: row[field.key] ?? "" }),
        {},
      ),
    );
    setModalOpen(true);
  };

  const saveDraft = () => {
    const resource = activeResource();

    if (!resource) {
      return;
    }

    const nextRow = resource.fields.reduce(
      (value, field) => ({
        ...value,
        [field.key]: draft()[field.key]?.trim() ?? "",
      }),
      {},
    );
    const currentRows = activeRows();
    const nextRows =
      editingIndex() === null
        ? [nextRow, ...currentRows]
        : currentRows.map((row, index) =>
            index === editingIndex() ? nextRow : row,
          );

    setRows((current) => ({ ...current, [resource.key]: nextRows }));
    setModalOpen(false);
    setEditingIndex(null);
    setDraft({});
  };

  const requestDeleteRow = (row: Record<string, string>, index: number) => {
    const resource = activeResource();

    if (!resource || !resource.canDelete) {
      return;
    }

    setDeleteTarget({
      resourceKey: resource.key,
      resourceTitle: resource.title,
      index,
      label: Object.values(row).find(Boolean) ?? "data ini",
    });
  };

  const confirmDeleteRow = () => {
    const target = deleteTarget();

    if (!target) {
      return;
    }

    setRows((current) => ({
      ...current,
      [target.resourceKey]: (current[target.resourceKey] ?? []).filter((_, rowIndex) => rowIndex !== target.index),
    }));
    setDeleteTarget(null);
  };

  const switchMenu = (label: string) => {
    setActiveMenu(label);
    setQuery("");
    setSidebarOpen(false);
    setModalOpen(false);
    setDeleteTarget(null);
    setDraft({});
    setEditingIndex(null);
  };

  const toggleTheme = () => {
    const nextTheme = theme() === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const confirmLogout = () => {
    try {
      localStorage.removeItem("simako-session-role");
    } catch {
      // Session redirect still proceeds even if storage cleanup fails.
    }

    navigate("/login", { replace: true });
  };

  return (
    <main class="min-h-screen bg-[rgb(var(--background-rgb))]">
      <div>
        {sidebarOpen() && (
          <button
            type="button"
            class="fixed inset-0 z-30 bg-slate-950/70 lg:hidden"
            aria-label="Tutup sidebar"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          class={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-[var(--surface-border)] bg-[var(--header-bg)] transition-transform lg:translate-x-0 ${
            sidebarOpen() ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div class="flex h-[78px] items-center gap-3 border-b border-[var(--divider)] px-5">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white">
              <Building2 size={20} />
            </div>
            <div>
              <A href="/" class="ui-heading text-lg font-bold">
                SIMAKO
              </A>
              <p class="dashboard-muted text-xs">{config().label} Panel</p>
            </div>
          </div>

          <nav class="flex-1 space-y-2 overflow-y-auto px-4 py-4">
            {config().menus.map((item) => {
              const Icon = item.icon;
              const active = activeMenu() === item.label;

              return (
                <button
                  type="button"
                  class={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-bold transition ${
                    active
                      ? "bg-red-500/12 text-red-400"
                      : "text-[rgb(var(--text-body-rgb))] hover:bg-[var(--nav-hover)] hover:text-[rgb(var(--text-strong-rgb))]"
                  }`}
                  onClick={() => switchMenu(item.label)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div class="border-t border-[var(--divider)] p-4">
            <div class="flex items-center justify-between rounded-lg bg-[var(--control-bg)] p-3">
              <div class="flex items-center gap-3">
                <div class="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
                  {config().userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p class="ui-heading text-sm font-bold">
                    {config().userName}
                  </p>
                  <p class="dashboard-muted text-xs">{config().userRole}</p>
                </div>
              </div>
              <button
                type="button"
                class="icon-button h-8 w-8"
                aria-label="Ganti tema"
                onClick={toggleTheme}
              >
                {theme() === "dark" ? <Moon size={16} /> : <Sun size={16} />}
              </button>
            </div>
            <button
              type="button"
              class="mt-4 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-bold text-red-400 hover:bg-red-500/10"
              onClick={() => setLogoutConfirmOpen(true)}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        <section class="lg:pl-[260px]">
          <div class="sticky top-0 z-20 flex h-[70px] items-center justify-between border-b border-[var(--divider)] bg-[var(--header-bg)] px-5 lg:hidden">
            <button
              type="button"
              class="icon-button h-10 w-10"
              aria-label="Buka menu dashboard"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <A href="/" class="flex items-center gap-3">
              <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white">
                <Building2 size={18} />
              </span>
              <span>
                <span class="ui-heading block text-sm font-bold">SIMAKO</span>
                <span class="dashboard-muted block text-xs">{config().label} Panel</span>
              </span>
            </A>
            <button type="button" class="icon-button h-10 w-10" aria-label="Ganti tema" onClick={toggleTheme}>
              {theme() === "dark" ? <Moon size={17} /> : <Sun size={17} />}
            </button>
          </div>

          <div class="mx-auto max-w-[1220px] px-5 py-6 md:px-8 lg:py-8">
            <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 class="ui-heading text-3xl font-bold md:text-4xl">
                  {activeResource()?.title ?? config().title}
                </h1>
                <p class="dashboard-muted mt-3 text-sm">
                  {activeResource()?.description ?? config().subtitle}
                </p>
              </div>
              <div class="hidden rounded-lg border border-[var(--control-border)] bg-[var(--control-bg)] px-3 py-2 text-xs font-bold text-[rgb(var(--text-body-rgb))] md:block">
                Role: <span class="text-red-400">{config().label}</span>
              </div>
            </div>

            {activeResource() ? (
              <section class="dashboard-card overflow-hidden">
                <div class="flex flex-col gap-4 border-b border-[var(--divider)] p-5 md:flex-row md:items-center md:justify-between">
                  <div class="input-with-icon w-full md:max-w-sm">
                    <Search class="input-icon" size={16} />
                    <input
                      class="form-control form-control-icon"
                      value={query()}
                      placeholder="Cari data"
                      onInput={(event) => setQuery(event.currentTarget.value)}
                    />
                  </div>
                  {activeResource()?.canCreate && (
                    <button
                      type="button"
                      class="btn-primary px-4 py-2 text-sm"
                      onClick={openCreate}
                    >
                      <Plus size={16} />
                      {activeResource()?.actionLabel}
                    </button>
                  )}
                </div>
                <div class="overflow-x-auto">
                  <table class="w-full min-w-[760px] text-left text-sm">
                    <thead class="bg-[rgba(148,163,184,0.08)] text-xs uppercase text-[rgb(var(--text-muted-rgb))]">
                      <tr>
                        {activeResource()?.columns.map((column) => (
                          <th class="px-5 py-3 font-bold">{column.label}</th>
                        ))}
                        <th class="px-5 py-3 text-right font-bold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRows().map((row) => {
                        const originalIndex = activeRows().indexOf(row);

                        return (
                          <tr class="border-t border-[var(--divider)]">
                            {activeResource()?.columns.map((column) => (
                              <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">
                                {column.key === "status" ||
                                column.key === "payment" ? (
                                  <StatusBadge value={row[column.key]} />
                                ) : (
                                  row[column.key]
                                )}
                              </td>
                            ))}
                            <td class="px-5 py-4">
                              <div class="flex justify-end gap-2">
                                {activeResource()?.canEdit && (
                                  <button
                                    type="button"
                                    class="icon-button h-8 w-8"
                                    aria-label="Edit data"
                                    onClick={() => openEdit(row, originalIndex)}
                                  >
                                    <Edit3 size={15} />
                                  </button>
                                )}
                                {activeResource()?.canDelete && (
                                  <button
                                    type="button"
                                    class="icon-button h-8 w-8 text-red-400"
                                    aria-label="Hapus data"
                                    onClick={() => requestDeleteRow(row, originalIndex)}
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                )}
                                {!activeResource()?.canEdit &&
                                  !activeResource()?.canDelete && (
                                    <span class="dashboard-muted text-xs font-bold">
                                      Read only
                                    </span>
                                  )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : config().key === "pemilik" ? (
              <OwnerDashboard />
            ) : (
              <>
                <section class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {config().stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                      <article class="dashboard-card min-h-[110px] p-5">
                        <div class="flex items-start justify-between gap-4">
                          <div>
                            <p class="dashboard-muted text-sm">{stat.label}</p>
                            <p
                              class={`mt-2 text-3xl font-bold ${statTextClass(stat.tone)}`}
                            >
                              {stat.value}
                            </p>
                          </div>
                          <div
                            class={`flex h-10 w-10 items-center justify-center rounded-xl border ${statIconClass(stat.tone)}`}
                          >
                            <Icon size={18} />
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </section>

                <section class="mt-8 grid gap-6 xl:grid-cols-2">
                  <div class="dashboard-card min-h-[390px] p-6">
                    <h2 class="ui-heading text-lg font-bold">
                      {config().statusTitle}
                    </h2>
                    <div class="mt-5 space-y-3">
                      {config().statusItems.map((item) => (
                        <div class="flex items-center justify-between gap-3 rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                          <div class="flex items-center gap-3">
                            <span class="h-3 w-3 rounded-full bg-emerald-500" />
                            <span class="ui-heading font-bold">
                              {item.label}
                            </span>
                          </div>
                          <StatusBadge value={item.value} tone={item.tone} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div class="dashboard-card min-h-[390px] p-6">
                    <h2 class="ui-heading text-lg font-bold">Quick Stats</h2>
                    <div class="mt-5 space-y-4">
                      {config().quickStats.map((item) => (
                        <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                          <p class="dashboard-muted text-sm">{item.label}</p>
                          <p
                            class={`mt-2 text-2xl font-bold ${statTextClass(item.tone)}`}
                          >
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </section>
      </div>

      {modalOpen() && activeResource() && (
        <div class="modal-backdrop-animate fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <section class="dashboard-card modal-panel-animate w-full max-w-2xl p-6">
            <div class="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 class="ui-heading text-2xl font-bold">
                  {editingIndex() === null
                    ? activeResource()?.actionLabel
                    : "Edit Data"}
                </h2>
                <p class="ui-muted mt-1 text-sm">
                  {activeResource()?.description}
                </p>
              </div>
              <button
                type="button"
                class="icon-button"
                aria-label="Tutup modal"
                onClick={() => setModalOpen(false)}
              >
                x
              </button>
            </div>
            <form
              class="grid gap-4 md:grid-cols-2"
              onSubmit={(event) => event.preventDefault()}
            >
              {activeResource()?.fields.map((field) => (
                <label
                  class={`block ${field.type === "textarea" ? "md:col-span-2" : ""}`}
                >
                  <span class="form-label">{field.label}</span>
                  {field.type === "textarea" ? (
                    <textarea
                      class="form-control mt-2 min-h-28 resize-y"
                      value={draft()[field.key] ?? ""}
                      placeholder={field.placeholder}
                      onInput={(event) =>
                        setDraft((current) => ({
                          ...current,
                          [field.key]: event.currentTarget.value,
                        }))
                      }
                    />
                  ) : field.type === "select" ? (
                    <select
                      class="form-control mt-2"
                      value={draft()[field.key] ?? ""}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          [field.key]: event.currentTarget.value,
                        }))
                      }
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options?.map((option) => (
                        <option>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      class="form-control mt-2"
                      type={field.type ?? "text"}
                      value={draft()[field.key] ?? ""}
                      placeholder={field.placeholder}
                      onInput={(event) =>
                        setDraft((current) => ({
                          ...current,
                          [field.key]: event.currentTarget.value,
                        }))
                      }
                    />
                  )}
                </label>
              ))}
              <div class="flex flex-col gap-3 md:col-span-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  class="btn-secondary px-5 py-3 text-sm"
                  onClick={() => setModalOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="button"
                  class="btn-primary px-5 py-3 text-sm"
                  onClick={saveDraft}
                >
                  <Database size={16} />
                  Simpan
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {deleteTarget() && (
        <ConfirmDialog
          title="Hapus Data?"
          message={`Data "${deleteTarget()?.label ?? ""}" dari ${deleteTarget()?.resourceTitle ?? "tabel"} akan dihapus.`}
          confirmLabel="Hapus Data"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDeleteRow}
        />
      )}

      {logoutConfirmOpen() && (
        <ConfirmDialog
          title="Logout Confirmation"
          message="Are you sure you want to logout? You will need to login again to access the dashboard panel."
          confirmLabel="Logout"
          cancelLabel="Cancel"
          tone="info"
          zIndexClass="z-[60]"
          onCancel={() => setLogoutConfirmOpen(false)}
          onConfirm={confirmLogout}
        />
      )}
    </main>
  );
}
