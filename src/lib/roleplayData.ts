export type MessageSender = "persona" | "player" | "system";

export type ApkAttachmentData = {
  filename: string;
  size: string;
  mime: string;
  extension: string;
  dangerousPermissions: string[];
};

export type MessageItem = {
  id: string;
  sender: MessageSender;
  text: string;
  time: string;
  apkAttachment?: ApkAttachmentData;
};

export type ChoiceOption = {
  id: string;
  label: string;
  actionText: string;
  riskLevel: "safe" | "inquisitive" | "fatal";
  nextStepId: string;
  tacticsRevealed?: string[];
};

export type ScenarioStep = {
  id: string;
  messages: MessageItem[];
  choices: ChoiceOption[];
  psychologicalTactic?: string;
  heuristicTelemetry?: {
    indicatorTitle: string;
    description: string;
    riskScore: number;
  };
};

export type BreachData = {
  headline: string;
  stolenOtp: string;
  drainAmount: string;
  targetAccount: string;
  compromisedData: string[];
  lessonLearned: string;
  systemWarningText?: string;
  drainNotificationText?: string;
  scammerExitText?: string;
};

export type VictoryData = {
  headline: string;
  score: number;
  tacticsFoiled: string[];
  keyInsight: string;
  scammerConcedeText?: string;
  defenseNotificationText?: string;
};

export type ForensicSummary = {
  targetLabel: string;
  targetValue: string;
  threatClassification: string;
  indicatorLabel: string;
  indicatorValue: string;
  attackImpact: string;
  officialProcedure: string;
  psychologicalPressure: string;
  decisionPointBreached: string;
  decisionPointSafe: string;
};

export type RoleplayScenarioDetail = {
  id: string;
  code: string;
  title: string;
  personaName: string;
  personaRole: string;
  personaAvatar: string;
  personaPhone: string;
  categoryBadge: string;
  threatTarget: string;
  backgroundStory: string;
  initialStepId: string;
  steps: Record<string, ScenarioStep>;
  breachOutcome: BreachData;
  victoryOutcome: VictoryData;
  forensicSummary?: ForensicSummary;
};

/**
 * Repository of realistic conversational scam roleplay scenarios based on viral Indonesian cybercrime cases.
 */
export const ROLEPLAY_DETAILS: Record<string, RoleplayScenarioDetail> = {
  "resi-paket-apk": {
    id: "resi-paket-apk",
    code: "SKENARIO 01",
    title: "Percakapan dengan Kurir J&T Palsu",
    personaName: "Rudi Kurniawan",
    personaRole: "Kurir Lapangan Gadungan",
    personaAvatar: "/avatars/rudi.jpg",
    personaPhone: "+62 821-4829-1029",
    categoryBadge: "SNIFFER SMS APK",
    threatTarget: "Penyadapan SMS OTP Perbankan",
    backgroundStory:
      "Berdasarkan kasus viral di Twitter/X: Penipu berpura-pura menjadi kurir ekspedisi yang kesulitan membaca alamat paket Anda, lalu mengirimkan file foto resi berformat APK jahat.",
    initialStepId: "step_1",
    steps: {
      step_1: {
        id: "step_1",
        psychologicalTactic: "Pura-pura Menolong (Pretexting)",
        heuristicTelemetry: {
          indicatorTitle: "Ekstensi Berkas Ganda (.apk)",
          description:
            "Berkas yang diklaim sebagai gambar foto sebenarnya adalah berkas executable Android (.apk) berisi malware penyadap SMS.",
          riskScore: 85,
        },
        messages: [
          {
            id: "m1",
            sender: "persona",
            text: "Selamat siang kak. Maaf mengganggu, saya Rudi kurir J&T Express. Mau antar paket belanjaan kakak yang COD.",
            time: "13:42",
          },
          {
            id: "m2",
            sender: "persona",
            text: "Ini kertas resi di kardusnya sobek kena hujan pas di jalan, nomor rumah sama nama penerimanya agak luntur. Tolong dicek dulu kak foto paketnya bener punya kakak atau bukan ya.",
            time: "13:43",
            apkAttachment: {
              filename: "LIHAT_Foto_Paket.apk",
              size: "4.2 MB",
              mime: "application/vnd.android.package-archive",
              extension: ".apk",
              dangerousPermissions: [
                "android.permission.RECEIVE_SMS",
                "android.permission.READ_SMS",
                "android.permission.INTERNET",
              ],
            },
          },
        ],
        choices: [
          {
            id: "c1_safe",
            label: "Minta Nomor Resi Tertulis",
            actionText:
              "Saya tidak merasa pesan paket COD. Minta nomor resinya saja mas, biar saya cek sendiri di aplikasi resmi J&T.",
            riskLevel: "safe",
            nextStepId: "step_2_confront",
            tacticsRevealed: ["Verifikasi Kanal Resmi", "Menolak Eksekusi Berkas"],
          },
          {
            id: "c1_inq",
            label: "Tanya Nama Toko / Pengirim",
            actionText:
              "Paket dari toko apa ya mas? Soalnya saya ada beberapa pesanan di toko online.",
            riskLevel: "inquisitive",
            nextStepId: "step_2_persuade",
            tacticsRevealed: ["Memancing Informasi Pelaku"],
          },
          {
            id: "c1_fatal",
            label: "Buka / Unduh File APK",
            actionText:
              "Oh iya mas, saya buka dulu ya foto paketnya di file itu.",
            riskLevel: "fatal",
            nextStepId: "outcome_breach",
          },
        ],
      },
      step_2_confront: {
        id: "step_2_confront",
        psychologicalTactic: "Menciptakan Urgensi Palsu (False Urgency)",
        heuristicTelemetry: {
          indicatorTitle: "Eskalasi Ancaman Finansial",
          description:
            "Pelaku mulai menakut-nakuti korban dengan ancaman denda atau blacklist marketplace jika paket tidak segera diproses.",
          riskScore: 95,
        },
        messages: [
          {
            id: "m3",
            sender: "persona",
            text: "Waduh kak, kertas nomor resinya justru yang sobek luntur gak kebaca barcode-nya. Tapi di sistem kurir saya ada foto dokumen digital itu kak.",
            time: "13:45",
          },
          {
            id: "m4",
            sender: "persona",
            text: "Kalau gak dicek sekarang lewat file itu, jam 15:00 ini paket terpaksa di-retur ke pusat gudang dan akun marketplace kakak bisa kena denda pembatalan COD lho kak.",
            time: "13:46",
          },
        ],
        choices: [
          {
            id: "c2_safe",
            label: "Tolak Tegas & Laporkan Nomor",
            actionText:
              "Semua kurir resmi punya data resi di scanner barcode internal kantor. Saya tidak akan buka file APK. Nomor ini akan saya laporkan ke CS resmi.",
            riskLevel: "safe",
            nextStepId: "outcome_victory",
            tacticsRevealed: ["Menghentikan Manipulasi Urgensi", "Melaporkan Rekening/Nomor"],
          },
          {
            id: "c2_fatal",
            label: "Panik & Menginstal Berkas",
            actionText:
              "Waduh jangan di-retur mas, saya takut kena denda. Yaudah saya unduh dan pasang aplikasinya sekarang.",
            riskLevel: "fatal",
            nextStepId: "outcome_breach",
          },
        ],
      },
      step_2_persuade: {
        id: "step_2_persuade",
        psychologicalTactic: "Validasi Palsu & Pura-Pura Netral",
        heuristicTelemetry: {
          indicatorTitle: "Social Engineering Push",
          description:
            "Pelaku mengarahkan korban agar tetap menginstal berkas dengan dalih invoice berada di dalam aplikasi tersebut.",
          riskScore: 90,
        },
        messages: [
          {
            id: "m5",
            sender: "persona",
            text: "Tulisannya dari olshop busana Muslim kak. Di dalam berkas invoice itu sudah lengkap ada nomor invoice sama nomor telepon pengirimnya.",
            time: "13:45",
          },
          {
            id: "m6",
            sender: "persona",
            text: "Tinggal diklik dan install aja kak, cuma 4 MB kok. Nanti langsung keliatan fotonya di layar ponsel kakak.",
            time: "13:46",
          },
        ],
        choices: [
          {
            id: "c3_safe",
            label: "Identifikasi Kejanggalan File",
            actionText:
              "Foto asli formatnya .jpg atau .png, bukan berkas aplikasi .apk. Kurir resmi tidak pernah menyuruh install aplikasi pihak ketiga. Saya batalkan saja.",
            riskLevel: "safe",
            nextStepId: "outcome_victory",
            tacticsRevealed: ["Deteksi Ekstensi Berkas", "Prinsip Zero Trust"],
          },
          {
            id: "c3_fatal",
            label: "Menuruti Instruksi",
            actionText:
              "Baik mas, saya coba install aplikasinya biar keliatan fotonya.",
            riskLevel: "fatal",
            nextStepId: "outcome_breach",
          },
        ],
      },
    },
    breachOutcome: {
      headline: "SIMULASI: AKUN TERBOBOL & REKENING DIKURAS",
      stolenOtp:
        "SMS BANK BCA: 'Kode OTP Anda adalah 819204. JANGAN BERIKAN KEPADA SIAPAPUN TERMASUK PETUGAS BANK.'",
      drainAmount: "Rp 4.850.000",
      targetAccount: "Virtual Account Dana / OVO (Penampung Bodong)",
      compromisedData: [
        "Malware SMS Sniffer membaca SMS OTP secara background tanpa notifikasi.",
        "Pelaku login ke m-Banking Anda menggunakan data kredensial yang disadap.",
        "Pelaku mentransfer seluruh saldo tabungan ke dompet digital tanpa sepengetahuan Anda.",
      ],
      lessonLearned:
        "Berkas foto resi tidak akan pernah berakhiran (.apk). Ekstensi .apk adalah paket aplikasi Android. Jangan pernah mengizinkan install aplikasi dari sumber tidak dikenal (Unknown Sources).",
      systemWarningText:
        "⚠️ [Sistem Android] Memasang berkas 'LIHAT_Foto_Paket.apk'... Izin sensitif disetujui (Akses SMS & Notifikasi).",
      drainNotificationText:
        "KODE OTP: 819204. JANGAN BERIKAN KEPADA SIAPAPUN. Transaksi keluar sebesar Rp 4.850.000 ke DANA sedang diproses.",
      scammerExitText: "Baik kak, terima kasih ya.",
    },
    victoryOutcome: {
      headline: "SIMULASI BERHASIL: ANDA TANGKAL SERANGAN KURIR PALSU!",
      score: 100,
      tacticsFoiled: [
        "Membongkar False Urgency (ancaman denda/retur palsu)",
        "Menolak instalasi berkas Trojan berkedok foto (.apk)",
        "Mengutamakan verifikasi nomor tracking melalui aplikasi resmi ekspedisi",
      ],
      keyInsight:
        "Ekspedisi resmi (J&T, JNE, SiCepat) TIDAK PERNAH mengirimkan file .apk kepada pelanggan untuk melihat resi atau foto paket. Semua pelacakan paket dilakukan di situs atau aplikasi resmi.",
      scammerConcedeText:
        "Yaudah kalau gak mau gapapa kak, paket saya retur ke gudang pusat.",
      defenseNotificationText:
        "🛡️ Upaya penipuan berhasil digagalkan. Serangan APK ditangkal tanpa kebocoran data.",
    },
    forensicSummary: {
      targetLabel: "Nama Berkas Trojan",
      targetValue: "LIHAT_Foto_Paket.apk (4.2 MB)",
      threatClassification: "Android SMS Sniffer Trojan (Tingkat Risiko: 85%)",
      indicatorLabel: "Izin Berbahaya (Permissions)",
      indicatorValue: "RECEIVE_SMS, READ_SMS, INTERNET",
      attackImpact: "Malware membaca SMS OTP m-Banking di latar belakang dan mengirimkannya ke server penipu",
      officialProcedure: "Ekspedisi resmi (J&T, JNE, SiCepat) tidak pernah mengirim berkas APK kepada pelanggan untuk cek resi",
      psychologicalPressure: "Ancaman retur paket dan denda pembatalan COD jika tidak segera dicek (False Urgency)",
      decisionPointBreached: "Menyetujui instalasi berkas .apk dari luar kanal resmi",
      decisionPointSafe: "Menolak eksekusi file dan memverifikasi nomor resi secara mandiri",
    },
  },

  "tarif-bank-phishing": {
    id: "tarif-bank-phishing",
    code: "SKENARIO 02",
    title: "Panggilan CS Bank BCA Palsu",
    personaName: "Sari Wulandari",
    personaRole: "Customer Service Priority Palsu",
    personaAvatar: "/avatars/sari.jpg",
    personaPhone: "+62 813-9820-4102",
    categoryBadge: "PHISHING BANK",
    threatTarget: "Kredensial & PIN Mobile Banking",
    backgroundStory:
      "Berdasarkan modus kejahatan perbankan paling marak di Indonesia: Penipu mengaku sebagai tim Customer Care Halo BCA, mengumumkan kenaikan tarif transfer antar-bank drastis menjadi Rp 150.000/bulan secara sepihak dan mengarahkan korban ke web form phishing palsu untuk membatalkan.",
    initialStepId: "step_1",
    steps: {
      step_1: {
        id: "step_1",
        psychologicalTactic: "Otoritas Palsu & Ancaman Finansial (Authority Pretexting & Loss Aversion)",
        heuristicTelemetry: {
          indicatorTitle: "Domain Phishing & Typosquatting (.info)",
          description:
            "Link bukan domain resmi bca.co.id atau klikbca.com, melainkan domain pihak ketiga bca-pembaruan-tarif.info yang baru didaftarkan.",
          riskScore: 92,
        },
        messages: [
          {
            id: "m1",
            sender: "persona",
            text: "Selamat siang Bapak/Ibu nasabah terhormat Bank BCA. Kami dari Customer Care BCA Priority ingin mengonfirmasikan pemberlakuan tarif transfer antar-bank baru sebesar Rp 150.000/bulan yang akan didebit otomatis dari rekening Anda per malam ini.",
            time: "14:15",
          },
          {
            id: "m2",
            sender: "persona",
            text: "Apabila Bapak/Ibu keberatan dan memilih tetap menggunakan tarif normal Rp 6.500 per transaksi, mohon segera mengisi Formulir Pembatalan sebelum pukul 17:00 WIB melalui link resmi kami: https://bca-pembaruan-tarif.info/batal-tarif",
            time: "14:16",
          },
          {
            id: "m3",
            sender: "persona",
            text: "Jika melewati batas waktu pukul 17:00 WIB formulir belum diterima, sistem menganggap Anda setuju dan saldo rekening akan otomatis dipotong Rp 150.000 setiap awal bulan. Terima kasih.",
            time: "14:16",
          },
        ],
        choices: [
          {
            id: "c1_safe",
            label: "Konfirmasi ke Halo BCA 1500888",
            actionText:
              "BCA tidak pernah mengubah tarif menjadi Rp150.000/bulan dan tidak pernah membagikan link formulir via chat WhatsApp pribadi. Saya akan konfirmasi ke Halo BCA 1500888.",
            riskLevel: "safe",
            nextStepId: "step_2_confront",
            tacticsRevealed: ["Verifikasi Kanal Resmi 1500888", "Menolak Membuka Link Eksternal"],
          },
          {
            id: "c1_inq",
            label: "Tanya Mengapa Diberitahu Mendadak",
            actionText:
              "Kenapa pemberitahuannya mendadak begini ya Bu? Kenapa tidak ada notifikasi resmi di aplikasi myBCA atau BCA mobile saya?",
            riskLevel: "inquisitive",
            nextStepId: "step_2_persuade",
            tacticsRevealed: ["Mempertanyakan Prosedur", "Mengecek Validitas Notifikasi Resmi"],
          },
          {
            id: "c1_fatal",
            label: "Panik & Buka Link Pembatalan",
            actionText:
              "Mahal sekali Rp150.000 per bulan! Saya tidak setuju dipotong otomatis. Saya buka linknya sekarang untuk isi formulir pembatalan ya Bu.",
            riskLevel: "fatal",
            nextStepId: "outcome_breach",
          },
        ],
      },
      step_2_confront: {
        id: "step_2_confront",
        psychologicalTactic: "Menciptakan Urgensi Palsu & Menghalangi Kanal Resmi",
        heuristicTelemetry: {
          indicatorTitle: "Manipulasi Ketakutan Nasabah (Coercive Urgency)",
          description:
            "Pelaku mencegah korban menelepon Halo BCA resmi dengan dalih antrean ribuan nasabah dan batas waktu sistem akan terlewat.",
          riskScore: 96,
        },
        messages: [
          {
            id: "m4",
            sender: "persona",
            text: "Waduh Bapak/Ibu, antrean telepon di 1500888 saat ini sedang membeludak mencapai ribuan panggilan karena nasabah se-Indonesia sedang memproses ini. Kalau menunggu antrean telepon, batas waktu jam 17:00 WIB pasti terlewat.",
            time: "14:18",
          },
          {
            id: "m5",
            sender: "persona",
            text: "Ini jalur fast-track langsung dari sistem BCA Priority. Tinggal klik linknya, masukkan 16 digit nomor kartu ATM dan PIN untuk verifikasi kepemilikan rekening agar tidak didebit otomatis.",
            time: "14:19",
          },
        ],
        choices: [
          {
            id: "c2_safe",
            label: "Tolak Keras: Bank Tidak Pernah Minta PIN",
            actionText:
              "Petugas bank asli TIDAK PERNAH meminta nomor kartu ATM dan PIN nasabah dalam formulir apapun! Ini link phishing palsu. Nomor Anda sudah saya laporkan ke Patroli Siber dan BCA!",
            riskLevel: "safe",
            nextStepId: "outcome_victory",
            tacticsRevealed: ["Prinsip Kerahasiaan PIN/Kredensial", "Mengenali Karakteristik Phishing Web"],
          },
          {
            id: "c2_fatal",
            label: "Menyerahkan Nomor Kartu & PIN",
            actionText:
              "Oh begitu ya Bu. Baik saya isi nomor kartu ATM dan PIN saya di link itu sekarang biar saldo tabungan saya tidak terpotong.",
            riskLevel: "fatal",
            nextStepId: "outcome_breach",
          },
        ],
      },
      step_2_persuade: {
        id: "step_2_persuade",
        psychologicalTactic: "Legitimasi Palsu & Surat Keputusan Fiktif",
        heuristicTelemetry: {
          indicatorTitle: "Fabricated Institutional Authority",
          description:
            "Pelaku mencatut nomor Surat Edaran Direksi fiktif untuk meyakinkan korban bahwa kebijakan pemotongan ini sah.",
          riskScore: 90,
        },
        messages: [
          {
            id: "m6",
            sender: "persona",
            text: "Surat edaran resmi sudah kami kirimkan ke email terdaftar sejak minggu lalu Pak/Bu, sesuai Surat Keputusan Direksi BCA No. 042/SK/BCA/2026. Kemungkinan masuk ke folder spam email Anda.",
            time: "14:18",
          },
          {
            id: "m7",
            sender: "persona",
            text: "Kami selaku tim Customer Care hanya membantu agar rekening Anda tidak terpotong otomatis Rp150.000 malam ini. Cukup buka link https://bca-pembaruan-tarif.info/batal-tarif dan lengkapi data verifikasi akun.",
            time: "14:19",
          },
        ],
        choices: [
          {
            id: "c3_safe",
            label: "Bongkar Domain Palsu .info",
            actionText:
              "Domain resmi BCA adalah www.bca.co.id dan klikbca.com, bukan bca-pembaruan-tarif.info! Bank tidak pernah memakai ekstensi .info. Anda penipu, saya laporkan dan blokir sekarang!",
            riskLevel: "safe",
            nextStepId: "outcome_victory",
            tacticsRevealed: ["Inspeksi Domain URL Resmi", "Identifikasi TLD Mencurigakan", "Zero Trust"],
          },
          {
            id: "c3_fatal",
            label: "Percaya & Mengisi Formulir",
            actionText:
              "Oalah ada surat edarannya ya. Yaudah Bu saya klik linknya sekarang dan isi datanya.",
            riskLevel: "fatal",
            nextStepId: "outcome_breach",
          },
        ],
      },
    },
    breachOutcome: {
      headline: "SIMULASI: KREDENSIAL M-BANKING DICURI & SALDO DIKURAS",
      stolenOtp:
        "NOTIFIKASI BANK BCA: 'Transfer dana sebesar Rp 12.500.000 ke Rekening Penampung Virtual Account BERHASIL. Sisa saldo rekening Anda: Rp 45.000.'",
      drainAmount: "Rp 12.500.000",
      targetAccount: "Virtual Account Bank Jago / Dana (Akun Mule Penampung)",
      compromisedData: [
        "Nomor kartu ATM (16 digit) dan tanggal kedaluwarsa berhasil direkam situs phishing.",
        "Kode PIN rahasia dan User ID KlikBCA diserahkan langsung oleh korban di web palsu.",
        "Pelaku langsung melakukan pengambilalihan akun (Account Takeover) dan menguras saldo tabungan.",
      ],
      lessonLearned:
        "Bank BCA maupun bank manapun di Indonesia TIDAK PERNAH menaikkan biaya transfer menjadi Rp 150.000/bulan. Bank juga TIDAK PERNAH meminta nomor kartu ATM, PIN, kode OTP, atau password melalui tautan link di chat WhatsApp atau SMS.",
      systemWarningText:
        "⚠️ [Peringatan Browser] Data kredensial perbankan (Nomor Kartu ATM & PIN) telah terkirim ke server phishing 'bca-pembaruan-tarif.info'!",
      drainNotificationText:
        "NOTIFIKASI BANK BCA: Transaksi debit transfer keluar sebesar Rp 12.500.000 ke Rekening Penampung telah BERHASIL.",
      scammerExitText:
        "Terima kasih, data pembatalan tarif Anda sudah masuk ke sistem kami (Nomor Anda langsung diblokir oleh pelaku).",
    },
    victoryOutcome: {
      headline: "SIMULASI BERHASIL: ANDA TANGKAL SERANGAN PHISHING BCA PALSU!",
      score: 100,
      tacticsFoiled: [
        "Membongkar hoaks kenaikan tarif perbankan Rp150.000/bulan",
        "Mengenali domain situs web palsu (.info alih-alih bca.co.id)",
        "Menjaga kerahasiaan nomor kartu ATM dan PIN dari permintaan pihak ketiga",
        "Memilih konfirmasi langsung ke nomor resmi Halo BCA 1500888",
      ],
      keyInsight:
        "Pihak bank resmi TIDAK PERNAH mengirimkan tautan link pembatalan tarif melalui pesan instan WhatsApp atau SMS. Seluruh informasi perubahan tarif perbankan hanya diumumkan melalui situs resmi www.bca.co.id atau kanal media sosial bercentang biru resmi.",
      scammerConcedeText:
        "Ya sudah kalau tidak mau dibantu batalkan! Jangan komplain ke bank ya kalau saldo terpotong otomatis tiap bulan!",
      defenseNotificationText:
        "🛡️ Upaya phishing perbankan berhasil digagalkan. Rekening tabungan dan PIN m-Banking Anda 100% aman terlindungi.",
    },
    forensicSummary: {
      targetLabel: "Target / Alamat URL",
      targetValue: "https://bca-pembaruan-tarif.info/batal-tarif",
      threatClassification: "Credential Harvesting Web Phishing (Tingkat Risiko: 92%)",
      indicatorLabel: "Kredensial yang Diincar",
      indicatorValue: "Nomor Kartu ATM (16 Digit), PIN Mobile Banking, Kode OTP",
      attackImpact: "Pengambilalihan akun m-Banking secara ilegal dan pengurasan saldo tabungan ke rekening penampung",
      officialProcedure: "Bank BCA tidak pernah membagikan tautan formulir pembatalan tarif melalui pesan instan WhatsApp",
      psychologicalPressure: "Ancaman auto-debit Rp 150.000/bulan sebelum batas waktu pukul 17:00 WIB (Loss Aversion)",
      decisionPointBreached: "Menyerahkan data nomor kartu ATM dan PIN di formulir web palsu",
      decisionPointSafe: "Menolak membuka link dan memilih verifikasi ke Halo BCA 1500888",
    },
  },

  "undangan-nikah-digital": {
    id: "undangan-nikah-digital",
    code: "SKENARIO 03",
    title: "Undangan Pernikahan Teman Lama",
    personaName: "Rian Pratama",
    personaRole: "Akun WhatsApp Kenalan Dibajak",
    personaAvatar: "/avatars/rian.jpg",
    personaPhone: "+62 857-1923-4819",
    categoryBadge: "REKAYASA SOSIAL",
    threatTarget: "Aksesibilitas & Izin Trojan (Keylogger)",
    backgroundStory:
      "Berdasarkan modus serangan siber paling masif di Indonesia: Pelaku membajak akun WhatsApp kenalan korban (Account Takeover), kemudian menyebarkan file APK berkedok surat undangan pernikahan digital (Surat_Undangan_Pernikahan.apk) yang meminta izin Aksesibilitas (Accessibility Service) untuk mencuri kredensial m-Banking dan menyebarkan malware ke seluruh kontak.",
    initialStepId: "step_1",
    steps: {
      step_1: {
        id: "step_1",
        psychologicalTactic: "Memanfaatkan Relasi Pertemanan & Rasa Sungkan (Social Rapport & Obligation)",
        heuristicTelemetry: {
          indicatorTitle: "Trojan Berkedok Dokumen Digital (.apk)",
          description:
            "Berkas diklaim sebagai surat undangan pernikahan, namun berekstensi .apk dengan muatan Trojan pengambil alih layar (Accessibility Service).",
          riskScore: 94,
        },
        messages: [
          {
            id: "m1",
            sender: "persona",
            text: "Halo bro! Maaf baru ngechat lagi setelah sekian lama, masih inget kan ini Rian Pratama temen satu kampus dulu. Alhamdulillah hari Minggu besok gue mau nikah nih bro. Mohon doa restu dan kehadirannya ya!",
            time: "10:15",
          },
          {
            id: "m2",
            sender: "persona",
            text: "Ini surat undangan pernikahan digital resminya ya bro, tolong dibuka dan diisi formulir kehadirannya (RSVP) biar kami bisa rekap kuota kateringnya. Ditunggu banget kehadirannya ya bro!",
            time: "10:16",
            apkAttachment: {
              filename: "Surat_Undangan_Pernikahan.apk",
              size: "4.8 MB",
              mime: "application/vnd.android.package-archive",
              extension: ".apk",
              dangerousPermissions: [
                "android.permission.BIND_ACCESSIBILITY_SERVICE",
                "android.permission.RECEIVE_SMS",
                "android.permission.READ_CONTACTS",
                "android.permission.INTERNET",
              ],
            },
          },
        ],
        choices: [
          {
            id: "c1_safe",
            label: "Curigai Ekstensi File .apk",
            actionText:
              "Selamat Rian! Tapi kok format undangannya .apk aplikasi Android ya bro? Bukannya undangan digital biasanya website link (seperti Weddingku/Viding) atau PDF/video?",
            riskLevel: "safe",
            nextStepId: "step_2_confront",
            tacticsRevealed: ["Mengenali Ekstensi Berbahaya", "Menolak Eksekusi Aplikasi Asing"],
          },
          {
            id: "c1_inq",
            label: "Tanya Calon Pasangan & Lokasi Acara",
            actionText:
              "Wah selamat ya bro! Nikah sama siapa dan lokasinya di mana bro? Kok undangannya dalam bentuk aplikasi yang harus di-install ya?",
            riskLevel: "inquisitive",
            nextStepId: "step_2_persuade",
            tacticsRevealed: ["Memverifikasi Informasi Personal", "Mempertanyakan Keharusan Instalasi"],
          },
          {
            id: "c1_fatal",
            label: "Langsung Unduh & Install Aplikasi",
            actionText:
              "Wah selamat bro Rian! Mantap akhirnya nikah juga. Siap, gue unduh dan install aplikasinya sekarang buat lihat denah lokasinya.",
            riskLevel: "fatal",
            nextStepId: "outcome_breach",
          },
        ],
      },
      step_2_confront: {
        id: "step_2_confront",
        psychologicalTactic: "Alibi Teknis Palsu & Desakan Emosional",
        heuristicTelemetry: {
          indicatorTitle: "Permintaan Izin Aksesibilitas Android",
          description:
            "Pelaku mendesak korban mengaktifkan Accessibility Service dengan dalih fitur navigasi denah 3D.",
          riskScore: 96,
        },
        messages: [
          {
            id: "m3",
            sender: "persona",
            text: "Iya bro, sengaja dibikin format aplikasi biar ada animasi 3D denah Google Maps sama galeri foto prewedding-nya. Kemarin temen-temen angkatan lain juga pada lancar kok install-nya.",
            time: "10:18",
          },
          {
            id: "m4",
            sender: "persona",
            text: "Kalau muncul peringatan keamanan pas buka, klik aja 'Izinkan Aksesibilitas' biar animasinya jalan bro. Tolong banget ya bro, RSVP-nya ditutup jam 12 siang ini buat kuota gedung.",
            time: "10:19",
          },
        ],
        choices: [
          {
            id: "c2_safe",
            label: "Tolak Izin Aksesibilitas & Telepon Suara",
            actionText:
              "Izin Aksesibilitas itu fitur paling berbahaya di Android yang bisa rekam ketukan layar dan password. Undangan asli tidak butuh akses itu. Saya telepon kamu sekarang ya buat pastiin ini beneran Rian atau akun kamu dibajak.",
            riskLevel: "safe",
            nextStepId: "outcome_victory",
            tacticsRevealed: [
              "Waspada Izin Aksesibilitas",
              "Verifikasi Jalur Suara Langsung",
              "Mendeteksi Account Takeover",
            ],
          },
          {
            id: "c2_fatal",
            label: "Percaya Alibi & Berikan Izin Aksesibilitas",
            actionText:
              "Oh gitu, pantesan ada peringatan sistem. Yaudah gue aktifkan izin aksesibilitasnya bro biar bisa isi RSVP.",
            riskLevel: "fatal",
            nextStepId: "outcome_breach",
          },
        ],
      },
      step_2_persuade: {
        id: "step_2_persuade",
        psychologicalTactic: "Memanipulasi Hubungan Sosial & Formalitas RSVP",
        heuristicTelemetry: {
          indicatorTitle: "Social Reassurance Pretext",
          description:
            "Pelaku memberikan cerita penenang dan mendesak korban mengunduh demi formalitas acara.",
          riskScore: 92,
        },
        messages: [
          {
            id: "m5",
            sender: "persona",
            text: "Sama Dita bro, acaranya di Balai Kartini Sabtu depan jam 10 pagi. Di dalam aplikasinya sudah ada barcode akses masuk gedung sama barcode amplop digitalnya bro.",
            time: "10:18",
          },
          {
            id: "m6",
            sender: "persona",
            text: "Ukuran aplikasinya cuma 4 MB kok bro, tinggal download terus klik pasang. Jangan lupa aktifkan izinnya ya biar kebuka barcode-nya.",
            time: "10:19",
          },
        ],
        choices: [
          {
            id: "c3_safe",
            label: "Bongkar Kejanggalan Aplikasi & Batalkan",
            actionText:
              "Barcode akses gedung tidak pernah mewajibkan install paket APK liar. Ini pola penipuan Trojan undangan yang lagi marak. Akun WhatsApp kamu pasti kena bajak!",
            riskLevel: "safe",
            nextStepId: "outcome_victory",
            tacticsRevealed: ["Menolak Instalasi Trojan", "Mengenali Modus APK Undangan Viral"],
          },
          {
            id: "c3_fatal",
            label: "Unduh APK Demi Barcode Gedung",
            actionText:
              "Oh harus pakai barcode buat masuk ya bro. Oke deh gue unduh dan pasang sekarang aplikasinya.",
            riskLevel: "fatal",
            nextStepId: "outcome_breach",
          },
        ],
      },
    },
    breachOutcome: {
      headline: "SIMULASI: AKSESIBILITAS PERANGKAT DIBOBOL & DATA PERBANKAN DISADAP",
      stolenOtp:
        "NOTIFIKASI BANK: 'Transfer dana sebesar Rp 18.200.000 ke Rekening Penampung BERHASIL. Akses perangkat baru terverifikasi.'",
      drainAmount: "Rp 18.200.000",
      targetAccount: "Rekening Penampung Bank Digital & Dompet Kripto",
      compromisedData: [
        "Malware memanfaatkan izin Accessibility Service untuk membaca ketukan keyboard PIN & password perbankan korban (Keylogger).",
        "SMS OTP masuk dicegat otomatis dan langsung dihapus dari inbox tanpa sempat dibaca korban.",
        "Malware mengekspor daftar kontak ponsel korban dan mengirimkan APK palsu tersebut ke ratusan kontak WhatsApp korban (Worm Propagation).",
      ],
      lessonLearned:
        "Undangan pernikahan digital yang sah SELALU berbentuk tautan situs web resmi (misal: Weddingku, Viding) atau dokumen gambar/video, TIDAK PERNAH berupa berkas instalasi aplikasi (.apk). Mengaktifkan izin Aksesibilitas (Accessibility Service) untuk aplikasi asing sama dengan menyerahkan kendali ponsel secara total kepada pelaku kejahatan siber.",
      systemWarningText:
        "⚠️ [Peringatan Sistem Android] Aplikasi 'Surat_Undangan_Pernikahan.apk' meminta izin BIND_ACCESSIBILITY_SERVICE untuk mengontrol layar dan membaca teks!",
      drainNotificationText:
        "NOTIFIKASI BANK: Transaksi pemindahbukuan sebesar Rp 18.200.000 BERHASIL. Akses m-Banking Anda telah dipindahkan ke perangkat baru.",
      scammerExitText:
        "(Pelaku langsung memblokir Anda dan menggunakan nomor WhatsApp Anda untuk menyebarkan malware ke seluruh kontak ponsel Anda).",
    },
    victoryOutcome: {
      headline: "SIMULASI BERHASIL: ANDA TANGKAL SERANGAN MALWARE UNDANGAN NIKAH PALSU!",
      score: 100,
      tacticsFoiled: [
        "Mengenali ekstensi berkas .apk berbahaya berkedok dokumen undangan",
        "Menolak mengaktifkan izin berbahaya Accessibility Service",
        "Memverifikasi keaslian pengirim melalui panggilan suara atau kanal komunikasi lain",
        "Menolak manipulasi rasa sungkan sosial dari akun teman yang dibajak",
      ],
      keyInsight:
        "Jangan pernah mengunduh berkas berekstensi .apk yang dikirim via WhatsApp dari siapa pun, termasuk dari nomor teman atau keluarga sekalipun, karena akun mereka bisa saja telah dibajak (WhatsApp Account Takeover).",
      scammerConcedeText:
        "Duh yaudah bro kalau gak percaya, gak usah dateng sekalian gapapa.",
      defenseNotificationText:
        "🛡️ Serangan Trojan Aksesibilitas berhasil digagalkan. Ponsel, data kontak, dan rekening Anda tetap aman terlindungi.",
    },
    forensicSummary: {
      targetLabel: "Nama Berkas Trojan",
      targetValue: "Surat_Undangan_Pernikahan.apk (4.8 MB)",
      threatClassification: "Android Accessibility Trojan & SMS Sniffer (Tingkat Risiko: 94%)",
      indicatorLabel: "Izin Berbahaya (Permissions)",
      indicatorValue: "BIND_ACCESSIBILITY_SERVICE, RECEIVE_SMS, READ_CONTACTS, INTERNET",
      attackImpact:
        "Penyadapan ketukan keyboard (Keylogger), pembajakan OTP latar belakang, dan penyebaran malware berantai ke kontak WhatsApp korban",
      officialProcedure:
        "Undangan pernikahan digital tidak pernah berbentuk berkas instalasi aplikasi (.apk). Seluruh undangan resmi berbentuk tautan web atau berkas gambar/video",
      psychologicalPressure:
        "Memanfaatkan relasi pertemanan lama, rasa sungkan, dan batas waktu konfirmasi RSVP (Social Obligation & Urgency)",
      decisionPointBreached:
        "Menyetujui instalasi berkas .apk dan memberikan izin Accessibility Service",
      decisionPointSafe:
        "Menolak instalasi APK, mewaspadai izin aksesibilitas, dan melakukan verifikasi via panggilan telepon biasa",
    },
  },

  "salah-transfer-pinjol": {
    id: "salah-transfer-pinjol",
    code: "SKENARIO 04",
    title: "Teror Salah Transfer Pinjol Ilegal",
    personaName: "Hendro Wijaya",
    personaRole: "Penagih Dana Eksternal / Debt Collector",
    personaAvatar: "/avatars/hendro.jpg",
    personaPhone: "+62 822-4910-3841",
    categoryBadge: "PEMERASAN DANA",
    threatTarget: "Pemerasan Berkedok Pinjol & Intimidasi Kontak",
    backgroundStory:
      "Berdasarkan modus kejahatan pinjaman online ilegal yang marak: Pelaku mentransfer dana misterius sebesar Rp2.500.000 ke rekening korban tanpa permohonan, lalu menghubungi korban dengan nada ancaman untuk mengembalikan uang pokok ditambah bunga pemerasan sebesar 30% (total Rp3.250.000) ke nomor rekening pribadi penagih, mengancam akan menyebarkan foto KTP dan memfitnah ke seluruh kontak darurat.",
    initialStepId: "step_1",
    steps: {
      step_1: {
        id: "step_1",
        psychologicalTactic: "Intimidasi Doxxing & Jebakan Utang Fiktif (Extortion & Debt Trap)",
        heuristicTelemetry: {
          indicatorTitle: "Pemerasan Rekening Pribadi (Mule Account)",
          description:
            "Pelaku menuntut transfer balik dana ke rekening perorangan dan meminta bunga liar tanpa perjanjian kontrak sah.",
          riskScore: 96,
        },
        messages: [
          {
            id: "m1",
            sender: "persona",
            text: "Woi! Anda pemilik rekening atas nama nasabah kan? Jangan pura-pura bego ya, sistem aplikasi kami sudah mencairkan dana pinjaman kilat Rp 2.500.000 ke rekening Anda tadi pagi! Cek mutasi Anda sekarang!",
            time: "11:20",
          },
          {
            id: "m2",
            sender: "persona",
            text: "Kalau Anda mau batalkan dan ngaku gak minjam, balikin dana itu SEKARANG juga beserta biaya pembatalan sistem dan bunga harian 30% jadi total Rp 3.250.000 ke rekening penagihan saya: Bank Mandiri 132-0091-882-192 an Hendro Wijaya!",
            time: "11:21",
          },
          {
            id: "m3",
            sender: "persona",
            text: "Waktu Anda cuma 30 menit! Kalau dana tidak masuk, foto KTP dan data pribadi Anda bakal kami sebar ke seluruh atasan kerja dan keluarga Anda dengan status buronan penggelapan dana!",
            time: "11:21",
          },
        ],
        choices: [
          {
            id: "c1_safe",
            label: "Tolak Kirim ke Rekening Pribadi & Lapor Bank/OJK",
            actionText:
              "Saya tidak pernah mengajukan pinjaman apapun. Saya tidak akan mentransfer sepeser pun ke rekening pribadi Anda. Saya akan langsung melapor ke pihak bank dan Satgas PASTI OJK 157 untuk memproses dana salah transfer ini secara resmi.",
            riskLevel: "safe",
            nextStepId: "step_2_confront",
            tacticsRevealed: [
              "Menolak Transfer ke Rekening Pribadi",
              "Mengetahui Prosedur Bank & Satgas PASTI",
            ],
          },
          {
            id: "c1_inq",
            label: "Tanya Asal Platform & Legalitas OJK",
            actionText:
              "Lho saya tidak pernah pinjam dana apapun! Anda dari aplikasi apa? Kenapa nomor rekening pengembaliannya rekening perorangan bukan Virtual Account resmi perusahaan berizin OJK?",
            riskLevel: "inquisitive",
            nextStepId: "step_2_persuade",
            tacticsRevealed: [
              "Mempertanyakan Legalitas OJK",
              "Mengidentifikasi Rekening Pribadi",
            ],
          },
          {
            id: "c1_fatal",
            label: "Panik & Transfer Uang Tebusan",
            actionText:
              "Aduh tolong jangan sebar data saya ke kantor dan keluarga! Saya panik sekali. Saya transfer sekarang uangnya Rp3.250.000 ke rekening Mas Hendro, tolong jamin data saya dihapus ya!",
            riskLevel: "fatal",
            nextStepId: "outcome_breach",
          },
        ],
      },
      step_2_confront: {
        id: "step_2_confront",
        psychologicalTactic: "Eskalasi Teror Lapangan & Ancaman Kekerasan",
        heuristicTelemetry: {
          indicatorTitle: "Teror Psikis & Ancaman Fisik",
          description:
            "Pelaku mengancam mengerahkan debt collector lapangan ke alamat domisili korban untuk memicu kepanikan.",
          riskScore: 98,
        },
        messages: [
          {
            id: "m4",
            sender: "persona",
            text: "Gak usah banyak bacot bawa-bawa OJK dan bank! Data alamat rumah dan kantor Anda sudah dipegang tim lapangan kami! Kalau dalam 15 menit bukti transfer belum dikirim, 4 orang debt collector langsung meluncur bikin ribut di rumah Anda!",
            time: "11:23",
          },
          {
            id: "m5",
            sender: "persona",
            text: "Jangan salahkan kami kalau tetangga dan RT Anda tahu Anda buronan maling pinjol! Balikin duitnya sekarang ke rekening Hendro Wijaya!",
            time: "11:24",
          },
        ],
        choices: [
          {
            id: "c2_safe",
            label: "Gunakan Dasar Hukum Pemerasan & Blokir",
            actionText:
              "Seluruh chat ancaman dan nomor rekening Hendro Wijaya ini sudah saya dokumentasikan sebagai bukti pemerasan Pasal 368 KUHP dan UU ITE ke Patroli Siber Polri. Silakan datang bersama aparat jika berani. Dana salah transfer hanya saya kembalikan melalui mediasi resmi teller bank.",
            riskLevel: "safe",
            nextStepId: "outcome_victory",
            tacticsRevealed: [
              "Menangkal Teror Lapangan",
              "Memanfaatkan Dasar Hukum Pidana Pemerasan",
              "Mendokumentasikan Bukti Digital",
            ],
          },
          {
            id: "c2_fatal",
            label: "Takut Didatangi Debt Collector & Transfer",
            actionText:
              "Ampun mas, jangan bikin ribut di rumah saya sama tetangga. Saya transfer uang Rp3.250.000 sekarang ke rekening Mas Hendro, tolong batalkan tim lapangan.",
            riskLevel: "fatal",
            nextStepId: "outcome_breach",
          },
        ],
      },
      step_2_persuade: {
        id: "step_2_persuade",
        psychologicalTactic: "Taktik Good-Cop Palsu (Pura-pura Menolong Hapus Data)",
        heuristicTelemetry: {
          indicatorTitle: "Manipulasi Penghapusan Data Fiktif",
          description:
            "Pelaku berpura-pura bersedia menghapus data korban asalkan uang segera ditransfer ke rekening pribadinya.",
          riskScore: 94,
        },
        messages: [
          {
            id: "m6",
            sender: "persona",
            text: "Kami dari platform Koperasi Simpan Pinjam Dana Kilat! Sistem kami sudah verifikasi NIK dan nomor rekening Anda. Kalau Anda kooperatif balikin dana pokoknya aja Rp 2.500.000 sekarang juga, saya bantu hapus data NIK Anda dari sistem penagihan biar nama Anda bersih.",
            time: "11:23",
          },
          {
            id: "m7",
            sender: "persona",
            text: "Tapi kalau Anda lambat atau rewel, sistem otomatis kunci denda bunga berjalan 50 ribu per jam. Transfer sekarang sebelum saya gak bisa bantu Anda!",
            time: "11:24",
          },
        ],
        choices: [
          {
            id: "c3_safe",
            label: "Tolak Jebakan Hapus Data Palsu",
            actionText:
              "Menyetor ke rekening pribadi penagih tidak akan pernah menghapus data di sistem pinjol ilegal, melainkan jadi sasaran pemerasan berulang. Saya sudah instruksikan bank saya untuk tahan dana tersebut dan lapor Satgas PASTI. Anda tidak punya hak menagih!",
            riskLevel: "safe",
            nextStepId: "outcome_victory",
            tacticsRevealed: [
              "Membongkar Alibi Hapus Data",
              "Memutus Siklus Pemerasan Berulang",
            ],
          },
          {
            id: "c3_fatal",
            label: "Tergiur Hapus Data & Transfer Pokok",
            actionText:
              "Terima kasih mas kalau mau bantu hapus data saya. Saya transfer pokoknya Rp2.500.000 ke rekening Mas Hendro ya, tolong benar-benar dibersihkan nama saya.",
            riskLevel: "fatal",
            nextStepId: "outcome_breach",
          },
        ],
      },
    },
    breachOutcome: {
      headline: "SIMULASI: TERPERANGKAP PEMERASAN PINJOL ILEGAL & UANG AMBLAS",
      stolenOtp:
        "BUKTI TRANSFER: 'Transfer sebesar Rp 3.250.000 ke Bank Mandiri 132-0091-882-192 an Hendro Wijaya BERHASIL.'",
      drainAmount: "Rp 3.250.000",
      targetAccount: "Rekening Pribadi Penampung (Mule Account)",
      compromisedData: [
        "Dana pribadi korban sebesar Rp3.250.000 hilang ditransfer ke rekening pribadi penipu.",
        "Pelaku TIDAK menghapus data korban, melainkan terus meneror korban untuk meminta 'uang administrasi penghapusan berkas' tambahan.",
        "Data KTP dan nomor telepon korban tetap disebarluaskan ke sindikat pinjol ilegal lainnya karena korban terbukti rentan terhadap intimidasi.",
      ],
      lessonLearned:
        "JANGAN PERNAH mentransfer balik dana yang masuk tiba-tiba ke nomor rekening pribadi yang diberikan oleh penagih di WhatsApp. Jika Anda menerima transfer dana misterius, biarkan uang tersebut tetap di rekening (JANGAN DIGUNAKAN), segera datang ke kantor cabang bank Anda untuk membuat laporan salah transfer resmi, dan laporkan nomor penagih ke Satgas PASTI OJK (157).",
      systemWarningText:
        "⚠️ [Teror Pemerasan Finansial Terdeteksi] Pelaku memaksa pengiriman uang tebusan ke rekening perorangan dengan ancaman pencemaran nama baik!",
      drainNotificationText:
        "NOTIFIKASI BANK: Transfer keluar sebesar Rp 3.250.000 ke rekening Hendro Wijaya berhasil. Penipu kembali menuntut transfer Rp 1.500.000 keesokan harinya!",
      scammerExitText:
        "(Uang Anda masuk ke rekening pelaku. Dua hari kemudian, nomor lain dari sindikat yang sama kembali meneror Anda meminta uang tambahan).",
    },
    victoryOutcome: {
      headline: "SIMULASI BERHASIL: ANDA TANGKAL TEROR SALAH TRANSFER PINJOL ILEGAL!",
      score: 100,
      tacticsFoiled: [
        "Menolak terintimidasi oleh ancaman doxxing dan kedatangan debt collector",
        "Menolak mentransfer dana ke rekening pribadi yang ditunjuk penagih",
        "Mengetahui prosedur sah penyelesaian dana salah transfer melalui mediasi bank resmi",
        "Menggunakan dasar hukum pemerasan Pasal 368 KUHP dan melapor ke Satgas PASTI OJK 157",
      ],
      keyInsight:
        "Modus transfer dana sepihak adalah jebakan pinjol ilegal agar korban terikat utang berbunga tinggi. Kunci pertahanan utama adalah JANGAN MENGGUNAKAN DANA TERSEBUT, JANGAN TRANSFER KE REKENING PRIBADI PENAGIH, dan selesaikan secara resmi hanya melalui teller kantor cabang bank Anda.",
      scammerConcedeText:
        "Sialan lu! Awas aja kalau berani lapor-lapor polisi!",
      defenseNotificationText:
        "🛡️ Upaya pemerasan pinjol ilegal berhasil ditangkal. Uang Anda selamat dan pelaku gagal menjerat Anda dalam lingkaran utang fiktif.",
    },
    forensicSummary: {
      targetLabel: "Rekening Penampung Penagih",
      targetValue: "Bank Mandiri 132-0091-882-192 an Hendro Wijaya",
      threatClassification: "Extortion & Illegal Loan Shark Debt Trap (Tingkat Risiko: 96%)",
      indicatorLabel: "Tuntutan & Bunga Pemerasan",
      indicatorValue: "Dana Pokok Rp 2.500.000 + Bunga Harian Fiktif 30% (Total Rp 3.250.000)",
      attackImpact:
        "Kerugian finansial tebusan pemerasan, utang fiktif terus berlanjut, dan ancaman doxxing penyebaran data pribadi ke kontak ponsel",
      officialProcedure:
        "Jangan gunakan dana salah transfer dan jangan transfer ke rekening pribadi penagih. Hubungi bank penyedia rekening dan laporkan ke Satgas PASTI OJK 157",
      psychologicalPressure:
        "Ancaman sebar data KTP, fitnah sebagai buronan ke atasan/keluarga, dan teror kedatangan debt collector lapangan (Doxxing & Fear Induction)",
      decisionPointBreached:
        "Panik dan mentransfer uang tebusan ke rekening perorangan penagih",
      decisionPointSafe:
        "Menolak intimidasi rekening perorangan, membawa kasus ke bank resmi & Satgas PASTI 157, serta mendokumentasikan bukti pemerasan",
    },
  },
};
