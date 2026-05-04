import { ChevronLeft, ChevronRight } from "lucide-solid";
import { createMemo } from "solid-js";

export type RowsPerPageOption = 10 | 50 | 100;

export const rowsPerPageOptions: RowsPerPageOption[] = [10, 50, 100];

export const parseRowsPerPage = (value: string): RowsPerPageOption => {
  const parsed = Number(value);
  return parsed === 50 || parsed === 100 ? parsed : 10;
};

export const getTotalPages = (totalItems: number, rowsPerPage: RowsPerPageOption) =>
  Math.max(1, Math.ceil(totalItems / rowsPerPage));

export const getPaginatedRows = <T,>(
  rows: T[],
  page: number,
  rowsPerPage: RowsPerPageOption,
) => rows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

export default function Pagination(props: {
  ariaLabel: string;
  page: number;
  totalItems: number;
  rowsPerPage: RowsPerPageOption;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: RowsPerPageOption) => void;
}) {
  const totalPages = createMemo(() => getTotalPages(props.totalItems, props.rowsPerPage));
  const entryStart = createMemo(() =>
    props.totalItems === 0 ? 0 : (props.page - 1) * props.rowsPerPage + 1,
  );
  const entryEnd = createMemo(() =>
    Math.min(props.page * props.rowsPerPage, props.totalItems),
  );

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages()) {
      return;
    }

    props.onPageChange(nextPage);
  };

  return (
    <nav class="pagination-bar" aria-label={props.ariaLabel}>
      <div class="pagination-left">
        <p class="pagination-info">
          {entryStart()}-{entryEnd()} of {props.totalItems} entries
        </p>
        <label class="rows-control">
          <span>Rows</span>
          <select
            class="rows-select"
            value={String(props.rowsPerPage)}
            onChange={(event) => props.onRowsPerPageChange(parseRowsPerPage(event.currentTarget.value))}
          >
            {rowsPerPageOptions.map((option) => (
              <option value={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>
      <div class="pagination-controls">
        <button
          type="button"
          class="pagination-button pagination-button-wide"
          disabled={props.page === 1}
          onClick={() => goToPage(props.page - 1)}
        >
          <ChevronLeft size={14} />
          Prev
        </button>
        {Array.from({ length: totalPages() }, (_, index) => index + 1).map((item) => (
          <button
            type="button"
            class={`pagination-button ${props.page === item ? "pagination-button-active" : ""}`}
            onClick={() => goToPage(item)}
          >
            {item}
          </button>
        ))}
        <button
          type="button"
          class="pagination-button pagination-button-wide"
          disabled={props.page === totalPages()}
          onClick={() => goToPage(props.page + 1)}
        >
          Next
          <ChevronRight size={14} />
        </button>
      </div>
    </nav>
  );
}
