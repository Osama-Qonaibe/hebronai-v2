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
  // Locale/RTL Handling
  // ============================================

  // Check if pathname starts with a locale (e.g., /ar, /en)
  const pathnameLocale = SUPPORTED_LOCALES.find(
    (locale) =>
      pathname.startsWith(`/${locale.code}/`) || pathname === `/${locale.code}`,
  );

  if (pathnameLocale) {
    // Extract the locale from pathname
    const locale = pathnameLocale.code;

    // Set locale cookie
    const response = NextResponse.next();
    response.cookies.set(COOKIE_KEY_LOCALE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });

    // Redirect to pathname without locale prefix
    const newPathname = pathname.replace(`/${locale}`, "") || "/";
    const url = request.nextUrl.clone();
    url.pathname = newPathname;

    return NextResponse.redirect(url);
  }

  // Check for locale in query parameter (e.g., ?locale=ar)
  const searchParams = new URL(request.url).searchParams;
  const queryLocale = searchParams.get("locale");

  if (queryLocale && SUPPORTED_LOCALES.some((l) => l.code === queryLocale)) {
    const response = NextResponse.next();
    response.cookies.set(COOKIE_KEY_LOCALE, queryLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });

    // Redirect to clean URL without query parameter
    const url = request.nextUrl.clone();
    url.searchParams.delete("locale");
    return NextResponse.redirect(url);
  }

  // ============================================
  // Authentication & Admin Handling
  // ============================================

  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/users", request.url));
  }

  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/auth|export|sign-in|sign-up).*)",
  ],
};
