
# Panduan Deployment ke Netlify - Versi Optimized

## Langkah-langkah Deployment (Updated)

### 1. Persiapan GitHub
1. Pastikan proyek sudah terhubung ke GitHub melalui Lovable
2. Klik tombol GitHub di Lovable untuk membuat repository
3. Pastikan semua file konfigurasi sudah ter-push ke GitHub

### 2. Setup Netlify
1. Kunjungi [netlify.com](https://netlify.com)
2. Daftar/login dengan akun GitHub Anda
3. Klik "New site from Git"
4. Pilih "GitHub" sebagai Git provider
5. Pilih repository proyek Anda

### 3. Konfigurasi Build Settings
**PENTING**: Gunakan konfigurasi ini untuk menghindari error initialization:

- **Build command**: `npm ci && npm run build`
- **Publish directory**: `dist`
- **Node version**: `20` (LTS)

### 4. Environment Variables (WAJIB)
Tambahkan environment variables berikut di Netlify Dashboard:
1. Masuk ke Site Settings → Environment Variables
2. Tambahkan:
   - `VITE_SUPABASE_URL`: `https://xokqnkvjpiygfxtmwmuu.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhva3Fua3ZqcGl5Z2Z4dG13bXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTY1OTYsImV4cCI6MjA2NDIzMjU5Nn0.yeW3mfg3Q30nYGR4SzClz5C57d7-1fBMgM7cslBxPOk`
   - `NODE_ENV`: `production`
   - `CI`: `true`

### 5. Deploy
1. Klik "Deploy site"
2. Monitor build logs untuk memastikan tidak ada error
3. Jika build berhasil, site akan tersedia di URL Netlify

### 6. Troubleshooting Jika Masih Error

#### A. Jika Build Gagal:
1. Periksa build logs di Netlify dashboard
2. Pastikan semua dependencies ada di `package.json`
3. Coba deploy ulang dengan "Clear cache and deploy site"

#### B. Jika Routing Tidak Bekerja:
1. Pastikan file `_redirects` ada di folder `public`
2. Periksa konfigurasi redirects di `netlify.toml`

#### C. Jika Environment Variables Tidak Terdeteksi:
1. Set ulang environment variables di Netlify dashboard
2. Pastikan nama variabel diawali dengan `VITE_`
3. Deploy ulang setelah setting environment variables

### 7. Optimasi Performa

Konfigurasi sudah dioptimasi untuk:
- ✅ CSS dan JS minification
- ✅ Asset caching
- ✅ Security headers
- ✅ Better build process dengan `npm ci`
- ✅ Node.js LTS version (20)

### 8. Monitoring dan Maintenance

Setelah deploy berhasil:
- Monitor build logs untuk error
- Test semua routing aplikasi
- Periksa Console browser untuk error JavaScript
- Test environment variables dengan melihat network requests

## Perbedaan dengan Konfigurasi Sebelumnya

1. **Node.js Version**: Upgrade ke v20 (LTS) untuk stabilitas
2. **Build Command**: Menggunakan `npm ci` untuk build yang lebih konsisten
3. **Environment Variables**: Dipindah ke Netlify dashboard untuk keamanan
4. **Build Processing**: Ditambahkan optimasi CSS/JS
5. **Redirect Rules**: Disederhanakan untuk menghindari konflik

## Catatan Penting

- Jangan set environment variables sensitif di `netlify.toml`
- Selalu gunakan `npm ci` untuk production builds
- Monitor build time - jika terlalu lama, ada kemungkinan dependency issue
