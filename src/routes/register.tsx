import { A } from "@solidjs/router";
import { Building2, CheckCircle2, Mail, Phone, User, UserPlus, Users } from "lucide-solid";
import { createSignal } from "solid-js";

type RegisterRole = "tenant" | "owner";

const roleContent = {
  tenant: {
    label: "Penyewa",
    title: "Daftar sebagai Penyewa",
    description: "Cari kamar, ajukan booking, dan pantau status pembayaran dari akun penyewa.",
    icon: Users,
    bullets: ["Simpan kamar favorit", "Booking dan survei lebih cepat", "Riwayat tagihan rapi"]
  },
  owner: {
    label: "Pemilik Kost",
    title: "Daftar sebagai Pemilik Kost",
    description: "Kelola data kamar, penyewa, tagihan, dan komunikasi operasional kost.",
    icon: Building2,
    bullets: ["Kelola banyak kamar", "Pantau okupansi", "Rekap tagihan penyewa"]
  }
};

export default function RegisterPage() {
  const [role, setRole] = createSignal<RegisterRole>("tenant");
  const activeContent = () => roleContent[role()];

  return (
    <main class="layout-shell py-14">
      <section class="mx-auto max-w-5xl">
        <div class="text-center">
          <p class="eyebrow">Daftar SIMAKO</p>
          <h1 class="ui-heading mt-4 text-4xl font-bold md:text-5xl">Pilih tipe akun yang Anda butuhkan</h1>
          <p class="ui-lead mx-auto mt-4 max-w-2xl leading-8">
            SIMAKO memisahkan alur penyewa dan pemilik kost agar proses daftar, pengelolaan, dan akses fitur lebih tepat.
          </p>
        </div>

        <div class="mt-9 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <aside class="surface-card p-5 md:p-6">
            <div class="grid gap-3">
              {(["tenant", "owner"] as RegisterRole[]).map((item) => {
                const Icon = roleContent[item].icon;

                return (
                  <button
                    type="button"
                    class={`role-option ${role() === item ? "role-option-active" : ""}`}
                    onClick={() => setRole(item)}
                  >
                    <span class="role-option-icon">
                      <Icon size={20} />
                    </span>
                    <span class="text-left">
                      <span class="ui-title block font-semibold">{roleContent[item].label}</span>
                      <span class="ui-muted mt-1 block text-sm">{roleContent[item].description}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div class="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 p-4">
              <h2 class="text-sm font-bold text-red-400">{activeContent().title}</h2>
              <div class="mt-3 space-y-2">
                {activeContent().bullets.map((item) => (
                  <div class="check-row text-sm">
                    <CheckCircle2 size={16} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section class="surface-card auth-panel p-6 md:p-8">
            <div class="mb-7">
              <h2 class="ui-heading text-2xl font-bold">{activeContent().title}</h2>
              <p class="ui-text mt-2 text-sm">{activeContent().description}</p>
            </div>

            <form class="grid gap-5 md:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
              <label class="block md:col-span-2">
                <span class="form-label">Nama lengkap</span>
                <span class="relative mt-2 block">
                  <User class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-red-400" size={17} />
                  <input class="form-control pl-10" placeholder="Nama sesuai identitas" />
                </span>
              </label>

              <label class="block">
                <span class="form-label">Email</span>
                <span class="relative mt-2 block">
                  <Mail class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-red-400" size={17} />
                  <input class="form-control pl-10" type="email" placeholder="nama@email.com" />
                </span>
              </label>

              <label class="block">
                <span class="form-label">Nomor WhatsApp</span>
                <span class="relative mt-2 block">
                  <Phone class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-red-400" size={17} />
                  <input class="form-control pl-10" placeholder="08xxxxxxxxxx" />
                </span>
              </label>

              <label class="block md:col-span-2">
                <span class="form-label">{role() === "tenant" ? "Preferensi lokasi" : "Nama kost"}</span>
                <input
                  class="form-control mt-2"
                  placeholder={role() === "tenant" ? "Contoh: dekat kampus, Purwokerto Selatan" : "Contoh: Kost Melati Purwokerto"}
                />
              </label>

              <label class="block">
                <span class="form-label">Password</span>
                <input class="form-control mt-2" type="password" placeholder="Minimal 8 karakter" />
              </label>

              <label class="block">
                <span class="form-label">Konfirmasi password</span>
                <input class="form-control mt-2" type="password" placeholder="Ulangi password" />
              </label>

              <button type="submit" class="btn-primary md:col-span-2 px-5 py-3 text-sm">
                <UserPlus size={17} />
                Daftar sebagai {activeContent().label}
              </button>
            </form>

            <p class="ui-text mt-6 text-center text-sm">
              Sudah punya akun?{" "}
              <A href="/login" class="font-semibold text-red-400 transition hover:text-red-300">
                Masuk
              </A>
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
