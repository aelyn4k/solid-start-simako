import { A, useLocation, useNavigate } from "@solidjs/router";
import { FileText, Home, LogOut, Menu, Moon, Settings, Sun, UserCog, Users, X } from "lucide-solid";
import { createSignal, onMount } from "solid-js";
import type { JSX } from "solid-js";
import { requireAdmin, sessionRoleKey } from "~/utils/roleAccess";

type ThemeMode = "dark" | "light";

const adminMenu = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Home },
  { href: "/admin/akun-pemilik", label: "Akun Pemilik", icon: UserCog },
  { href: "/admin/akun-penyewa", label: "Akun Penyewa", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/logs", label: "Logs", icon: FileText },
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

export default function Sidebar(props: { title: string; subtitle: string; children: JSX.Element }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = createSignal(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = createSignal(false);
  const [theme, setTheme] = createSignal<ThemeMode>("dark");

  onMount(() => {
    if (!requireAdmin(navigate)) {
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
    } catch {
      // Redirect still proceeds if storage cleanup fails.
    }

    navigate("/login", { replace: true });
  };

  return (
    <main class="min-h-screen bg-[rgb(var(--background-rgb))]">
      <div class={logoutConfirmOpen() ? "dashboard-blur-target" : ""}>
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
              <p class="dashboard-muted text-xs">Admin Panel</p>
            </div>
          </div>

          <nav class="flex-1 space-y-2 overflow-y-auto px-4 py-4">
            {adminMenu.map((item) => {
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
                  A
                </div>
                <div>
                  <p class="ui-heading text-sm font-bold">Admin SIMAKO</p>
                  <p class="dashboard-muted text-xs">superadmin</p>
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
          <div class="mx-auto max-w-[1220px] px-5 py-8 md:px-8">
            <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div class="flex gap-3">
                <button
                  type="button"
                  class="icon-button mt-1 lg:hidden"
                  aria-label="Buka sidebar"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu size={20} />
                </button>
                <div>
                  <h1 class="ui-heading text-3xl font-bold md:text-4xl">{props.title}</h1>
                  <p class="dashboard-muted mt-3 text-sm">{props.subtitle}</p>
                </div>
              </div>
              <div class="rounded-lg border border-[var(--control-border)] bg-[var(--control-bg)] px-3 py-2 text-xs font-bold text-[rgb(var(--text-body-rgb))]">
                Role: <span class="text-red-400">Admin</span>
              </div>
            </div>

            {props.children}
          </div>
        </section>
      </div>

      {logoutConfirmOpen() && (
        <div class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
          <section class="dashboard-card w-full max-w-md border-sky-500/40 p-6">
            <div class="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-500">
              <X size={24} />
            </div>
            <h2 class="ui-heading text-xl font-bold">Logout Confirmation</h2>
            <p class="ui-text mt-3 leading-7">
              Are you sure you want to logout? You will need to login again to access the admin panel.
            </p>
            <div class="mt-7 grid gap-3 sm:grid-cols-2">
              <button type="button" class="btn-secondary px-5 py-3 text-sm" onClick={() => setLogoutConfirmOpen(false)}>
                Cancel
              </button>
              <button type="button" class="btn-primary px-5 py-3 text-sm" onClick={confirmLogout}>
                Logout
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
