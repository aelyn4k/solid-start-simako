export type UserRole = "admin" | "pemilik_kost" | "penyewa";
export type UserStatus = "aktif" | "nonaktif" | "pending";
export type AccessLogStatus = "success" | "failed" | "warning";

export interface DummyUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  last_login: string;
}

export interface AccessLog {
  id: number;
  user_id: number;
  user_name: string;
  role: UserRole;
  activity: string;
  access_time: string;
  status: AccessLogStatus;
  ip_address: string;
}

export const users: DummyUser[] = [
  {
    id: 1,
    name: "Admin SIMAKO",
    email: "admin@simako.id",
    phone: "0811 0000 0001",
    role: "admin",
    status: "aktif",
    created_at: "2026-01-02T08:00:00+07:00",
    last_login: "2026-05-04T09:10:00+07:00",
  },
  {
    id: 2,
    name: "Siti Aminah",
    email: "siti@simako.id",
    phone: "0812 3456 7890",
    role: "pemilik_kost",
    status: "aktif",
    created_at: "2026-03-14T10:25:00+07:00",
    last_login: "2026-05-04T08:42:00+07:00",
  },
  {
    id: 3,
    name: "Rudi Hartono",
    email: "rudi@simako.id",
    phone: "0821 4455 7788",
    role: "pemilik_kost",
    status: "aktif",
    created_at: "2026-04-09T13:20:00+07:00",
    last_login: "2026-05-03T19:14:00+07:00",
  },
  {
    id: 4,
    name: "Dewi Lestari",
    email: "dewi@simako.id",
    phone: "0857 1122 3344",
    role: "pemilik_kost",
    status: "pending",
    created_at: "2026-05-02T11:15:00+07:00",
    last_login: "2026-05-02T11:22:00+07:00",
  },
  {
    id: 5,
    name: "Agus Pranata",
    email: "agus@simako.id",
    phone: "0878 9988 1122",
    role: "pemilik_kost",
    status: "pending",
    created_at: "2026-05-03T16:45:00+07:00",
    last_login: "2026-05-03T17:02:00+07:00",
  },
  {
    id: 6,
    name: "Nadia Putri",
    email: "nadia@mail.com",
    phone: "0813 9000 1122",
    role: "penyewa",
    status: "aktif",
    created_at: "2026-02-22T09:30:00+07:00",
    last_login: "2026-05-04T07:55:00+07:00",
  },
  {
    id: 7,
    name: "Raka Pratama",
    email: "raka@mail.com",
    phone: "0822 1122 7788",
    role: "penyewa",
    status: "aktif",
    created_at: "2026-03-12T14:18:00+07:00",
    last_login: "2026-05-03T21:10:00+07:00",
  },
  {
    id: 8,
    name: "Fajar Maulana",
    email: "fajar@mail.com",
    phone: "0852 8877 2211",
    role: "penyewa",
    status: "nonaktif",
    created_at: "2026-03-18T15:40:00+07:00",
    last_login: "2026-04-20T18:44:00+07:00",
  },
  {
    id: 9,
    name: "Aulia Rahma",
    email: "aulia@mail.com",
    phone: "0819 7744 3201",
    role: "penyewa",
    status: "aktif",
    created_at: "2026-05-01T08:12:00+07:00",
    last_login: "2026-05-04T08:21:00+07:00",
  },
  {
    id: 10,
    name: "Bima Saputra",
    email: "bima@mail.com",
    phone: "0858 2211 9090",
    role: "penyewa",
    status: "pending",
    created_at: "2026-05-04T07:30:00+07:00",
    last_login: "2026-05-04T07:36:00+07:00",
  },
];

export const accessLogs: AccessLog[] = [
  {
    id: 101,
    user_id: 1,
    user_name: "Admin SIMAKO",
    role: "admin",
    activity: "Membuka dashboard admin",
    access_time: "2026-05-04T09:10:00+07:00",
    status: "success",
    ip_address: "103.164.12.10",
  },
  {
    id: 102,
    user_id: 2,
    user_name: "Siti Aminah",
    role: "pemilik_kost",
    activity: "Login dashboard pemilik",
    access_time: "2026-05-04T08:42:00+07:00",
    status: "success",
    ip_address: "103.164.12.22",
  },
  {
    id: 103,
    user_id: 6,
    user_name: "Nadia Putri",
    role: "penyewa",
    activity: "Melihat tagihan",
    access_time: "2026-05-04T07:55:00+07:00",
    status: "success",
    ip_address: "103.164.12.41",
  },
  {
    id: 104,
    user_id: 10,
    user_name: "Bima Saputra",
    role: "penyewa",
    activity: "Login akun pending",
    access_time: "2026-05-04T07:36:00+07:00",
    status: "warning",
    ip_address: "103.164.12.52",
  },
  {
    id: 105,
    user_id: 4,
    user_name: "Dewi Lestari",
    role: "pemilik_kost",
    activity: "Mencoba akses halaman admin",
    access_time: "2026-05-03T20:11:00+07:00",
    status: "failed",
    ip_address: "103.164.12.77",
  },
];

export {
  bankAccounts,
  contactInfo,
  facilities,
  kostInfo,
  ownerRooms,
  roomBills,
  rules,
} from "./ownerData";

export type {
  BankAccount,
  ContactInfo,
  KostInfo,
  KostRule,
  OwnerBillStatus,
  OwnerKostType,
  OwnerRoom,
  OwnerRoomStatus,
  PublicFacility,
  RoomBill,
} from "./ownerData";
