import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Home -> dashboard
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Proteger el área de dashboard: basta con que exista la cookie de sesión.
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("shoe_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // El nombre lo inyectamos para el header (opcional).
    const headers = new Headers(request.headers);
    headers.set("x-user-name", "Usuario");
    return NextResponse.next({ request: { headers } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
