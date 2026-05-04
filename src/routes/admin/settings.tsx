import { KeyRound, Save } from "lucide-solid";
import Sidebar from "~/components/layout/Sidebar";

export default function AdminSettingsRoute() {
  return (
    <Sidebar
      title="Settings"
      subtitle="Pengaturan akun admin untuk keamanan akses panel."
    >
      <section class="dashboard-card max-w-2xl p-6">
        <div class="mb-6 flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 text-red-400">
            <KeyRound size={20} />
          </div>
          <div>
            <h2 class="ui-heading text-lg font-bold">Ubah Password</h2>
            <p class="dashboard-muted mt-1 text-sm">
              Gunakan password yang kuat untuk menjaga akses admin.
            </p>
          </div>
        </div>

        <form class="grid gap-4" onSubmit={(event) => event.preventDefault()}>
          <label class="block">
            <span class="form-label">Password saat ini</span>
            <input
              class="form-control mt-2"
              type="password"
              placeholder="Masukkan password saat ini"
            />
          </label>
          <label class="block">
            <span class="form-label">Password baru</span>
            <input
              class="form-control mt-2"
              type="password"
              placeholder="Minimal 8 karakter"
            />
          </label>
          <label class="block">
            <span class="form-label">Konfirmasi password baru</span>
            <input
              class="form-control mt-2"
              type="password"
              placeholder="Ulangi password baru"
            />
          </label>
          <div class="pt-2">
            <button type="submit" class="btn-primary px-5 py-3 text-sm">
              <Save size={16} />
              Simpan Password
            </button>
          </div>
        </form>
      </section>
    </Sidebar>
  );
}
