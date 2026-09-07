# buatbelajaraja — pembaruan pengaturan kuis

## Upload pembaruan
Ekstrak ZIP pembaruan. Upload seluruh file di dalamnya ke root repository buatbelajaraja melalui Add file > Upload files, lalu Commit changes. Tidak perlu upload ZIP sebagai satu file. Paket ini tidak berisi soal.csv, sehingga bank soal yang sudah ada tetap dipakai. Setelah GitHub Pages selesai menerbitkan perubahan, muat ulang halaman (Ctrl+F5 jika masih tampilan lama).

File runtime: index.html, style.css, script.js, quiz-core.js, curriculum.js, practice-history.js. Panduan: panduan.html dan README.md. Semua path relatif dan sesuai GitHub Pages project site. Tidak memerlukan build atau instalasi paket.

## Pengaturan
- Jumlah soal: ketik bilangan bulat 1–5000 atau tekan Semua. Bila permintaan melebihi soal pada materi terpilih, sesi memakai jumlah yang tersedia tanpa duplikasi.
- Klik Materi, pilih Module 1–26, lalu submodul x.y. Pilihan semua modul atau semua submodul juga tersedia. Angka dalam kurung adalah jumlah soal tersedia. Modul kosong tetap tercantum dan tombol mulai tidak aktif jika hasil filter kosong.
- Waktu per soal: 10, 20, 30, atau 45 detik. Default 30 detik.
- Waktu habis: jawaban dikunci, bernilai 0, dan pembahasan ditampilkan. Tekan Soal berikutnya untuk melanjutkan. Timer berhenti saat jawaban dikunci dan dimulai ulang untuk setiap soal berikutnya.
- Timer tetap berjalan saat tab ditinggalkan atau dialog Akhiri sesi dibuka. Kembali ke tab akan memperbarui waktu sesuai tenggat. Sesi tidak disimpan setelah reload.
- Ulangi yang belum benar mencakup soal salah, kehabisan waktu, dan belum dijawab. Timer serta status jawaban direset pada sesi baru.

## Mengelompokkan CSV
Header tetap:
`id,kategori,pertanyaan,opsi_a,opsi_b,opsi_c,opsi_d,jawaban,pembahasan`

Isi kategori dengan kode dan judul submodul, misalnya `1.2 Cisco Enterprise Architecture Model`, `8.6 EIGRP Path Selection`, atau `11.5 BGP Path Selection`. Kode x.y adalah acuan utama. Kategori bertingkat seperti `11.5.2 ...` masuk ke induk 11.5, tanpa menampilkan tingkat ketiga. Nama submodul persis tanpa kode juga dikenali jika hanya ada satu kecocokan. Kategori umum seperti `Introduction` perlu kode karena ada pada banyak modul.

Beberapa judul chat lama serta kategori contoh BGP telah dipetakan dalam aliases di curriculum.js. Kategori yang belum cocok masuk Materi lainnya, tetap tersedia pada Semua modul, dan tidak dibuang. Anda dapat mengganti kategori CSV dengan kode x.y yang tepat atau menambahkan pasangan judul lama: kode di aliases. Tidak ada klasifikasi berdasarkan tebakan isi pertanyaan.

Hierarki berasal dari file CCNP_ENCOR_v9_Hierarchy_Modul_1-26(1).md yang diberikan pengguna, hanya modul dan submodul. Daftar modul tidak otomatis membuat bank soal baru.

Kelola soal.csv sendiri di GitHub. Setiap ID wajib unik. Bank soal dan kunci dapat dibaca pengunjung situs publik. Pengujian file lewat file:// tidak mendukung fetch CSV; gunakan GitHub Pages atau server HTTP lokal.

## Pembaruan: tampilan ringkas, pencarian, dan prioritas soal
Halaman awal kini berupa satu kartu pengaturan, tanpa angka dekoratif dan panel sambutan. Kuis tampil setelah Mulai ditekan. Di desktop, kontrol jumlah dan waktu sejajar; di layar sempit tata letak menyesuaikan.

Klik Materi lalu gunakan Cari materi (contoh HSRP, EIGRP, 8.6). Pencarian mencakup 26 modul, submodul x.y, dan kategori lainnya. Hasil menampilkan jumlah soal. Klik hasil untuk memilih; dropdown modul/submodul tetap bisa digunakan. Pencarian tidak mengubah pilihan aktif sampai hasil dipilih. Enter memilih hasil pertama, panah bawah menuju daftar hasil, panah atas/bawah berpindah hasil, Escape menghapus pencarian. Materi kosong tetap tampil sesuai perilaku sebelumnya.

Opsi Prioritaskan soal yang sering salah aktif secara default dan bisa dimatikan. Catatan jawaban baru mulai terkumpul setelah versi ini digunakan; sesi lama tidak dapat dipulihkan. Setiap jawaban yang sudah dikunci dicatat sekali saat itu juga, termasuk waktu habis sebagai jawaban tidak benar. Soal yang belum dikerjakan saat sesi diakhiri tidak menambah catatan kesalahan.

Jika ada soal yang perlu diulang, sekitar 70% slot sesi diambil dari soal tersebut, sisanya dari soal lain dengan mengutamakan yang belum pernah dikerjakan. Pada sesi kecil proporsi dibulatkan; kuota diisi dari kelompok lain jika salah satu kelompok kurang. Untuk satu soal, prioritas diberikan ke soal yang perlu diulang. Tidak ada soal duplikat dalam sesi dan pilihan modul tetap dihormati. Acak soal menentukan urutan akhir. Ketika belum ada riwayat kesalahan, sesi berjalan seperti biasa.

Prioritas mempertimbangkan frekuensi serta proporsi kesalahan; setelah dua jawaban benar berturut-turut, soal keluar dari kelompok prioritas sampai dijawab salah lagi. Tombol Ulangi yang belum benar tetap mengulang seluruh soal yang belum benar pada sesi terakhir, tanpa campuran baru.

Catatan disimpan melalui localStorage di browser/perangkat ini dan tidak dikirim ke server. Mode privat atau penghapusan data browser dapat menghapusnya. Jika penyimpanan diblokir/penuh, latihan tetap berjalan menggunakan catatan selama halaman terbuka dan menampilkan keterbatasan tersebut. Tidak ada login, sinkronisasi perangkat, dashboard riwayat, atau jadwal pengulangan.

Gunakan ID soal yang stabil. Mengubah teks pertanyaan, opsi, atau kunci dengan ID sama akan memulai catatan baru untuk soal tersebut; mengubah kategori atau pembahasan saja mempertahankan catatan. Menghapus soal dari CSV mengeluarkannya dari catatan aktif. Catatan dari dua tab yang dipakai bersamaan belum digabung secara langsung; gunakan satu tab latihan agar hasil pencatatan konsisten.
