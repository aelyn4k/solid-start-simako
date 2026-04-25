import { A } from "@solidjs/router";
import { Eye, EyeOff, LockKeyhole, LogIn, Mail, ShieldCheck } from "lucide-solid";
import { createSignal } from "solid-js";

export default function LoginPage() {
  const [showPassword, setShowPassword] = createSignal(false);

  return (
    <main class="layout-shell grid min-h-[72vh] items-center gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr]">
      <section>
        <p class="eyebrow">Masuk SIMAKO</p>
        <h1 class="ui-heading mt-4 text-4xl font-bold leading-tight md:text-5xl">
          Kelola kost dan booking kamar dari satu akun.
        </h1>
        <p class="ui-lead mt-5 max-w-xl leading-8">
          Masuk untuk memantau status kamar, tagihan, data penyewa, dan proses
          booking tanpa berpindah platform.
        </p>
        <div class="mt-8 grid gap-3 sm:grid-cols-2">
          <div class="auth-benefit">
            <ShieldCheck size={18} />
            <span>Data akun terlindungi</span>
          </div>
          <div class="auth-benefit">
            <LogIn size={18} />
            <span>Akses cepat ke dashboard</span>
          </div>
        </div>
      </section>

      <section class="surface-card auth-panel p-6 md:p-8">
        <div class="mb-7">
          <h2 class="ui-heading text-2xl font-bold">Masuk ke Akun</h2>
          <p class="ui-text mt-2 text-sm">
            Gunakan email dan password yang sudah terdaftar.
          </p>
        </div>

        <form class="space-y-5" onSubmit={(event) => event.preventDefault()}>
          <label class="block">
            <span class="form-label">Email</span>
            <span class="input-with-icon mt-2 block">
              <Mail class="input-icon" size={17} />
              <input
                class="form-control form-control-icon"
                type="email"
                placeholder="nama@email.com"
              />
            </span>
          </label>

          <label class="block">
            <span class="form-label">Password</span>
            <span class="input-with-icon mt-2 block">
              <LockKeyhole class="input-icon" size={17} />
              <input
                class="form-control form-control-icon form-control-action"
                type={showPassword() ? "text" : "password"}
                placeholder="Masukkan password"
              />
              <button
                type="button"
                class="input-action-button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword() ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword() ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </span>
          </label>

          <div class="flex flex-wrap items-center justify-between gap-3 text-sm">
            <label class="inline-flex items-center gap-2 ui-text">
              <input type="checkbox" class="accent-red-500" />
              Ingat saya
            </label>
            <A
              href="/forgot-password"
              class="font-semibold text-red-400 transition hover:text-red-300"
            >
              Lupa password?
            </A>
          </div>

          <button type="submit" class="btn-primary w-full px-5 py-3 text-sm">
            <LogIn size={17} />
            Masuk
          </button>
        </form>

        <p class="ui-text mt-6 text-center text-sm">
          Belum punya akun?{" "}
          <A
            href="/register"
            class="font-semibold text-red-400 transition hover:text-red-300"
          >
            Daftar sekarang
          </A>
        </p>
      </section>
    </main>
  );
}
