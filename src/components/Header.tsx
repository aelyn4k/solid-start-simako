import { A, useLocation } from "@solidjs/router";
import { Moon, Sun } from "lucide-solid";
import { createSignal, onMount } from "solid-js";

type ThemeMode = "dark" | "light";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/search", label: "Cari Kost" },
  { href: "/about", label: "Tentang" },
  { href: "/contact", label: "Kontak" }
];

const getCurrentTheme = (): ThemeMode => {
  if (typeof document === "undefined") {
    return "dark";
  }

  const activeTheme = document.documentElement.dataset.theme;
  return activeTheme === "light" || activeTheme === "dark" ? activeTheme : "dark";
};

export default function Header() {
  const location = useLocation();
  const [theme, setTheme] = createSignal<ThemeMode>(getCurrentTheme());

  const applyTheme = (mode: ThemeMode) => {
    document.documentElement.dataset.theme = mode;
    localStorage.setItem("simako-theme", mode);
  };

  onMount(() => {
    const savedTheme = localStorage.getItem("simako-theme") as ThemeMode | null;
    const initialTheme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : getCurrentTheme();
    setTheme(initialTheme);
    applyTheme(initialTheme);
  });

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  const navLinkClass = (href: string) =>
    `nav-link ${isActive(href) ? "nav-link-active" : ""}`;

  const toggleTheme = () => {
    const nextTheme = theme() === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <header class="site-header sticky top-0 z-50 backdrop-blur-xl">
      <nav class="layout-shell">
        <div class="flex h-16 items-center justify-between gap-6">
          <div class="flex items-center">
            <A href="/" class="brand-mark text-xl font-bold md:text-2xl">
              SIMAKO
            </A>
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-center gap-2">
              {navItems.map((item) => (
                <A href={item.href} class={navLinkClass(item.href)}>
                  {item.label}
                </A>
              ))}
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button
              type="button"
              aria-label="Ganti mode tampilan"
              aria-pressed={theme() === "light"}
              onClick={toggleTheme}
              class="icon-button"
            >
              {theme() === "dark" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <A
              href="/login"
              class="nav-action rounded-lg px-3 py-2 text-sm font-medium"
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
