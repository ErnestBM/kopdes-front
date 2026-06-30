import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

const SESSION_COOKIE = "kopdes_session";

interface SessionPayload {
  mustChangePassword?: boolean;
  role?: string;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  let payload: SessionPayload | null = null;
  if (token) {
    try {
      payload = decodeJwt(token);
    } catch {
      payload = null;
    }
  }

  const isAuthed = Boolean(payload);
  const isLoginPage = pathname === "/login";

  if (!isAuthed && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthed && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAuthed && payload?.mustChangePassword && pathname !== "/change-password") {
    return NextResponse.redirect(new URL("/change-password", request.url));
  }

  if (isAuthed && !payload?.mustChangePassword && pathname === "/change-password") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAuthed && pathname.startsWith("/admin") && payload?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
