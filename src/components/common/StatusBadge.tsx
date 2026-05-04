export type StatusBadgeTone = "success" | "danger" | "warning" | "info" | "neutral";

const toneClass = (tone: StatusBadgeTone) => {
  switch (tone) {
    case "success":
      return "border-emerald-400/30 bg-emerald-500/10 text-emerald-300";
    case "danger":
      return "border-red-400/30 bg-red-500/10 text-red-300";
    case "warning":
      return "border-orange-400/30 bg-orange-500/10 text-orange-300";
    case "info":
      return "border-sky-400/30 bg-sky-500/10 text-sky-300";
    default:
      return "border-slate-400/30 bg-slate-500/10 text-slate-300";
  }
};

export default function StatusBadge(props: { value: string; tone?: StatusBadgeTone }) {
  return (
    <span class={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${toneClass(props.tone ?? "neutral")}`}>
      {props.value}
    </span>
  );
}
