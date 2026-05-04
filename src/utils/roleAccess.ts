import type { NavigateFunction } from "@solidjs/router";
import type { AuthRole } from "~/lib/auth";

export const sessionRoleKey = "simako-session-role";

export const isSessionRole = (value: string | null): value is AuthRole =>
  value === "admin" || value === "pemilik" || value === "penyewa";

export const getSessionRole = (): AuthRole | null => {
  if (typeof localStorage === "undefined") {
    return null;
  }

  const storedRole = localStorage.getItem(sessionRoleKey);
  return isSessionRole(storedRole) ? storedRole : null;
};

export const getDashboardPathByRole = (role: AuthRole) => {
  if (role === "admin") {
    return "/admin/dashboard";
  }

  return `/dashboard/${role}`;
};

export const redirectByRole = (navigate: NavigateFunction, role: AuthRole, replace = true) => {
  navigate(getDashboardPathByRole(role), { replace });
};

export const requireAdmin = (navigate: NavigateFunction) => {
  const role = getSessionRole();

  if (!role) {
    navigate("/login", { replace: true });
    return false;
  }

  if (role !== "admin") {
    redirectByRole(navigate, role);
    return false;
  }

  return true;
};
