import { A, useNavigate } from "@solidjs/router";
import { LogOut, ShieldQuestion } from "lucide-solid";
import { createSignal } from "solid-js";

export default function LogoutPage() {
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = createSignal(false);

  const cancelLogout = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    navigate("/");
  };

  return (
    <main class="layout-shell flex min-h-[72vh] items-center justify-center py-14">
      <section class="surface-card auth-panel w-full max-w-lg p-6 text-center md:p-8">
        {confirmed() ? (
          <>
            <div class="feature-icon mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl text-red-400">
              <LogOut size={26} />
            </div>
            <h1 class="ui-heading text-3xl font-bold">Anda sudah keluar</h1>
            <p class="ui-text mt-3 leading-7">
              Sesi akun telah diakhiri. Silakan masuk kembali untuk mengakses
              dashboard.
            </p>
            <A href="/login" class="btn-primary mt-7 px-6 py-3 text-sm">
              Masuk Lagi
            </A>
          </>
        ) : (
          <>
            <div class="feature-icon mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl text-red-400">
              <ShieldQuestion size={26} />
            </div>
            <p class="eyebrow">Konfirmasi Logout</p>
            <h1 class="ui-heading mt-4 text-3xl font-bold">
              Yakin ingin keluar?
            </h1>
            <p class="ui-text mt-3 leading-7">
              Setiap tindakan logout perlu dikonfirmasi agar sesi tidak tertutup
              tanpa sengaja.
            </p>
            <div class="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                class="btn-primary px-5 py-3 text-sm"
                onClick={() => setConfirmed(true)}
              >
                Ya, Logout
              </button>
              <button
                type="button"
                class="btn-secondary px-5 py-3 text-sm"
                onClick={cancelLogout}
              >
                Tidak
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
