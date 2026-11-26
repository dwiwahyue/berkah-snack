# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.
**Hasil:**
Tulisan "Masih data contoh" hilang dan 6 kartu produk tetap tampil. Karena isinya mirip data contoh, buktikan datanya dari database:
Di Supabase Table Editor → produk, klik ganda nama satu produk, ubah (misalnya jadi "Kopi Spesial"), tekan Enter.
Muat ulang localhost:3000. Nama produk ikut berubah = berhasil.
**Perbaikan:**

## US-02 Detail produk

**Prompt:**
Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.
**Hasil:**
Klik salah satu kartu produk: halaman detail terbuka dengan foto, harga, dan deskripsi.
Ubah deskripsi produk itu di Supabase, muat ulang: deskripsi ikut berubah.
Buka localhost:3000/produk/9999: tampil halaman "Halaman tidak ditemukan".
**Perbaikan:**

## US-03 Pesan via WhatsApp

**Prompt:**
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.
**Hasil:**
Klik tombol di halaman detail: WhatsApp Web (atau aplikasi WhatsApp) terbuka ke nomor tokomu, dengan pesan sudah terisi, misalnya "Halo, saya mau pesan Kopi Bubuk Robusta 250 g (Rp 45.000)".
**Perbaikan:**

## US-04 Login admin

**Prompt:**
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.
**Hasil:**
Buka localhost:3000/admin/login, masuk dengan password salah: muncul pesan error.
Masuk dengan email dan password bawaan dari Langkah 4: masuk ke halaman daftar produk admin.
Klik Keluar: kembali ke halaman login.
**Perbaikan:**

## US-05 Ganti password

**Prompt:**
Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
Login ke /admin, buka /admin/password.
Isi password baru kurang dari 8 karakter: muncul pesan error merah "Password baru minimal 8 karakter."
Isi password tidak cocok dengan konfirmasi: muncul pesan "Konfirmasi password tidak cocok."
Isi keduanya benar: muncul pesan hijau "Password berhasil diperbarui."
Logout lalu login ulang dengan password baru: berhasil masuk.

**Perbaikan:**

## US-06 Proteksi halaman admin

**Prompt:**
Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
Tanpa login, buka localhost:3000/admin: langsung diarahkan ke /admin/login.
Login berhasil, buka /admin: halaman tampil normal.
Klik Keluar, buka /admin lagi: diarahkan kembali ke login.
Server Action gantiPassword menolak aksi jika tidak ada sesi dan redirect ke halaman login.

**Perbaikan:**

## Debugging dan fitur bonus

### Perbaikan SUPABASE_URL salah format **[SENDIRI]**

**Masalah:** Halaman katalog menampilkan pesan "Gagal memuat produk" setelah US-01 selesai.

**Penyebab:** Nilai `SUPABASE_URL` di `.env.local` diisi dengan URL REST API lengkap (`https://xxxx.supabase.co/rest/v1/`), padahal `createClient` dari `@supabase/supabase-js` hanya butuh URL proyek (`https://xxxx.supabase.co`).

**Perbaikan:** Hapus `/rest/v1/` dari nilai `SUPABASE_URL` di `.env.local`, lalu restart dev server.

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.
