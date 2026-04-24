import { A } from "@solidjs/router";
import { Moon } from "lucide-solid";

export default function Header() {
  return (
    <header class="sticky top-0 z-50 border-b border-slate-800/80 bg-[#040B1F]/95 backdrop-blur-xl">
      <nav class="layout-shell">
        <div class="flex h-16 items-center justify-between gap-6">
          <div class="flex items-center">
            <A href="/" class="text-xl font-bold text-white md:text-2xl">
              SIMAKO
            </A>
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-center gap-2">
              <A
                href="/"
                class="rounded-lg px-3 py-2 text-sm font-medium text-red-400"
              >
                Beranda
              </A>
              <A
                href="/search"
                class="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800/70 hover:text-white"
              >
                Cari Kost
              </A>
              <A
                href="/about"
                class="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800/70 hover:text-white"
              >
                Tentang
              </A>
              <A
                href="/contact"
                class="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800/70 hover:text-white"
              >
                Kontak
              </A>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button class="rounded-lg border border-slate-700 bg-slate-900/75 p-2 text-slate-300 transition hover:text-white">
              <Moon size={20} />
            </button>
            <A
              href="/login"
              class="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800/75"
            >
              Masuk
            </A>
            <A
              href="/register"
              class="btn-primary px-4 py-2 text-sm"
            >
              Daftar
            </A>
          </div>
        </div>
      </nav>
    </header>
  );
}
