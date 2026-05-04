import { createMemo } from "solid-js";
import Sidebar from "~/components/layout/Sidebar";
import { accessLogs } from "~/data/dummyData";
import { accessStatusTone, formatDateTime, roleLabel, StatusBadge } from "~/pages/admin/AdminDashboard";

export default function AdminLogsRoute() {
  const sortedLogs = createMemo(() =>
    [...accessLogs].sort((first, second) => second.access_time.localeCompare(first.access_time)),
  );

  return (
    <Sidebar title="Logs" subtitle="Riwayat akses user ke sistem SIMAKO.">
      <section class="dashboard-card overflow-hidden">
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
              {sortedLogs().map((log) => (
                <tr class="border-t border-[var(--divider)]">
                  <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">{log.user_name}</td>
                  <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">{roleLabel(log.role)}</td>
                  <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">{log.activity}</td>
                  <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">{formatDateTime(log.access_time)}</td>
                  <td class="px-5 py-4">
                    <StatusBadge value={log.status} tone={accessStatusTone(log.status)} />
                  </td>
                  <td class="px-5 py-4 text-[rgb(var(--text-body-rgb))]">{log.ip_address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Sidebar>
  );
}
