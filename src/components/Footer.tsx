import { A, useLocation } from "@solidjs/router";

const footerLinks = [
  { href: "/search", label: "Cari Kamar" },
  { href: "/about", label: "Tentang Kami" },
  { href: "/contact", label: "Hubungi Kami" }
];

export default function Footer() {
  const location = useLocation();
  const isActive = (href: string) => location.pathname.startsWith(href);
  const linkClass = (href: string) => `footer-link ${isActive(href) ? "footer-link-active" : ""}`;

  return (
    <footer class="site-footer mt-14">
      <div class="layout-shell py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="ui-title text-lg font-bold mb-4">SIMAKO</h3>
            <p class="ui-text">
              Platform manajemen kost digital untuk memudahkan pencarian kamar, pembayaran, dan komunikasi.
            </p>
          </div>
          <div>
            <h3 class="ui-title text-lg font-bold mb-4">Navigasi Cepat</h3>
            <ul class="space-y-2">
              {footerLinks.map((item) => (
                <li>
                  <A href={item.href} class={linkClass(item.href)}>
                    {item.label}
                  </A>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 class="ui-title text-lg font-bold mb-4">Kontak</h3>
            <p class="ui-text">Telkom University Purwokerto</p>
            <p class="ui-text">Jl. D.I. Panjaitan No.128, Purwokerto Selatan, Banyumas</p>
            <p class="ui-text">halo@simako.id</p>
          </div>
        </div>
        <div class="footer-bottom mt-8 flex flex-col items-center justify-between pt-8 sm:flex-row">
          <p class="ui-muted text-sm">
            © {new Date().getFullYear()} SIMAKO Management. Seluruh hak cipta dilindungi.
          </p>
          <div class="mt-4 flex space-x-4 sm:mt-0">
            <A href="/privacy" class="footer-link text-sm">
              Kebijakan Privasi
            </A>
            <A href="/terms" class="footer-link text-sm">
              Syarat Layanan
            </A>
          </div>
        </div>
      </div>
    </footer>
  );
}
