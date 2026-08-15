import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const AUTH_COOKIE = "shoe_token";
// Debe coincidir con el secreto usado en lib/auth.ts (jsonwebtoken)
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "shoe-inventory-secret-change-me"
);

// Rutas públicas dentro de /api
const PUBLIC_API_PATHS = ["/api/auth/login", "/api/auth/logout"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Home -> dashboard
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Proteger el área de dashboard: basta con que exista la cookie de sesión.
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get(AUTH_COOKIE)?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // El nombre lo inyectamos para el header (opcional).
    const headers = new Headers(request.headers);
    headers.set("x-user-name", "Usuario");
    return NextResponse.next({ request: { headers } });
  }

  // Proteger la API: toda ruta /api/* (salvo auth) requiere una sesión válida.
  if (pathname.startsWith("/api/")) {
    if (PUBLIC_API_PATHS.includes(pathname)) {
      return NextResponse.next();
    }
    const token = request.cookies.get(AUTH_COOKIE)?.value;
    if (!token) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    try {
      await jwtVerify(token, SECRET);
    } catch {
      return NextResponse.json(
        { error: "Sesión inválida" },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
