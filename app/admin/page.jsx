import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { buatSupabaseServer } from "@/lib/supabase";

// US-06: halaman ini dilindungi proxy.js — hanya admin yang sudah login bisa membuka.
export default async function HalamanAdmin() {
  // US-07 (bonus): daftar produk masih memakai data contoh, belum dari database.
  // const daftarProduk = produkContoh;
  const { data: produk, error } = await buatSupabaseServer
    .from("produk")
    .select("*");

  if (error) {
    console.error("Gagal mengambil data:", error.message);

    return <div>Gagal mengambil data produk.</div>;
  }
  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        {/* US-08 (bonus): tambah produk */}
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>
      <TabelProduk daftarProduk={produk} />
    </div>
  );
}
