export interface Testimonial {
  name: string;
  role: string;
  room: string;
  message: string;
}

export const initialTestimonials: Testimonial[] = [
  {
    name: "Nadia Putri",
    role: "Penyewa",
    room: "Kamar 101",
    message:
      "Booking kamar jadi lebih jelas karena status kamar, fasilitas, dan kontak pengelola bisa dicek dari satu halaman."
  },
  {
    name: "Raka Pratama",
    role: "Penyewa",
    room: "Kamar 203",
    message:
      "Saya bisa membandingkan kamar sebelum survei. Informasi harga dan fasilitasnya membantu mengambil keputusan lebih cepat."
  },
  {
    name: "Bu Sari",
    role: "Pemilik Kost",
    room: "Kost Melati",
    message:
      "Data kamar dan penyewa lebih rapi. Calon penyewa juga lebih mudah diarahkan ke detail kamar yang tersedia."
  }
];
