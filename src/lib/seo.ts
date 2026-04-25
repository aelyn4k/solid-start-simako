import { getOwnerRoomsBySlug, rooms, slugifyOwner, type Room } from "~/data/rooms";

const siteUrl = "https://simako.id";
const siteName = "SIMAKO";
const defaultImage =
  "https://images.unsplash.com/photo-1560185008-b033106af5c3?q=80&w=1200&auto=format&fit=crop";

export interface SeoData {
  title: string;
  description: string;
  canonical: string;
  image: string;
  type: "website" | "article" | "product";
  keywords: string;
  jsonLd: Record<string, unknown>;
}

const absoluteUrl = (path: string) => `${siteUrl}${path === "/" ? "" : path}`;

const staticSeo: Record<string, Omit<SeoData, "canonical" | "jsonLd">> = {
  "/": {
    title: "SIMAKO - Cari Kost dan Kelola Kamar Lebih Praktis",
    description:
      "SIMAKO membantu penyewa menemukan kamar kost dan membantu pemilik kost mengelola kamar, booking, tagihan, dan komunikasi dalam satu platform.",
    image: defaultImage,
    type: "website",
    keywords: "SIMAKO, cari kost, kost Purwokerto, manajemen kost, booking kamar kost"
  },
  "/search": {
    title: "Cari Kost Purwokerto - Daftar Kamar SIMAKO",
    description:
      "Cari kamar kost berdasarkan pemilik, harga, status ketersediaan, dan fasilitas. Bandingkan kamar sebelum menghubungi pengelola.",
    image: rooms[0]?.image ?? defaultImage,
    type: "website",
    keywords: "cari kost Purwokerto, kamar kost tersedia, sewa kamar kost, kost mahasiswa"
  },
  "/about": {
    title: "Tentang SIMAKO - Platform Manajemen Kost Digital",
    description:
      "Pelajari bagaimana SIMAKO membantu penyewa menemukan kamar dan pemilik kost mengelola data kamar, penyewa, booking, dan komunikasi.",
    image: defaultImage,
    type: "website",
    keywords: "tentang SIMAKO, platform kost, aplikasi kost, manajemen kost digital"
  },
  "/contact": {
    title: "Kontak dan CS SIMAKO - Bantuan Akun dan Booking",
    description:
      "Hubungi CS SIMAKO untuk bantuan akun, login, register, booking kamar, pembayaran, atau kendala penggunaan platform.",
    image: defaultImage,
    type: "website",
    keywords: "kontak SIMAKO, CS SIMAKO, bantuan akun kost, bantuan booking kost"
  },
  "/login": {
    title: "Login SIMAKO - Masuk ke Akun Penyewa atau Pemilik Kost",
    description:
      "Masuk ke akun SIMAKO untuk memantau booking, data kamar, tagihan, dan komunikasi kost.",
    image: defaultImage,
    type: "website",
    keywords: "login SIMAKO, masuk akun kost, akun penyewa, akun pemilik kost"
  },
  "/register": {
    title: "Daftar SIMAKO - Akun Penyewa dan Pemilik Kost",
    description:
      "Daftar sebagai penyewa untuk booking kamar atau sebagai pemilik kost untuk mengelola data kamar dan penyewa.",
    image: defaultImage,
    type: "website",
    keywords: "daftar SIMAKO, register kost, akun penyewa, akun pemilik kost"
  },
  "/forgot-password": {
    title: "Lupa Password SIMAKO - Reset Akses Akun",
    description: "Reset password akun SIMAKO melalui email terdaftar agar bisa mengakses kembali fitur booking dan pengelolaan kost.",
    image: defaultImage,
    type: "website",
    keywords: "lupa password SIMAKO, reset password akun kost"
  },
  "/privacy": {
    title: "Kebijakan Privasi SIMAKO",
    description: "Informasi tentang data yang dikumpulkan SIMAKO, penggunaan data, keamanan akun, dan kontrol pengguna.",
    image: defaultImage,
    type: "website",
    keywords: "kebijakan privasi SIMAKO, privasi akun kost, data pengguna SIMAKO"
  },
  "/terms": {
    title: "Syarat Layanan SIMAKO",
    description: "Ketentuan penggunaan SIMAKO untuk akun penyewa, pemilik kost, informasi kamar, booking, dan komunikasi pengelola.",
    image: defaultImage,
    type: "website",
    keywords: "syarat layanan SIMAKO, ketentuan SIMAKO, terms kost"
  }
};

const baseJsonLd = (path: string) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: absoluteUrl(path),
  potentialAction: {
    "@type": "SearchAction",
    target: `${absoluteUrl("/search")}?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
});

const roomSeo = (room: Room): SeoData => ({
  title: `${room.name} ${room.ownerName} - ${room.price} | SIMAKO`,
  description: `${room.description} Status ${room.status}, ${room.area}, ${room.bathroom}, dikelola oleh ${room.ownerName}.`,
  canonical: absoluteUrl(`/room/${room.id}`),
  image: room.image,
  type: "product",
  keywords: `${room.name}, ${room.ownerName}, kost ${room.ownerName}, kamar kost ${room.type}, ${room.price}, ${room.status}`,
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "Product",
    name: room.name,
    description: room.description,
    image: room.gallery,
    brand: {
      "@type": "Brand",
      name: room.ownerName
    },
    category: "Kamar Kost",
    offers: {
      "@type": "Offer",
      priceCurrency: "IDR",
      price: room.price.replace(/\D/g, ""),
      availability: room.status === "Tersedia" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      url: absoluteUrl(`/room/${room.id}`)
    }
  }
});

const ownerSeo = (ownerSlug: string): SeoData | undefined => {
  const ownerRooms = getOwnerRoomsBySlug(ownerSlug);

  if (ownerRooms.length === 0) {
    return undefined;
  }

  const ownerName = ownerRooms[0].ownerName;
  const availableCount = ownerRooms.filter((room) => room.status === "Tersedia").length;

  return {
    title: `${ownerName} - Kamar Kost dan Info Sewa | SIMAKO`,
    description: `Lihat daftar kamar ${ownerName}, status ketersediaan, fasilitas, harga sewa, dan detail booking di SIMAKO. ${availableCount} kamar tersedia.`,
    canonical: absoluteUrl(`/owner/${slugifyOwner(ownerName)}`),
    image: ownerRooms[0].image,
    type: "website",
    keywords: `${ownerName}, kost ${ownerName}, kamar ${ownerName}, sewa kost Purwokerto, SIMAKO`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      name: ownerName,
      url: absoluteUrl(`/owner/${slugifyOwner(ownerName)}`),
      image: ownerRooms[0].image,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Purwokerto Selatan",
        addressRegion: "Banyumas",
        addressCountry: "ID"
      },
      containsPlace: ownerRooms.map((room) => ({
        "@type": "Accommodation",
        name: room.name,
        url: absoluteUrl(`/room/${room.id}`)
      }))
    }
  };
};

export const getSeoForPath = (pathname: string): SeoData => {
  const normalizedPath = pathname === "" ? "/" : pathname.replace(/\/$/, "") || "/";
  const roomMatch = normalizedPath.match(/^\/room\/(\d+)$/);
  const ownerMatch = normalizedPath.match(/^\/owner\/([^/]+)$/);

  if (roomMatch) {
    const room = rooms.find((item) => String(item.id) === roomMatch[1]);

    if (room) {
      return roomSeo(room);
    }
  }

  if (ownerMatch) {
    const owner = ownerSeo(ownerMatch[1]);

    if (owner) {
      return owner;
    }
  }

  const pageSeo = staticSeo[normalizedPath] ?? {
    title: "Halaman Tidak Ditemukan | SIMAKO",
    description: "Halaman yang Anda cari tidak ditemukan. Kembali ke SIMAKO untuk mencari kamar kost atau menghubungi CS.",
    image: defaultImage,
    type: "website" as const,
    keywords: "SIMAKO, halaman tidak ditemukan"
  };

  return {
    ...pageSeo,
    canonical: absoluteUrl(normalizedPath),
    jsonLd: baseJsonLd(normalizedPath)
  };
};

export const getOwnerSlug = slugifyOwner;
