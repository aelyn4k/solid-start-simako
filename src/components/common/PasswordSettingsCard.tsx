import { KeyRound, Save } from "lucide-solid";
import { createMemo, createSignal } from "solid-js";

type PasswordSettingsCardProps = {
  description: string;
  successMessage?: string;
};

const emptyForm = () => ({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

export default function PasswordSettingsCard(props: PasswordSettingsCardProps) {
  const [form, setForm] = createSignal(emptyForm());
  const [error, setError] = createSignal("");
  const [success, setSuccess] = createSignal("");

  const canSubmit = createMemo(() =>
    Boolean(
      form().currentPassword.trim() &&
        form().newPassword.trim() &&
        form().confirmPassword.trim(),
    ),
  );

  const submit = () => {
    const currentForm = form();

    setError("");
    setSuccess("");

    if (!currentForm.currentPassword.trim()) {
      setError("Password saat ini wajib diisi.");
      return;
    }

    if (currentForm.newPassword.length < 8) {
      setError("Password baru minimal 8 karakter.");
      return;
    }

    if (currentForm.newPassword !== currentForm.confirmPassword) {
      setError("Konfirmasi password baru tidak sesuai.");
      return;
    }

    setForm(emptyForm());
    setSuccess(props.successMessage ?? "Password berhasil diperbarui.");
  };

  return (
    <section class="dashboard-card max-w-2xl p-6">
      <div class="mb-6 flex items-center gap-3">
        <div class="flex h-11 w-11 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 text-red-400">
          <KeyRound size={20} />
        </div>
        <div>
          <h2 class="ui-heading text-lg font-bold">Ubah Password</h2>
          <p class="dashboard-muted mt-1 text-sm">{props.description}</p>
        </div>
      </div>

      <form
        class="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <label class="block">
          <span class="form-label">Password saat ini</span>
          <input
            class="form-control mt-2"
            type="password"
            value={form().currentPassword}
            placeholder="Masukkan password saat ini"
            onInput={(event) =>
              setForm({ ...form(), currentPassword: event.currentTarget.value })
            }
          />
        </label>
        <label class="block">
          <span class="form-label">Password baru</span>
          <input
            class="form-control mt-2"
            type="password"
            value={form().newPassword}
            placeholder="Minimal 8 karakter"
            onInput={(event) =>
              setForm({ ...form(), newPassword: event.currentTarget.value })
            }
          />
        </label>
        <label class="block">
          <span class="form-label">Konfirmasi password baru</span>
          <input
            class="form-control mt-2"
            type="password"
            value={form().confirmPassword}
            placeholder="Ulangi password baru"
            onInput={(event) =>
              setForm({ ...form(), confirmPassword: event.currentTarget.value })
            }
          />
        </label>

        {error() && <p class="text-sm font-semibold text-red-400">{error()}</p>}
        {success() && (
          <p class="text-sm font-semibold text-emerald-400">{success()}</p>
        )}

        <div class="pt-2">
          <button
            type="submit"
            class="btn-primary px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!canSubmit()}
          >
            <Save size={16} />
            Simpan Password
          </button>
        </div>
      </form>
    </section>
  );
}
