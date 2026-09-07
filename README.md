# buatbelajaraja — pembaruan pengaturan kuis

## Upload pembaruan
Ekstrak ZIP pembaruan. Upload seluruh file di dalamnya ke root repository buatbelajaraja melalui Add file > Upload files, lalu Commit changes. Tidak perlu upload ZIP sebagai satu file. Paket ini tidak berisi soal.csv, sehingga bank soal yang sudah ada tetap dipakai. Setelah GitHub Pages selesai menerbitkan perubahan, muat ulang halaman (Ctrl+F5 jika masih tampilan lama).

File runtime: index.html, style.css, script.js, quiz-core.js, curriculum.js, practice-history.js, quiz-session.js, content-format.js. Panduan: panduan.html dan README.md. Semua path relatif dan sesuai GitHub Pages project site. Tidak memerlukan build atau instalasi paket.

## Pengaturan
- Jumlah soal: ketik bilangan bulat 1–5000 atau tekan Semua. Bila permintaan melebihi soal pada materi terpilih, sesi memakai jumlah yang tersedia tanpa duplikasi.
- Klik Materi, pilih Module 1–26 dan submodul x.y, lalu Tambahkan materi. Ulangi untuk beberapa pilihan. Tanpa pilihan khusus berarti semua materi. Angka dalam kurung adalah jumlah soal tersedia. Modul kosong tetap tercantum dan tombol mulai tidak aktif jika hasil filter kosong.
- Waktu per soal: Tanpa timer, 10, 20, 30, atau 45 detik. Default 30 detik.
- Waktu habis: jawaban dikunci dan bernilai 0. Mode Belajar menampilkan pembahasan saat itu; Mode Ujian menunggu sesi selesai. Tekan Soal berikutnya untuk melanjutkan. Timer berhenti saat jawaban dikunci dan dimulai ulang untuk setiap soal berikutnya.
- Timer tetap berjalan saat tab ditinggalkan atau dialog Akhiri sesi dibuka. Kembali ke tab akan memperbarui waktu sesuai tenggat. Sesi tersimpan di browser jika penyimpanan tersedia; gunakan Lanjutkan sesi setelah reload.
- Ulangi yang belum benar mencakup soal salah, kehabisan waktu, dan belum dijawab. Timer serta status jawaban direset pada sesi baru.

## Mengelompokkan CSV
Header baru untuk bank dua bahasa:
`id,kategori,pertanyaan,opsi_a,opsi_b,opsi_c,opsi_d,jawaban,pembahasan,bahasa`

Isi kategori dengan kode dan judul submodul, misalnya `1.2 Cisco Enterprise Architecture Model`, `8.6 EIGRP Path Selection`, atau `11.5 BGP Path Selection`. Kode x.y adalah acuan utama. Kategori bertingkat seperti `11.5.2 ...` masuk ke induk 11.5, tanpa menampilkan tingkat ketiga. Nama submodul persis tanpa kode juga dikenali jika hanya ada satu kecocokan. Kategori umum seperti `Introduction` perlu kode karena ada pada banyak modul.

Beberapa judul chat lama serta kategori contoh BGP telah dipetakan dalam aliases di curriculum.js. Kategori yang belum cocok masuk Materi lainnya, tetap tersedia pada Semua modul, dan tidak dibuang. Anda dapat mengganti kategori CSV dengan kode x.y yang tepat atau menambahkan pasangan judul lama: kode di aliases. Tidak ada klasifikasi berdasarkan tebakan isi pertanyaan.

Hierarki berasal dari file CCNP_ENCOR_v9_Hierarchy_Modul_1-26(1).md yang diberikan pengguna, hanya modul dan submodul. Daftar modul tidak otomatis membuat bank soal baru.

Kelola soal.csv sendiri di GitHub. Setiap ID wajib unik. Bank soal dan kunci dapat dibaca pengunjung situs publik. Pengujian file lewat file:// tidak mendukung fetch CSV; gunakan GitHub Pages atau server HTTP lokal.

## Pembaruan: tampilan ringkas, pencarian, dan prioritas soal
Halaman awal kini berupa satu kartu pengaturan, tanpa angka dekoratif dan panel sambutan. Kuis tampil setelah Mulai ditekan. Di desktop, kontrol jumlah dan waktu sejajar; di layar sempit tata letak menyesuaikan.

Klik Materi lalu gunakan Cari materi (contoh HSRP, EIGRP, 8.6). Pencarian mencakup 26 modul, submodul x.y, dan kategori lainnya. Hasil menampilkan jumlah soal. Klik hasil untuk menambah pilihan; dropdown modul/submodul tetap bisa digunakan melalui Tambahkan materi. Pencarian tidak mengubah pilihan aktif sampai hasil dipilih. Enter menambahkan hasil pertama yang belum dipilih, panah bawah menuju daftar hasil, panah atas/bawah berpindah hasil, Escape menghapus pencarian. Materi kosong tetap tampil sesuai perilaku sebelumnya.

Opsi Prioritaskan soal yang sering salah aktif secara default dan bisa dimatikan. Catatan jawaban baru mulai terkumpul setelah versi ini digunakan; sesi lama tidak dapat dipulihkan. Setiap jawaban yang sudah dikunci dicatat sekali saat itu juga, termasuk waktu habis sebagai jawaban tidak benar. Soal yang belum dikerjakan saat sesi diakhiri tidak menambah catatan kesalahan.

Jika ada soal yang perlu diulang, sekitar 70% slot sesi diambil dari soal tersebut, sisanya dari soal lain dengan mengutamakan yang belum pernah dikerjakan. Pada sesi kecil proporsi dibulatkan; kuota diisi dari kelompok lain jika salah satu kelompok kurang. Untuk satu soal, prioritas diberikan ke soal yang perlu diulang. Tidak ada soal duplikat dalam sesi dan pilihan modul tetap dihormati. Acak soal menentukan urutan akhir. Ketika belum ada riwayat kesalahan, sesi berjalan seperti biasa.

Prioritas mempertimbangkan frekuensi serta proporsi kesalahan; setelah dua jawaban benar berturut-turut, soal keluar dari kelompok prioritas sampai dijawab salah lagi. Tombol Ulangi yang belum benar tetap mengulang seluruh soal yang belum benar pada sesi terakhir, tanpa campuran baru.

Catatan disimpan melalui localStorage di browser/perangkat ini dan tidak dikirim ke server. Mode privat atau penghapusan data browser dapat menghapusnya. Jika penyimpanan diblokir/penuh, latihan tetap berjalan menggunakan catatan selama halaman terbuka dan menampilkan keterbatasan tersebut. Tidak ada login, sinkronisasi perangkat, dashboard riwayat, atau jadwal pengulangan.

Gunakan ID soal yang stabil. Mengubah teks pertanyaan, opsi, atau kunci dengan ID sama akan memulai catatan baru untuk soal tersebut; mengubah kategori atau pembahasan saja mempertahankan catatan. Menghapus soal dari CSV mengeluarkannya dari catatan aktif. Catatan dari dua tab yang dipakai bersamaan belum digabung secara langsung; gunakan satu tab latihan agar hasil pencatatan konsisten.

## Pembaruan: beberapa materi, pemulihan sesi, tanpa timer, dan mode ujian

### Beberapa materi
Di dalam Materi, pilih modul dan submodul, lalu tekan Tambahkan materi. Bisa juga menambahkan langsung dari pencarian. Daftar pilihan berupa label dengan tombol × untuk menghapus. Tanpa pilihan khusus berarti semua materi. Gunakan semua materi mengosongkan daftar pilihan khusus.

Memilih seluruh modul mencakup semua submodul di bawahnya; submodul yang sama tidak diduplikasi. Jika memilih seluruh modul setelah memilih beberapa submodulnya, pilihan submodul tersebut diringkas menjadi satu pilihan modul. Jumlah soal adalah total sesi, bukan jumlah per modul. Soal diambil dari gabungan materi; tidak dijamin setiap modul mendapatkan kuota yang sama. Prioritas soal salah dan pengacakan tetap mengikuti pengaturan.

### Mode dan timer
- Mode Belajar: memilih jawaban langsung menguncinya, menampilkan benar/salah dan pembahasan.
- Mode Ujian: memilih jawaban langsung menguncinya dengan penanda netral. Benar/salah, skor, dan pembahasan hanya muncul di hasil akhir. Tidak ada navigasi kembali untuk mengganti jawaban yang sudah dikunci pada versi ini.
- Tanpa timer: tidak ada hitung mundur, soal dapat dibaca sampai pengguna menjawab.
- Mode Belajar/Ujian bisa dikombinasikan dengan Tanpa timer atau 10/20/30/45 detik. Batas waktu tetap PER SOAL, bukan waktu total ujian.

### Sesi tersimpan
Mulai sesi, kunci jawaban, waktu habis, atau pindah soal akan menyimpan sesi secara otomatis di browser. Urutan soal dan pilihan jawaban, jawaban terkunci, posisi soal, pilihan materi, mode, dan tenggat timer dipertahankan. Setelah refresh atau menutup dan membuka kembali halaman, muncul Lanjutkan sesi atau Buang sesi. Pembuangan sesi perlu konfirmasi dan tidak menghapus riwayat jawaban yang sudah tercatat.

Timer memakai tenggat waktu tetap: refresh tidak memberikan waktu baru. Jika waktu soal aktif habis saat tab ditutup, ketika dilanjutkan soal itu ditandai Waktu habis; soal berikutnya belum mulai dihitung sampai tombol berikutnya ditekan. Soal yang sudah dijawab tidak terkena waktu habis. Tanpa timer tetap dapat dilanjutkan tanpa batas hitung mundur.

Snapshot menyimpan ID dan urutan opsi, lalu memeriksa kesesuaian dengan bank soal terbaru. Jika soal dalam sesi dihapus atau pertanyaan/opsi/kunci/kategorinya berubah, sesi lama tidak dilanjutkan; pengguna mendapat penjelasan untuk memulai sesi baru. Penambahan soal baru di luar sesi tidak membatalkan sesi. Perubahan pembahasan saja menggunakan penjelasan terbaru. Hasil sesi yang sudah selesai tidak disimpan sebagai sesi aktif.

Catatan kesalahan menggunakan penanda sesi dan ID soal agar jawaban yang dipulihkan tidak dihitung berulang. Catatan baru berlaku mulai versi ini; sesi dari versi sebelumnya tidak dapat dipulihkan karena belum memiliki snapshot.

Penyimpanan hanya tersedia di browser/perangkat yang sama, tidak tersinkron. Gunakan satu tab latihan agar sesi tersimpan tidak saling tertimpa. Jika penyimpanan gagal, kuis tetap berjalan dan pesan status memberi tahu sesi belum tersimpan. Semua data dapat hilang jika data situs dibersihkan atau setelah mode privat ditutup.

## Pembaruan: konfigurasi CLI dan output

Penanda berada di dalam nilai CSV; fitur CLI tidak memerlukan kolom tambahan. Gunakan kolom bahasa untuk bank dua bahasa. CSV lama tanpa penanda tetap tampil sebagai teks biasa. Tambahkan file runtime baru `content-format.js` bersama file lain dalam paket ini. Paket mencakup fitur update sebelumnya, termasuk `quiz-session.js`.

| Penanda | Isi |
| --- | --- |
| `[cli]` ... `[/cli]` | Command dan konfigurasi |
| `[output]` ... `[/output]` | Output show/debug/log |
| `[xml]` ... `[/xml]` | XML |
| `[json]` ... `[/json]` | JSON |
| `[code]` ... `[/code]` | Kode lainnya |

Gunakan di `pertanyaan`, `opsi_a`–`opsi_d`, dan `pembahasan`. Teks sebelum/sesudah blok tetap menjadi narasi. Beberapa blok dalam satu sel diperbolehkan; blok bersarang dan atribut tag tidak didukung. Tag tidak tertutup ditampilkan sebagai teks biasa agar sumbernya dapat diperbaiki; tag yang tidak dikenal juga menjadi teks biasa. Tidak ada deteksi otomatis dari command atau Markdown.

Isi blok tampil sebagai panel gelap berlabel dengan font monospace. Baris baru, indentasi, dan spasi dipertahankan; baris panjang bisa digulir horizontal di dalam panel. Pada blok di pertanyaan/pembahasan, Tab lalu panah kiri/kanan membantu menggulir. Pada opsi jawaban, fokuskan tombol opsi lalu gunakan panah kiri/kanan untuk menggulir blok pertama; Enter/Spasi memilih jawaban. Blok tidak menjalankan command, XML, JSON, atau HTML.

Penanda diproses pada soal, pilihan, pembahasan Mode Belajar, dan ulasan akhir. Di Mode Ujian, pembahasan tetap tersembunyi hingga selesai. Ulasan dengan kode menampilkan ringkasan narasi; buka ulasan untuk membaca pertanyaan lengkap beserta kode. Ini adalah tampilan teks, bukan simulator terminal dan belum mencakup gambar.

Simpan CSV UTF-8. Gunakan baris baru sungguhan di dalam sel yang dikutip, bukan dua karakter `\n`. Gandakan kutip ganda di dalam nilai, misalnya JSON menjadi `""hostname""`. Simpan penanda dan command yang sama pada kedua bahasa.

Menambahkan penanda pada teks soal/opsi lama mengubah isinya untuk pemeriksaan riwayat, sehingga catatan soal itu dimulai ulang dan sesi tersimpan yang memakainya perlu dimulai lagi. Mengubah pembahasan saja tidak memulai ulang catatan jawaban.

### Contoh CSV Inggris — 2 soal
Contoh berikut hanya berada di dokumentasi, tidak otomatis dimasukkan ke bank aktif. Salin baris soal pilihanmu ke soal.csv; jangan menggandakan header. Kedua bahasa memiliki ID berbeda dan kolom bahasa. Gabungkan baris keduanya dalam satu soal.csv dengan satu header. Contoh ini tidak otomatis dimuat dari README.

```csv
id,kategori,pertanyaan,opsi_a,opsi_b,opsi_c,opsi_d,jawaban,pembahasan,bahasa
"CLI-DEMO-001-EN","20.2 Troubleshooting Concepts","On a Cisco IOS XE router, GigabitEthernet0/1 initially has an up/up state. No other configuration changes occur. After these commands, which Status and Protocol values are expected for that interface? The choices show only those two fields.
[cli]
R1(config)# interface GigabitEthernet0/1
R1(config-if)# shutdown
R1(config-if)# end
R1# show ip interface brief
[/cli]","[output]
Status: up
Protocol: up
[/output]","[output]
Status: down
Protocol: up
[/output]","[output]
Status: administratively down
Protocol: down
[/output]","[output]
Status: up
Protocol: down
[/output]","C","The shutdown command administratively disables the interface, so the expected fields are administratively down and down. The other combinations do not represent this administrative shutdown. The IP address configuration is not removed.","en"
"CLI-DEMO-002-EN","10.5 OSPF Route Filtering Tools","A Cisco IOS XE router uses the prefix-list below, which contains only this entry.
[cli]
ip prefix-list LATIHAN seq 10 permit 10.0.0.0/8 ge 24 le 28
[/cli]
The administrator replaces it with the following entry.
[cli]
ip prefix-list LATIHAN seq 10 permit 10.0.0.0/8 ge 25 le 28
[/cli]
What happens when prefix 10.50.1.0/24 is evaluated against the new prefix-list?","It no longer matches the permit entry because /24 is shorter than the minimum /25.","It is still permitted because its address is inside 10.0.0.0/8, regardless of prefix length.","The prefix-list changes its prefix length from /24 to /25.","The prefix-list disables the interface that learned the prefix.","A","The ge and le parameters limit eligible prefix lengths to /25 through /28 in the new entry. Although 10.50.1.0/24 is within 10.0.0.0/8, its /24 length is outside that range. Prefix-list matching does not change a route mask or administratively disable an interface.","en"
```

### Contoh CSV Indonesia — 2 soal

```csv
id,kategori,pertanyaan,opsi_a,opsi_b,opsi_c,opsi_d,jawaban,pembahasan,bahasa
"CLI-DEMO-001-ID","20.2 Troubleshooting Concepts","Pada router Cisco IOS XE, GigabitEthernet0/1 awalnya berstatus up/up. Tidak ada perubahan konfigurasi lain. Setelah command berikut dijalankan, nilai Status dan Protocol apa yang diharapkan untuk interface tersebut? Pilihan hanya menampilkan kedua field itu.
[cli]
R1(config)# interface GigabitEthernet0/1
R1(config-if)# shutdown
R1(config-if)# end
R1# show ip interface brief
[/cli]","[output]
Status: up
Protocol: up
[/output]","[output]
Status: down
Protocol: up
[/output]","[output]
Status: administratively down
Protocol: down
[/output]","[output]
Status: up
Protocol: down
[/output]","C","Command shutdown menonaktifkan interface secara administratif, sehingga field yang diharapkan adalah administratively down dan down. Kombinasi lainnya tidak menunjukkan kondisi administrative shutdown ini. Konfigurasi IP address tidak dihapus.","id"
"CLI-DEMO-002-ID","10.5 OSPF Route Filtering Tools","Router Cisco IOS XE menggunakan prefix-list berikut yang hanya memiliki satu entry ini.
[cli]
ip prefix-list LATIHAN seq 10 permit 10.0.0.0/8 ge 24 le 28
[/cli]
Administrator menggantinya dengan entry berikut.
[cli]
ip prefix-list LATIHAN seq 10 permit 10.0.0.0/8 ge 25 le 28
[/cli]
Apa yang terjadi ketika prefix 10.50.1.0/24 dievaluasi terhadap prefix-list baru?","Prefix tidak lagi cocok dengan entry permit karena /24 lebih pendek daripada batas minimum /25.","Prefix tetap diizinkan karena alamatnya berada dalam 10.0.0.0/8, tanpa memperhatikan prefix length.","Prefix-list mengubah prefix length dari /24 menjadi /25.","Prefix-list menonaktifkan interface tempat prefix dipelajari.","A","Parameter ge dan le membatasi prefix length yang cocok menjadi /25 sampai /28 pada entry baru. Walaupun 10.50.1.0/24 berada dalam 10.0.0.0/8, prefix length /24 berada di luar rentang tersebut. Pencocokan prefix-list tidak mengubah mask route atau menonaktifkan interface secara administratif.","id"
```

Contoh adalah skenario latihan yang disusun untuk panduan, bukan rekaman hasil uji perangkat. Acuan teknis: [Cisco shutdown](https://www.cisco.com/E-Learning/bulk/public/tac/cim/cib/using_cisco_ios_software/cmdrefs/shutdown.htm), [Cisco show ip interface](https://www.cisco.com/E-Learning/bulk/public/tac/cim/cib/using_cisco_ios_software/cmdrefs/show_ip_interface.htm), dan [Cisco IOS XE prefix lists](https://netascode.cisco.com/docs/data_models/iosxe/device/prefix_list/).

### Tambahan prompt untuk setiap chat

TAMBAHAN: SOAL SKENARIO CLI, KONFIGURASI, DAN OUTPUT

- Pertahankan seluruh aturan prompt utama: target 30–45 soal unik, 70–80% dari chat dan 20–30% pengembangan relevan, mayoritas sedang/sulit, dua versi Inggris/Indonesia dengan pembahasan, ID berpasangan, dan sepuluh kolom CSV termasuk bahasa. Semua soal CLI/lab termasuk dalam total tersebut.
- Jika sesuai dengan materi chat, usahakan sekitar 40% soal berupa analisis konfigurasi/output. Jangan memaksakan persentase pada materi desain atau teori yang tidak memiliki CLI relevan. Soal ini termasuk dalam total, bukan tambahan di luar batas 60.
- Variasikan skenario: Apa output atau field yang diharapkan setelah command dijalankan? Apa yang terjadi jika satu konfigurasi diubah/dihapus? Apa penyebab gejala pada output? Konfigurasi mana yang memperbaikinya? Command verifikasi mana yang paling tepat?
- Gunakan cakupan CCNA/CCNP sesuai materi chat. Buat latihan orisinal; jangan mengklaim sebagai soal ujian resmi.
- Nyatakan platform, kondisi awal, hubungan perangkat, konfigurasi relevan, serta asumsi lain yang diperlukan. Untuk routing, jelaskan apakah prefix dipelajari, terpasang di RIB, atau diiklankan jika perbedaan itu menentukan jawaban.
- Jangan meminta output persis untuk timestamp, uptime, counter, router-id, atau nilai lain yang tidak dapat ditentukan dari skenario. Tanyakan field/perilaku yang pasti; tandai output yang disederhanakan sebagai potongan ilustrasi, bukan hasil lab yang benar-benar dijalankan.
- Sertakan pembahasan hubungan command → perubahan perilaku → cara verifikasi. Jika opsi berupa konfigurasi, tandai opsi tersebut juga.

FORMAT BLOK DI DALAM SEL CSV
- [cli] ... [/cli] untuk command dan konfigurasi.
- [output] ... [/output] untuk output show/debug/log.
- [xml] ... [/xml], [json] ... [/json], atau [code] ... [/code] untuk format lainnya.
- Gunakan tag huruf kecil yang tepat, tanpa atribut. Tag pembuka dan penutup wajib berpasangan dan tidak boleh bersarang.
- Letakkan tag pembuka, isi, dan penutup pada baris terpisah menggunakan baris baru sungguhan, bukan teks literal \n.
- Penanda hanya boleh digunakan dalam pertanyaan, opsi_a/opsi_b/opsi_c/opsi_d, dan pembahasan; bukan ID, kategori, jawaban, atau bahasa.
- Teks pertanyaan biasa berada di luar penanda. Satu sel boleh memiliki beberapa blok, misalnya konfigurasi sebelum/sesudah.
- Jangan menggunakan HTML atau pagar Markdown tiga backtick di dalam sel sebagai penanda kode. Blok CSV terluar tetap menggunakan pagar Markdown csv.
- Gunakan header: id,kategori,pertanyaan,opsi_a,opsi_b,opsi_c,opsi_d,jawaban,pembahasan,bahasa
- Semua nilai data dibungkus tanda kutip ganda. Tanda kutip ganda di dalam command/XML/JSON digandakan sesuai aturan CSV.
- Command, output, alamat IP, nama interface, dan penanda harus identik pada pasangan soal Inggris/Indonesia. Terjemahkan narasi dan pembahasan tanpa menerjemahkan istilah networking.
- Audit apakah seluruh penanda tertutup, spasi/indentasi tetap benar, CSV memiliki sepuluh kolom, dan kunci konsisten di kedua bahasa.


## Pembaruan: Bahasa Indonesia / English

Web membaca satu file `soal.csv`. Kolom tambahan `bahasa` menentukan bahasa setiap baris. Pilih Bahasa soal sebelum mulai; pertanyaan, opsi, dan pembahasan diambil langsung dari baris bahasa tersebut. Web tidak menerjemahkan otomatis. Tombol, petunjuk aplikasi, dan judul kurikulum tetap seperti sebelumnya.

Format yang disarankan:
`id,kategori,pertanyaan,opsi_a,opsi_b,opsi_c,opsi_d,jawaban,pembahasan,bahasa`

- `id` untuk bahasa Indonesia.
- `en` untuk bahasa Inggris.
- Nilai `indonesia`, `bahasa indonesia`, `indonesian`, `english`, `inggris`, dan `bahasa inggris` juga diterima, tanpa membedakan huruf besar/kecil; gunakan `id`/`en` agar konsisten.
- Jika kolom bahasa ada, semua baris wajib berisi nilai bahasa yang didukung. Nilai kosong/tidak dikenal membuat parser meminta perbaikan dengan nomor record.
- CSV lama tanpa kolom bahasa tetap diterima dan seluruh barisnya dianggap Indonesia, termasuk jika ID berakhiran -EN. Tidak ada tebakan bahasa dari isi atau ID.
- ID lengkap wajib unik di seluruh file, misalnya `BGP-COMMUNITY-001-ID` dan `BGP-COMMUNITY-001-EN`. Kategori kedua versi harus sama.

### Menyiapkan bank di GitHub
1. Tetap gunakan nama `soal.csv` pada root, satu folder dengan `index.html`.
2. Tambahkan `,bahasa` di akhir header CSV lama.
3. Tambahkan `,"id"` di akhir SETIAP RECORD soal Indonesia, setelah kolom pembahasan terakhir; pada CSV multiline ini bukan setiap baris fisik konfigurasi.
4. Tambahkan baris soal Inggris dengan struktur kolom yang sama, ID unik, dan nilai terakhir `"en"`.
5. Jika berasal dari dua CSV hasil prompt, gabungkan baris datanya dengan satu header saja. Jangan menambahkan header kedua di tengah file.
6. Pastikan seluruh record memiliki jumlah kolom yang sama. Jika CSV lama memiliki kolom tambahan seperti sumber, samakan header dan struktur kedua bank sebelum menggabungkan.
7. Commit perubahan. Setelah GitHub Pages selesai, muat ulang dan pilih Bahasa soal.

File terpisah seperti soal_en.csv dan soal_id.csv tidak dimuat oleh versi ini. Anda boleh menyimpannya sebagai arsip, tetapi bank yang dipakai web adalah soal.csv. Teks Inggris harus tersedia pada record en; mengganti penanda bahasa saja tidak menerjemahkan isinya.

### Perilaku sesi
Jumlah soal, tombol Semua, jumlah pada modul/submodul, hasil pencarian, dan prioritas soal salah mengikuti bahasa terpilih. Pilihan materi tetap dipertahankan ketika bahasa diganti. Jika bahasa/materi tidak memiliki soal, tombol Mulai dinonaktifkan dan tampil penjelasan; tidak mencampur bahasa sebagai pengganti.

Pemilihan bahasa dikunci selama sesi. Saat Lanjutkan sesi, bahasa, urutan, jawaban, dan tenggat timer dipulihkan. Sesi dari versi lama masih dapat dilanjutkan sebagai Indonesia jika soal tidak berubah. Jika bahasa suatu soal pada sesi tersimpan diubah, mulai sesi baru. Ulangi yang belum benar menggunakan bahasa dan pengaturan sesi asal.

Bahasa default untuk sesi baru setelah reload adalah Indonesia, kecuali sedang melanjutkan sesi tersimpan. Tidak ada preferensi bahasa lintas perangkat. Riwayat jawaban menggunakan ID lengkap; pasangan Indonesia/Inggris memiliki catatan terpisah. Mengganti bahasa saja pada record dengan ID dan isi yang sama tidak menghapus catatan jawaban lama. Batas 5.000 soal berlaku untuk seluruh record file, termasuk kedua bahasa (misalnya 2.500 pasangan).

### Pengganti aturan CSV pada prompt bank soal

Aturan berikut menggantikan ketentuan sembilan kolom pada prompt lama:
- Buat dua versi bahasa dengan jumlah soal, nomor dasar ID, kategori, opsi, dan kunci yang setara; sertakan kolom bahasa pada setiap versi.
- Gunakan tepat sepuluh kolom: id,kategori,pertanyaan,opsi_a,opsi_b,opsi_c,opsi_d,jawaban,pembahasan,bahasa
- Isi bahasa=id pada seluruh soal Indonesia dan bahasa=en pada seluruh soal Inggris.
- Gunakan ID lengkap berbeda untuk pasangan, misalnya MATERI-001-ID dan MATERI-001-EN.
- Tampilkan satu blok CSV per bahasa. Kedua blok akan digabung ke satu soal.csv dengan satu header oleh pemilik web.
- Penanda CLI/output/XML/JSON tetap berlaku pada pertanyaan, opsi, dan pembahasan. Jangan gunakan penanda tersebut pada kolom bahasa.
- Pertahankan 30–45 soal unik, 70–80% dari chat dan 20–30% pengembangan relevan, sekitar 10% mudah/50% sedang/40% sulit. Konfigurasi/lab pilihan ganda termasuk dalam total; jangan menambah soal di luar jumlah untuk versi bahasa atau jenis CLI.
