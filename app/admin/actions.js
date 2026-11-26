"use server";

import { redirect } from "next/navigation";
import { buatSupabaseAuth } from "@/lib/supabase-auth";

/**
 * US-04: Login admin dengan email dan password memakai Supabase Auth.
 * Dipanggil dari form di /admin/login via Server Action.
 */
export async function login(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await buatSupabaseAuth();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Email atau password salah. Periksa kembali dan coba lagi." };
  }

  redirect("/admin");
}

/**
 * US-04: Logout admin — hapus sesi lalu arahkan ke halaman login.
 * Dipanggil dari tombol Keluar di NavAdmin.
 */
export async function logout() {
  const supabase = await buatSupabaseAuth();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
