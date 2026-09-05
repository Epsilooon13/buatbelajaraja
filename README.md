# buatbelajaraja

Website statis untuk latihan pilihan ganda dalam bahasa Indonesia.

Buka `panduan.html` untuk panduan penggunaan CSV dan publikasi GitHub Pages/cPanel.

## Mengedit source code

Ekstrak ZIP, lalu buka foldernya di VS Code melalui File > Open Folder. Edit `index.html` untuk nama dan teks, `style.css` untuk tampilan, `script.js` dan `quiz-core.js` untuk perilaku kuis, atau `soal.csv` untuk bank soal. Simpan perubahan, lalu uji melalui `index.html` dan impor CSV untuk pengujian lokal.

Perubahan lokal tidak otomatis mengubah website yang sudah terbit. Unggah perubahan ke hosting/GitHub yang digunakan, atau lampirkan file hasil edit di percakapan ChatGPT pemilik Site dan minta pembaruan.

Alamat website dikelola terpisah dari kode. Untuk Sites, buka pengaturan Site lalu Change URL untuk mengubah label alamat. Domain sendiri seperti `buatbelajaraja.my.id` harus didaftarkan lebih dulu dan disambungkan lewat pengaturan domain serta DNS.

## Isi paket

- `index.html`: halaman kuis
- `style.css`: tampilan responsif
- `quiz-core.js`: parser CSV dan logika penilaian
- `script.js`: interaksi aplikasi
- `soal.csv`: 12 soal contoh BGP beserta sumber
- `panduan.html`: panduan lengkap

Tidak perlu npm, build, API key, PHP, atau database server.

Untuk menguji dari folder lokal, buka `index.html`, klik Bank soal, impor `soal.csv`, lalu Gunakan bank soal ini. Ketika dipasang pada web hosting, file `soal.csv` dimuat otomatis.

Impor CSV di browser hanya berlaku selama halaman terbuka. Untuk memperbarui bank soal pengunjung lain, ganti `soal.csv` pada hosting. CSV dapat diakses pengunjung, termasuk kunci jawaban. Hasil latihan tidak disimpan ke server. Ini aplikasi latihan mandiri, bukan platform ujian dengan kunci rahasia.
