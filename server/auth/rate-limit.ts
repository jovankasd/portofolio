import { createServerClient } from "@/server/db/server";
import { env } from "@/config/env";

const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 menit
const LOCKOUT_MS = 10 * 60 * 1000; // 10 menit lock

export interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  lockoutUntil: number | null;
}

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  if (!env.supabase.hasServiceRole()) {
    return { allowed: true, remainingAttempts: MAX_FAILURES, lockoutUntil: null };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createServerClient() as any;
    const windowStart = new Date(Date.now() - WINDOW_MS).toISOString();

    const { data: recentFails } = await db
      .from("admin_audit_log")
      .select("created_at")
      .eq("ip_address", ip)
      .eq("event_type", "login_fail")
      .gte("created_at", windowStart)
      .order("created_at", { ascending: false });

    const failCount = recentFails?.length ?? 0;

    if (failCount >= MAX_FAILURES) {
      const { data: lockouts } = await db
        .from("admin_audit_log")
        .select("created_at")
        .eq("ip_address", ip)
        .eq("event_type", "lockout")
        .gte("created_at", new Date(Date.now() - LOCKOUT_MS).toISOString())
        .order("created_at", { ascending: false })
        .limit(1);

      if (lockouts && lockouts.length > 0) {
        const lockoutAt = new Date(lockouts[0].created_at).getTime();
        const lockoutUntil = lockoutAt + LOCKOUT_MS;
        if (Date.now() < lockoutUntil) {
          return { allowed: false, remainingAttempts: 0, lockoutUntil };
        }
      }
    }

    return {
      allowed: true,
      remainingAttempts: Math.max(0, MAX_FAILURES - failCount),
      lockoutUntil: null,
    };
  } catch (err) {
    console.error("[checkRateLimit]", err);
    return { allowed: true, remainingAttempts: MAX_FAILURES, lockoutUntil: null };
  }
}

export async function recordLoginAttempt(
  ip: string,
  userAgent: string,
  success: boolean
): Promise<void> {
  if (!env.supabase.hasServiceRole()) return;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createServerClient() as any;
    const eventType = success ? "login_success" : "login_fail";

    await db.from("admin_audit_log").insert({
      event_type: eventType,
      ip_address: ip,
      user_agent: userAgent,
    });

    if (!success) {
      const windowStart = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      const { data: recentFails } = await db
        .from("admin_audit_log")
        .select("id")
        .eq("ip_address", ip)
        .eq("event_type", "login_fail")
        .gte("created_at", windowStart);

      if ((recentFails?.length ?? 0) >= MAX_FAILURES) {
        await db.from("admin_audit_log").insert({
          event_type: "lockout",
          ip_address: ip,
          user_agent: userAgent,
        });
      }
    }
  } catch (err) {
    console.error("[recordLoginAttempt]", err);
  }
}
