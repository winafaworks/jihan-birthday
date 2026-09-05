# PRD — Website Ucapan Ulang Tahun Interaktif "Untuk Keonho"

| | |
|---|---|
| **Dokumen** | Product Requirements Document (PRD) |
| **Produk** | Website ucapan ulang tahun interaktif, single-page |
| **Platform** | Web (mobile-first, responsive ke desktop/tablet) |
| **Status** | Draft v1.0 |

---

## 1. Ringkasan Produk

Website ucapan ulang tahun personal untuk **Keonho**, berbentuk single-page interaktif yang dibuka lewat link (dibagikan via WhatsApp/Instagram). Pengalaman dirancang seperti "membuka hadiah/surat" secara bertahap: mulai dari amplop 3D, kue interaktif dengan hitung mundur, animasi ucapan selamat ulang tahun, pemutaran lagu favorit, surat/ucapan personal, hingga galeri foto kenangan.

Referensi gaya visual: template scrapbook/letter (lihat gambar acuan yang dilampirkan user), namun dengan palet warna **pink & putih tulang** serta font **Indie Flower** (detail di `design.md`).

## 2. Tujuan Produk

- Menghadirkan pengalaman ucapan ulang tahun yang personal, emosional, dan berkesan — bukan kartu ucapan statis.
- Mendorong keterlibatan aktif user (buka amplop, tiup lilin, putar lagu, scroll galeri), bukan sekadar membaca teks.
- Bisa diakses nyaman lewat HP (mobile-first) karena kemungkinan besar dibuka dari chat/DM.
- Cukup dibagikan lewat **satu link**, tanpa perlu install apapun.

## 3. Target Pengguna

| Peran | Deskripsi |
|---|---|
| Primary user | Keonho — penerima ucapan |
| Sender/owner | User (kamu) — sekali setup konten, tidak perlu maintenance berkala |
| Perangkat utama | Smartphone (Android/iOS browser) |
| Perangkat sekunder | Desktop/tablet — tetap harus berfungsi baik |

## 4. Ruang Lingkup Platform

- Web app, single page (SPA), diakses lewat browser, tanpa login/instalasi.
- Dibagikan sebagai satu URL.
- (Opsional) Menyediakan OG image/meta preview yang menarik saat link di-share di WhatsApp/Instagram DM.

## 5. Alur Pengguna (User Flow)

Alur bersifat **linear, satu arah**, setiap fase punya tombol "lanjut" agar user mengontrol tempo cerita (tidak auto-lanjut tiba-tiba).

```
[1. Landing: 3D Envelope]
        ↓ tap "Buka"
[2. Interactive Cake + Countdown]
        ↓ (jika sudah tanggal target)
[3. Animasi "Happy Birthday, Keonho!"]
        ↓ tap "Lanjut"
[4. Music Experience: vinyl / sound wave]
        ↓ (musik terus main di background, atau tap "Lanjut")
[5. Ucapan / Surat]
        ↓ scroll / tap "Lanjut"
[6. Galeri Foto]
```

## 6. Detail Fitur per Layar

### 6.1 Layar 1 — Landing: 3D Envelope

**Deskripsi:** Halaman pertama yang dibuka user. Menampilkan objek amplop bergaya 3D di tengah layar, dengan tombol "Buka Surat" di bawahnya.

**Requirement:**
- Amplop ditampilkan dengan efek 3D (perspective/rotate ringan, bisa idle animation seperti sedikit bergoyang/mengambang).
- Tombol CTA jelas terlihat di bawah amplop (misal: "Buka 💌" / "Tap untuk Buka").
- Saat tombol ditekan → flap amplop terbuka (animasi rotateX), lalu transisi ke Layar 2.
- Background halaman ini sudah harus memakai tone pink/bone white (lihat `design.md`).

**Acceptance criteria:**
- [ ] Amplop terlihat proporsional & tidak terpotong di layar mobile (320px–428px width).
- [ ] Tap/klik pada tombol memicu animasi buka dalam ≤ 1 detik delay.
- [ ] Transisi ke layar berikutnya smooth, tidak "loncat" tiba-tiba.

### 6.2 Layar 2 — Interactive Cake & Countdown

**Deskripsi:** Setelah amplop dibuka, muncul kue ulang tahun interaktif dengan lilin menyala, **berbarengan** dengan tampilan hitung mundur (Hari : Jam : Menit : Detik) menuju tanggal target.

Layar ini punya **dua state**, tergantung waktu saat website diakses:

| State | Kondisi | Tampilan |
|---|---|---|
| **A. Countdown state** | Waktu akses < tanggal target | Kue dengan lilin menyala (idle flicker animation) + counter Hari/Jam/Menit/Detik yang berjalan real-time menuju tanggal target |
| **B. Birthday state** | Waktu akses ≥ tanggal target | Langsung lanjut ke Layar 3 (animasi Happy Birthday), kue bisa tetap tampil sebagai transisi sebelum tiup lilin |

**Requirement:**
- Lilin menyala dengan animasi flicker (loop, halus, tidak kaku).
- Interaksi "tiup lilin": tap/klik pada kue atau tombol khusus → efek blow out (lilin padam + asap tipis fade out).
- Countdown format: `HH Hari : HH Jam : MM Menit : SS Detik`, update setiap detik.
- **Target tanggal**: 14 Desember, dihitung otomatis ke kemunculan terdekat (lihat Asumsi §11).
- Timezone: WIB (Asia/Jakarta) — lihat Asumsi §11.

**Acceptance criteria:**
- [ ] Countdown akurat, update per detik, tidak drift.
- [ ] Jika user membuka website setelah tanggal target, countdown tidak muncul — langsung ke state Birthday.
- [ ] Interaksi tiup lilin memberi feedback visual jelas (lilin padam + partikel asap).

### 6.3 Layar 3 — Animasi "Happy Birthday, Keonho!"

**Deskripsi:** Muncul saat kondisi tanggal sudah terpenuhi (atau setelah lilin ditiup). Teks besar "Happy Birthday, Keonho!" muncul dengan animasi reveal, disertai efek confetti/hati/sparkle.

**Requirement:**
- Teks menggunakan font Indie Flower, animasi muncul huruf-per-huruf atau fade+scale.
- Efek partikel (confetti/hati/bintang kecil) dengan warna sesuai palet (pink, gold, putih).
- Tombol "Lanjut" muncul setelah animasi utama selesai (delay ±1–2 detik agar tidak terburu-buru).

**Acceptance criteria:**
- [ ] Animasi teks selesai dalam waktu wajar (≤3 detik) sebelum tombol lanjut aktif.
- [ ] Tidak ada elemen yang overlap/tertutup di layar kecil.

### 6.4 Layar 4 — Music Experience

**Deskripsi:** Lagu favorit mulai diputar, ditampilkan dengan animasi piringan hitam (vinyl) berputar dan/atau sound wave visualizer.

**Requirement:**
- Musik dipicu oleh interaksi user (tap tombol "Lanjut" di layar sebelumnya dianggap sebagai user gesture) — penting karena browser mobile memblokir autoplay audio tanpa interaksi.
- Vinyl berputar terus-menerus (rotate linear infinite) selama lagu diputar.
- Sound wave/equalizer bar animasi mengikuti status play (statis/berhenti saat pause).
- Kontrol dasar: play/pause, (opsional) volume/mute.
- Musik bisa **terus berjalan di background** saat user lanjut ke layar Ucapan & Galeri Foto (tidak berhenti otomatis).
- Tombol "Lanjut" untuk melanjutkan ke Ucapan.

**Acceptance criteria:**
- [ ] Musik mulai diputar tanpa perlu tap kedua (memakai gesture dari tombol sebelumnya), atau muncul tombol play manual jika autoplay diblokir browser.
- [ ] Vinyl/sound wave sinkron dengan status play/pause.
- [ ] Tidak ada delay/buffering yang mengganggu (audio di-preload).

### 6.5 Layar 5 — Ucapan / Surat

**Deskripsi:** Halaman berisi teks ucapan personal, ditampilkan seperti surat tulisan tangan.

**Requirement:**
- Teks surat ditampilkan dengan styling handwritten (Indie Flower untuk heading/aksen, font pendamping untuk isi surat panjang agar tetap terbaca — lihat `design.md`).
- Bisa menyertakan nama pengirim & tanggal di bagian bawah surat.
- Scrollable jika teks panjang, dengan card/background bertekstur kertas lembut.

**Acceptance criteria:**
- [ ] Teks surat mudah dibaca di layar kecil (kontras cukup, ukuran font memadai — lihat catatan aksesibilitas di `design.md`).
- [ ] Tidak ada teks terpotong/overflow.

### 6.6 Layar 6 — Galeri Foto

**Deskripsi:** Kumpulan foto kenangan ditampilkan dalam gaya polaroid/scrapbook, sesuai referensi gambar user.

**Requirement:**
- Grid atau carousel foto (disarankan carousel/scroll horizontal untuk mobile, grid untuk desktop).
- Gaya polaroid: frame putih, sedikit rotasi acak per foto, bisa ditambah washi tape/pita kecil.
- Tap foto → lightbox/fullscreen view.
- (Opsional) caption singkat per foto.

**Acceptance criteria:**
- [ ] Foto ter-load dengan lazy loading (tidak membebani performa di awal).
- [ ] Lightbox bisa ditutup dengan tap di luar area / tombol close.

## 7. Ringkasan Functional Requirements

| ID | Requirement | Prioritas |
|---|---|---|
| FR-01 | Landing page menampilkan amplop 3D + tombol buka | Must have |
| FR-02 | Animasi buka amplop transisi ke layar kue | Must have |
| FR-03 | Kue dengan lilin menyala + interaksi tiup (blow out) | Must have |
| FR-04 | Countdown real-time (hari/jam/menit/detik) ke tanggal target | Must have |
| FR-05 | Auto-switch ke state "Happy Birthday" saat tanggal terpenuhi | Must have |
| FR-06 | Animasi teks "Happy Birthday, Keonho!" + efek partikel | Must have |
| FR-07 | Tombol lanjut antar-layar di setiap fase | Must have |
| FR-08 | Music player dengan animasi vinyl/sound wave | Must have |
| FR-09 | Kontrol play/pause musik | Must have |
| FR-10 | Halaman ucapan/surat personal | Must have |
| FR-11 | Galeri foto dengan lightbox | Must have |
| FR-12 | Responsive di semua ukuran layar (mobile-first) | Must have |
| FR-13 | Guestbook/kolom balasan dari Keonho | Nice to have |
| FR-14 | Mic-based blow-out detection (tiup asli via mic) | Nice to have |
| FR-15 | OG image preview saat link dibagikan | Nice to have |

## 8. Non-Functional Requirements

- **Performa:** waktu muat awal < 3 detik pada koneksi 4G; gambar & audio dioptimasi (compress, lazy-load).
- **Responsive:** mendukung lebar layar 320px – 1440px tanpa elemen terpotong.
- **Kompatibilitas browser:** Chrome, Safari (iOS), Samsung Internet — versi 2 tahun terakhir.
- **Aksesibilitas:** hormati `prefers-reduced-motion` untuk user yang sensitif terhadap animasi; kontras warna teks memadai (detail di `design.md`).
- **Tidak butuh backend wajib** — kecuali fitur guestbook diaktifkan (stretch goal).
- **Keamanan/privasi:** tidak ada data pribadi sensitif tersimpan; jika ada form balasan, tidak wajib publik.

## 9. Rekomendasi Teknis

| Aspek | Rekomendasi |
|---|---|
| Frontend | HTML/CSS/JS vanilla, atau React (jika ingin lebih terstruktur) |
| Animasi 3D/transisi | CSS 3D transforms untuk amplop; GSAP atau Framer Motion untuk sequencing animasi |
| Audio | `<audio>` native atau Howler.js (lebih mudah kontrol fade/loop) |
| Font | Google Fonts — Indie Flower |
| Hosting | Vercel / Netlify / GitHub Pages (statis, gratis, cepat) |
| Countdown | JS `Date` object, hitung selisih real-time dengan `setInterval` |

## 10. Konten yang Perlu Disiapkan User

- [ ] Nama penerima: **Keonho**
- [ ] Tanggal target ulang tahun (konfirmasi: 14 Desember)
- [ ] Foto-foto kenangan (disarankan 6–12 foto, format & rasio lihat `design.md`)
- [ ] File lagu favorit (mp3, pastikan untuk pemakaian pribadi/non-publik)
- [ ] Teks ucapan/surat pribadi
- [ ] Nama pengirim (opsional ditampilkan di akhir surat)

## 11. Asumsi & Pertanyaan Terbuka

> ⚠️ **Bagian ini perlu dikonfirmasi user sebelum development dimulai.**

1. **Tanggal target countdown** — brief menyebut "14-12-2009". Karena tanggal ini sudah lampau, PRD ini mengasumsikan **2009 adalah tahun lahir Keonho**, dan countdown yang dimaksud adalah menuju **ulang tahun terdekat berikutnya (14 Desember)**, dengan tahun dihitung otomatis mengikuti tahun berjalan/berikutnya. *Mohon dikonfirmasi apakah ini benar, atau apakah maksudnya adalah tanggal spesifik lain.*
2. **Timezone** countdown diasumsikan **WIB (Asia/Jakarta)**.
3. **Mekanisme tiup lilin**: direkomendasikan berbasis **tap/klik** (sederhana & pasti berjalan di semua device). Deteksi tiupan asli via mikrofon dimasukkan sebagai *stretch goal* opsional karena butuh izin akses mic dan kurang reliable di beberapa browser.
4. **Hak pakai lagu**: karena bersifat hadiah personal (bukan produk publik), lagu diasumsikan untuk pemakaian pribadi/terbatas, bukan didistribusikan secara publik.

## 12. Metrik Keberhasilan

Karena ini produk hadiah personal (bukan produk bisnis), metrik keberhasilan lebih ke kualitas pengalaman:
- User (Keonho) berhasil menyelesaikan seluruh alur dari amplop hingga galeri foto.
- Tidak ada bug/crash yang menghentikan alur di tengah jalan.
- Pengalaman terasa lancar & personal di perangkat mobile.

## 13. Out of Scope

- Multi-user / multi-penerima (produk generik yang bisa dipakai banyak orang).
- Admin panel/CMS untuk edit konten dari UI (konten di-hardcode saat development).
- Backend/database kompleks, kecuali fitur guestbook diaktifkan.

## 14. Stretch Goals (Opsional)

- Guestbook — kolom balasan singkat dari Keonho yang tersimpan.
- Deteksi tiup lilin asli via mikrofon.
- OG image/meta preview custom saat link dibagikan ke WhatsApp/Instagram.
- Toggle mute musik global yang persist antar-layar.
