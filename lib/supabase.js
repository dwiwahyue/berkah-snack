import { createClient } from "@supabase/supabase-js";

/**
 * Klien Supabase untuk dipakai di sisi server saja:
 * Server Component, Server Action, dan Route Handler.
 *
 * Memakai SUPABASE_SECRET_KEY (service_role) agar bisa membaca
 * tabel yang dilindungi RLS tanpa perlu sesi pengguna.
 *
 * JANGAN impor file ini dari komponen "use client".
 */
export function buatSupabaseServer() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error(
      "Environment variable SUPABASE_URL atau SUPABASE_SECRET_KEY belum diisi. " +
        "Salin .env.example menjadi .env.local dan isi nilainya.",
    );
  }

  return createClient(url, key);
}
