import { cookies } from "next/headers";
import { getIronSession } from "iron-session";

export interface AdminSession {
  isLoggedIn: boolean;
  loginAt?: number;
}

const SESSION_NAME = "dossier_session";
const SESSION_TTL_MS = 2 * 60 * 60 * 1000; // 2 jam

function getSessionOptions() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET harus diset dan minimal 32 karakter di .env.local"
    );
  }
  return {
    cookieName: SESSION_NAME,
    password: secret,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict" as const,
      maxAge: SESSION_TTL_MS / 1000,
    },
  };
}

export async function getSession() {
  const cookieStore = cookies();
  return getIronSession<AdminSession>(cookieStore, getSessionOptions());
}

export async function createAdminSession(): Promise<void> {
  const session = await getSession();
  session.isLoggedIn = true;
  session.loginAt = Date.now();
  await session.save();
}

export async function destroyAdminSession(): Promise<void> {
  const session = await getSession();
  session.destroy();
}

export async function verifyAdminSession(): Promise<boolean> {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) return false;
    // Periksa masa berlaku sesi
    if (session.loginAt && Date.now() - session.loginAt > SESSION_TTL_MS) {
      await destroyAdminSession();
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
