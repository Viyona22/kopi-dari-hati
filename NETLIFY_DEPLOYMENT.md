
# Panduan Deployment ke Netlify

## Langkah-langkah Deployment

### 1. Persiapan GitHub
1. Pastikan proyek sudah terhubung ke GitHub melalui Lovable
2. Klik tombol GitHub di Lovable untuk membuat repository

### 2. Setup Netlify
1. Kunjungi [netlify.com](https://netlify.com)
2. Daftar/login dengan akun GitHub Anda
3. Klik "New site from Git"
4. Pilih "GitHub" sebagai Git provider
5. Pilih repository proyek Anda

### 3. Konfigurasi Build Settings
Netlify akan otomatis mendeteksi pengaturan dari `netlify.toml`, tapi pastikan:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18

### 4. Environment Variables (Opsional)
Jika Anda ingin override environment variables:
1. Masuk ke Site Settings → Environment Variables
2. Tambahkan:
   - `VITE_SUPABASE_URL`: https://xokqnkvjpiygfxtmwmuu.supabase.co
   - `VITE_SUPABASE_ANON_KEY`: [anon key dari proyek]

### 5. Deploy
1. Klik "Deploy site"
2. Netlify akan mulai build dan deploy otomatis
3. Anda akan mendapat URL seperti `random-name-123.netlify.app`

### 6. Custom Domain (Opsional)
1. Masuk ke Site Settings → Domain Management
2. Klik "Add custom domain"
3. Ikuti instruksi untuk setup DNS

## File Konfigurasi yang Telah Dibuat

- `netlify.toml`: Konfigurasi utama Netlify
- `public/_redirects`: Routing untuk SPA
- `.nvmrc`: Versi Node.js
- `NETLIFY_DEPLOYMENT.md`: Panduan ini

## Fitur Netlify yang Tersedia

- ✅ Auto-deploy dari GitHub
- ✅ Branch previews
- ✅ Custom domains
- ✅ SSL certificates (gratis)
- ✅ Form handling
- ✅ Edge functions
- ✅ Analytics

## Troubleshooting

### Build Gagal
- Periksa Node version di `netlify.toml`
- Pastikan semua dependencies ada di `package.json`
- Cek build logs di Netlify dashboard

### Routing Tidak Bekerja
- Pastikan file `_redirects` ada di folder `public`
- Atau gunakan konfigurasi redirects di `netlify.toml`

### Environment Variables
- Variabel environment harus diawali dengan `VITE_` untuk Vite
- Set di Netlify dashboard atau `netlify.toml`

## Monitoring

Setelah deploy, Anda bisa monitor:
- Build logs di Netlify dashboard
- Analytics (jika diaktifkan)
- Performance metrics
- Error tracking

## Maintenance

- Auto-deploy akan berjalan setiap kali ada push ke branch utama
- Branch previews otomatis untuk pull requests
- Rollback mudah melalui dashboard Netlify
