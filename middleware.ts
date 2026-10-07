import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import type { AdminSession } from "@/server/auth/session";

const PROTECTED_PATHS = ["/dossier-control/dashboard"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Hanya lindungi sub-path dashboard (halaman login tetap publik)
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return rewriteTo404(request);

  try {
    // Baca cookie iron-session secara manual di middleware
    const response = new NextResponse();
    const session = await getIronSession<AdminSession>(request, response, {
      cookieName: "dossier_session",
      password: secret,
      cookieOptions: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "strict",
      },
    });

    const SESSION_TTL_MS = 2 * 60 * 60 * 1000;
    const valid =
      session.isLoggedIn &&
      session.loginAt != null &&
      Date.now() - session.loginAt < SESSION_TTL_MS;

    if (!valid) return rewriteTo404(request);

    return NextResponse.next();
  } catch {
    return rewriteTo404(request);
  }
}

// Rewrite ke 404 — URL di address bar TETAP /dossier-control/dashboard,
// status HTTP 404, tidak ada redirect yang membocorkan keberadaan rute.
function rewriteTo404(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/404";
  return NextResponse.rewrite(url, { status: 404 });
}

export const config = {
  matcher: ["/dossier-control/dashboard/:path*"],
};
