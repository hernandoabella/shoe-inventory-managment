import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET || "shoe-inventory-secret-change-me";
export const AUTH_COOKIE = "shoe_token";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  storeIds: string[];
}

export function signToken(user: SessionUser): string {
  return jwt.sign(user, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, SECRET) as SessionUser;
  } catch {
    return null;
  }
}

// Lee la sesión desde la cookie (en Server Components / Route Handlers)
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}
