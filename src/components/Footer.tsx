import { A } from "@solidjs/router";

export default function Footer() {
  return (
    <footer class="mt-14 border-t border-slate-800/80 bg-[#030B1F]/95">
      <div class="layout-shell py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-white text-lg font-bold mb-4">SIMAKO</h3>
            <p class="text-slate-300">
              Platform manajemen kost digital untuk memudahkan pencarian kamar, pembayaran, dan komunikasi.
            </p>
          </div>
          <div>
            <h3 class="text-white text-lg font-bold mb-4">Navigasi Cepat</h3>
            <ul class="space-y-2">
              <li>
                <A href="/search" class="text-slate-300 hover:text-white">
                  Cari Kamar
                </A>
              </li>
              <li>
                <A href="/about" class="text-slate-300 hover:text-white">
                  Tentang Kami
                </A>
              </li>
              <li>
                <A href="/contact" class="text-slate-300 hover:text-white">
                  Hubungi Kami
                </A>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-white text-lg font-bold mb-4">Kontak</h3>
            <p class="text-slate-300">Telkom University Purwokerto</p>
            <p class="text-slate-300">Jl. D.I. Panjaitan No.128, Purwokerto Selatan, Banyumas</p>
            <p class="text-slate-300">halo@simako.id</p>
          </div>
        </div>
        <div class="mt-8 flex flex-col items-center justify-between border-t border-slate-800 pt-8 sm:flex-row">
          <p class="text-sm text-slate-400">
            © {new Date().getFullYear()} SIMAKO Management. Seluruh hak cipta dilindungi.
          </p>
          <div class="mt-4 flex space-x-4 sm:mt-0">
            <A href="/privacy" class="text-sm text-slate-400 hover:text-white">
              Kebijakan Privasi
            </A>
            <A href="/terms" class="text-sm text-slate-400 hover:text-white">
              Syarat Layanan
            </A>
          </div>
        </div>
      </div>
    </footer>
  );
}
