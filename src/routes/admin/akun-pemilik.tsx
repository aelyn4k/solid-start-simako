import { createMemo } from "solid-js";
import Sidebar from "~/components/layout/Sidebar";
import { users } from "~/data/dummyData";
import {
  formatDateTime,
  StatusBadge,
  statusLabel,
} from "~/pages/admin/AdminDashboard";

export default function AdminOwnerAccountsRoute() {
  const ownerUsers = createMemo(() =>
    users.filter((user) => user.role === "pemilik_kost"),
  );

  return (
    <Sidebar
      title="Akun Pemilik"
      subtitle="Daftar akun pemilik kost yang terdaftar di SIMAKO."
    >
      <section class="dashboard-card overflow-hidden">
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
              {ownerUsers().map((user) => (
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
      </section>
    </Sidebar>
  );
}
