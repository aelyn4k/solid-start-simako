# SIMAKO (Sistem Manajemen Kost)

##  Deskripsi Sistem

SIMAKO (Sistem Manajemen Kost) merupakan aplikasi berbasis web yang dirancang untuk mengelola operasional kost secara terintegrasi. Sistem ini mendukung tiga peran utama:

- **Admin**
- **Pemilik Kost**
- **Penyewa Kost**

Tujuan utama sistem adalah:
- Mengoptimalkan manajemen kamar kost
- Meningkatkan transparansi tagihan
- Mempermudah komunikasi antara penyewa dan pemilik
- Mengurangi proses manual melalui digitalisasi

---

##  Konsep Sistem (Untuk AI Understanding)

Sistem berbasis:
- **Role-Based Access Control (RBAC)**
- **Dashboard-centric UI**
- **Data-driven management system**
- **Event-triggered notification system (email)**

Pendekatan desain:
- Modular UI
- Card-based dashboard
- Dark mode default + Light mode toggle
- Responsive modern web design

---

##  Role dan Hak Akses

### 1. Admin
Akses penuh terhadap sistem:
- Mengelola data kost
- Mengelola kamar
- Mengelola user (pemilik & penyewa)
- Monitoring tagihan
- Monitoring laporan kendala

---

### 2. Pemilik Kost
Fitur utama:
- Dashboard ringkasan:
  - Total kamar
  - Kamar kosong
  - Kamar terisi
  - Tagihan belum dibayar
- Mengelola kamar
- Melihat daftar penyewa
- Verifikasi pembayaran
- Melihat laporan kendala

---

### 3. Penyewa Kost
Fitur utama:
- Melihat kamar yang disewa
- Melihat tagihan
- Upload bukti pembayaran
- Melihat riwayat pembayaran
- Mengirim laporan kendala
- Menghubungi pemilik via WhatsApp

---

##  Alur Sistem (Workflow)

### 1. Landing Page (Public)
- Menampilkan daftar kamar kosong
- User dapat melihat detail tanpa login
- Untuk booking → harus register

---

### 2. Registrasi
User memilih role:
- Penyewa
- Pemilik kost

---

### 3. Login
User masuk ke dashboard sesuai role

---

### 4. Pemilik Kost
- Input data kost & kamar
- Menentukan harga
- Menambahkan penyewa
- Mengelola tagihan

---

### 5. Penyewa
- Melihat kamar
- Menerima tagihan
- Melakukan pembayaran
- Upload bukti pembayaran

---

### 6. Verifikasi Pembayaran
- Pemilik menerima bukti
- Melakukan verifikasi
- Status berubah menjadi "Lunas"

---

### 7. Laporan Kendala
- Penyewa membuat laporan
- Sistem mengirim notifikasi email ke pemilik
- Pemilik menangani laporan

---

### 8. Notifikasi Sistem
Event-based:
- Tagihan jatuh tempo → Email reminder
- Laporan kendala → Email pemilik
- Status pembayaran → Update dashboard

---

##  Struktur Data (Core Entities)

### Data Kost
- Nama kost
- Alamat
- Google Maps link
- Fasilitas umum
- Aturan kost

---

### Data Kamar
- Nomor kamar
- Spesifikasi
- Harga semester/tahun
- Foto
- Deskripsi
- Status (tersedia / terisi)
- Penyewa (jika ada)

---

### Data Penyewa
- Nama
- Email
- Nomor HP

---

### Data Tagihan
- ID kamar
- Jumlah tagihan
- Tanggal jatuh tempo
- Status pembayaran
- Bukti pembayaran

---

### Data Pembayaran
- Bank
- Nomor rekening
- Nama pemilik rekening
- Catatan pembayaran

---

### Data Laporan Kendala
- ID kamar
- Deskripsi masalah
- Status (Pending / Proses / Selesai)


##  Design System

- Dark theme (default)
- Light mode toggle
- Card-based layout
- Sidebar navigation (dashboard)
- Responsive design

---

##  AI Instruction Guideline (UNTUK STITCH / AI BUILDER)

Gunakan pendekatan berikut:

1. Gunakan layout dashboard modern (dark mode)
2. Gunakan card-based UI untuk semua data
3. Gunakan tabel untuk data kompleks (tagihan, user)
4. Gunakan role-based rendering
5. Gunakan status badge:
   - Hijau → aktif / lunas
   - Merah → belum bayar
   - Kuning → pending
6. Gunakan modal/form untuk input data
7. Gunakan CTA jelas:
   - Booking
   - Bayar
   - Upload bukti
8. Gunakan notifikasi berbasis event

---

## 📊 Behavior Rules (Logic Sistem)

- Penyewa tidak bisa akses data lain
- Pemilik hanya melihat kost miliknya
- Admin memiliki akses global
- Pembayaran harus diverifikasi manual oleh pemilik
- Sistem mengirim email otomatis saat:
  - Tagihan jatuh tempo
  - Laporan kendala dibuat

---

##  Roadmap Pengembangan

Tahap selanjutnya:
- Integrasi payment gateway
- Mobile app (Flutter)
- AI rekomendasi kost
- Analytics dashboard

---

##  Referensi Konseptual

- Nielsen, J. (1994) – Usability Heuristics
- Norman, D. (2013) – User-Centered Design
- Pressman, R. (2014) – Software Engineering

---

##  Catatan untuk AI

AI harus memahami bahwa:
- Sistem ini multi-role
- Fokus utama adalah manajemen kost
- Data bersifat relational
- UI harus konsisten antar halaman
- User experience harus sederhana namun informatif

---

##  Penutup

Dokumen ini digunakan sebagai:
- Panduan implementasi sistem
- Instruction file untuk AI builder
- Referensi pengembangan aplikasi SIMAKO
