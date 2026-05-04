import { Navigate } from "@solidjs/router";
import { createSignal, onMount, Show } from "solid-js";
import type { JSX } from "solid-js";
import type { AuthRole } from "~/lib/auth";
import { getDashboardPathByRole, getSessionRole } from "~/utils/roleAccess";

export type ProtectedRole = AuthRole | "pemilik_kost";

const normalizeRole = (role: ProtectedRole): AuthRole =>
  role === "pemilik_kost" ? "pemilik" : role;

export default function ProtectedRoute(props: {
  allowedRoles: ProtectedRole[];
  children: JSX.Element;
}) {
  const [role, setRole] = createSignal<AuthRole | null>(null);
  const [checked, setChecked] = createSignal(false);

  onMount(() => {
    setRole(getSessionRole());
    setChecked(true);
  });

  const allowedRoles = () => props.allowedRoles.map(normalizeRole);

  return (
    <Show when={checked()}>
      <Show when={role()} fallback={<Navigate href="/login" />}>
        {(currentRole) => (
          <Show
            when={allowedRoles().includes(currentRole())}
            fallback={<Navigate href={getDashboardPathByRole(currentRole())} />}
          >
            {props.children}
          </Show>
        )}
      </Show>
    </Show>
  );
}
