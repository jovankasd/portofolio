import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";

const RATE_LIMIT_MAP = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000; // 1 menit
const MAX_PER_WINDOW = 5;

function checkInMemoryRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT_MAP.get(ip);

  if (!entry || now > entry.resetAt) {
    RATE_LIMIT_MAP.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_PER_WINDOW) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkInMemoryRateLimit(ip)) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Coba lagi dalam 1 menit." },
      { status: 429 }
    );
  }

  let body: { name?: string; email?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload tidak valid." }, { status: 400 });
  }

  const { name, email, message } = body;

  // Validasi input minimal
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    name.trim().length < 1 ||
    message.trim().length < 1 ||
    !email.includes("@")
  ) {
    return NextResponse.json(
      { error: "Nama, email, dan pesan wajib diisi." },
      { status: 422 }
    );
  }

  if (env.supabase.hasServiceRole()) {
    try {
      const { createServerClient } = await import("@/server/db/server");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = createServerClient() as any;
      const { error } = await db.from("messages").insert({
        name: name.trim().slice(0, 120),
        email: email.trim().slice(0, 254),
        message: message.trim().slice(0, 2000),
      });
      if (error) throw error;
    } catch (err) {
      console.error("[/api/contact]", err);
      return NextResponse.json(
        { error: "Gagal menyimpan pesan. Coba lagi nanti." },
        { status: 500 }
      );
    }
  } else {
    console.log("[/api/contact] Dev mode — pesan diterima:", { name, email, message });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
