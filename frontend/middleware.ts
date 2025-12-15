import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  // Rutas protegidas
  const protectedPaths = [
    pathname.startsWith("/notifications"),
    pathname.startsWith("/(authenticated)"),
  ];

  if (protectedPaths.some(Boolean)) {
    const refreshCookie = req.cookies.get("accessToken");
    if (!refreshCookie) {
      const url = new URL("/login", origin);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notifications/:path*", "/(authenticated)/:path*"],
}
