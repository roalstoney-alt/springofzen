import { handleInquiry, purgeExpired } from "./inquiries.js";
const CANONICAL_HOST = "mykidsnest.com";
const WORLD_ALIASES = new Map([
  ["/ocean-room", "/ocean/"],
  ["/ocean-room/", "/ocean/"],
  ["/space-room", "/space/"],
  ["/space-room/", "/space/"],
  ["/forest-room", "/forest/"],
  ["/forest-room/", "/forest/"]
]);
const CLEAN_ROUTES = new Set(["/ocean", "/space", "/forest", "/parents", "/request", "/about", "/contact", "/privacy", "/safety", "/faq", "/terms"]);

function redirect(url, status) {
  return new Response(null, {
    status,
    headers: {
      Location: url.toString(),
      "Cache-Control": "public, max-age=3600"
    }
  });
}

function withHeaders(response, pathname) {
  const headers = new Headers(response.headers);
  headers.set("Content-Security-Policy", "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; media-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; upgrade-insecure-requests");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("Vary", "Accept-Encoding");

  if (pathname.startsWith("/api/")) {
    headers.set("Cache-Control", "no-store");
    headers.set("X-Robots-Tag", "noindex");
  } else if (/\.(?:avif|gif|jpe?g|png|svg|webp|woff2?)$/i.test(pathname)) {
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else if (/\.(?:css|js)$/i.test(pathname)) {
    headers.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  } else {
    headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export default {
  async scheduled(_event, env, ctx) { ctx.waitUntil(purgeExpired(env)); },
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname.toLowerCase() === `www.${CANONICAL_HOST}`) {
      url.protocol = "https:";
      url.hostname = CANONICAL_HOST;
      return redirect(url, 308);
    }

    const alias = WORLD_ALIASES.get(url.pathname);
    if (alias) {
      url.pathname = alias;
      return redirect(url, 301);
    }

    if (CLEAN_ROUTES.has(url.pathname)) {
      url.pathname += "/";
      return redirect(url, 308);
    }

    if (url.pathname.startsWith("/api/")) return withHeaders(await handleInquiry(request, env), url.pathname);

    if (!['GET', 'HEAD'].includes(request.method)) {
      return withHeaders(new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, HEAD" } }), url.pathname);
    }

    let response = await env.ASSETS.fetch(request);
    if (response.status === 404 && url.pathname !== "/404/") {
      const fallbackUrl = new URL("/404/", url);
      const fallback = await env.ASSETS.fetch(new Request(fallbackUrl, request));
      response = new Response(fallback.body, { status: 404, headers: fallback.headers });
    }
    return withHeaders(response, url.pathname);
  }
};
