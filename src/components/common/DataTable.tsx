import type { JSX } from "solid-js";

export interface DataTableColumn<T> {
  header: string;
  class?: string;
  render: (row: T) => JSX.Element;
}

export default function DataTable<T>(props: {
  columns: DataTableColumn<T>[];
  rows: T[];
  minWidthClass?: string;
  emptyText?: string;
}) {
  return (
    <>
      <div class="overflow-x-auto">
        <table class={`w-full ${props.minWidthClass ?? "min-w-[760px]"} text-left text-sm`}>
          <thead class="bg-[rgba(148,163,184,0.08)] text-xs uppercase text-[rgb(var(--text-muted-rgb))]">
            <tr>
              {props.columns.map((column) => (
                <th class={`px-5 py-3 font-bold ${column.class ?? ""}`}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {props.rows.map((row) => (
              <tr class="border-t border-[var(--divider)]">
                {props.columns.map((column) => (
                  <td class={`px-5 py-4 text-[rgb(var(--text-body-rgb))] ${column.class ?? ""}`}>{column.render(row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {props.rows.length === 0 && (
        <div class="p-5">
          <div class="rounded-xl border border-dashed border-[var(--surface-border)] bg-[var(--control-bg)] p-6 text-center text-sm text-[rgb(var(--text-muted-rgb))]">
            {props.emptyText ?? "Tidak ada data."}
          </div>
        </div>
      )}
    </>
  );
}
