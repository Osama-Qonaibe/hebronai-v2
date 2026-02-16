import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { COOKIE_KEY_LOCALE, SUPPORTED_LOCALES } from "./lib/const";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /*
   * Playwright starts the dev server and requires a 200 status to
   * begin the tests, so this ensures that the tests can start
   */
  if (pathname.startsWith("/ping")) {
    return new Response("pong", { status: 200 });
  }

  // ============================================
  // Locale/RTL Handling (runs on ALL pages)
  // ============================================

  // Check if pathname starts with a locale (e.g., /ar, /en)
  const pathnameLocale = SUPPORTED_LOCALES.find(
    (locale) =>
      pathname.startsWith(`/${locale.code}/`) || pathname === `/${locale.code}`,
  );

  if (pathnameLocale) {
    // Extract the locale from pathname
    const locale = pathnameLocale.code;

    // Redirect to pathname without locale prefix, but set cookie
    const newPathname = pathname.replace(`/${locale}`, "") || "/";
    const url = request.nextUrl.clone();
    url.pathname = newPathname;

    const response = NextResponse.redirect(url);
    response.cookies.set(COOKIE_KEY_LOCALE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });

    return response;
  }

  // Check for locale in query parameter (e.g., ?locale=ar)
  const searchParams = new URL(request.url).searchParams;
  const queryLocale = searchParams.get("locale");

  if (queryLocale && SUPPORTED_LOCALES.some((l) => l.code === queryLocale)) {
    // Redirect to clean URL without query parameter, but set cookie
    const url = request.nextUrl.clone();
    url.searchParams.delete("locale");

    const response = NextResponse.redirect(url);
    response.cookies.set(COOKIE_KEY_LOCALE, queryLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });

    return response;
  }

  // ============================================
  // Authentication & Admin Handling
  // ============================================

  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/users", request.url));
  }

  // Skip authentication check for public pages
  if (
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/export")
  ) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - api/auth (auth API routes)
     * - favicon.ico, sitemap.xml, robots.txt
     * - Files with extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|xml|txt)$).*)",
  ],
};
