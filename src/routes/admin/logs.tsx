import { createEffect, createMemo, createSignal } from "solid-js";
import FilterSelect from "~/components/common/FilterSelect";
import Pagination, {
  getPaginatedRows,
  getTotalPages,
  type RowsPerPageOption,
} from "~/components/common/Pagination";
import SearchInput from "~/components/common/SearchInput";
import Sidebar from "~/components/layout/Sidebar";
import {
  accessLogs,
  type AccessLogStatus,
  type UserRole,
} from "~/data/dummyData";
import {
  accessStatusTone,
  formatDateTime,
  roleLabel,
  StatusBadge,
} from "~/pages/admin/AdminDashboard";

type RoleFilter = "semua" | UserRole;
type StatusFilter = "semua" | AccessLogStatus;

const accessStatusLabel = (status: AccessLogStatus) => {
  switch (status) {
    case "success":
      return "Success";
    case "warning":
      return "Warning";
    default:
      return "Failed";
  }
};

export default function AdminLogsRoute() {
  const [searchQuery, setSearchQuery] = createSignal("");
  const [roleFilter, setRoleFilter] = createSignal<RoleFilter>("semua");
  const [statusFilter, setStatusFilter] = createSignal<StatusFilter>("semua");
  const [page, setPage] = createSignal(1);
  const [rowsPerPage, setRowsPerPage] = createSignal<RowsPerPageOption>(10);
  const filteredLogs = createMemo(() => {
    const query = searchQuery().trim().toLowerCase();

    return accessLogs.filter((log) => {
      const roleText = roleLabel(log.role).toLowerCase();
      const statusText = accessStatusLabel(log.status).toLowerCase();
      const matchesRole = roleFilter() === "semua" || log.role === roleFilter();
      const matchesStatus =
        statusFilter() === "semua" || log.status === statusFilter();
      const matchesSearch =
        !query ||
        log.user_name.toLowerCase().includes(query) ||
        roleText.includes(query) ||
        log.activity.toLowerCase().includes(query) ||
        statusText.includes(query) ||
        log.ip_address.toLowerCase().includes(query) ||
        formatDateTime(log.access_time).toLowerCase().includes(query);

      return matchesRole && matchesStatus && matchesSearch;
    });
  });
  const sortedLogs = createMemo(() =>
    [...filteredLogs()].sort((first, second) =>
      second.access_time.localeCompare(first.access_time),
    ),
  );
  const paginatedLogs = createMemo(() =>
    getPaginatedRows(sortedLogs(), page(), rowsPerPage()),
  );

  createEffect(() => {
    const totalPages = getTotalPages(sortedLogs().length, rowsPerPage());
    if (page() > totalPages) {
      setPage(totalPages);
    }
  });

  return (
    <Sidebar title="Logs" subtitle="Riwayat akses user ke sistem SIMAKO.">
      <section class="dashboard-card overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--divider)] p-4">
          <div>
            <h2 class="ui-heading text-lg font-bold">Access Logs</h2>
            <p class="dashboard-muted mt-1 text-sm">
              Search dan filter riwayat akses user.
            </p>
          </div>
          <div class="rounded-lg border border-[var(--control-border)] bg-[var(--control-bg)] px-3 py-2 text-sm font-bold text-red-400">
            {filteredLogs().length} logs
          </div>
        </div>

        <div class="grid gap-3 border-b border-[var(--divider)] p-4 lg:grid-cols-[1fr_0.3fr_0.3fr]">
          <SearchInput
            value={searchQuery()}
            placeholder="Cari nama user, aktivitas, role, status, atau IP"
            onInput={(value) => {
              setSearchQuery(value);
              setPage(1);
            }}
          />
          <FilterSelect<RoleFilter>
            value={roleFilter()}
            ariaLabel="Filter role logs"
            options={[
              { label: "Semua role", value: "semua" },
              { label: "Admin", value: "admin" },
              { label: "Pemilik Kost", value: "pemilik_kost" },
              { label: "Penyewa", value: "penyewa" },
            ]}
            onChange={(value) => {
              setRoleFilter(value);
              setPage(1);
            }}
          />
          <FilterSelect<StatusFilter>
            value={statusFilter()}
            ariaLabel="Filter status logs"
            options={[
              { label: "Semua status", value: "semua" },
              { label: "Success", value: "success" },
              { label: "Warning", value: "warning" },
              { label: "Failed", value: "failed" },
            ]}
            onChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          />
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[920px] text-left text-sm">
            <thead class="bg-[rgba(148,163,184,0.08)] text-xs uppercase text-[rgb(var(--text-muted-rgb))]">
              <tr>
                <th class="px-5 py-3 font-bold">Nama User</th>
                <th class="px-5 py-3 font-bold">Role</th>
                <th class="px-5 py-3 font-bold">Aktivitas</th>
                <th class="px-5 py-3 font-bold">Waktu Akses</th>
                <th class="px-5 py-3 font-bold">Status</th>
                <th class="px-5 py-3 font-bold">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs().map((log) => (
                <tr class="border-t border-[var(--divider)]">
                  <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">
                    {log.user_name}
                  </td>
                  <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">
                    {roleLabel(log.role)}
                  </td>
                  <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">
                    {log.activity}
                  </td>
                  <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">
                    {formatDateTime(log.access_time)}
                  </td>
                  <td class="px-5 py-4">
                    <StatusBadge
                      value={accessStatusLabel(log.status)}
                      tone={accessStatusTone(log.status)}
                    />
                  </td>
                  <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">
                    {log.ip_address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLogs().length === 0 && (
          <div class="p-5">
            <div class="rounded-xl border border-dashed border-[var(--surface-border)] bg-[var(--control-bg)] p-6 text-center text-sm text-[rgb(var(--text-muted-rgb))]">
              Tidak ada logs yang cocok dengan filter.
            </div>
          </div>
        )}
        <div class="p-4">
          <Pagination
            ariaLabel="Pagination logs akses admin"
            page={page()}
            totalItems={filteredLogs().length}
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
