import { A, useLocation } from "@solidjs/router";
import { Mail, MapPin, MessageCircle } from "lucide-solid";

const footerLinks = [
  { href: "/search", label: "Cari Kamar" },
  { href: "/about", label: "Tentang Kami" },
];

export default function Footer() {
  const location = useLocation();
  const isActive = (href: string) => location.pathname.startsWith(href);
  const linkClass = (href: string) =>
    `footer-link ${isActive(href) ? "footer-link-active" : ""}`;

  return (
    <footer class="site-footer mt-14">
      <div class="layout-shell py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="ui-title text-lg font-bold mb-4">SIMAKO</h3>
            <p class="ui-text">
              Platform manajemen kost digital untuk memudahkan pencarian kamar,
              pembayaran, dan komunikasi.
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
            <div class="space-y-3">
              <div class="flex items-start gap-2">
                <Mail class="mt-1 shrink-0 text-red-400" size={16} />
                <A href="mailto:simako@gmail.com" class="footer-link leading-6">
                  simako@gmail.com
                </A>
              </div>
              <div class="flex items-start gap-2">
                <MapPin class="mt-1 shrink-0 text-red-400" size={16} />
                <p class="ui-text leading-6">Telkom University Purwokerto, Jl. D.I. Panjaitan No.128, Purwokerto Selatan, Banyumas</p>
              </div>
              <div class="flex items-start gap-2">
                <MessageCircle class="mt-1 shrink-0 text-red-400" size={16} />
                <A
                  href="https://instagram.com/simako.id"
                  target="_blank"
                  rel="noreferrer"
                  class="footer-link leading-6"
                >
                  simako.id
                </A>
              </div>
            </div>
          </div>
        </div>
        <div class="footer-bottom mt-8 flex flex-col items-center justify-between pt-8 sm:flex-row">
          <p class="ui-muted text-sm">
            © {new Date().getFullYear()} SIMAKO Management. Seluruh hak cipta
            dilindungi.
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
