import { User, UserRole } from "@/lib/types/api";

export function normalizeAuthUser(u: {
  id: string | number;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  role: string;
  avatar_url?: string | null;
  is_active: boolean;
  last_login_at?: string | null;
  createdAt?: string | null;
  updated_at?: string | null;
  updatedAt?: string | null;
}): User {
  const now = new Date().toISOString();
  return {
    id: String(u.id),
    email: u.email,
    first_name: u.first_name ?? "",
    last_name: u.last_name ?? "",
    role: u.role as UserRole,
    avatar_url: u.avatar_url ?? undefined,
    is_active: u.is_active,
    last_login_at: u.last_login_at ?? undefined,
    createdAt: u.createdAt ?? now,
    updated_at: u.updated_at ?? u.updatedAt ?? now,
  };
}
