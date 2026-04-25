export type RoomStatus = "Tersedia" | "Terisi";

export type RoomFacilityKey =
  | "wifi"
  | "tv"
  | "privateBath"
  | "sharedBath"
  | "fan"
  | "airflow"
  | "wardrobe"
  | "desk"
  | "security"
  | "electricity";

export interface Room {
  id: number;
  name: string;
  type: string;
  price: string;
  status: RoomStatus;
  image: string;
  gallery: string[];
  facilities: RoomFacilityKey[];
  area: string;
  floor: string;
  capacity: string;
  bathroom: string;
  electricity: string;
  description: string;
  highlights: string[];
  rules: string[];
}

export const facilityLabels: Record<RoomFacilityKey, string> = {
  wifi: "Wi-Fi Cepat",
  tv: "TV",
  privateBath: "KM Dalam",
  sharedBath: "KM Luar",
  fan: "Kipas Angin",
  airflow: "Sirkulasi Udara",
  wardrobe: "Lemari",
  desk: "Meja Belajar",
  security: "Keamanan 24 Jam",
  electricity: "Listrik Termasuk"
};

export const rooms: Room[] = [
  {
    id: 1,
    name: "Kamar 101 - Tipe Premium",
    type: "Premium",
    price: "Rp 1.500.000 / bulan",
    status: "Tersedia",
    image:
      "https://images.unsplash.com/photo-1585672799395-3953a8364a32?q=80&w=2070&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1585672799395-3953a8364a32?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?q=80&w=2069&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2070&auto=format&fit=crop"
    ],
    facilities: ["wifi", "tv", "privateBath", "wardrobe", "desk", "security", "electricity"],
    area: "3 x 4 meter",
    floor: "Lantai 1",
    capacity: "1 orang",
    bathroom: "Kamar mandi dalam",
    electricity: "Termasuk biaya bulanan",
    description:
      "Kamar premium dengan tata ruang rapi, pencahayaan nyaman, dan akses cepat ke area parkir serta ruang bersama.",
    highlights: ["Dekat area depan", "Cocok untuk mahasiswa aktif", "Siap huni setelah verifikasi"],
    rules: ["Maksimal 1 penghuni", "Tamu wajib lapor pengelola", "Pembayaran dilakukan sebelum tanggal 10"]
  },
  {
    id: 2,
    name: "Kamar 102 - Tipe Reguler",
    type: "Reguler",
    price: "Rp 1.200.000 / bulan",
    status: "Terisi",
    image:
      "https://images.unsplash.com/photo-1595526114035-0d45ed16433d?q=80&w=2070&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16433d?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595526114035-b9f6efdd3b90?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"
    ],
    facilities: ["fan", "sharedBath", "wardrobe", "desk", "security"],
    area: "3 x 3 meter",
    floor: "Lantai 1",
    capacity: "1 orang",
    bathroom: "Kamar mandi luar",
    electricity: "Token pribadi",
    description:
      "Kamar reguler yang efisien untuk penghuni yang membutuhkan ruang istirahat tenang dengan akses fasilitas bersama.",
    highlights: ["Area paling mudah dijangkau", "Biaya bulanan ekonomis", "Dekat dapur bersama"],
    rules: ["Jaga kebersihan area bersama", "Jam tamu sampai 21.00 WIB", "Tidak membawa hewan peliharaan"]
  },
  {
    id: 3,
    name: "Kamar 201 - Tipe Premium",
    type: "Premium",
    price: "Rp 1.600.000 / bulan",
    status: "Tersedia",
    image:
      "https://images.unsplash.com/photo-1560185893-a5536c80e64d?q=80&w=1974&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1560185893-a5536c80e64d?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=2080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=2070&auto=format&fit=crop"
    ],
    facilities: ["wifi", "tv", "privateBath", "airflow", "wardrobe", "desk", "electricity"],
    area: "3.2 x 4 meter",
    floor: "Lantai 2",
    capacity: "1 orang",
    bathroom: "Kamar mandi dalam",
    electricity: "Termasuk biaya bulanan",
    description:
      "Kamar lantai dua dengan suasana lebih privat, ventilasi baik, dan fasilitas lengkap untuk belajar maupun bekerja.",
    highlights: ["Pemandangan lebih terbuka", "Area lebih privat", "Fasilitas belajar lengkap"],
    rules: ["Maksimal 1 penghuni", "Tidak merokok di dalam kamar", "Tidak mengubah instalasi listrik"]
  },
  {
    id: 4,
    name: "Kamar 202 - Tipe Reguler",
    type: "Reguler",
    price: "Rp 1.250.000 / bulan",
    status: "Tersedia",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2070&auto=format&fit=crop"
    ],
    facilities: ["airflow", "sharedBath", "fan", "wardrobe", "desk", "security"],
    area: "3 x 3.5 meter",
    floor: "Lantai 2",
    capacity: "1 orang",
    bathroom: "Kamar mandi luar",
    electricity: "Token pribadi",
    description:
      "Kamar reguler dengan ventilasi nyaman dan akses cepat ke area jemur, cocok untuk penghuni yang aktif di kampus.",
    highlights: ["Sirkulasi udara baik", "Dekat area jemur", "Harga stabil untuk sewa bulanan"],
    rules: ["Jaga ketenangan setelah 22.00 WIB", "Tamu wajib lapor", "Pembayaran sebelum tanggal 10"]
  },
  {
    id: 5,
    name: "Kamar 203 - Tipe Premium",
    type: "Premium",
    price: "Rp 1.650.000 / bulan",
    status: "Tersedia",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2072&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2072&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2127&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2074&auto=format&fit=crop"
    ],
    facilities: ["wifi", "privateBath", "airflow", "wardrobe", "desk", "security", "electricity"],
    area: "3.5 x 4 meter",
    floor: "Lantai 2",
    capacity: "1 orang",
    bathroom: "Kamar mandi dalam",
    electricity: "Termasuk biaya bulanan",
    description:
      "Kamar premium dengan area lebih lega, meja belajar nyaman, dan pencahayaan natural untuk aktivitas harian.",
    highlights: ["Area kamar lebih luas", "Pencahayaan natural", "Dekat balkon bersama"],
    rules: ["Maksimal 1 penghuni", "Tidak merokok di kamar", "Pembayaran sebelum tanggal 10"]
  },
  {
    id: 6,
    name: "Kamar 301 - Tipe Reguler",
    type: "Reguler",
    price: "Rp 1.300.000 / bulan",
    status: "Tersedia",
    image:
      "https://images.unsplash.com/photo-1560448075-bb485b067938?q=80&w=2070&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1560448075-bb485b067938?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=2070&auto=format&fit=crop"
    ],
    facilities: ["fan", "sharedBath", "wardrobe", "desk", "security"],
    area: "3 x 3 meter",
    floor: "Lantai 3",
    capacity: "1 orang",
    bathroom: "Kamar mandi luar",
    electricity: "Token pribadi",
    description:
      "Kamar reguler di lantai atas dengan suasana lebih tenang dan akses mudah ke area cuci serta jemur.",
    highlights: ["Area lebih tenang", "Dekat ruang cuci", "Harga ekonomis"],
    rules: ["Jaga kebersihan area bersama", "Tidak membuat bising setelah 22.00 WIB", "Tamu wajib lapor"]
  },
  {
    id: 7,
    name: "Kamar 302 - Tipe Premium",
    type: "Premium",
    price: "Rp 1.700.000 / bulan",
    status: "Terisi",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2070&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2080&auto=format&fit=crop"
    ],
    facilities: ["wifi", "tv", "privateBath", "wardrobe", "desk", "security", "electricity"],
    area: "3.5 x 4 meter",
    floor: "Lantai 3",
    capacity: "1 orang",
    bathroom: "Kamar mandi dalam",
    electricity: "Termasuk biaya bulanan",
    description:
      "Kamar premium lantai atas dengan fasilitas lengkap dan atmosfer privat untuk penghuni yang butuh fokus.",
    highlights: ["Privasi lebih tinggi", "Fasilitas lengkap", "Cocok untuk kerja remote"],
    rules: ["Maksimal 1 penghuni", "Tidak mengubah tata letak besar", "Pembayaran sebelum tanggal 10"]
  },
  {
    id: 8,
    name: "Kamar 303 - Tipe Reguler",
    type: "Reguler",
    price: "Rp 1.350.000 / bulan",
    status: "Tersedia",
    image:
      "https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?q=80&w=2070&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560185008-b033106af5c3?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop"
    ],
    facilities: ["airflow", "sharedBath", "fan", "wardrobe", "desk", "security"],
    area: "3 x 3.5 meter",
    floor: "Lantai 3",
    capacity: "1 orang",
    bathroom: "Kamar mandi luar",
    electricity: "Token pribadi",
    description:
      "Kamar reguler dengan layout sederhana, ventilasi baik, dan akses cepat ke area bersama lantai tiga.",
    highlights: ["Ventilasi baik", "Dekat area bersama", "Biaya bulanan terjangkau"],
    rules: ["Jaga ketertiban penghuni", "Jam tamu sampai 21.00 WIB", "Tidak membawa hewan peliharaan"]
  }
];
