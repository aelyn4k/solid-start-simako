import { X } from "lucide-solid";
import type { JSX } from "solid-js";

export default function FormModal(props: {
  title: string;
  subtitle?: string;
  maxWidthClass?: string;
  onClose: () => void;
  children: JSX.Element;
}) {
  return (
    <div class="modal-backdrop-animate fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md">
      <section class={`dashboard-card modal-panel-animate my-6 w-full ${props.maxWidthClass ?? "max-w-2xl"} p-6`}>
        <div class="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 class="ui-heading text-xl font-bold">{props.title}</h2>
            {props.subtitle && <p class="dashboard-muted mt-2 text-sm">{props.subtitle}</p>}
          </div>
          <button type="button" class="icon-button h-9 w-9" aria-label="Tutup modal" onClick={props.onClose}>
            <X size={17} />
          </button>
        </div>
        {props.children}
      </section>
    </div>
  );
}
