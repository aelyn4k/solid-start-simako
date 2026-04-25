import { A } from "@solidjs/router";
import { ArrowLeft, KeyRound, Mail, Send } from "lucide-solid";

export default function ForgotPasswordPage() {
  return (
    <main class="layout-shell flex min-h-[72vh] items-center justify-center py-14">
      <section class="surface-card auth-panel w-full max-w-xl p-6 md:p-8">
        <A
          href="/login"
          class="inline-flex items-center gap-2 text-sm font-semibold text-red-400 transition hover:text-red-300"
        >
          <ArrowLeft size={16} />
          Kembali ke Login
        </A>

        <div class="mt-7">
          <div class="feature-icon mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl text-red-400">
            <KeyRound size={22} />
          </div>
          <h1 class="ui-heading text-3xl font-bold">Lupa Password</h1>
          <p class="ui-text mt-3 leading-7">
            Masukkan email akun SIMAKO. Instruksi reset password akan dikirim
            jika email terdaftar.
          </p>
        </div>

        <form
          class="mt-7 space-y-5"
          onSubmit={(event) => event.preventDefault()}
        >
          <label class="block">
            <span class="form-label">Email terdaftar</span>
            <span class="input-with-icon mt-2 block">
              <Mail class="input-icon" size={17} />
              <input
                class="form-control form-control-icon"
                type="email"
                placeholder="nama@email.com"
              />
            </span>
          </label>

          <button type="submit" class="btn-primary w-full px-5 py-3 text-sm">
            <Send size={17} />
            Kirim Instruksi Reset
          </button>
        </form>
      </section>
    </main>
  );
}
