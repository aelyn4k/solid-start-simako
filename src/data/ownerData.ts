export type OwnerRoomStatus = "tersedia" | "berpenghuni";
export type OwnerBillStatus = "aktif" | "nonaktif";
export type OwnerKostType = "putra" | "putri" | "campur";

export interface OwnerRoom {
  id: number;
  owner_id: number;
  nama_kamar: string;
  spesifikasi_kamar: string;
  harga_perbulan: number;
  harga_persemester: number;
  harga_pertahun: number;
  foto_kamar: string[];
  deskripsi_kamar: string;
  jenis_kost: OwnerKostType;
  status_kost: OwnerRoomStatus;
  nama_penghuni: string;
  email_penghuni: string;
  created_at: string;
  updated_at: string;
}

export interface KostInfo {
  id: number;
  owner_id: number;
  alamat_kost: string;
  link_google_maps: string;
  created_at: string;
  updated_at: string;
}

export interface ContactInfo {
  id: number;
  owner_id: number;
  nama_pemilik: string;
  nomor_hp_pemilik: string;
  nomor_whatsapp_pemilik: string;
  email_pemilik: string;
  kontak_cadangan: string;
  created_at: string;
  updated_at: string;
}

export interface RoomBill {
  id: number;
  owner_id: number;
  room_id: number;
  nama_kamar: string;
  periode_tagihan: string;
  tanggal_tagihan: string;
  tanggal_jatuh_tempo: string;
  nominal_tagihan: number;
  status_tagihan: OwnerBillStatus;
  catatan: string;
  created_at: string;
  updated_at: string;
}

export interface KostRule {
  id: number;
  owner_id: number;
  judul_aturan: string;
  isi_aturan: string;
  status_aktif: boolean;
  created_at: string;
  updated_at: string;
}

export interface PublicFacility {
  id: number;
  owner_id: number;
  nama_fasilitas: string;
  deskripsi_fasilitas: string;
  status_aktif: boolean;
  created_at: string;
  updated_at: string;
}

export interface BankAccount {
  id: number;
  owner_id: number;
  nama_bank: string;
  nomor_rekening: string;
  nama_pemilik_rekening: string;
  catatan_pembayaran: string;
  status_aktif: boolean;
  created_at: string;
  updated_at: string;
}

export const ownerRooms: OwnerRoom[] = [
  {
    id: 101,
    owner_id: 2,
    nama_kamar: "Kamar 101",
    spesifikasi_kamar: "3 x 4 meter, kamar mandi dalam, meja belajar, lemari",
    harga_perbulan: 1500000,
    harga_persemester: 9000000,
    harga_pertahun: 17000000,
    foto_kamar: ["https://images.unsplash.com/photo-1585672799395-3953a8364a32?q=80&w=1200&auto=format&fit=crop"],
    deskripsi_kamar: "Kamar premium dengan pencahayaan nyaman dan akses dekat ke area parkir.",
    jenis_kost: "putri",
    status_kost: "tersedia",
    nama_penghuni: "",
    email_penghuni: "",
    created_at: "2026-05-03T09:30:00+07:00",
    updated_at: "2026-05-03T09:30:00+07:00",
  },
  {
    id: 102,
    owner_id: 2,
    nama_kamar: "Kamar 102",
    spesifikasi_kamar: "3 x 3 meter, kamar mandi luar, kipas angin, lemari",
    harga_perbulan: 1200000,
    harga_persemester: 7200000,
    harga_pertahun: 13800000,
    foto_kamar: ["https://images.unsplash.com/photo-1595526114035-0d45ed16433d?q=80&w=1200&auto=format&fit=crop"],
    deskripsi_kamar: "Kamar reguler yang efisien untuk penghuni aktif dengan akses fasilitas bersama.",
    jenis_kost: "putri",
    status_kost: "berpenghuni",
    nama_penghuni: "Nadia Putri",
    email_penghuni: "nadia@mail.com",
    created_at: "2026-05-02T10:10:00+07:00",
    updated_at: "2026-05-02T10:10:00+07:00",
  },
  {
    id: 103,
    owner_id: 2,
    nama_kamar: "Kamar 103",
    spesifikasi_kamar: "3 x 3.5 meter, ventilasi besar, meja belajar, Wi-Fi",
    harga_perbulan: 1350000,
    harga_persemester: 8100000,
    harga_pertahun: 15600000,
    foto_kamar: [],
    deskripsi_kamar: "Kamar dengan ventilasi baik dan koneksi Wi-Fi untuk kebutuhan belajar.",
    jenis_kost: "putri",
    status_kost: "berpenghuni",
    nama_penghuni: "Raka Pratama",
    email_penghuni: "raka@mail.com",
    created_at: "2026-04-28T08:45:00+07:00",
    updated_at: "2026-04-28T08:45:00+07:00",
  },
  {
    id: 104,
    owner_id: 2,
    nama_kamar: "Kamar 104",
    spesifikasi_kamar: "3.5 x 4 meter, kamar mandi dalam, AC, meja belajar",
    harga_perbulan: 1600000,
    harga_persemester: 9600000,
    harga_pertahun: 18400000,
    foto_kamar: ["https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?q=80&w=1200&auto=format&fit=crop"],
    deskripsi_kamar: "Kamar luas dengan fasilitas lengkap untuk penghuni jangka panjang.",
    jenis_kost: "campur",
    status_kost: "tersedia",
    nama_penghuni: "",
    email_penghuni: "",
    created_at: "2026-04-20T13:20:00+07:00",
    updated_at: "2026-04-20T13:20:00+07:00",
  },
  {
    id: 201,
    owner_id: 3,
    nama_kamar: "Kamar A1",
    spesifikasi_kamar: "3.2 x 4 meter, kamar mandi dalam, Wi-Fi, lemari",
    harga_perbulan: 1700000,
    harga_persemester: 10200000,
    harga_pertahun: 19600000,
    foto_kamar: ["https://images.unsplash.com/photo-1560185893-a5536c80e64d?q=80&w=1200&auto=format&fit=crop"],
    deskripsi_kamar: "Kamar premium milik Kost Anggrek dengan suasana privat.",
    jenis_kost: "putra",
    status_kost: "berpenghuni",
    nama_penghuni: "Bima Saputra",
    email_penghuni: "bima@mail.com",
    created_at: "2026-04-21T11:00:00+07:00",
    updated_at: "2026-04-21T11:00:00+07:00",
  },
  {
    id: 202,
    owner_id: 3,
    nama_kamar: "Kamar A2",
    spesifikasi_kamar: "3 x 3 meter, kamar mandi luar, kipas angin",
    harga_perbulan: 1250000,
    harga_persemester: 7500000,
    harga_pertahun: 14500000,
    foto_kamar: [],
    deskripsi_kamar: "Kamar reguler dengan harga terjangkau dan akses dekat dapur bersama.",
    jenis_kost: "putra",
    status_kost: "tersedia",
    nama_penghuni: "",
    email_penghuni: "",
    created_at: "2026-05-01T11:00:00+07:00",
    updated_at: "2026-05-01T11:00:00+07:00",
  },
];

export const kostInfo: KostInfo[] = [
  {
    id: 1,
    owner_id: 2,
    alamat_kost: "Jl. D.I. Panjaitan No.128, Purwokerto Selatan, Banyumas",
    link_google_maps: "https://maps.google.com/?q=Telkom+University+Purwokerto",
    created_at: "2026-05-01T09:00:00+07:00",
    updated_at: "2026-05-01T09:00:00+07:00",
  },
  {
    id: 2,
    owner_id: 3,
    alamat_kost: "Jl. Kampus No.20, Purwokerto Selatan, Banyumas",
    link_google_maps: "https://maps.google.com/?q=Purwokerto+Selatan",
    created_at: "2026-05-01T09:20:00+07:00",
    updated_at: "2026-05-01T09:20:00+07:00",
  },
];

export const contactInfo: ContactInfo[] = [
  {
    id: 1,
    owner_id: 2,
    nama_pemilik: "Siti Aminah",
    nomor_hp_pemilik: "0812 3456 7890",
    nomor_whatsapp_pemilik: "0812 3456 7890",
    email_pemilik: "siti@simako.id",
    kontak_cadangan: "Pak Budi - 0813 1111 2222",
    created_at: "2026-05-01T09:10:00+07:00",
    updated_at: "2026-05-01T09:10:00+07:00",
  },
  {
    id: 2,
    owner_id: 3,
    nama_pemilik: "Rudi Hartono",
    nomor_hp_pemilik: "0821 4455 7788",
    nomor_whatsapp_pemilik: "0821 4455 7788",
    email_pemilik: "rudi@simako.id",
    kontak_cadangan: "",
    created_at: "2026-05-01T09:25:00+07:00",
    updated_at: "2026-05-01T09:25:00+07:00",
  },
];

export const roomBills: RoomBill[] = [
  {
    id: 301,
    owner_id: 2,
    room_id: 102,
    nama_kamar: "Kamar 102",
    periode_tagihan: "Mei 2026",
    tanggal_tagihan: "2026-05-01",
    tanggal_jatuh_tempo: "2026-05-10",
    nominal_tagihan: 1200000,
    status_tagihan: "aktif",
    catatan: "Tagihan otomatis setelah masa sewa berakhir.",
    created_at: "2026-05-01T08:00:00+07:00",
    updated_at: "2026-05-01T08:00:00+07:00",
  },
  {
    id: 302,
    owner_id: 2,
    room_id: 103,
    nama_kamar: "Kamar 103",
    periode_tagihan: "Mei 2026",
    tanggal_tagihan: "2026-05-01",
    tanggal_jatuh_tempo: "2026-05-09",
    nominal_tagihan: 1350000,
    status_tagihan: "aktif",
    catatan: "Notifikasi akan dikirim ke akun penyewa.",
    created_at: "2026-05-01T08:10:00+07:00",
    updated_at: "2026-05-01T08:10:00+07:00",
  },
  {
    id: 303,
    owner_id: 2,
    room_id: 104,
    nama_kamar: "Kamar 104",
    periode_tagihan: "Juni 2026",
    tanggal_tagihan: "2026-06-01",
    tanggal_jatuh_tempo: "2026-06-10",
    nominal_tagihan: 1600000,
    status_tagihan: "nonaktif",
    catatan: "Kamar tersedia, tagihan belum aktif.",
    created_at: "2026-05-02T09:00:00+07:00",
    updated_at: "2026-05-02T09:00:00+07:00",
  },
  {
    id: 304,
    owner_id: 3,
    room_id: 201,
    nama_kamar: "Kamar A1",
    periode_tagihan: "Mei 2026",
    tanggal_tagihan: "2026-05-01",
    tanggal_jatuh_tempo: "2026-05-10",
    nominal_tagihan: 1700000,
    status_tagihan: "aktif",
    catatan: "",
    created_at: "2026-05-01T08:20:00+07:00",
    updated_at: "2026-05-01T08:20:00+07:00",
  },
];

export const rules: KostRule[] = [
  {
    id: 401,
    owner_id: 2,
    judul_aturan: "Jam Tamu",
    isi_aturan: "Jam tamu hanya diperbolehkan sampai 21.00 WIB.",
    status_aktif: true,
    created_at: "2026-05-01T09:00:00+07:00",
    updated_at: "2026-05-01T09:00:00+07:00",
  },
  {
    id: 402,
    owner_id: 2,
    judul_aturan: "Hewan Peliharaan",
    isi_aturan: "Penyewa tidak diperbolehkan membawa hewan peliharaan ke area kost.",
    status_aktif: true,
    created_at: "2026-05-01T09:10:00+07:00",
    updated_at: "2026-05-01T09:10:00+07:00",
  },
  {
    id: 403,
    owner_id: 2,
    judul_aturan: "Pembayaran",
    isi_aturan: "Pembayaran sewa wajib dilakukan sebelum tanggal 10 setiap periode tagihan.",
    status_aktif: true,
    created_at: "2026-05-01T09:20:00+07:00",
    updated_at: "2026-05-01T09:20:00+07:00",
  },
  {
    id: 404,
    owner_id: 2,
    judul_aturan: "Area Bebas Rokok",
    isi_aturan: "Merokok tidak diperbolehkan di dalam kamar dan koridor kost.",
    status_aktif: false,
    created_at: "2026-05-01T09:30:00+07:00",
    updated_at: "2026-05-01T09:30:00+07:00",
  },
  {
    id: 405,
    owner_id: 3,
    judul_aturan: "Kebersihan Bersama",
    isi_aturan: "Penyewa wajib menjaga kebersihan dapur, kamar mandi, dan area bersama.",
    status_aktif: true,
    created_at: "2026-05-01T09:40:00+07:00",
    updated_at: "2026-05-01T09:40:00+07:00",
  },
];

export const facilities: PublicFacility[] = [
  {
    id: 501,
    owner_id: 2,
    nama_fasilitas: "Wi-Fi",
    deskripsi_fasilitas: "Akses internet untuk penghuni di area kamar dan ruang bersama.",
    status_aktif: true,
    created_at: "2026-05-01T10:00:00+07:00",
    updated_at: "2026-05-01T10:00:00+07:00",
  },
  {
    id: 502,
    owner_id: 2,
    nama_fasilitas: "Dapur Bersama",
    deskripsi_fasilitas: "Dapur bersama dengan kompor, wastafel, dan area penyimpanan sederhana.",
    status_aktif: true,
    created_at: "2026-05-01T10:10:00+07:00",
    updated_at: "2026-05-01T10:10:00+07:00",
  },
  {
    id: 503,
    owner_id: 2,
    nama_fasilitas: "Area Parkir",
    deskripsi_fasilitas: "Area parkir motor untuk penghuni kost.",
    status_aktif: true,
    created_at: "2026-05-01T10:20:00+07:00",
    updated_at: "2026-05-01T10:20:00+07:00",
  },
  {
    id: 504,
    owner_id: 2,
    nama_fasilitas: "CCTV",
    deskripsi_fasilitas: "Pemantauan area pintu masuk dan area bersama selama 24 jam.",
    status_aktif: true,
    created_at: "2026-05-01T10:30:00+07:00",
    updated_at: "2026-05-01T10:30:00+07:00",
  },
  {
    id: 505,
    owner_id: 3,
    nama_fasilitas: "Laundry",
    deskripsi_fasilitas: "Layanan laundry mitra untuk penghuni kost.",
    status_aktif: true,
    created_at: "2026-05-01T10:40:00+07:00",
    updated_at: "2026-05-01T10:40:00+07:00",
  },
];

export const bankAccounts: BankAccount[] = [
  {
    id: 601,
    owner_id: 2,
    nama_bank: "BCA",
    nomor_rekening: "1234567890",
    nama_pemilik_rekening: "Siti Aminah",
    catatan_pembayaran: "Cantumkan nama dan nomor kamar pada berita transfer.",
    status_aktif: true,
    created_at: "2026-05-01T11:00:00+07:00",
    updated_at: "2026-05-01T11:00:00+07:00",
  },
  {
    id: 602,
    owner_id: 2,
    nama_bank: "BRI",
    nomor_rekening: "9876543210",
    nama_pemilik_rekening: "Siti Aminah",
    catatan_pembayaran: "Kirim bukti transfer melalui WhatsApp pemilik kost.",
    status_aktif: true,
    created_at: "2026-05-01T11:10:00+07:00",
    updated_at: "2026-05-01T11:10:00+07:00",
  },
  {
    id: 603,
    owner_id: 3,
    nama_bank: "Mandiri",
    nomor_rekening: "1122334455",
    nama_pemilik_rekening: "Rudi Hartono",
    catatan_pembayaran: "Pembayaran diverifikasi maksimal 1x24 jam.",
    status_aktif: true,
    created_at: "2026-05-01T11:20:00+07:00",
    updated_at: "2026-05-01T11:20:00+07:00",
  },
];
