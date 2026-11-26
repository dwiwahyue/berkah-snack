import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Klien Supabase berbasis sesi (cookie) untuk autentikasi admin.
 * Memakai SUPABASE_PUBLISHABLE_KEY (anon key) + @supabase/ssr.
 *
 * Dipakai di: Server Action, Route Handler, Server Component yang butuh sesi.
 * JANGAN impor dari "use client".
 */
export async function buatSupabaseAuth() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll dipanggil dari Server Component — abaikan jika tidak bisa di-set.
          }
        },
      },
    }
  );
}
