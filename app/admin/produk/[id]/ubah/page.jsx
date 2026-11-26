import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { buatSupabaseAuth } from "@/lib/supabase-auth";
import { ubahProduk } from "@/app/admin/actions";

// US-09: ubah produk dari database Supabase.
export default async function HalamanUbahProduk({ params }) {
  const { id } = await params;

  const supabase = await buatSupabaseAuth();
  const { data: produk } = await supabase
    .from("produk")
    .select("id, nama, harga, deskripsi, foto_url, kategori")
    .eq("id", id)
    .single();

  if (!produk) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      <FormProduk produk={produk} labelTombol="Simpan perubahan" action={ubahProduk} />
    </div>
  );
}
