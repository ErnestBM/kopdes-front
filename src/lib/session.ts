import "server-only";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";
import type { Role } from "./types";

export const SESSION_COOKIE = "kopdes_session";

export interface SessionUser {
  id: string;
  username: string;
  name: string;
  role: Role;
  mustChangePassword: boolean;
}

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}

/**
 * Decodes the session JWT without verifying its signature. Safe for display-only
 * purposes (greeting, "is this record mine" labelling) because every actual data
 * fetch is re-authorized by the backend using the same cookie and the real secret.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = await getSessionToken();
  if (!token) return null;
  try {
    const payload = decodeJwt(token);
    return {
      id: String(payload.sub),
      username: String(payload.username),
      name: String(payload.name),
      role: payload.role as Role,
      mustChangePassword: Boolean(payload.mustChangePassword),
    };
  } catch {
    return null;
  }
}
