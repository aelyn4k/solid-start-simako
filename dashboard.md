# PROMPT DASHBOARD SIMAKO
## Sistem Manajemen Kost Berbasis Role

Buatkan desain dan struktur dashboard aplikasi web bernama **SIMAKO (Sistem Manajemen Kost)**.

Aplikasi ini memiliki 3 role utama:
1. Admin
2. Pemilik Kost
3. Penyewa Kost

Setiap role memiliki dashboard, akses menu, data, dan fungsi yang berbeda.

Gunakan desain modern seperti dashboard SaaS:
- Dark mode sebagai default
- Tersedia tombol light mode/dark mode di kanan atas
- Sidebar konsisten
- Header konsisten
- Card statistik
- Table data
- Badge status
- Button merah sebagai primary action
- Background dark navy
- Card berwarna biru gelap
- Border halus
- Rounded corner
- Responsive desktop dan mobile

---

# 1. DASHBOARD ADMIN

## Tujuan Dashboard Admin
Dashboard admin digunakan untuk mengelola seluruh data sistem SIMAKO secara global.

Admin memiliki akses penuh terhadap:
- Data kost
- Data kamar
- Data pemilik kost
- Data penyewa kost
- Data tagihan
- Data pembayaran
- Data laporan kendala
- Data aturan kost
- Data fasilitas umum
- Pengaturan sistem

---

## Sidebar Admin

Menu sidebar admin:
- Dashboard
- Data Kost
- Data Kamar
- Data Pemilik Kost
- Data Penyewa Kost
- Data Tagihan
- Data Pembayaran
- Laporan Kendala
- Aturan Kost
- Fasilitas Umum
- Pengaturan
- Logout

---

## Isi Dashboard Admin

### Card Statistik
Tampilkan card statistik berikut:
- Total Kost
- Total Kamar
- Total Kamar Kosong
- Total Kamar Terisi
- Total Pemilik Kost
- Total Penyewa Kost
- Total Tagihan Belum Dibayar
- Total Pembayaran Pending
- Total Laporan Kendala Aktif

---

## Data yang Dibutuhkan Admin

### Data Kost
- Nama kost
- Alamat kost
- Link Google Maps
- Total kamar
- Jumlah kamar kosong
- Jumlah kamar terisi
- Nama pemilik kost
- Nomor HP pemilik
- Email pemilik

### Data Kamar
- Nama/nomor kamar
- Spesifikasi kamar
- Harga per semester
- Harga per tahun
- Foto kamar
- Deskripsi kamar
- Jenis kost
- Status kost: tersedia / berpenghuni
- Nama penghuni jika berpenghuni
- Email penghuni jika berpenghuni

### Data Pemilik Kost
- Nama pemilik kost
- Nomor HP
- Nomor WhatsApp
- Email
- Kontak cadangan
- Data rekening pembayaran

### Data Penyewa Kost
- Nama penyewa
- Email penyewa
- Nomor HP penyewa
- Kamar yang disewa
- Status sewa
- Status pembayaran

### Data Tagihan
- Nama kamar
- Nama penyewa
- Nominal tagihan
- Periode tagihan
- Tanggal jatuh tempo
- Status tagihan: belum bayar / pending / lunas

### Data Pembayaran
- Nama bank
- Nomor rekening
- Nama pemilik rekening
- Bukti pembayaran
- Catatan pembayaran
- Status verifikasi pembayaran

### Data Laporan Kendala
- Nama penyewa
- Nomor kamar
- Jenis kendala
- Deskripsi kendala
- Tanggal laporan
- Status laporan: pending / diproses / selesai

---

## Komponen Dashboard Admin

Gunakan:
- Summary cards
- Data table
- Search input
- Filter status
- Button tambah data
- Button edit
- Button hapus
- Button detail
- Badge status
- Modal form untuk tambah/edit data

---

# 2. DASHBOARD PEMILIK KOST

## Tujuan Dashboard Pemilik Kost
Dashboard pemilik kost digunakan untuk mengelola data kost milik pemilik tersebut.

Pemilik kost hanya dapat melihat dan mengelola data miliknya sendiri.

---

## Sidebar Pemilik Kost

Menu sidebar pemilik:
- Dashboard
- Data Kost Saya
- Data Kamar
- Data Penyewa
- Tagihan
- Verifikasi Pembayaran
- Laporan Kendala
- Aturan Kost
- Fasilitas Umum
- Rekening Pembayaran
- Pengaturan
- Logout

---

## Isi Dashboard Pemilik Kost

### Card Statistik
Tampilkan card statistik berikut:
- Total Kamar
- Kamar Kosong
- Kamar Terisi
- Tagihan Belum Dibayar
- Pembayaran Menunggu Verifikasi
- Laporan Kendala Aktif

---

## Data yang Dibutuhkan Pemilik Kost

### Data Kost Saya
- Nama kost
- Alamat kost
- Link Google Maps
- Fasilitas umum
- Aturan penyewa kost
- Total jumlah kamar
- Jumlah kamar kosong
- Jumlah kamar terisi

### Data Kamar
- Nama/nomor kamar
- Spesifikasi kamar
- Harga per semester
- Harga per tahun
- Foto kamar
- Deskripsi kamar
- Jenis kost
- Status kost: tersedia / berpenghuni
- Nama penghuni jika berpenghuni
- Email penghuni jika berpenghuni

### Data Penyewa
- Nama penyewa
- Email penyewa
- Nomor HP penyewa
- Nomor kamar yang disewa
- Tanggal mulai sewa
- Status sewa

### Data Tagihan
- Nama kamar
- Nama penyewa
- Nominal tagihan
- Periode tagihan
- Tanggal dibuat
- Tanggal jatuh tempo
- Status tagihan

### Data Pembayaran
- Nama penyewa
- Nomor kamar
- Nominal pembayaran
- Bukti pembayaran
- Tanggal upload bukti
- Status pembayaran: pending / diterima / ditolak

### Data Rekening Pembayaran
- Nama bank
- Nomor rekening
- Nama pemilik rekening
- Catatan pembayaran

### Data Laporan Kendala
- Nama penyewa
- Nomor kamar
- Jenis kendala
- Deskripsi kendala
- Foto kendala jika ada
- Tanggal laporan
- Status laporan: pending / diproses / selesai

---

## Fitur Khusus Pemilik Kost

Pemilik kost dapat:
- Menambah kamar
- Mengedit kamar
- Mengubah status kamar
- Mengatur harga kamar
- Melihat daftar penyewa
- Membuat tagihan
- Memverifikasi bukti pembayaran
- Menolak bukti pembayaran
- Mengubah status laporan kendala
- Mengirim pengingat tagihan melalui email
- Melihat daftar kamar yang belum membayar tagihan

---

## Komponen Dashboard Pemilik Kost

Gunakan:
- Summary cards
- Table kamar
- Table penyewa
- Table tagihan belum dibayar
- Table pembayaran pending
- Table laporan kendala
- Button tambah kamar
- Button buat tagihan
- Button verifikasi pembayaran
- Button kirim reminder email
- Badge status pembayaran
- Badge status kamar
- Badge status laporan

---

# 3. DASHBOARD PENYEWA KOST

## Tujuan Dashboard Penyewa Kost
Dashboard penyewa digunakan untuk melihat informasi kamar yang sedang disewa, tagihan, pembayaran, riwayat, dan laporan kendala.

Penyewa hanya dapat melihat data miliknya sendiri.

---

## Sidebar Penyewa Kost

Menu sidebar penyewa:
- Dashboard
- Kamar Saya
- Tagihan Saya
- Upload Bukti Pembayaran
- Riwayat Pembayaran
- Laporan Kendala
- Aturan Kost
- Kontak Pemilik
- Pengaturan Akun
- Logout

---

## Isi Dashboard Penyewa Kost

### Card Statistik
Tampilkan card statistik berikut:
- Kamar yang Disewa
- Tagihan Aktif
- Tagihan Belum Dibayar
- Pembayaran Pending
- Laporan Kendala Aktif

---

## Data yang Dibutuhkan Penyewa

### Data Kamar Saya
- Nama/nomor kamar
- Spesifikasi kamar
- Harga per semester
- Harga per tahun
- Foto kamar
- Deskripsi kamar
- Jenis kost
- Status sewa
- Nama pemilik kost
- Nomor WhatsApp pemilik
- Email pemilik

### Data Tagihan Saya
- Nomor kamar
- Nominal tagihan
- Periode tagihan
- Tanggal dibuat
- Tanggal jatuh tempo
- Status tagihan: belum bayar / pending / lunas

### Data Pembayaran
- Nama bank tujuan
- Nomor rekening tujuan
- Nama pemilik rekening
- Catatan pembayaran
- Upload bukti pembayaran
- Status verifikasi pembayaran

### Riwayat Pembayaran
- Tanggal pembayaran
- Nominal pembayaran
- Bukti pembayaran
- Status pembayaran
- Catatan verifikasi

### Data Laporan Kendala
- Jenis kendala
- Deskripsi kendala
- Foto kendala jika ada
- Tanggal laporan
- Status laporan: pending / diproses / selesai

### Aturan Kost
- Daftar aturan penyewa kost
- Informasi fasilitas umum
- Kontak darurat

---

## Fitur Khusus Penyewa

Penyewa dapat:
- Melihat kamar yang disewa
- Melihat detail tagihan
- Upload bukti pembayaran
- Melihat status pembayaran
- Melihat riwayat pembayaran
- Membuat laporan kendala
- Melihat status laporan kendala
- Menghubungi pemilik melalui tombol WhatsApp langsung
- Menerima reminder tagihan melalui email

---

## Komponen Dashboard Penyewa

Gunakan:
- Summary cards
- Card informasi kamar
- Table tagihan
- Upload form bukti pembayaran
- Table riwayat pembayaran
- Form laporan kendala
- Status badge
- Button WhatsApp langsung menggunakan format wa.me/nomorhp
- Alert jatuh tempo tagihan

---

# ROLE-BASED ACCESS RULES

## Admin
Admin dapat mengakses semua data dan semua fitur.

## Pemilik Kost
Pemilik hanya dapat mengakses data kost miliknya sendiri.

Pemilik tidak boleh melihat:
- Kost milik pemilik lain
- Penyewa dari kost lain
- Tagihan dari kost lain

## Penyewa Kost
Penyewa hanya dapat melihat data dirinya sendiri.

Penyewa tidak boleh mengakses:
- Data penyewa lain
- Data tagihan penyewa lain
- Dashboard pemilik
- Dashboard admin

---

# STATE DAN STATUS SISTEM

## Status Kamar
- Tersedia
- Berpenghuni

## Status Tagihan
- Belum Dibayar
- Pending Verifikasi
- Lunas

## Status Pembayaran
- Pending
- Diterima
- Ditolak

## Status Laporan Kendala
- Pending
- Diproses
- Selesai

---

# ALUR DASHBOARD

## Alur Admin
1. Admin login
2. Masuk dashboard admin
3. Melihat ringkasan seluruh sistem
4. Mengelola data kost, kamar, user, tagihan, pembayaran, dan laporan
5. Melakukan monitoring sistem secara keseluruhan

## Alur Pemilik Kost
1. Pemilik login
2. Masuk dashboard pemilik
3. Melihat ringkasan kamar dan tagihan
4. Mengelola kamar
5. Melihat daftar penyewa
6. Membuat tagihan
7. Memverifikasi pembayaran
8. Menangani laporan kendala
9. Mengirim reminder email jika tagihan belum dibayar

## Alur Penyewa Kost
1. Penyewa login
2. Masuk dashboard penyewa
3. Melihat kamar yang disewa
4. Melihat tagihan aktif
5. Melakukan pembayaran ke rekening pemilik
6. Upload bukti pembayaran
7. Menunggu verifikasi pemilik
8. Melihat riwayat pembayaran
9. Membuat laporan kendala jika ada masalah
10. Menghubungi pemilik melalui WhatsApp

---

# NOTIFICATION RULES

Sistem harus mendukung notifikasi email untuk:
- Tagihan mendekati jatuh tempo
- Tagihan melewati jatuh tempo
- Bukti pembayaran berhasil diupload
- Pembayaran diverifikasi pemilik
- Laporan kendala dibuat oleh penyewa
- Status laporan kendala diperbarui

---

# UI DESIGN INSTRUCTION

Gunakan gaya visual seperti dashboard referensi:
- Dark navy background
- Sidebar kiri
- Header atas
- Card statistik besar
- Tabel data rapi
- Ikon pada menu
- Button merah untuk aksi utama
- Badge warna:
  - Hijau untuk lunas/tersedia/selesai
  - Merah untuk belum bayar/error
  - Kuning untuk pending
  - Biru untuk diproses
- Mode light/dark toggle di kanan atas
- Layout responsif

---

# OUTPUT YANG DIHARAPKAN DARI AI

AI harus menghasilkan:
1. Dashboard Admin
2. Dashboard Pemilik Kost
3. Dashboard Penyewa Kost
4. Sidebar berbeda sesuai role
5. Card statistik sesuai role
6. Table data sesuai role
7. Form input sesuai kebutuhan role
8. State dan badge status yang jelas
9. UI konsisten antara semua dashboard
10. Tidak mencampur akses antar role