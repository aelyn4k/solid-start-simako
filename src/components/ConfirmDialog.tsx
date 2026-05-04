import { AlertTriangle, X } from "lucide-solid";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "danger" | "info";
  zIndexClass?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
  const tone = () => props.tone ?? "danger";

  return (
    <div
      class={`modal-backdrop-animate fixed inset-0 ${props.zIndexClass ?? "z-[80]"} flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md`}
    >
      <section class="dashboard-card modal-panel-animate w-full max-w-md border-red-500/40 p-6">
        <div
          class={`mb-5 flex h-12 w-12 items-center justify-center rounded-full ${
            tone() === "danger" ? "bg-red-500/15 text-red-300" : "bg-sky-500/15 text-sky-300"
          }`}
        >
          {tone() === "danger" ? <AlertTriangle size={24} /> : <X size={24} />}
        </div>
        <h2 class="ui-heading text-xl font-bold">{props.title}</h2>
        <p class="ui-text mt-3 leading-7">{props.message}</p>
        <div class="mt-7 grid gap-3 sm:grid-cols-2">
          <button type="button" class="btn-secondary px-5 py-3 text-sm" onClick={props.onCancel}>
            {props.cancelLabel ?? "Batal"}
          </button>
          <button type="button" class="btn-primary px-5 py-3 text-sm" onClick={props.onConfirm}>
            {props.confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
