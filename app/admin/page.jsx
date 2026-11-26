import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { buatSupabaseAuth } from "@/lib/supabase-auth";

// US-06 & US-07: halaman ini dilindungi proxy.js dan mengambil daftar produk dari Supabase.
export default async function HalamanAdmin() {
  const supabase = await buatSupabaseAuth();
  const { data: produk, error } = await supabase
    .from("produk")
    .select("*")
    .order("created_at", { ascending: false });

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
      <TabelProduk daftarProduk={produk ?? []} />
    </div>
  );
}
