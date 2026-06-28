import { NextResponse } from "next/server";

export async function proxy(request) {
  const token = request.cookies.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  let user;
  try {
    const res = await fetch("http://localhost:8080/api/me", {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    });

    if (!res.ok) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    user = await res.json();
  } catch {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/admin") && user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/admin"],
};