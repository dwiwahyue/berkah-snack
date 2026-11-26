"use server";

import { revalidatePath } from "next/cache";
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

/**
 * Helper internal: baca dan validasi field form produk.
 */
function ambilDataProduk(formData) {
  const nama = String(formData.get("nama") ?? "").trim();
  const hargaRaw = formData.get("harga");
  const harga = Number(hargaRaw);
  const kategori = String(formData.get("kategori") ?? "").trim() || null;
  const foto_url = String(formData.get("foto_url") ?? "").trim() || null;
  const deskripsi = String(formData.get("deskripsi") ?? "").trim() || null;

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }
  if (hargaRaw === null || hargaRaw === "" || Number.isNaN(harga) || harga < 0) {
    return { error: "Harga harus berupa angka 0 atau lebih." };
  }

  return {
    data: { nama, harga: Math.round(harga), kategori, foto_url, deskripsi },
  };
}

/**
 * US-08: Tambah produk baru ke Supabase.
 */
export async function tambahProduk(prevState, formData) {
  let supabase;
  try {
    ({ supabase } = await periksaLogin());
  } catch {
    return { error: "Akses ditolak: Anda belum login." };
  }

  const parsed = ambilDataProduk(formData);
  if (parsed.error) {
    return { error: parsed.error };
  }

  const { error } = await supabase.from("produk").insert(parsed.data);

  if (error) {
    return { error: "Gagal menyimpan produk: " + error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

/**
 * US-09: Ubah data produk yang sudah ada di Supabase.
 */
export async function ubahProduk(prevState, formData) {
  let supabase;
  try {
    ({ supabase } = await periksaLogin());
  } catch {
    return { error: "Akses ditolak: Anda belum login." };
  }

  const id = formData.get("id");
  if (!id) {
    return { error: "ID produk tidak ditemukan." };
  }

  const parsed = ambilDataProduk(formData);
  if (parsed.error) {
    return { error: parsed.error };
  }

  const { error } = await supabase.from("produk").update(parsed.data).eq("id", id);

  if (error) {
    return { error: "Gagal menyimpan perubahan: " + error.message };
  }

  revalidatePath("/");
  revalidatePath(`/produk/${id}`);
  revalidatePath("/admin");
  redirect("/admin");
}

/**
 * US-10: Hapus produk dari Supabase.
 */
export async function hapusProduk(formData) {
  const { supabase } = await periksaLogin();

  const id = formData.get("id");
  if (!id) {
    throw new Error("ID produk tidak ditemukan.");
  }

  const { error } = await supabase.from("produk").delete().eq("id", id);

  if (error) {
    throw new Error("Gagal menghapus produk: " + error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin");
}
