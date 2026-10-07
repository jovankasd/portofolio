"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  createAdminSession,
  destroyAdminSession,
  verifyAdminSession,
} from "@/server/auth/session";
import { checkRateLimit, recordLoginAttempt } from "@/server/auth/rate-limit";
import { authKeySchema } from "@/server/services/validation";
import { env } from "@/config/env";

// ── Helpers ──────────────────────────────────────────────────

function getClientIP(): string {
  const headersList = headers();
  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown"
  );
}

function getClientUA(): string {
  return headers().get("user-agent") ?? "unknown";
}

// ── Auth Actions ─────────────────────────────────────────────

export interface AuthResult {
  success: boolean;
  error?: string;
  lockoutUntil?: number;
}

export async function authenticateAdmin(key: string): Promise<AuthResult> {
  const parsed = authKeySchema.safeParse(key);
  if (!parsed.success) {
    return { success: false, error: "INVALID_KEY" };
  }

  const ip = getClientIP();
  const ua = getClientUA();

  const rateLimit = await checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: "TOO_MANY_ATTEMPTS",
      lockoutUntil: rateLimit.lockoutUntil ?? undefined,
    };
  }

  const keyHash = env.admin.masterKeyHash();
  if (!keyHash) {
    if (env.app.isProduction()) {
      return { success: false, error: "SERVER_MISCONFIGURED" };
    }
    return { success: false, error: "SERVER_MISCONFIGURED" };
  }

  const match = await bcrypt.compare(parsed.data, keyHash);
  if (!match) {
    await recordLoginAttempt(ip, ua, false);
    const updatedLimit = await checkRateLimit(ip);
    return {
      success: false,
      error: "INVALID_KEY",
      lockoutUntil: updatedLimit.lockoutUntil ?? undefined,
    };
  }

  await createAdminSession();
  await recordLoginAttempt(ip, ua, true);
  return { success: true };
}

export async function logoutAdmin(): Promise<void> {
  await destroyAdminSession();
  revalidatePath("/dossier-control");
}

export { verifyAdminSession };
