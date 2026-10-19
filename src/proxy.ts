import { NextResponse, type NextRequest } from "next/server";
import { legacyAction } from "@/lib/legacy";

/**
 * 1. Legacy WordPress URLs: 410 Gone for spam / leftovers, 301 for the sitemap.
 * 2. Locale routing: Arabic lives under /ar, English is served from the root
 *    (internally rewritten to /en) so existing English URLs stay unchanged.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const legacy = legacyAction(pathname);
  if (legacy.type === "gone") {
    return new NextResponse("410 Gone", {
      status: 410,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "x-robots-tag": "noindex, nofollow",
        "cache-control": "public, max-age=3600",
      },
    });
  }
  if (legacy.type === "redirect") {
    return NextResponse.redirect(new URL(legacy.to, request.url), 301);
  }

  // Old WordPress URLs end with a slash: canonicalise to the slash-less form.
  if (pathname.length > 1 && pathname.endsWith("/")) {
    const target = new URL(`${pathname.replace(/\/+$/, "")}${request.nextUrl.search}`, request.url);
    return NextResponse.redirect(target, 308);
  }

  if (pathname === "/ar" || pathname.startsWith("/ar/")) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!_next/|api/|images/|og/|favicon\\.ico|icon|apple-icon|robots\\.txt|sitemap\\.xml).*)",
  ],
};
