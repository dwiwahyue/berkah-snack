import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

/**
 * US-06: Proteksi rute /admin.
 *
 * File ini bernama proxy.js (bukan middleware.js) sesuai ketentuan Next.js 16
 * di proyek ini. Semua halaman /admin kecuali /admin/login membutuhkan sesi
 * admin yang valid; tanpa sesi, pengunjung dialihkan ke /admin/login.
 */
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Halaman login boleh dibuka siapa saja — lewati.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Hanya terapkan ke rute /admin/*.
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  // Buat klien Supabase ringan yang bisa membaca/menulis cookie di middleware.
  const supabase = createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // getUser() memverifikasi token ke Supabase Auth — tidak bisa dipalsukan.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
