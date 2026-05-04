import { createEffect, createMemo, createSignal } from "solid-js";
import FilterSelect from "~/components/common/FilterSelect";
import Pagination, {
  getPaginatedRows,
  getTotalPages,
  type RowsPerPageOption,
} from "~/components/common/Pagination";
import SearchInput from "~/components/common/SearchInput";
import Sidebar from "~/components/layout/Sidebar";
import { users, type UserStatus } from "~/data/dummyData";
import {
  formatDateTime,
  StatusBadge,
  statusLabel,
} from "~/pages/admin/AdminDashboard";

type StatusFilter = "semua" | UserStatus;

export default function AdminOwnerAccountsRoute() {
  const [searchQuery, setSearchQuery] = createSignal("");
  const [statusFilter, setStatusFilter] = createSignal<StatusFilter>("semua");
  const [page, setPage] = createSignal(1);
  const [rowsPerPage, setRowsPerPage] = createSignal<RowsPerPageOption>(10);
  const ownerUsers = createMemo(() =>
    users.filter((user) => user.role === "pemilik_kost"),
  );
  const filteredUsers = createMemo(() => {
    const query = searchQuery().trim().toLowerCase();

    return ownerUsers().filter((user) => {
      const matchesStatus = statusFilter() === "semua" || user.status === statusFilter();
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  });
  const paginatedUsers = createMemo(() =>
    getPaginatedRows(filteredUsers(), page(), rowsPerPage()),
  );

  createEffect(() => {
    const totalPages = getTotalPages(filteredUsers().length, rowsPerPage());
    if (page() > totalPages) {
      setPage(totalPages);
    }
  });

  return (
    <Sidebar
      title="Akun Pemilik"
      subtitle="Daftar akun pemilik kost yang terdaftar di SIMAKO."
    >
      <section class="dashboard-card overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--divider)] p-4">
          <div>
            <h2 class="ui-heading text-lg font-bold">Akun Pemilik Kost</h2>
            <p class="dashboard-muted mt-1 text-sm">Search dan filter status akun pemilik kost.</p>
          </div>
          <div class="rounded-lg border border-[var(--control-border)] bg-[var(--control-bg)] px-3 py-2 text-sm font-bold text-red-400">
            {filteredUsers().length} akun
          </div>
        </div>

        <div class="grid gap-3 border-b border-[var(--divider)] p-4 lg:grid-cols-[1fr_0.35fr]">
          <SearchInput
            value={searchQuery()}
            placeholder="Cari nama, email, atau nomor HP"
            onInput={(value) => {
              setSearchQuery(value);
              setPage(1);
            }}
          />
          <FilterSelect<StatusFilter>
            value={statusFilter()}
            ariaLabel="Filter status akun pemilik"
            options={[
              { label: "Semua status", value: "semua" },
              { label: "Aktif", value: "aktif" },
              { label: "Pending", value: "pending" },
              { label: "Nonaktif", value: "nonaktif" },
            ]}
            onChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          />
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[820px] text-left text-sm">
            <thead class="bg-[rgba(148,163,184,0.08)] text-xs uppercase text-[rgb(var(--text-muted-rgb))]">
              <tr>
                <th class="px-5 py-3 font-bold">Nama</th>
                <th class="px-5 py-3 font-bold">Email</th>
                <th class="px-5 py-3 font-bold">Nomor HP</th>
                <th class="px-5 py-3 font-bold">Status</th>
                <th class="px-5 py-3 font-bold">Dibuat</th>
                <th class="px-5 py-3 font-bold">Login Terakhir</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers().map((user) => (
                <tr class="border-t border-[var(--divider)]">
                  <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">
                    {user.name}
                  </td>
                  <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">
                    {user.email}
                  </td>
                  <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">
                    {user.phone}
                  </td>
                  <td class="px-5 py-4">
                    <StatusBadge
                      value={statusLabel(user.status)}
                      tone={
                        user.status === "aktif"
                          ? "success"
                          : user.status === "pending"
                            ? "warning"
                            : "danger"
                      }
                    />
                  </td>
                  <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">
                    {formatDateTime(user.created_at)}
                  </td>
                  <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">
                    {formatDateTime(user.last_login)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers().length === 0 && (
          <div class="p-5">
            <div class="rounded-xl border border-dashed border-[var(--surface-border)] bg-[var(--control-bg)] p-6 text-center text-sm text-[rgb(var(--text-muted-rgb))]">
              Tidak ada akun pemilik yang cocok dengan filter.
            </div>
          </div>
        )}
        <div class="p-4">
          <Pagination
            ariaLabel="Pagination akun pemilik"
            page={page()}
            totalItems={filteredUsers().length}
            rowsPerPage={rowsPerPage()}
            onPageChange={setPage}
            onRowsPerPageChange={(rows) => {
              setRowsPerPage(rows);
              setPage(1);
            }}
          />
        </div>
      </section>
    </Sidebar>
  );
}
