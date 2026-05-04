import { A, useNavigate } from "@solidjs/router";
import { Eye, EyeOff, LockKeyhole, LogIn, Mail } from "lucide-solid";
import { createSignal } from "solid-js";
import { resolveUserRole } from "~/lib/auth";
import { getDashboardPathByRole } from "~/utils/roleAccess";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = createSignal("");
  const [showPassword, setShowPassword] = createSignal(false);

  const submitLogin = () => {
    const authorizedRole = resolveUserRole(email());

    try {
      localStorage.setItem("simako-session-role", authorizedRole);
    } catch {
      // Role remains available through this redirect flow even if storage is unavailable.
    }

    navigate(getDashboardPathByRole(authorizedRole));
  };

  return (
    <main class="layout-shell flex min-h-[72vh] items-center justify-center py-14">
      <section class="surface-card auth-panel w-full max-w-md p-6 md:p-8">
        <div class="mb-7">
          <h2 class="ui-heading text-2xl font-bold">Masuk ke Akun</h2>
          <p class="ui-text mt-2 text-sm">
            Gunakan email dan password yang sudah terdaftar.
          </p>
        </div>

        <form
          class="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            submitLogin();
          }}
        >
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
