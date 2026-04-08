import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/signup"];

export function middleware(req: NextRequest) {
  const isPublic = publicRoutes.includes(req.nextUrl.pathname);
  const hasSession = Boolean(req.cookies.get("user_id")?.value);

  if (!isPublic && !hasSession) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isPublic && hasSession && ["/login", "/signup"].includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api/public|favicon.ico).*)"]
};
