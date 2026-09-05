# AGENT.md — Panduan untuk AI Coding Agent

Dokumen ini adalah konteks kerja untuk AI agent (Claude Code, Cursor, dsb.) yang akan membangun/mengembangkan project **Website Ucapan Ulang Tahun Interaktif untuk Keonho**. Baca dokumen ini dulu sebelum mulai menulis kode.

## 1. Dokumen Acuan (Wajib Dibaca Dulu)

| File | Isi |
|---|---|
| `prd.md` | Requirement produk lengkap: alur user, fitur per layar, acceptance criteria, asumsi tanggal target |
| `design.md` | Palet warna, tipografi, gaya komponen, motion guideline |

**Aturan:** Jangan mengarang fitur/warna/font di luar dua dokumen ini. Kalau ada requirement yang belum jelas, cek bagian "Asumsi & Pertanyaan Terbuka" di `prd.md` §11 dulu sebelum menebak.

## 2. Ringkasan Project (TL;DR)

Single-page website, mobile-first, berisi 6 scene berurutan yang harus dilalui satu arah:

1. Envelope 3D (landing) → tap buka
2. Kue interaktif + countdown ke ulang tahun berikutnya (14 Desember) → tiup lilin
3. Animasi "Happy Birthday, Keonho!" (muncul otomatis begitu tanggal target terpenuhi)
4. Music player (vinyl + sound wave), lagu favorit
5. Ucapan/surat personal
6. Galeri foto (gaya polaroid)

Tone visual: pink + putih tulang (bone white), font utama **Indie Flower**. Tidak ada backend wajib — ini static site.

## 3. Tech Stack

Ikuti rekomendasi di `prd.md` §9 kecuali ada instruksi lain dari user:

- **Frontend:** HTML/CSS/JS vanilla, atau React (Vite) jika project makin kompleks — pilih salah satu di awal dan konsisten, jangan campur.
- **Animasi:** CSS transitions/keyframes untuk animasi sederhana; GSAP atau Framer Motion (kalau pakai React) untuk sequencing antar-scene yang lebih kompleks.
- **Audio:** `<audio>` native cukup untuk MVP; pakai Howler.js kalau butuh kontrol fade/loop yang lebih halus.
- **Font:** Google Fonts CDN — Indie Flower (heading/aksen) + Quicksand atau Poppins (body text, lihat `design.md` §3).
- **Hosting:** static hosting (Vercel/Netlify/GitHub Pages) — pastikan build output bisa di-deploy sebagai static site.
- **Tidak perlu:** database, autentikasi, backend API — kecuali user secara eksplisit minta fitur guestbook (stretch goal di PRD §14).

## 4. Struktur Folder yang Disarankan

```
/
├── prd.md
├── design.md
├── agent.md
├── index.html
├── src/
│   ├── styles/
│   │   ├── tokens.css        # variabel warna, font, spacing dari design.md
│   │   ├── components.css    # button, card, countdown box, dll.
│   │   └── animations.css    # keyframes: flicker, blow-out, confetti, vinyl-spin, dll.
│   ├── scripts/
│   │   ├── main.js           # scene controller / state machine antar 6 layar
│   │   ├── countdown.js       # logic hitung mundur ke tanggal target
│   │   ├── envelope.js
│   │   ├── cake.js
│   │   ├── music-player.js
│   │   └── gallery.js
│   └── components/            # jika pakai React: EnvelopeScene, CakeScene, dst.
├── assets/
│   ├── images/                # foto galeri, ikon dekoratif (svg)
│   ├── audio/                 # file lagu (mp3)
│   └── fonts/                 # fallback kalau tidak pakai CDN
└── public/ (jika pakai Vite/React)
```

Sesuaikan penamaan bila memakai framework tertentu, tapi **pertahankan pemisahan per-scene** — jangan taruh semua logic 6 layar dalam satu file besar.

## 5. Urutan Implementasi yang Disarankan (Build Order)

Bangun sesuai urutan fungsi, bukan urutan visual, supaya bisa ditest bertahap:

1. **Design tokens dulu** — setup variabel warna/font dari `design.md` (`tokens.css` atau `theme.js`) sebelum menyentuh komponen apapun.
2. **State machine / scene controller** — mekanisme pindah antar 6 scene (misal: `currentScene` state + fungsi `goToNextScene()`). Ini fondasi, kerjakan lebih dulu daripada animasi detail.
3. **Countdown logic** (`countdown.js`) — ini logic paling gampang salah, kerjakan & test terpisah dulu sebelum digabung ke UI kue. Termasuk edge case: kalau tanggal akses sudah lewat tanggal target → langsung skip ke state "Birthday" (lihat `prd.md` §6.2).
4. **Scene 1 (Envelope)** → **Scene 2 (Cake+Countdown)** → **Scene 3 (Happy Birthday)** → **Scene 4 (Music)** → **Scene 5 (Surat)** → **Scene 6 (Galeri)** — implementasi berurutan sesuai flow, test tiap scene sebelum lanjut ke scene berikutnya.
5. **Polish animasi** (motion detail di `design.md` §7) dikerjakan paling akhir, setelah semua scene fungsional.
6. **Responsive check** di 320px, 375px, 768px, 1024px+ — dilakukan di tiap scene, bukan ditunda ke akhir.

## 6. Aturan Coding & Konvensi

- **Mobile-first CSS**: tulis style default untuk mobile, gunakan `min-width` media query untuk scale up ke tablet/desktop — bukan sebaliknya.
- **Semua warna & font ambil dari token/variabel**, jangan hardcode hex/font-family berulang di banyak file. Sinkronkan dengan tabel warna di `design.md` §2.
- **Audio harus dipicu oleh user gesture** (tap tombol), bukan auto-play saat page load — browser mobile akan blokir. Lihat `prd.md` §6.4.
- **Hormati `prefers-reduced-motion`** — sediakan fallback non-animasi untuk user yang mengaktifkan setting ini (lihat `design.md` §7).
- **Lazy-load gambar galeri** — jangan load semua foto sekaligus di initial load.
- **Jangan tambahkan fitur di luar scope PRD** (misal: multi-user, admin panel, backend kompleks) tanpa dikonfirmasi ke user dulu — itu eksplisit "Out of Scope" di `prd.md` §13.
- Beri komentar singkat di bagian logic yang tidak trivial (terutama `countdown.js` dan scene controller), karena project ini kemungkinan diedit ulang manual oleh user (bukan developer profesional).

## 7. Konten & Aset yang Masih Placeholder

Sebelum final, pastikan item berikut sudah diganti dari placeholder (lihat `prd.md` §10):

- [ ] Nama penerima: "Keonho" (cek apakah perlu diganti/dikonfirmasi ejaannya)
- [ ] Tanggal target countdown — **konfirmasi ulang asumsi di `prd.md` §11 sebelum hardcode tanggal**
- [ ] File lagu (mp3) — belum ada, jangan commit lagu berhak cipta ke repo publik
- [ ] Foto-foto galeri — belum ada, gunakan placeholder image dulu saat development
- [ ] Teks surat/ucapan — belum ada, gunakan lorem/placeholder text yang jelas ditandai `[GANTI TEKS INI]`

## 8. Definition of Done (per fitur)

Sebuah scene/fitur dianggap selesai kalau:
- [ ] Sesuai acceptance criteria terkait di `prd.md`
- [ ] Sesuai warna/font/motion di `design.md`
- [ ] Berfungsi baik di viewport mobile (320–428px) dan desktop
- [ ] Tidak ada console error
- [ ] Transisi ke scene berikutnya berjalan mulus, tidak stuck

## 9. Kalau Ragu

- Requirement fitur tidak jelas → cek `prd.md`, kalau masih ambigu, tanyakan ke user, jangan menebak.
- Warna/font/style tidak ada di `design.md` → ikuti mood umum ("soft, romantis, handwritten") dan tetap dalam palet yang sudah ditentukan, jangan menambah warna baru di luar palet tanpa alasan kuat.
