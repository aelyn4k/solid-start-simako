import {
  Activity,
  CheckCircle2,
  Database,
  MailCheck,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-solid";
import { createMemo } from "solid-js";
import type { Component } from "solid-js";
import {
  accessLogs,
  users,
  type UserRole,
  type UserStatus,
} from "~/data/dummyData";

type Tone = "red" | "green" | "orange" | "blue";
type BadgeTone = "success" | "danger" | "warning" | "info" | "neutral";
type IconComponent = Component<{ size?: number; class?: string }>;

interface StatCard {
  label: string;
  value: string;
  tone: Tone;
  icon: IconComponent;
}

interface QuickStat {
  label: string;
  value: string;
  tone: Tone;
}

const currentMonth = "2026-05";

const systemStatus = [
  { label: "Auth Service", value: "Operational", icon: ShieldCheck },
  { label: "Database", value: "Operational", icon: Database },
  { label: "Email Service", value: "Operational", icon: MailCheck },
];

const formatNumber = (value: number) =>
  new Intl.NumberFormat("id-ID").format(value);

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const roleLabel = (role: UserRole) => {
  switch (role) {
    case "pemilik_kost":
      return "Pemilik Kost";
    case "penyewa":
      return "Penyewa";
    default:
      return "Admin";
  }
};

const statusLabel = (status: UserStatus) => {
  switch (status) {
    case "aktif":
      return "Aktif";
    case "nonaktif":
      return "Nonaktif";
    default:
      return "Pending";
  }
};

const statTextClass = (tone: Tone) => {
  switch (tone) {
    case "green":
      return "text-emerald-400";
    case "orange":
      return "text-orange-400";
    case "blue":
      return "text-sky-400";
    default:
      return "text-red-400";
  }
};

const statIconClass = (tone: Tone) => {
  switch (tone) {
    case "green":
      return "border-emerald-400/20 bg-emerald-500/10 text-emerald-400";
    case "orange":
      return "border-orange-400/20 bg-orange-500/10 text-orange-400";
    case "blue":
      return "border-sky-400/20 bg-sky-500/10 text-sky-400";
    default:
      return "border-red-400/20 bg-red-500/10 text-red-400";
  }
};

const badgeToneClass = (tone: BadgeTone) => {
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

const accessStatusTone = (status: string): BadgeTone => {
  if (status === "success") {
    return "success";
  }

  if (status === "warning") {
    return "warning";
  }

  if (status === "failed") {
    return "danger";
  }

  return "neutral";
};

function StatusBadge(props: { value: string; tone?: BadgeTone }) {
  return (
    <span
      class={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${badgeToneClass(props.tone ?? "neutral")}`}
    >
      {props.value}
    </span>
  );
}

function StatCardItem(props: { stat: StatCard }) {
  const Icon = props.stat.icon;

  return (
    <article class="dashboard-card min-h-[110px] p-5">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="dashboard-muted text-sm">{props.stat.label}</p>
          <p
            class={`mt-2 text-3xl font-bold ${statTextClass(props.stat.tone)}`}
          >
            {props.stat.value}
          </p>
        </div>
        <div
          class={`flex h-10 w-10 items-center justify-center rounded-xl border ${statIconClass(props.stat.tone)}`}
        >
          <Icon size={18} />
        </div>
      </div>
    </article>
  );
}

function QuickStatItem(props: { stat: QuickStat }) {
  return (
    <div class="rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
      <p class="dashboard-muted text-sm">{props.stat.label}</p>
      <p class={`mt-2 text-2xl font-bold ${statTextClass(props.stat.tone)}`}>
        {props.stat.value}
      </p>
    </div>
  );
}

export default function AdminDashboard() {
  const managedUsers = createMemo(() =>
    users.filter((user) => user.role !== "admin"),
  );
  const activeUsers = createMemo(() =>
    managedUsers().filter((user) => user.status === "aktif"),
  );
  const ownerUsers = createMemo(() =>
    managedUsers().filter((user) => user.role === "pemilik_kost"),
  );
  const tenantUsers = createMemo(() =>
    managedUsers().filter((user) => user.role === "penyewa"),
  );
  const pendingUsers = createMemo(() =>
    managedUsers().filter((user) => user.status === "pending"),
  );

  const stats = createMemo<StatCard[]>(() => [
    {
      label: "Total Akun",
      value: formatNumber(managedUsers().length),
      tone: "red",
      icon: Users,
    },
    {
      label: "Akun Aktif",
      value: formatNumber(activeUsers().length),
      tone: "green",
      icon: CheckCircle2,
    },
    {
      label: "Total Pemilik Kost",
      value: formatNumber(ownerUsers().length),
      tone: "orange",
      icon: UserCog,
    },
    {
      label: "Total Penyewa Kost",
      value: formatNumber(tenantUsers().length),
      tone: "blue",
      icon: Users,
    },
  ]);

  const quickStats = createMemo<QuickStat[]>(() => {
    const totalAccounts = managedUsers().length;
    const activeAccountsRate =
      totalAccounts === 0 ? 0 : (activeUsers().length / totalAccounts) * 100;
    const newOwnersThisMonth = ownerUsers().filter((user) =>
      user.created_at.startsWith(currentMonth),
    ).length;
    const newTenantsThisMonth = tenantUsers().filter((user) =>
      user.created_at.startsWith(currentMonth),
    ).length;

    return [
      {
        label: "Active Accounts Rate",
        value: `${activeAccountsRate.toFixed(1)}%`,
        tone: "green",
      },
      {
        label: "New Owners This Month",
        value: formatNumber(newOwnersThisMonth),
        tone: "orange",
      },
      {
        label: "New Tenants This Month",
        value: formatNumber(newTenantsThisMonth),
        tone: "blue",
      },
      {
        label: "Pending Account Verification",
        value: formatNumber(pendingUsers().length),
        tone: "red",
      },
    ];
  });

  const recentAccessLogs = createMemo(() =>
    [...accessLogs]
      .sort((first, second) =>
        second.access_time.localeCompare(first.access_time),
      )
      .slice(0, 5),
  );

  return (
    <>
      <section class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats().map((stat) => (
          <StatCardItem stat={stat} />
        ))}
      </section>

      <section class="mt-8 grid gap-6 xl:grid-cols-2">
        <article class="dashboard-card p-6">
          <div class="flex items-center gap-3">
            <ShieldCheck class="text-red-400" size={20} />
            <h2 class="ui-heading text-lg font-bold">System Status</h2>
          </div>
          <div class="mt-5 space-y-3">
            {systemStatus.map((item) => {
              const Icon = item.icon;

              return (
                <div class="flex items-center justify-between gap-3 rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)] p-4">
                  <div class="flex items-center gap-3">
                    <span class="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-500/10 text-emerald-400">
                      <Icon size={17} />
                    </span>
                    <span class="ui-heading font-bold">{item.label}</span>
                  </div>
                  <StatusBadge value={item.value} tone="success" />
                </div>
              );
            })}
          </div>
        </article>

        <article class="dashboard-card p-6">
          <div class="flex items-center gap-3">
            <Activity class="text-red-400" size={20} />
            <h2 class="ui-heading text-lg font-bold">Quick Stats</h2>
          </div>
          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            {quickStats().map((stat) => (
              <QuickStatItem stat={stat} />
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

export {
  roleLabel,
  statusLabel,
  formatDateTime,
  accessStatusTone,
  StatusBadge,
};
