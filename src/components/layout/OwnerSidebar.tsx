import { A, useLocation, useNavigate } from "@solidjs/router";
import {
  Banknote,
  Building2,
  ClipboardList,
  CreditCard,
  Home,
  KeyRound,
  LogOut,
  MapPinned,
  Menu,
  MessageSquareWarning,
  Moon,
  Phone,
  Settings,
  Sun,
  UserCog,
  Users,
} from "lucide-solid";
import { createSignal, onMount } from "solid-js";
import type { JSX } from "solid-js";
import ConfirmDialog from "~/components/ConfirmDialog";
import { getCurrentOwner } from "~/utils/ownerSession";
import { requireOwner, sessionRoleKey } from "~/utils/roleAccess";

type ThemeMode = "dark" | "light";

const ownerMenu = [
  { href: "/pemilik/dashboard", label: "Dashboard", icon: Home },
  { href: "/pemilik/data-kamar", label: "Data Kamar", icon: Building2 },
  { href: "/pemilik/list-penyewa", label: "List Penyewa", icon: Users },
  { href: "/pemilik/informasi-kost", label: "Informasi Kost", icon: MapPinned },
  { href: "/pemilik/kontak-pemilik", label: "Kontak Pemilik", icon: Phone },
  { href: "/pemilik/tagihan-kamar", label: "Tagihan Kamar", icon: CreditCard },
  { href: "/pemilik/keluhan-penyewa", label: "Keluhan Penyewa", icon: MessageSquareWarning },
  { href: "/pemilik/aturan-kost", label: "Aturan Kost", icon: ClipboardList },
  { href: "/pemilik/fasilitas-umum", label: "Fasilitas Umum", icon: Settings },
  { href: "/pemilik/rekening-pembayaran", label: "Rekening Pembayaran", icon: Banknote },
  { href: "/pemilik/settings", label: "Settings", icon: KeyRound },
];

const getStoredTheme = (): ThemeMode => {
  if (typeof document === "undefined") {
    return "dark";
  }

  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
};

const applyTheme = (mode: ThemeMode) => {
  document.documentElement.dataset.theme = mode;

  try {
    localStorage.setItem("simako-theme", mode);
  } catch {
    // Theme remains active for this session.
  }
};

export default function OwnerSidebar(props: { title: string; subtitle: string; children: JSX.Element }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = createSignal(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = createSignal(false);
  const [theme, setTheme] = createSignal<ThemeMode>("dark");
  const owner = () => getCurrentOwner();

  onMount(() => {
    if (!requireOwner(navigate)) {
      return;
    }

    const savedTheme = localStorage.getItem("simako-theme");
    const initialTheme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : getStoredTheme();
    setTheme(initialTheme);
    applyTheme(initialTheme);
  });

  const isActive = (href: string) => location.pathname === href;

  const toggleTheme = () => {
    const nextTheme = theme() === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const confirmLogout = () => {
    try {
      localStorage.removeItem(sessionRoleKey);
      localStorage.removeItem("simako-session-email");
    } catch {
      // Redirect still proceeds if storage cleanup fails.
    }

    navigate("/login", { replace: true });
  };

  return (
    <main class="min-h-screen bg-[rgb(var(--background-rgb))]">
      <div>
        {sidebarOpen() && (
          <button
            type="button"
            class="fixed inset-0 z-30 bg-slate-950/70 lg:hidden"
            aria-label="Tutup sidebar"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          class={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-[var(--surface-border)] bg-[var(--header-bg)] transition-transform lg:translate-x-0 ${
            sidebarOpen() ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div class="flex h-[78px] items-center gap-3 border-b border-[var(--divider)] px-5">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white">
              <UserCog size={20} />
            </div>
            <div>
              <A href="/" class="ui-heading text-lg font-bold">
                SIMAKO
              </A>
              <p class="dashboard-muted text-xs">Pemilik Kost Panel</p>
            </div>
          </div>

          <nav class="flex-1 space-y-2 overflow-y-auto px-4 py-4">
            {ownerMenu.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <A
                  href={item.href}
                  class={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-bold transition ${
                    active
                      ? "bg-red-500/12 text-red-400"
                      : "text-[rgb(var(--text-body-rgb))] hover:bg-[var(--nav-hover)] hover:text-[rgb(var(--text-strong-rgb))]"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </A>
              );
            })}
          </nav>

          <div class="border-t border-[var(--divider)] p-4">
            <div class="flex items-center justify-between rounded-lg bg-[var(--control-bg)] p-3">
              <div class="flex items-center gap-3">
                <div class="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
                  {owner()?.name.charAt(0) ?? "P"}
                </div>
                <div>
                  <p class="ui-heading text-sm font-bold">{owner()?.name ?? "Pemilik Kost"}</p>
                  <p class="dashboard-muted text-xs">pemilik_kost</p>
                </div>
              </div>
              <button type="button" class="icon-button h-8 w-8" aria-label="Ganti tema" onClick={toggleTheme}>
                {theme() === "dark" ? <Moon size={16} /> : <Sun size={16} />}
              </button>
            </div>
            <button
              type="button"
              class="mt-4 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-bold text-red-400 hover:bg-red-500/10"
              onClick={() => setLogoutConfirmOpen(true)}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        <section class="lg:pl-[260px]">
          <div class="sticky top-0 z-20 flex h-[70px] items-center justify-between border-b border-[var(--divider)] bg-[var(--header-bg)] px-5 lg:hidden">
            <button
              type="button"
              class="icon-button h-10 w-10"
              aria-label="Buka menu dashboard"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <A href="/" class="flex items-center gap-3">
              <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white">
                <UserCog size={18} />
              </span>
              <span>
                <span class="ui-heading block text-sm font-bold">SIMAKO</span>
                <span class="dashboard-muted block text-xs">Pemilik Kost</span>
              </span>
            </A>
            <button type="button" class="icon-button h-10 w-10" aria-label="Ganti tema" onClick={toggleTheme}>
              {theme() === "dark" ? <Moon size={17} /> : <Sun size={17} />}
            </button>
          </div>

          <div class="mx-auto max-w-[1220px] px-5 py-6 md:px-8 lg:py-8">
            <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 class="ui-heading text-3xl font-bold md:text-4xl">{props.title}</h1>
                <p class="dashboard-muted mt-3 text-sm">{props.subtitle}</p>
              </div>
              <div class="hidden rounded-lg border border-[var(--control-border)] bg-[var(--control-bg)] px-3 py-2 text-xs font-bold text-[rgb(var(--text-body-rgb))] md:block">
                Role: <span class="text-red-400">Pemilik Kost</span>
              </div>
            </div>

            {props.children}
          </div>
        </section>
      </div>

      {logoutConfirmOpen() && (
        <ConfirmDialog
          title="Konfirmasi Logout"
          message="Anda yakin ingin keluar dari panel pemilik kost?"
          confirmLabel="Logout"
          tone="info"
          zIndexClass="z-[60]"
          onCancel={() => setLogoutConfirmOpen(false)}
          onConfirm={confirmLogout}
        />
      )}
    </main>
  );
}
