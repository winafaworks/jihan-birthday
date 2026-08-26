# Design Guideline — Website Ucapan Ulang Tahun Interaktif

| | |
|---|---|
| **Dokumen** | Design Guideline / Style Guide |
| **Terkait** | `prd.md` |
| **Mood** | Romantis, lembut, handwritten scrapbook, feminin tapi tidak kekanakan |
| **Status** | Draft v1.0 |

---

## 1. Arah Desain (Mood & Direction)

Referensi visual dari user memakai gaya scrapbook/letter dengan foto polaroid, doodle, dan sentuhan handwritten — namun dengan tone warna **maroon/burgundy gelap**. Guideline ini mengadaptasi *layout & gaya* yang sama, tetapi mengganti palet menjadi **pink & putih tulang** agar lebih lembut, cerah, dan "girly-romantic" — tetap elegan, bukan norak.

Kata kunci desain: *soft, dreamy, handwritten, warm, cozy, sedikit playful lewat animasi.*

## 2. Palet Warna

### Warna Utama

| Nama | Hex | Penggunaan |
|---|---|---|
| Bone White (background utama) | `#FAF7F2` | Background dasar semua layar |
| Ivory / Off-white | `#F5EFE6` | Background card/section alternatif |
| Blush Pink | `#F8C9D4` | Background aksen, panel, elemen dekoratif |
| Soft Pink | `#FADCE3` | Gradient partner, hover state ringan |
| Rose Pink (Primary Accent) | `#EF7DA0` | Tombol CTA, highlight, ikon aktif |
| Deep Rose (Accent Gelap) | `#C24170` | Teks aksen, hover CTA, border penting |
| Warm Charcoal (teks utama) | `#4A3B3F` | Body text — **bukan hitam pekat**, agar tetap hangat |
| Putih | `#FFFFFF` | Card, highlight, elemen foto frame |

### Contoh Gradient

```css
/* Background hero/landing */
background: linear-gradient(160deg, #FADCE3 0%, #FAF7F2 60%, #FFFFFF 100%);

/* Tombol CTA */
background: linear-gradient(135deg, #F8A6C1 0%, #EF7DA0 100%);
```

### Aturan Penggunaan

- Bone white / ivory selalu jadi **base/dominan** (≥60% area) agar tidak "terlalu pink" dan tetap elegan.
- Pink jenuh (Rose Pink, Deep Rose) dipakai **secukupnya** untuk aksen: tombol, ikon, judul, garis dekoratif.
- Hindari menumpuk pink jenuh di atas pink jenuh lain — selalu selingi dengan white/bone agar kontras terjaga.

## 3. Tipografi

### Font Utama: **Indie Flower** (Google Fonts)

Dipakai untuk elemen yang butuh nuansa "tulisan tangan personal": judul, headline animasi ("Happy Birthday, Jihan!"), label tombol, quote/aksen singkat.

```html
<link href="https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap" rel="stylesheet">
```

```css
font-family: 'Indie Flower', cursive;
```

### Font Pendamping (untuk keterbacaan teks panjang)

Indie Flower adalah font *script/handwriting* — sangat cocok untuk judul singkat, tapi **melelahkan dibaca untuk paragraf panjang** (misalnya isi surat di Layar 5). Direkomendasikan pairing dengan font rounded sans-serif yang tetap terasa hangat:

- **Rekomendasi:** `Quicksand` atau `Poppins` (Google Fonts), untuk body text/paragraf surat.
- Indie Flower tetap dipakai untuk heading "A Letter for You", tanda tangan, dan aksen di sekitar surat.

### Type Scale

| Elemen | Font | Size (mobile) | Size (desktop) | Weight |
|---|---|---|---|---|
| Hero title ("Happy Birthday, Jihan!") | Indie Flower | 40px | 64px | Regular |
| Section heading | Indie Flower | 28px | 36px | Regular |
| Sub-heading / label kecil | Indie Flower | 18px | 20px | Regular |
| Body text (surat, deskripsi) | Quicksand/Poppins | 16px | 17px | Regular/Medium |
| Caption foto | Quicksand/Poppins | 13px | 14px | Regular |
| Tombol (button label) | Indie Flower | 18px | 20px | Regular |

> Catatan: Indie Flower secara visual terlihat lebih kecil dari font biasa di ukuran yang sama — pertimbangkan menaikkan size 10–20% dari font sans biasa agar proporsi terasa pas.

## 4. Ikonografi & Ilustrasi

- Gaya ikon: **hand-drawn/doodle** — hati, bintang kecil, sparkle, garis bawah coret tangan.
- Elemen dekoratif berulang: hati kecil mengambang, taburan sparkle/confetti pink-gold-putih, washi tape/pita di sudut foto.
- Foto ditampilkan dalam **frame polaroid**: border putih tebal di 3 sisi + lebih tebal di bawah, sedikit rotasi acak (`-4deg` s/d `4deg`) agar terasa "ditempel manual".
- Amplop 3D: warna dasar bone white/soft pink, dengan segel/stiker hati kecil sebagai focal point.

## 5. Layout & Spacing

- **Pendekatan: mobile-first.** Desain & susun komponen utama dulu untuk layar 375–428px, baru scale up ke tablet/desktop.
- Struktur: single column di mobile, konten di-center secara vertikal per "scene" (tiap layar terasa seperti satu halaman penuh).
- Padding aman: minimum `24px` horizontal di mobile agar tidak mepet tepi layar.
- Spacing antar elemen dalam satu card: `12–16px`.
- Perhatikan *safe area* untuk notch/status bar di iOS (`env(safe-area-inset-*)`).

### Breakpoints

| Breakpoint | Lebar |
|---|---|
| Mobile (default) | 320px – 767px |
| Tablet | 768px – 1023px |
| Desktop | ≥ 1024px (konten tetap dibatasi max-width ±480–600px agar tidak melebar canggung, karena ini pengalaman naratif personal bukan web app lebar) |

## 6. Gaya Komponen

### Tombol (Button)

- Bentuk **pill** (border-radius penuh).
- Fill gradient Rose Pink → Deep Rose, teks putih, font Indie Flower.
- Shadow lembut: `box-shadow: 0 8px 20px rgba(239, 125, 160, 0.35);`
- State tap: scale down halus (`transform: scale(0.96)`), transisi 150ms.

```css
.btn-primary {
  background: linear-gradient(135deg, #F8A6C1, #EF7DA0);
  color: #FFFFFF;
  font-family: 'Indie Flower', cursive;
  border-radius: 999px;
  padding: 14px 32px;
  box-shadow: 0 8px 20px rgba(239, 125, 160, 0.35);
  transition: transform 150ms ease;
}
.btn-primary:active { transform: scale(0.96); }
```

### Card / Panel

- Border-radius: `20–24px`.
- Background: putih atau ivory `#F5EFE6`.
- Border tipis opsional: `1px dashed #F8C9D4` (kesan "ditempel di scrapbook").
- Shadow lembut, bukan tajam: `0 10px 30px rgba(194, 65, 112, 0.08)`.

### Countdown Timer

- 4 kotak (Hari/Jam/Menit/Detik), masing-masing: background putih, border pink lembut, angka besar pakai Indie Flower, label kecil di bawah pakai font pendamping.
- Animasi setiap detik berganti: fade/slide halus, bukan "loncat" kasar.

### Galeri Foto (Polaroid)

- Frame putih, shadow lembut, rotasi acak ringan per foto.
- Saat foto ditap → transisi ke lightbox dengan overlay blush pink transparan (`rgba(248, 201, 212, 0.85)`), bukan overlay hitam pekat (agar tetap konsisten mood pink/lembut).

## 7. Motion & Animasi

| Elemen | Animasi | Durasi | Easing |
|---|---|---|---|
| Amplop terbuka | Rotate flap (rotateX) | 700–900ms | ease-in-out |
| Idle envelope | Float halus naik-turun | loop 3s | ease-in-out |
| Lilin menyala | Flicker (scale + opacity kecil) | loop 1.5–2s | ease-in-out |
| Tiup lilin (blow out) | Flame scale→0 + asap fade & naik | 600–800ms | ease-out |
| Reveal teks "Happy Birthday" | Fade + slight scale-up, per kata/huruf | 1.5–2.5s total | ease-out |
| Confetti/partikel | Jatuh/burst dari titik tengah | 2–4s loop/one-shot | ease-out |
| Vinyl berputar | Rotate 360° | loop linear, ~3s/putaran | linear |
| Sound wave bar | Scale-Y naik turun acak | loop selama playing | ease-in-out |
| Transisi antar-layar | Fade + slide-up halus | 400–600ms | ease-in-out |

**Aksesibilitas motion:** hormati media query berikut agar animasi non-esensial dinonaktifkan untuk user yang sensitif:

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

## 8. Peta Visual per Layar (ringkas, mengacu ke `prd.md` §6)

| Layar | Background | Elemen dominan | Font utama di layar |
|---|---|---|---|
| 1. Envelope | Gradient blush pink → bone white | Amplop 3D + tombol pill | Indie Flower (label tombol) |
| 2. Cake & Countdown | Bone white, aksen pink dekoratif | Kue + lilin + 4 kotak countdown | Indie Flower (angka), font pendamping (label) |
| 3. Happy Birthday | Gradient soft pink, partikel confetti | Teks besar animasi | Indie Flower (headline besar) |
| 4. Music | Bone white/ivory, vinyl di tengah | Vinyl berputar + sound wave bar | Indie Flower (judul lagu) |
| 5. Ucapan/Surat | Ivory bertekstur kertas lembut | Card surat, tanda tangan | Indie Flower (heading & ttd), font pendamping (isi) |
| 6. Galeri Foto | Bone white | Grid/carousel polaroid | Font pendamping (caption) |

## 9. Aksesibilitas & Kontras

- Teks body **jangan** memakai Rose Pink terang di atas Bone White — kontras kurang. Gunakan **Warm Charcoal (`#4A3B3F`)** untuk semua body text panjang.
- Rose Pink (`#EF7DA0`) & Deep Rose (`#C24170`) aman dipakai untuk teks besar/heading (Indie Flower ukuran besar), tapi hindari untuk teks kecil/paragraf.
- Target kontras minimum WCAG AA (4.5:1) untuk body text — cek pasangan warna final sebelum development.
- Ukuran target sentuh (tombol, ikon interaktif): minimum `44x44px` di mobile.

## 10. Kebutuhan Aset

| Aset | Spesifikasi |
|---|---|
| Foto galeri | Disarankan rasio 4:5 atau 1:1, resolusi ≥ 1080px sisi terpanjang, di-compress (WebP jika memungkinkan) |
| Ikon dekoratif (hati, sparkle, doodle) | Format SVG agar tajam di semua ukuran layar |
| Font | Google Fonts CDN — Indie Flower + Quicksand/Poppins (tidak perlu self-host) |
| Audio | MP3, bitrate 128–192kbps cukup (menjaga ukuran file kecil untuk mobile), durasi disesuaikan/looping |
| Ilustrasi amplop & kue | SVG atau Lottie/JSON animation jika ingin animasi lebih halus & ringan dibanding video/GIF |
