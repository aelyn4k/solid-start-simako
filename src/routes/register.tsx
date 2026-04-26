import { A } from "@solidjs/router";
import {
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  User,
  UserPlus,
  Users,
} from "lucide-solid";
import { createSignal } from "solid-js";
import { saveUserRole, type AuthRole } from "~/lib/auth";

type RegisterRole = "tenant" | "owner";

const roleContent = {
  tenant: {
    label: "Penyewa",
    title: "Daftar sebagai Penyewa",
    description:
      "Cari kamar, ajukan booking, dan pantau status pembayaran dari akun penyewa.",
    icon: Users,
    bullets: [
      "Simpan kamar favorit",
      "Booking dan survei lebih cepat",
      "Riwayat tagihan rapi",
    ],
  },
  owner: {
    label: "Pemilik Kost",
    title: "Daftar sebagai Pemilik Kost",
    description:
      "Kelola data kamar, penyewa, tagihan, dan komunikasi operasional kost.",
    icon: Building2,
    bullets: [
      "Kelola banyak kamar",
      "Pantau okupansi",
      "Rekap tagihan penyewa",
    ],
  },
};

export default function RegisterPage() {
  const [role, setRole] = createSignal<RegisterRole>("tenant");
  const [email, setEmail] = createSignal("");
  const [showPassword, setShowPassword] = createSignal(false);
  const [showConfirmPassword, setShowConfirmPassword] = createSignal(false);
  const activeContent = () => roleContent[role()];
  const authRole = (): AuthRole => (role() === "owner" ? "pemilik" : "penyewa");
  const submitRegister = () => {
    saveUserRole(email(), authRole());
  };

  return (
    <main class="layout-shell flex min-h-[72vh] items-center justify-center py-14">
      <section class="w-full max-w-5xl">
        <div class="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
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
                      <span class="ui-title block font-semibold">
                        {roleContent[item].label}
                      </span>
                      <span class="ui-muted mt-1 block text-sm">
                        {roleContent[item].description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div class="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 p-4">
              <h2 class="text-sm font-bold text-red-400">
                {activeContent().title}
              </h2>
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
              <h2 class="ui-heading text-2xl font-bold">
                {activeContent().title}
              </h2>
              <p class="ui-text mt-2 text-sm">{activeContent().description}</p>
            </div>

            <form
              class="grid gap-5 md:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                submitRegister();
              }}
            >
              <label class="block md:col-span-2">
                <span class="form-label">Nama lengkap</span>
                <span class="input-with-icon mt-2 block">
                  <User class="input-icon" size={17} />
                  <input
                    class="form-control form-control-icon"
                    placeholder="Nama sesuai identitas"
                  />
                </span>
              </label>

              <label class="block">
                <span class="form-label">Email</span>
                <span class="input-with-icon mt-2 block">
                  <Mail class="input-icon" size={17} />
                  <input
                    class="form-control form-control-icon"
                    type="email"
                    value={email()}
                    onInput={(event) => setEmail(event.currentTarget.value)}
                    placeholder="nama@email.com"
                    required
                  />
                </span>
              </label>

              <label class="block">
                <span class="form-label">Nomor WhatsApp</span>
                <span class="input-with-icon mt-2 block">
                  <Phone class="input-icon" size={17} />
                  <input
                    class="form-control form-control-icon"
                    placeholder="08xxxxxxxxxx"
                  />
                </span>
              </label>

              {role() === "owner" && (
                <label class="block md:col-span-2">
                  <span class="form-label">Nama kost</span>
                  <input
                    class="form-control mt-2"
                    placeholder="Contoh: Kost Melati Purwokerto"
                  />
                </label>
              )}

              <label class="block">
                <span class="form-label">Password</span>
                <span class="input-with-icon mt-2 block">
                  <LockKeyhole class="input-icon" size={17} />
                  <input
                    class="form-control form-control-icon form-control-action"
                    type={showPassword() ? "text" : "password"}
                    placeholder="Minimal 8 karakter"
                  />
                  <button
                    type="button"
                    class="input-action-button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword()
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                  >
                    {showPassword() ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </span>
              </label>

              <label class="block">
                <span class="form-label">Konfirmasi password</span>
                <span class="input-with-icon mt-2 block">
                  <LockKeyhole class="input-icon" size={17} />
                  <input
                    class="form-control form-control-icon form-control-action"
                    type={showConfirmPassword() ? "text" : "password"}
                    placeholder="Ulangi password"
                  />
                  <button
                    type="button"
                    class="input-action-button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    aria-label={
                      showConfirmPassword()
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                  >
                    {showConfirmPassword() ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </span>
              </label>

              <button
                type="submit"
                class="btn-primary md:col-span-2 px-5 py-3 text-sm"
              >
                <UserPlus size={17} />
                Daftar sebagai {activeContent().label}
              </button>
            </form>

            <p class="ui-text mt-6 text-center text-sm">
              Sudah punya akun?{" "}
              <A
                href="/login"
                class="font-semibold text-red-400 transition hover:text-red-300"
              >
                Masuk
              </A>
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
