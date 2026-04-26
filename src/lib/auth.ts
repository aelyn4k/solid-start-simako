export type AuthRole = "admin" | "pemilik" | "penyewa";

const userRolesStorageKey = "simako-user-roles";

const seededUserRoles: Record<string, AuthRole> = {
  "admin@simako.id": "admin",
  "siti@simako.id": "pemilik",
  "rudi@simako.id": "pemilik",
  "dewi@simako.id": "pemilik",
  "nadia@mail.com": "penyewa",
  "raka@mail.com": "penyewa",
  "fajar@mail.com": "penyewa",
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const isAuthRole = (value: unknown): value is AuthRole =>
  value === "admin" || value === "pemilik" || value === "penyewa";

const readStoredUserRoles = () => {
  try {
    const storedRoles = localStorage.getItem(userRolesStorageKey);
    const parsedRoles = storedRoles ? JSON.parse(storedRoles) : {};

    if (!parsedRoles || typeof parsedRoles !== "object" || Array.isArray(parsedRoles)) {
      return {};
    }

    return Object.entries(parsedRoles).reduce<Record<string, AuthRole>>(
      (roles, [email, role]) =>
        isAuthRole(role) ? { ...roles, [normalizeEmail(email)]: role } : roles,
      {},
    );
  } catch {
    return {};
  }
};

export const saveUserRole = (email: string, role: AuthRole) => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return;
  }

  try {
    localStorage.setItem(
      userRolesStorageKey,
      JSON.stringify({ ...readStoredUserRoles(), [normalizedEmail]: role }),
    );
  } catch {
    // Login still works with seeded roles or the default tenant role.
  }
};

export const resolveUserRole = (email: string): AuthRole => {
  const normalizedEmail = normalizeEmail(email);
  const storedRole = readStoredUserRoles()[normalizedEmail];

  if (storedRole) {
    return storedRole;
  }

  return seededUserRoles[normalizedEmail] ?? "penyewa";
};
