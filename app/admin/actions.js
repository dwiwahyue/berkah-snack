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
 * Helper internal: periksa sesi login di server.
 * Jika tidak ada sesi, lempar error agar Server Action menolak aksi.
 * Redirect tidak dipakai di sini supaya caller bisa mengembalikan pesan error.
 */
async function periksaLogin() {
  const supabase = await buatSupabaseAuth();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Akses ditolak: Anda belum login.");
  }
  return { supabase, user };
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

/**
 * US-05: Ganti password admin yang sedang login.
 * Validasi di server: minimal 8 karakter, harus cocok dengan konfirmasi.
 */
export async function gantiPassword(prevState, formData) {
  const passwordBaru = formData.get("password_baru");
  const konfirmasi = formData.get("konfirmasi_password");

  if (!passwordBaru || !konfirmasi) {
    return { error: "Semua kolom wajib diisi." };
  }
  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }
  if (passwordBaru !== konfirmasi) {
    return { error: "Konfirmasi password tidak cocok." };
  }

  let supabase;
  try {
    ({ supabase } = await periksaLogin());
  } catch {
    redirect("/admin/login");
  }

  const { error } = await supabase.auth.updateUser({ password: passwordBaru });

  if (error) {
    return { error: "Gagal mengganti password: " + error.message };
  }

  return { sukses: "Password berhasil diperbarui." };
}
