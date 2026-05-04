import { kostInfo, ownerRooms, type OwnerRoom } from "~/data/ownerData";
import type { Room } from "~/data/rooms";

const ownerRoomsStorageKey = "simako-owner-rooms";
const placeholderImage =
  "https://placehold.co/900x650/111827/f87171?text=Tidak+ada+foto";

type StoredOwnerRoom = Omit<OwnerRoom, "foto_kamar" | "harga_perbulan"> & {
  foto_kamar?: string | string[];
  harga_perbulan?: number;
};

const normalizeRoom = (room: StoredOwnerRoom): OwnerRoom => ({
  ...room,
  harga_perbulan: room.harga_perbulan ?? Math.round(room.harga_persemester / 6),
  foto_kamar: Array.isArray(room.foto_kamar)
    ? room.foto_kamar.filter(Boolean).slice(0, 4)
    : room.foto_kamar
      ? [room.foto_kamar]
      : [],
});

const normalizeRooms = (rooms: StoredOwnerRoom[]): OwnerRoom[] => rooms.map(normalizeRoom);

export const readOwnerRooms = (): OwnerRoom[] => {
  if (typeof localStorage === "undefined") {
    return normalizeRooms(ownerRooms);
  }

  const stored = localStorage.getItem(ownerRoomsStorageKey);

  if (!stored) {
    return normalizeRooms(ownerRooms);
  }

  try {
    const parsed = JSON.parse(stored) as StoredOwnerRoom[];
    return Array.isArray(parsed) ? normalizeRooms(parsed) : normalizeRooms(ownerRooms);
  } catch {
    return normalizeRooms(ownerRooms);
  }
};

export const writeOwnerRooms = (rooms: OwnerRoom[]) => {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(ownerRoomsStorageKey, JSON.stringify(rooms));
};

export const persistOwnerRooms = (ownerId: number, ownerRows: OwnerRoom[]) => {
  const otherOwnerRows = readOwnerRooms().filter((room) => room.owner_id !== ownerId);
  writeOwnerRooms([...otherOwnerRows, ...ownerRows]);
};

export const getPublicOwnerRooms = (): Room[] =>
  readOwnerRooms().map((room) => {
    const owner = kostInfo.find((item) => item.owner_id === room.owner_id);
    const ownerName = `Kost Owner ${room.owner_id}`;
    const gallery = room.foto_kamar.length > 0 ? room.foto_kamar : [placeholderImage];

    return {
      id: room.id,
      name: room.nama_kamar,
      type: room.jenis_kost,
      ownerName,
      price: `${new Intl.NumberFormat("id-ID", {
        currency: "IDR",
        maximumFractionDigits: 0,
        style: "currency",
      }).format(room.harga_perbulan)} / bulan`,
      status: room.status_kost === "tersedia" ? "Tersedia" : "Terisi",
      image: gallery[0],
      gallery,
      facilities: ["wifi", "wardrobe", "desk"],
      area: room.spesifikasi_kamar,
      floor: "-",
      capacity: "1 orang",
      bathroom: room.spesifikasi_kamar.toLowerCase().includes("dalam")
        ? "Kamar mandi dalam"
        : "Kamar mandi luar",
      electricity: "Sesuai aturan kost",
      description: room.deskripsi_kamar,
      highlights: [room.spesifikasi_kamar, `Kost ${room.jenis_kost}`, "Data dari dashboard pemilik"],
      rules: ["Ikuti aturan kost", "Pembayaran sesuai jadwal", "Jaga kebersihan kamar"],
    };
  });
