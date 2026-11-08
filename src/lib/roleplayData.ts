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
  socialEngineeringTactic: string;
  forensicTabTitle?: string;
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
      socialEngineeringTactic: "Pura-pura menjadi kurir ekspedisi berdalih resi basah/rusak (Pretexting)",
      forensicTabTitle: "Analisis Forensik Berkas APK",
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
      socialEngineeringTactic: "Menyamar sebagai Customer Service resmi BCA Priority mengabarkan kenaikan tarif (Authority & Pretexting)",
      forensicTabTitle: "Analisis Forensik Web Phishing",
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
      socialEngineeringTactic: "Menyamar sebagai teman lama mengundang ke resepsi pernikahan digital (Familiarity & Pretexting)",
      forensicTabTitle: "Analisis Forensik Berkas APK",
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
      socialEngineeringTactic: "Mengaku salah transfer uang lalu melakukan intimidasi & ancaman doxxing kontak (Coercion & Extortion)",
      forensicTabTitle: "Analisis Forensik Pinjol Ilegal",
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

  "surat-tilang-etle": {
    id: "surat-tilang-etle",
    code: "SKENARIO 05",
    title: "Pemberitahuan Surat Tilang ETLE",
    personaName: "Bripka Anton",
    personaRole: "Petugas Tilang Siber Palsu",
    personaAvatar: "/avatars/anton.jpg",
    personaPhone: "+62 811-9238-1920",
    categoryBadge: "MALWARE ETLE",
    threatTarget: "Penyusupan Trojan Remote Access & SMS Sniffer",
    backgroundStory:
      "Berdasarkan modus penipuan mengatasnamakan Korlantas Polri: Pelaku menyamar sebagai petugas kepolisian lalu lintas dan mengabarkan bahwa kendaraan korban terekam kamera ETLE melakukan pelanggaran lalu lintas. Pelaku melampirkan berkas 'Surat_Tilang_ETLE.apk' berkedok surat konfirmasi resmi untuk mencuri SMS OTP dan menguras saldo rekening korban.",
    initialStepId: "step_1",
    steps: {
      step_1: {
        id: "step_1",
        psychologicalTactic: "Pemanfaatan Otoritas Penegak Hukum & Ketakutan Hukum (Authority Pretexting & Legal Intimidation)",
        heuristicTelemetry: {
          indicatorTitle: "Trojan Berkedok Dokumen Tilang Polri (.apk)",
          description:
            "Surat tilang resmi kepolisian TIDAK PERNAH dikirim dalam bentuk berkas aplikasi Android (.apk) via nomor WhatsApp seluler pribadi.",
          riskScore: 95,
        },
        messages: [
          {
            id: "m1",
            sender: "persona",
            text: "Selamat siang. Kami dari Tim Penindakan Pelanggaran ETLE Ditlantas Polda Metro Jaya memberitahukan bahwa kendaraan bermotor Anda terekam kamera tilang elektronik melakukan pelanggaran lalu lintas (Pasal 287 UU LLAJ).",
            time: "09:30",
          },
          {
            id: "m2",
            sender: "persona",
            text: "Berikut kami lampirkan Surat Konfirmasi Tilang Elektronik beserta foto bukti rekaman kamera CCTV pelanggaran di lokasi kejadian. Mohon segera dibuka berkas di bawah untuk konfirmasi kepemilikan:",
            time: "09:31",
            apkAttachment: {
              filename: "Surat_Tilang_ETLE.apk",
              size: "5.1 MB",
              mime: "application/vnd.android.package-archive",
              extension: ".apk",
              dangerousPermissions: [
                "android.permission.RECEIVE_SMS",
                "android.permission.READ_SMS",
                "android.permission.INTERNET",
                "android.permission.SEND_SMS",
              ],
            },
          },
          {
            id: "m3",
            sender: "persona",
            text: "Batas waktu konfirmasi adalah 3 x 24 jam. Jika tidak dikonfirmasi, STNK kendaraan Anda akan diblokir sementara di Samsat dan dikenakan denda maksimal Rp 500.000 saat perpanjangan pajak.",
            time: "09:31",
          },
        ],
        choices: [
          {
            id: "c1_safe",
            label: "Tolak APK & Cek Situs Resmi ETLE Korlantas",
            actionText:
              "Polri tidak pernah mengirimkan surat tilang dalam bentuk file aplikasi APK via WhatsApp pribadi. Surat tilang resmi dikirim via pos surat fisik ke alamat STNK atau dicek mandiri di situs resmi etle-korlantas.info. Saya tidak akan buka file ini.",
            riskLevel: "safe",
            nextStepId: "step_2_confront",
            tacticsRevealed: [
              "Verifikasi Prosedur Resmi ETLE",
              "Menolak Eksekusi APK Kepolisian Palsu",
            ],
          },
          {
            id: "c1_inq",
            label: "Tanya Pelat Nomor & Lokasi Pelanggaran",
            actionText:
              "Kendaraan saya pelat nomornya berapa yang kena tilang dan di jalan mana lokasinya Pak? Kenapa bukti fotonya tidak dikirim dalam format gambar biasa JPG/PNG?",
            riskLevel: "inquisitive",
            nextStepId: "step_2_persuade",
            tacticsRevealed: [
              "Meminta Bukti Konkret",
              "Mengidentifikasi Kejanggalan Format File",
            ],
          },
          {
            id: "c1_fatal",
            label: "Panik Takut STNK Diblokir & Unduh APK",
            actionText:
              "Waduh Pak jangan diblokir STNK saya! Saya buka dan pasang berkas surat tilangnya sekarang buat lihat bukti pelanggarannya.",
            riskLevel: "fatal",
            nextStepId: "outcome_breach",
          },
        ],
      },
      step_2_confront: {
        id: "step_2_confront",
        psychologicalTactic: "Penguatan Ancaman Pemblokiran STNK & Sidang Pengadilan",
        heuristicTelemetry: {
          indicatorTitle: "Eskalasi Intimidasi Birokrasi Samsat",
          description:
            "Pelaku menakut-nakuti korban dengan ancaman berkas dilimpahkan ke Pengadilan Negeri dan pemblokiran Samsat.",
          riskScore: 97,
        },
        messages: [
          {
            id: "m4",
            sender: "persona",
            text: "Jangan sembarangan menuduh ya! Ini sistem integrasi digital terbaru Ditlantas Polri untuk efisiensi paperless. Dokumen terenkripsi keamanan khusus sehingga harus dibuka lewat aplikasi resmi kami tersebut.",
            time: "09:34",
          },
          {
            id: "m5",
            sender: "persona",
            text: "Jika Anda menolak konfirmasi hari ini, berkas pelanggaran Anda langsung kami limpahkan ke Pengadilan Negeri untuk sidang tilang dan denda maksimal dipotong via pajak kendaraan!",
            time: "09:35",
          },
        ],
        choices: [
          {
            id: "c2_safe",
            label: "Bongkar Penipuan & Laporkan ke Pos Polisi",
            actionText:
              "Semua surat tilang resmi memiliki nomor referensi tilang 12 digit yang bisa dicek di situs etle-korlantas.info tanpa perlu install aplikasi apapun. Nomor WhatsApp ini akan saya laporkan ke Divisi Humas Polri dan Kominfo.",
            riskLevel: "safe",
            nextStepId: "outcome_victory",
            tacticsRevealed: [
              "Memahami Validasi ETLE Nasional",
              "Mendeteksi Penyamaran Otoritas Palsu",
              "Melaporkan Akun Penipu",
            ],
          },
          {
            id: "c2_fatal",
            label: "Takut Sidang Pengadilan & Pasang APK",
            actionText:
              "Saya takut kalau sampai sidang di pengadilan Pak. Baik Pak saya install aplikasinya sekarang untuk konfirmasi.",
            riskLevel: "fatal",
            nextStepId: "outcome_breach",
          },
        ],
      },
      step_2_persuade: {
        id: "step_2_persuade",
        psychologicalTactic: "Alibi Enkripsi Dokumen & Formalitas Kantor",
        heuristicTelemetry: {
          indicatorTitle: "Dalih Enkripsi Data CCTV",
          description:
            "Pelaku mengklaim format APK diperlukan untuk memutar video rekaman CCTV beresolusi tinggi.",
          riskScore: 93,
        },
        messages: [
          {
            id: "m6",
            sender: "persona",
            text: "Pelat nomor dan video rekaman CCTV-nya ada di dalam lampiran berkas itu karena data tilang berukuran besar dan dilindungi sistem enkripsi Korlantas.",
            time: "09:34",
          },
          {
            id: "m7",
            sender: "persona",
            text: "Tinggal klik install saja, nanti otomatis terbuka formulir sanggahan tilang. Jika memang bukan kendaraan Anda, Anda bisa langsung klik tombol sanggah di aplikasi tersebut.",
            time: "09:35",
          },
        ],
        choices: [
          {
            id: "c3_safe",
            label: "Tolak Dalih Enkripsi & Tegaskan Prosedur",
            actionText:
              "Tidak ada dokumen tilang yang dienkripsi ke dalam format .apk installer. Petugas kepolisian resmi tidak pernah meminta masyarakat menginstal aplikasi dari chat WhatsApp. Saya konfirmasi langsung ke pos polisi terdekat!",
            riskLevel: "safe",
            nextStepId: "outcome_victory",
            tacticsRevealed: [
              "Menolak Alibi Teknis Palsu",
              "Memilih Verifikasi Langsung ke Pos Polisi",
            ],
          },
          {
            id: "c3_fatal",
            label: "Ingin Mengajukan Sanggahan & Pasang APK",
            actionText:
              "Oh bisa sanggah lewat aplikasi ya Pak. Baik saya unduh dulu aplikasinya untuk ajukan sanggahan bahwa saya tidak melanggar.",
            riskLevel: "fatal",
            nextStepId: "outcome_breach",
          },
        ],
      },
    },
    breachOutcome: {
      headline: "SIMULASI: TROJAN ETLE AKTIF & AKSES SMS PERBANKAN DIRETAS",
      stolenOtp:
        "NOTIFIKASI SMS OTP: 'Kode OTP BCA: 948102. JANGAN BERIKAN KEPADA SIAPAPUN. Transaksi transfer Rp 8.700.000 ke Bank Jago BERHASIL.'",
      drainAmount: "Rp 8.700.000",
      targetAccount: "Rekening Penampung Bank Digital (Mule Account)",
      compromisedData: [
        "Malware 'Surat_Tilang_ETLE.apk' mencegat izin RECEIVE_SMS dan READ_SMS di latar belakang.",
        "Kode OTP verifikasi m-Banking dibaca otomatis oleh server command-and-control (C2) penipu.",
        "Penipu memindahkan akun perbankan korban ke perangkat baru dan mentransfer seluruh tabungan keluar.",
      ],
      lessonLearned:
        "Korlantas Polri maupun instansi pemerintah manapun TIDAK PERNAH mengirimkan surat pemberitahuan tilang dalam bentuk berkas .apk melalui pesan WhatsApp. Pemberitahuan tilang elektronik resmi hanya dikirim melalui surat pos fisik beramplop dinas cokelat ke alamat sesuai STNK atau dicek langsung melalui portal resmi www.etle-korlantas.info.",
      systemWarningText:
        "⚠️ [Malware Android Terpasang] Berkas 'Surat_Tilang_ETLE.apk' meminta izin penyadapan SMS perbankan!",
      drainNotificationText:
        "NOTIFIKASI BANK: Transaksi debit transfer keluar Rp 8.700.000 ke rekening penampung telah BERHASIL.",
      scammerExitText:
        "(Pesan konfirmasi Anda tidak lagi dibalas, nomor WhatsApp pelaku mendadak tidak aktif).",
    },
    victoryOutcome: {
      headline: "SIMULASI BERHASIL: ANDA TANGKAL SERANGAN MALWARE TILANG ETLE!",
      score: 100,
      tacticsFoiled: [
        "Mengenali penyamaran petugas kepolisian palsu melalui nomor seluler biasa",
        "Menolak ancaman blokir STNK dan intimidasi sidang pengadilan",
        "Memahami prosedur sah konfirmasi ETLE hanya lewat pos fisik atau situs resmi etle-korlantas.info",
        "Menolak membuka berkas .apk yang mengatasnamakan surat dinas kepolisian",
      ],
      keyInsight:
        "Kepolisian Republik Indonesia tidak pernah mendistribusikan aplikasi APK untuk surat tilang. Jangan pernah terkejut atau panik saat menerima tuduhan pelanggaran hukum dari chat WhatsApp; selalu verifikasi secara mandiri melalui saluran resmi pemerintah.",
      scammerConcedeText:
        "Ya sudah kalau mau nunggu surat tilang fisik, STNK Anda kami proses blokir di Samsat!",
      defenseNotificationText:
        "🛡️ Serangan malware ETLE berhasil digagalkan. Data ponsel dan rekening bank Anda 100% aman terlindungi.",
    },
    forensicSummary: {
      socialEngineeringTactic: "Menyamar sebagai kepolisian lalu lintas dengan ancaman pemblokiran STNK Samsat (Authority & Intimidation)",
      forensicTabTitle: "Analisis Forensik Berkas APK",
      targetLabel: "Nama Berkas Malware",
      targetValue: "Surat_Tilang_ETLE.apk (5.1 MB)",
      threatClassification: "Android SMS Sniffer Trojan & Police Impersonation (Tingkat Risiko: 95%)",
      indicatorLabel: "Izin Berbahaya (Permissions)",
      indicatorValue: "RECEIVE_SMS, READ_SMS, SEND_SMS, INTERNET",
      attackImpact:
        "Penyadapan kode OTP m-Banking via SMS latar belakang, bypass otentikasi dua faktor, dan pengurasan saldo tabungan",
      officialProcedure:
        "Pemberitahuan tilang ETLE resmi dikirim melalui surat pos fisik beramplop dinas Polri ke alamat STNK atau diakses di portal www.etle-korlantas.info",
      psychologicalPressure:
        "Penyamaran petugas kepolisian, tuduhan pelanggaran pasal lalu lintas, dan ancaman pemblokiran STNK Samsat (Authority Bias & Fear Induction)",
      decisionPointBreached:
        "Panik atas tuduhan pelanggaran hukum dan menginstal berkas .apk palsu",
      decisionPointSafe:
        "Menolak berkas APK, menegaskan prosedur pos resmi, dan memverifikasi mandiri ke situs ETLE Korlantas",
    },
  },

  "freelance-job-bodong": {
    id: "freelance-job-bodong",
    code: "SKENARIO 06",
    title: "Wawancara Kerja Freelance Bodong",
    personaName: "Jessica Tan",
    personaRole: "Talent Acquisition Global / Recruiter Freelance",
    personaAvatar: "/avatars/jessica.jpg",
    personaPhone: "+62 819-3810-9284",
    categoryBadge: "LOWONGAN FIKTIF",
    threatTarget: "Skema Deposit Bertingkat (Ponzi Task Scam)",
    backgroundStory:
      "Berdasarkan modus kejahatan rekayasa sosial lowongan kerja paruh waktu (task scam): Pelaku menawarkan pekerjaan mudah paruh waktu berupa like/subscribe video YouTube dengan komisi Rp30.000 per tugas. Korban awalnya diberi komisi kecil untuk membangun kepercayaan, namun kemudian diwajibkan melakukan deposit uang jaminan bertingkat (Rp500.000 hingga Rp5.000.000) ke platform investasi fiktif yang dananya dikunci dan tidak bisa ditarik kembali.",
    initialStepId: "step_1",
    steps: {
      step_1: {
        id: "step_1",
        psychologicalTactic: "Pemberian Hadiah Kecil & Pancingan Cepat Kaya (Foot-in-the-Door & Lure of Easy Money)",
        heuristicTelemetry: {
          indicatorTitle: "Tawaran Kerja Paruh Waktu Komisi Tidak Masuk Akal",
          description:
            "Menawarkan bayaran tinggi hanya untuk like & subscribe video tanpa kualifikasi kerja nyata, pola baku penipuan task scam.",
          riskScore: 92,
        },
        messages: [
          {
            id: "m1",
            sender: "persona",
            text: "Halo kak! Selamat siang. Saya Jessica Tan dari PT Media Promosi Asia (Partner Resmi TikTok & YouTube). Kami melihat profil aktif kakak dan ingin menawarkan pekerjaan freelance part-time dari rumah.",
            time: "14:00",
          },
          {
            id: "m2",
            sender: "persona",
            text: "Pekerjaannya sangat mudah kak, cuma bantu Like & Subscribe video konten klien kami di YouTube. Setiap 1 video selesai di-like dan kirim screenshot, kakak langsung dapat komisi Rp 30.000 tunai via transfer Dana/OVO/ShopeePay!",
            time: "14:01",
          },
          {
            id: "m3",
            sender: "persona",
            text: "Sebagai bonus perkenalan, coba klik like tautan video berikut dan kirim screenshot ke saya, nanti saya langsung transferkan reward Rp 30.000 ke rekening kakak sekarang juga: https://youtube-booster.promo/task-demo",
            time: "14:01",
          },
        ],
        choices: [
          {
            id: "c1_safe",
            label: "Tolak & Kenali Pola Task Scam Deposit",
            actionText:
              "Tidak ada perusahaan resmi yang membayar Rp30.000 hanya untuk like satu video YouTube. Ini modus task scam pancingan komisi awal yang nantinya berujung minta deposit uang jutaan rupiah. Saya tidak tertarik.",
            riskLevel: "safe",
            nextStepId: "step_2_confront",
            tacticsRevealed: [
              "Mengenali Pola Task Scam",
              "Menolak Pancingan Foot-in-the-Door",
            ],
          },
          {
            id: "c1_inq",
            label: "Tanya Asal Kontak & Perusahaan Resmi",
            actionText:
              "Dapat nomor kontak saya dari mana ya Mbak Jessica? PT Media Promosi Asia punya website resmi atau kantor fisik di mana? Apakah nanti ada syarat deposit uang?",
            riskLevel: "inquisitive",
            nextStepId: "step_2_persuade",
            tacticsRevealed: [
              "Menanyakan Sumber Data Pribadi",
              "Mendeteksi Indikasi Syarat Deposit",
            ],
          },
          {
            id: "c1_fatal",
            label: "Tergiur Komisi Cepat & Ikuti Tugas",
            actionText:
              "Wah gampang banget kerjanya! Mau dong Mbak Jessica, ini saya sudah like videonya. Tolong transfer komisinya ya, saya mau lanjut tugas berikutnya.",
            riskLevel: "fatal",
            nextStepId: "step_2_deposit_trap",
          },
        ],
      },
      step_2_confront: {
        id: "step_2_confront",
        psychologicalTactic: "Social Proof Palsu & Pamer Bukti Transfer Karyawan",
        heuristicTelemetry: {
          indicatorTitle: "Manipulasi Bukti Transfer & Testimoni Fiktif",
          description:
            "Pelaku membagikan tangkapan layar bukti transfer palsu dan grup Telegram ramai untuk meyakinkan korban.",
          riskScore: 94,
        },
        messages: [
          {
            id: "m4",
            sender: "persona",
            text: "Aduh kak, kami legal dan sudah ada ratusan anggota grup Telegram yang tiap hari dapet penghasilan Rp 500.000 - Rp 1.500.000 per hari lho kak. Ini buktinya murni proyek naikin engagement konten digital.",
            time: "14:04",
          },
          {
            id: "m5",
            sender: "persona",
            text: "Kami tidak pernah minta pungutan biaya pendaftaran apapun kok kak. Kakak cuma jalani misi like dulu, reward langsung cair detik itu juga. Coba tugas pertama aja dulu kak, gak ada ruginya kan?",
            time: "14:05",
          },
        ],
        choices: [
          {
            id: "c2_safe",
            label: "Tolak Tegas & Edukasi Modus Ponzi",
            actionText:
              "Memang awalnya tidak bayar pendaftaran dan dikasih reward Rp30.000, tapi tugas ke-4 atau ke-5 pasti disuruh 'Tugas Merchant Deposit Saldo' bertingkat yang ujungnya uang tidak bisa di-withdraw. Modus ini sudah diumumkan Satgas PASTI OJK. Jangan hubungi saya lagi!",
            riskLevel: "safe",
            nextStepId: "outcome_victory",
            tacticsRevealed: [
              "Membedah Alur Scam Bertingkat",
              "Mengenali Peringatan Satgas PASTI",
            ],
          },
          {
            id: "c2_fatal",
            label: "Luluh Melihat Testimoni & Coba Daftar",
            actionText:
              "Banyak juga ya yang dapet ratusan ribu per hari. Yaudah Mbak, saya coba jalani tugas pertamanya dulu deh kalau emang gak ada biaya pendaftaran.",
            riskLevel: "fatal",
            nextStepId: "step_2_deposit_trap",
          },
        ],
      },
      step_2_persuade: {
        id: "step_2_persuade",
        psychologicalTactic: "Menolak Transparan & Mengalihkan ke Tugas Demo",
        heuristicTelemetry: {
          indicatorTitle: "Evasion of Legality Verification",
          description:
            "Pelaku mengaburkan identitas perusahaan dan terus mendesak korban memulai tugas demi uang saku cepat.",
          riskScore: 91,
        },
        messages: [
          {
            id: "m6",
            sender: "persona",
            text: "Data kakak direkomendasikan sistem HRD algoritma LinkedIn kami kak. Kantor pusat kami di Marina Bay Singapura dan perwakilan Jakarta di Sudirman.",
            time: "14:04",
          },
          {
            id: "m7",
            sender: "persona",
            text: "Tenang kak, kami jamin 100% tidak ada biaya deposit di awal. Kakak cukup like 1 video sekarang dan nomor rekening kakak langsung menerima Rp 30.000. Kenapa ragu kalau kakak yang dibayar duluan?",
            time: "14:05",
          },
        ],
        choices: [
          {
            id: "c3_safe",
            label: "Identifikasi Alibi Palsu & Blokir Kontak",
            actionText:
              "Perusahaan resmi tidak menggunakan nomor seluler WhatsApp acak untuk rekrutmen massal. Dalih membayar di awal adalah psikologi manipulasi komitmen agar korban terikat ke tugas deposit jebakan berikutnya. Saya tolak dan laporkan nomor ini.",
            riskLevel: "safe",
            nextStepId: "outcome_victory",
            tacticsRevealed: [
              "Mengenali Jebakan Uang Muka",
              "Memutus Manipulasi Komitmen Psikologis",
            ],
          },
          {
            id: "c3_fatal",
            label: "Percaya Karena Dibayar Duluan",
            actionText:
              "Bener juga ya, kan saya yang dibayar duluan bukan saya yang bayar. Yaudah Mbak Jessica, ini saya kerjakan like videonya sekarang.",
            riskLevel: "fatal",
            nextStepId: "step_2_deposit_trap",
          },
        ],
      },
      step_2_deposit_trap: {
        id: "step_2_deposit_trap",
        psychologicalTactic: "Jebakan Deposit Tingkat Lanjut (Sunk Cost Fallacy & Escrow Trap)",
        heuristicTelemetry: {
          indicatorTitle: "Tuntutan Tugas Merchant / Deposit Wajib",
          description:
            "Setelah memberi komisi Rp30.000, pelaku mewajibkan deposit Rp500.000 - Rp2.500.000 dengan iming-iming komisi 40%.",
          riskScore: 98,
        },
        messages: [
          {
            id: "m8",
            sender: "persona",
            text: "Selamat! Reward tugas pertama Rp 30.000 sudah berhasil ditransfer ke e-wallet kakak. Sekarang kakak sudah naik ke Level Silver Member!",
            time: "14:08",
          },
          {
            id: "m9",
            sender: "persona",
            text: "Untuk membuka paket komisi besar Rp 700.000 di tugas selanjutnya, kakak diwajibkan mengambil 'Misi Merchant Pesanan Khusus'. Cukup transfer deposit saldo Rp 500.000 ke rekening bendahara kami: Bank BCA 829-0192-381 an PT Media Kreasi Bersama. Nanti uang pokok Rp 500.000 + komisi Rp 200.000 langsung cair dalam 10 menit!",
            time: "14:09",
          },
        ],
        choices: [
          {
            id: "c4_safe",
            label: "Sadar Jebakan Deposit & Langsung Berhenti",
            actionText:
              "Nah kan, sudah mulai muncul jebakan deposit! Di mana-mana orang bekerja itu digaji, bukan malah pekerja yang bayar deposit modal ke perusahaan! Komisi Rp30.000 tadi cuma umpan. Saya berhenti dan blokir nomor Anda!",
            riskLevel: "safe",
            nextStepId: "outcome_victory",
            tacticsRevealed: [
              "Menyadari Jebakan Modal Kerja",
              "Menghindari Sunk Cost Fallacy",
            ],
          },
          {
            id: "c4_fatal",
            label: "Transfer Deposit Rp500.000 Demi Komisi",
            actionText:
              "Tadi kan reward Rp30.000 beneran cair, berarti ini beneran. Yaudah Mbak saya transfer depositnya Rp500.000 sekarang biar dapat komisi Rp200.000.",
            riskLevel: "fatal",
            nextStepId: "outcome_breach",
          },
        ],
      },
    },
    breachOutcome: {
      headline: "SIMULASI: TERJEBAK SKEMA TASK SCAM & SALDO DEPOSIT TERKUNCI",
      stolenOtp:
        "BUKTI TRANSFER: 'Transfer deposit Rp 500.000 berhasil. Sistem membekukan penarikan dan meminta deposit lanjutan Rp 3.500.000.'",
      drainAmount: "Rp 4.000.000",
      targetAccount: "Rekening Penampung Sindikat Task Scam (BCA / Mandiri)",
      compromisedData: [
        "Korban mentransfer deposit awal Rp500.000, lalu pelaku mengklaim sistem eror karena korban 'salah kode misi'.",
        "Pelaku memaksa korban menyetor deposit perbaikan sebesar Rp3.500.000 agar uang sebelumnya bisa dicairkan (Sunk Cost Trap).",
        "Setelah total uang Rp4.000.000 disetor, akun korban di Telegram langsung dihapus dan nomor WhatsApp diblokir.",
      ],
      lessonLearned:
        "Pekerjaan yang sah TIDAK AKAN PERNAH meminta pelamar mentransfer deposit dana atau uang jaminan dalam bentuk apapun. Pemberian komisi kecil di awal hanyalah trik psikologis (Foot-in-the-Door) untuk memancing kepercayaan korban sebelum menguras saldo jutaan rupiah pada tugas merchant deposit bertingkat.",
      systemWarningText:
        "⚠️ [Skema Penipuan Tugas Bertingkat Terdeteksi] Permintaan deposit uang modal kerja mengindikasikan 100% sindikat task scam!",
      drainNotificationText:
        "NOTIFIKASI BANK: Transfer keluar sebesar Rp 4.000.000 ke sindikat task scam berhasil. Dana tidak pernah dapat dicairkan kembali!",
      scammerExitText:
        "(Anda dikeluarkan dari grup tugas dan nomor WhatsApp Anda diblokir oleh admin setelah menolak transfer deposit lanjutan Rp 7.000.000).",
    },
    victoryOutcome: {
      headline: "SIMULASI BERHASIL: ANDA TANGKAL JEBAKAN LOWONGAN FREELANCE BODONG!",
      score: 100,
      tacticsFoiled: [
        "Membongkar ilusi pekerjaan mudah dengan komisi like video yang tidak masuk akal",
        "Menolak tergiur oleh umpan hadiah kecil di awal percakapan",
        "Mengenali jebakan tugas merchant / deposit modal kerja bertingkat",
        "Membentengi diri dari jebakan psikologis rasa rugi (Sunk Cost Fallacy)",
      ],
      keyInsight:
        "Prinsip dasar ketenagakerjaan: Anda bekerja untuk menghasilkan uang, bukan membayar uang untuk bekerja. Segala bentuk lowongan kerja yang mewajibkan deposit saldo, top up poin, atau transfer uang talangan adalah penipuan terorganisir (Task Scam).",
      scammerConcedeText:
        "Ya sudah kalau gak mau ambil misi cuannya, slot Level Silver kami berikan ke kandidat lain yang lebih niat cari uang!",
      defenseNotificationText:
        "🛡️ Upaya penipuan task scam berhasil digagalkan. Tabungan Anda aman dari skema deposit bodong bertingkat.",
    },
    forensicSummary: {
      socialEngineeringTactic: "Menawarkan pekerjaan paruh waktu mudah (like/subscribe) dengan komisi bertahap lalu deposit trap (Foot-in-the-Door)",
      forensicTabTitle: "Analisis Forensik Task Scam",
      targetLabel: "Platform & Rekening Penampung",
      targetValue: "PT Media Kreasi Bersama (BCA 829-0192-381) & Bot Telegram Task",
      threatClassification: "Ponzi Task Scam & Advanced Fee Fraud (Tingkat Risiko: 94%)",
      indicatorLabel: "Skema Manipulasi Komisi",
      indicatorValue:
        "Umpan Like Video Rp 30.000 -> Jebakan Misi Merchant Deposit Bertingkat (Rp 500.000 - Rp 5.000.000)",
      attackImpact:
        "Kerugian finansial deposit bertingkat, penahanan dana dengan dalih salah kode misi, dan nomor diblokir setelah korban kehabisan modal",
      officialProcedure:
        "Pekerjaan resmi tidak pernah memungut deposit uang modal kerja. Verifikasi legalitas perusahaan penyedia kerja di portal Kemnaker / OJK",
      psychologicalPressure:
        "Pancingan komisi instan awal, pamer bukti transfer karyawan fiktif, dan jebakan rasa rugi modal tertahan (Foot-in-the-Door & Sunk Cost Fallacy)",
      decisionPointBreached:
        "Tergiur komisi berlipat dan menyetor uang deposit ke rekening sindikat penipu",
      decisionPointSafe:
        "Menolak tawaran like video berbayar tinggi dan segera berhenti saat muncul klausul deposit uang modal",
    },
  },

  "giveaway-marketplace": {
    id: "giveaway-marketplace",
    code: "SKENARIO 07",
    title: "Pemenang Undian Belanja Marketplace",
    personaName: "Admin Hadiah",
    personaRole: "Layanan Promo Berkah / CS Undian",
    personaAvatar: "/avatars/admin_hadiah.jpg",
    personaPhone: "+62 878-1920-3841",
    categoryBadge: "GIVEAWAY PALSU",
    threatTarget: "Biaya Tebusan Hadiah Fiktif (Advance Fee Fraud)",
    backgroundStory:
      "Berdasarkan modus penipuan undian berhadiah mengatasnamakan marketplace terkemuka: Pelaku mengabarkan korban memenangkan hadiah utama iPhone 16 Pro Max dari program undian transaksi berkah. Pelaku mendesak korban segera mentransfer biaya tebusan pajak undian dan asuransi pengiriman sebesar Rp1.250.000 ke rekening pribadi bendahara sebelum batas waktu hangus.",
    initialStepId: "step_1",
    steps: {
      step_1: {
        id: "step_1",
        psychologicalTactic: "Euforia Kemenangan & Ancaman Hangus (Greed & Artificial Scarcity)",
        heuristicTelemetry: {
          indicatorTitle: "Pemberitahuan Pemenang Hadiah via Pesan Pribadi",
          description:
            "Program undian resmi tidak pernah meminta transfer uang pajak di awal via rekening perorangan WhatsApp.",
          riskScore: 93,
        },
        messages: [
          {
            id: "m1",
            sender: "persona",
            text: "SELAMAT! Nomor WhatsApp Anda terpilih sebagai Pemenang Utama Program Undian Berkah Belanja Marketplace 2026. Anda berhak membawa pulang 1 unit iPhone 16 Pro Max 256GB senilai Rp 25.000.000 secara GRATIS!",
            time: "15:10",
          },
          {
            id: "m2",
            sender: "persona",
            text: "Untuk klaim hadiah dan pengiriman nomor resi paket, pemenang hanya diwajibkan menyelesaikan biaya administrasi bea balik nama dan asuransi ekspedisi sebesar Rp 1.250.000 (biaya ini 100% dikembalikan saat barang diterima).",
            time: "15:11",
          },
          {
            id: "m3",
            sender: "persona",
            text: "Transfer sekarang ke rekening bendahara verifikasi hadiah kami: Bank BRI 0281-01-09283-502 an Ahmad Santoso. Batas klaim hanya 1 jam ke depan, lewat dari itu hadiah dialihkan ke pemenang cadangan!",
            time: "15:11",
          },
        ],
        choices: [
          {
            id: "c1_safe",
            label: "Tolak & Ingatkan Regulasi Pajak Hadiah",
            actionText:
              "Undian resmi marketplace tidak pernah memungut biaya tebusan asuransi ke rekening perorangan via WhatsApp. Pajak undian resmi selalu ditanggung penyelenggara atau dipotong resmi dengan surat keterangan Kementerian Sosial. Hadiah ini jelas fiktif!",
            riskLevel: "safe",
            nextStepId: "step_2_confront",
            tacticsRevealed: [
              "Menolak Uang Muka Hadiah",
              "Memahami Ketentuan Pajak Undian Kemensos",
            ],
          },
          {
            id: "c1_inq",
            label: "Minta Potong Biaya dari Nilai Hadiah",
            actionText:
              "Kalau memang saya menang, kenapa biaya Rp1.250.000 itu tidak dipotong langsung dari harga iPhone atau diganti uang tunai saja? Kenapa rekening tujuannya atas nama perorangan Ahmad Santoso?",
            riskLevel: "inquisitive",
            nextStepId: "step_2_persuade",
            tacticsRevealed: [
              "Mempertanyakan Alur Pemotongan Biaya",
              "Mengidentifikasi Rekening Pribadi",
            ],
          },
          {
            id: "c1_fatal",
            label: "Tergiur iPhone Gratis & Transfer Rp1.250.000",
            actionText:
              "Wah alhamdulillah saya menang iPhone 16! Baik admin, saya transfer biaya asuransinya Rp1.250.000 sekarang ke rekening BRI Ahmad Santoso agar hadiah tidak dialihkan.",
            riskLevel: "fatal",
            nextStepId: "outcome_breach",
          },
        ],
      },
      step_2_confront: {
        id: "step_2_confront",
        psychologicalTactic: "Dokumen Legalitas Palsu & Surat Izin Cetak Fiktif",
        heuristicTelemetry: {
          indicatorTitle: "Manipulasi Surat Izin Kemensos & Notaris Palsu",
          description:
            "Pelaku memamerkan sertifikat pemenang berlogo instansi pemerintah yang telah diedit untuk meyakinkan korban.",
          riskScore: 95,
        },
        messages: [
          {
            id: "m4",
            sender: "persona",
            text: "Jangan khawatir kak! Undian kami resmi disahkan oleh Notaris dan Kementerian Sosial RI. Kami kirimkan foto SK Pemenang dan KTP petugas kami sebagai jaminan hukum.",
            time: "15:14",
          },
          {
            id: "m5",
            sender: "persona",
            text: "Uang Rp 1.250.000 itu bukan biaya tebusan kak, tapi syarat validasi sistem BI FAST dan asuransi barang antikorupsi. Begitu barang sampai di tangan kakak besok, uang jaminan Rp 1.250.000 langsung diserahkan kembali oleh kurir dalam amplop tertutup!",
            time: "15:15",
          },
        ],
        choices: [
          {
            id: "c2_safe",
            label: "Bongkar SK Palsu & Laporkan Penipuan",
            actionText:
              "SK Kemensos dan Notaris yang Anda kirim jelas hasil editan Photoshop murahan dengan cap stempel buram. Kurir ekspedisi manapun tidak pernah mengantar amplop uang pengembalian pajak undian. Penipuan Anda sudah terbongkar!",
            riskLevel: "safe",
            nextStepId: "outcome_victory",
            tacticsRevealed: [
              "Membongkar Surat Izin Fiktif",
              "Menangkal Alibi Pengembalian Dana Kurir",
            ],
          },
          {
            id: "c2_fatal",
            label: "Yakin Karena Ada Surat Izin & Transfer",
            actionText:
              "Oh uangnya dibalikin lagi sama kurir ya. Ada surat izin notarisnya juga. Ya sudah saya transfer sekarang Rp1.250.000 ke rekening BRI.",
            riskLevel: "fatal",
            nextStepId: "outcome_breach",
          },
        ],
      },
      step_2_persuade: {
        id: "step_2_persuade",
        psychologicalTactic: "Aturan Fiktif Sistem Akuntansi Perusahaan",
        heuristicTelemetry: {
          indicatorTitle: "Alibi Pembukuan Audit Fiktif",
          description:
            "Pelaku berdalih hadiah berbentuk barang fisik bersegel pabrik sehingga tidak bisa dipotong tunai.",
          riskScore: 91,
        },
        messages: [
          {
            id: "m6",
            sender: "persona",
            text: "Unit iPhone sudah bersegel resmi Apple iBox dan dipacking kayu dalam pengawasan pabean kak, jadi sistem audit tidak membolehkan pembukaan segel untuk dipotong nominalnya.",
            time: "15:14",
          },
          {
            id: "m7",
            sender: "persona",
            text: "Rekening Ahmad Santoso adalah rekening escrow bendahara penjaminan sementara. Waktu kakak tinggal 15 menit lagi sebelum sistem membatalkan status juara kakak secara otomatis!",
            time: "15:15",
          },
        ],
        choices: [
          {
            id: "c3_safe",
            label: "Tegaskan Bahwa Rekening Escrow Palsu",
            actionText:
              "Tidak ada istilah rekening pribadi sebagai escrow penjaminan resmi korporasi marketplace. Rekening perorangan itu murni rekening penampung kejahatan siber (mule account). Saya batalkan dan nomor ini saya laporkan!",
            riskLevel: "safe",
            nextStepId: "outcome_victory",
            tacticsRevealed: [
              "Mengenali Istilah Escrow Palsu",
              "Menghentikan Manipulasi Tenggat Waktu",
            ],
          },
          {
            id: "c3_fatal",
            label: "Panik Batas Waktu 15 Menit & Transfer",
            actionText:
              "Tinggal 15 menit lagi ya! Waduh sayang banget kalau iPhone 16 saya hangus. Saya transfer sekarang uangnya.",
            riskLevel: "fatal",
            nextStepId: "outcome_breach",
          },
        ],
      },
    },
    breachOutcome: {
      headline: "SIMULASI: TERPEDAYA HADIAH GADUNGAN & UANG ASURANSI AMBLAS",
      stolenOtp:
        "BUKTI TRANSFER: 'Transfer sebesar Rp 1.250.000 ke BRI 0281-01-09283-502 an Ahmad Santoso BERHASIL.'",
      drainAmount: "Rp 1.250.000",
      targetAccount: "Rekening Pribadi Penampung Hadiah Fiktif",
      compromisedData: [
        "Uang korban sebesar Rp1.250.000 langsung lenyap ditarik di ATM oleh sindikat penipu.",
        "Pelaku kembali menghubungi korban dan meminta biaya tambahan 'Aktivasi Garansi IMEI Bea Cukai' sebesar Rp2.500.000.",
        "Hadiah iPhone 16 Pro Max tidak pernah ada dan nomor korban langsung diblokir.",
      ],
      lessonLearned:
        "Pemenang undian resmi dari marketplace maupun perusahaan manapun TIDAK AKAN PERNAH diminta mentransfer uang ke rekening pribadi sebelum hadiah dikirim. Pajak hadiah resmi di Indonesia selalu diumumkan secara terbuka di aplikasi resmi dan diverifikasi melalui Dinas Sosial/Kemensos, bukan lewat chat WhatsApp pribadi.",
      systemWarningText:
        "⚠️ [Penipuan Hadiah Fiktif Terdeteksi] Pelaku meminta uang tebusan pengiriman hadiah ke rekening perorangan!",
      drainNotificationText:
        "NOTIFIKASI BANK: Transfer keluar sebesar Rp 1.250.000 ke rekening penipu berhasil. Pelaku kembali meminta biaya IMEI tambahan!",
      scammerExitText:
        "(Uang tebusan Anda diterima penipu. Nomor Anda langsung diblokir dan barang tidak pernah dikirimkan).",
    },
    victoryOutcome: {
      headline: "SIMULASI BERHASIL: ANDA TANGKAL JEBAKAN UNDIAN MARKETPLACE PALSU!",
      score: 100,
      tacticsFoiled: [
        "Membongkar trik hadiah gratis dengan tuntutan uang tebusan di muka (Advance Fee Fraud)",
        "Menolak mentransfer dana ke rekening pribadi mengatasnamakan bendahara",
        "Mengenali dokumen SK Notaris dan izin Kemensos hasil manipulasi visual",
        "Menolak terburu-buru oleh manipulasi batas waktu hangus buatan",
      ],
      keyInsight:
        "Kaidah utama undian berhadiah: Jika Anda harus membayar sejumlah uang terlebih dahulu untuk menerima sebuah hadiah gratis, maka itu 100% adalah PENIPUAN (Advance Fee Scam).",
      scammerConcedeText:
        "Ya sudah kalau gak mau klaim, hadiah iPhone kami serahkan ke pemenang cadangan!",
      defenseNotificationText:
        "🛡️ Upaya penipuan hadiah fiktif berhasil digagalkan. Uang Anda selamat dari modus tebusan giveaway palsu.",
    },
    forensicSummary: {
      socialEngineeringTactic: "Memberikan kabar palsu menang undian smartphone lalu meminta transfer biaya pajak hadiah (Advance Fee Fraud)",
      forensicTabTitle: "Analisis Forensik Modus Undian",
      targetLabel: "Rekening Bendahara Gadungan",
      targetValue: "Bank BRI 0281-01-09283-502 an Ahmad Santoso",
      threatClassification: "Advance Fee Fraud & Lottery Scam (Tingkat Risiko: 93%)",
      indicatorLabel: "Tuntutan Biaya Tebusan",
      indicatorValue: "Biaya Pajak Hadiah & Asuransi Pengiriman Fiktif (Rp 1.250.000)",
      attackImpact:
        "Kerugian finansial biaya tebusan di muka, pemerasan biaya IMEI lanjutan, dan hadiah fiktif tidak pernah ada",
      officialProcedure:
        "Pemberitahuan pemenang undian resmi hanya diumumkan melalui banner aplikasi resmi marketplace atau akun media sosial terverifikasi centang biru",
      psychologicalPressure:
        "Euforia kemenangan barang mewah (iPhone 16) dan ancaman hangus dalam batas waktu 1 jam (Greed & Artificial Urgency)",
      decisionPointBreached:
        "Tergiur hadiah barang mewah dan mentransfer uang tebusan ke rekening pribadi penipu",
      decisionPointSafe:
        "Menolak transfer ke rekening perorangan dan memvalidasi kebenaran undian via aplikasi resmi",
    },
  },

  "titip-dana-kripto": {
    id: "titip-dana-kripto",
    code: "SKENARIO 08",
    title: "Titip Dana Trading Kripto Bodong",
    personaName: "Kevin Pratama",
    personaRole: "Trader Kripto Independen / Pengelola Investasi Kilat",
    personaAvatar: "/avatars/kevin.jpg",
    personaPhone: "+62 852-9102-3918",
    categoryBadge: "INVESTASI ILEGAL",
    threatTarget: "Investasi Ilegal Tanpa Izin OJK (Pig Butchering)",
    backgroundStory:
      "Berdasarkan modus kejahatan investasi ilegal titip dana trading kripto: Pelaku memamerkan tangkapan layar profit harian 15% tanpa risiko dan saldo ratusan juta di media sosial, lalu membujuk korban menitipkan dana modal mulai Rp1.000.000 ke platform trading fiktif tidak berizin Bappebti/OJK. Setelah dana masuk, grafik trading dimanipulasi seolah-olah profit besar, namun saat korban ingin menarik dana (withdrawal), pelaku mengunci akun dan menuntut transfer uang pajak tambahan.",
    initialStepId: "step_1",
    steps: {
      step_1: {
        id: "step_1",
        psychologicalTactic: "Iming-iming Profit Pasti Tanpa Risiko (Unrealistic ROI & Greed Pretexting)",
        heuristicTelemetry: {
          indicatorTitle: "Klaim Profit Harian Tetap 15% Tanpa Risiko",
          description:
            "Dalam dunia investasi legal, tidak ada instrumen finansial yang dapat menjamin profit pasti 15% setiap hari tanpa risiko rugi.",
          riskScore: 97,
        },
        messages: [
          {
            id: "m1",
            sender: "persona",
            text: "Halo bro! Salam cuan! Gue Kevin, admin channel Signal Crypto VIP Indonesia. Kemarin gue liat lu follow akun edukasi trading gue di medsos.",
            time: "19:40",
          },
          {
            id: "m2",
            sender: "persona",
            text: "Lagi ada program eksklusif 'Titip Dana Trading Bot AI' nih bro buat 5 slot tercepat. Cukup setor modal minimal Rp 1.000.000, bot trading kami jamin profit pasti 15% per hari tanpa risiko rugi sama sekali (garansi modal 100% aman).",
            time: "19:41",
          },
          {
            id: "m3",
            sender: "persona",
            text: "Nih gue kirim bukti pencairan profit member kami tadi sore yang titip 5 juta dapet profit 750 ribu dalam 6 jam: https://crypto-asset-global.xyz/bukti-cuan. Kalau mau gabung slot hari ini tinggal transfer modal ke dompet rekening penjamin kami bro.",
            time: "19:41",
          },
        ],
        choices: [
          {
            id: "c1_safe",
            label: "Bongkar Skema Ponzi & Izin Bappebti/OJK",
            actionText:
              "Janji profit pasti 15% per hari tanpa risiko adalah ciri mutlak investasi bodong skema Ponzi. Semua pedagang aset kripto di Indonesia wajib terdaftar resmi di Bappebti dan OJK. Menitipkan dana ke rekening pribadi adalah tindakan ilegal!",
            riskLevel: "safe",
            nextStepId: "step_2_confront",
            tacticsRevealed: [
              "Mengenali Ciri Investasi Bodong",
              "Menuntut Izin Resmi Bappebti/OJK",
            ],
          },
          {
            id: "c1_inq",
            label: "Tanya Sistem Trading & Legalitas Kantor",
            actionText:
              "Kok bisa jamin profit pasti 15% per hari bro padahal pasar kripto sangat volatil? Platform tradingnya apa dan legalitas perusahaannya di Bappebti bagaimana?",
            riskLevel: "inquisitive",
            nextStepId: "step_2_persuade",
            tacticsRevealed: [
              "Mempertanyakan Rasionalitas Finansial",
              "Meminta Bukti Regulasi Pasar",
            ],
          },
          {
            id: "c1_fatal",
            label: "Tergiur Cuan Kilat & Transfer Modal Rp1.000.000",
            actionText:
              "Mantap banget bro profit 15% sehari! Gue mau coba slot minimal Rp1.000.000 dulu deh bro, tolong kirim nomor rekeningnya sekarang biar botnya langsung jalan.",
            riskLevel: "fatal",
            nextStepId: "step_2_wd_trap",
          },
        ],
      },
      step_2_confront: {
        id: "step_2_confront",
        psychologicalTactic: "Alibi Pasar Internasional & Pamer Kemewahan (Flexing)",
        heuristicTelemetry: {
          indicatorTitle: "Pengaburan Yuridiksi Hukum Global",
          description:
            "Pelaku mengklaim platform beroperasi di luar yurisdiksi Indonesia untuk menghindari hukum Bappebti/OJK.",
          riskScore: 96,
        },
        messages: [
          {
            id: "m4",
            sender: "persona",
            text: "Aduh bro, OJK dan Bappebti mah regulasi lokal konvensional yang kaku! Server bot AI kami terdaftar di broker internasional Cayman Islands dan menggunakan algoritma arbitrase kuantum.",
            time: "19:44",
          },
          {
            id: "m5",
            sender: "persona",
            text: "Gue sendiri udah nikmatin hasilnya bro, dari modal puluhan juta sekarang udah kebeli BMW dan apartemen dari trading ini. Kalau lu kebanyakan mikir ragu-ragu terus, lu bakal ketinggalan cuan selamanya di saat orang lain udah pasif income!",
            time: "19:45",
          },
        ],
        choices: [
          {
            id: "c2_safe",
            label: "Tolak Alibi Luar Negeri & Blokir",
            actionText:
              "Dalih broker luar negeri tanpa kantor di Indonesia adalah modus klasik agar uang korban tidak bisa dilacak penegak hukum saat kabur. Flexing mobil dan apartemen itu sewaan sindikat. Saya tidak akan buang uang untuk penipuan Anda!",
            riskLevel: "safe",
            nextStepId: "outcome_victory",
            tacticsRevealed: [
              "Membongkar Alibi Broker Offshore",
              "Menolak Manipulasi FOMO & Flexing",
            ],
          },
          {
            id: "c2_fatal",
            label: "Kena FOMO & Setor Modal Rp1.000.000",
            actionText:
              "Bener juga ya, mumpung botnya lagi bagus. Daripada nyesel ketinggalan cuan. Oke bro Kevin gue transfer modal Rp1.000.000 sekarang.",
            riskLevel: "fatal",
            nextStepId: "step_2_wd_trap",
          },
        ],
      },
      step_2_persuade: {
        id: "step_2_persuade",
        psychologicalTactic: "Jaminan Garansi Uang Kembali (False Safety Net)",
        heuristicTelemetry: {
          indicatorTitle: "Garansi Finansial Sepihak Tanpa Akta Notaris",
          description:
            "Pelaku memberikan garansi lisan bahwa modal korban 100% aman dan bisa ditarik kapan saja.",
          riskScore: 93,
        },
        messages: [
          {
            id: "m6",
            sender: "persona",
            text: "Sistem kami pake stop-loss otomatis di level mikro detik bro, jadi gak mungkin ada floating minus. Kalau sampai ada kerugian teknis, dana modal lu gue garansi ganti 100% dari kantong pribadi gue.",
            time: "19:44",
          },
          {
            id: "m7",
            sender: "persona",
            text: "Lu coba aja tes modal kecil 1 juta hari ini. Besok sore lu langsung bisa tarik modal pokok 1 juta plus profitnya Rp 150.000 ke rekening lu. Gak ada komitmen kontrak mengikat sama sekali.",
            time: "19:45",
          },
        ],
        choices: [
          {
            id: "c3_safe",
            label: "Tegaskan Garansi Pribadi Tidak Sah Secara Hukum",
            actionText:
              "Garansi lisan di chat WhatsApp sama sekali tidak memiliki kekuatan hukum. Begitu uang ditransfer ke rekening pribadi Anda, uang itu sudah hilang kendali. Satgas PASTI OJK sudah memasukkan modus titip dana kripto sebagai tindak pidana pencucian uang!",
            riskLevel: "safe",
            nextStepId: "outcome_victory",
            tacticsRevealed: [
              "Menolak Garansi Palsu Lisan",
              "Memahami Aspek Perlindungan Konsumen OJK",
            ],
          },
          {
            id: "c3_fatal",
            label: "Percaya Garansi Pribadi & Transfer",
            actionText:
              "Ada garansi ganti rugi pribadi ya. Yaudah gue tenang kalau gitu. Gue coba tes setor 1 juta ya bro sekarang.",
            riskLevel: "fatal",
            nextStepId: "step_2_wd_trap",
          },
        ],
      },
      step_2_wd_trap: {
        id: "step_2_wd_trap",
        psychologicalTactic: "Jebakan Pajak Penarikan Dana (Withdrawal Tax Extortion)",
        heuristicTelemetry: {
          indicatorTitle: "Penguncian Dana & Tuntutan Pajak Fiktif",
          description:
            "Pelaku memanipulasi saldo korban di web fiktif menjadi puluhan juta, lalu menuntut transfer pajak penarikan 20% sebelum dana dicairkan.",
          riskScore: 99,
        },
        messages: [
          {
            id: "m8",
            sender: "persona",
            text: "Gokil bro! Lu hoki banget, tadi malem pasar koin meledak dan modal 1 juta lu di bot sekarang udah berubah jadi Rp 18.500.000 di dashboard akun lu!",
            time: "19:48",
          },
          {
            id: "m9",
            sender: "persona",
            text: "Nah tapi untuk proses pencairan (withdrawal) dana Rp 18.500.000 ke rekening bank lu, sistem smart contract memerlukan deposit 'Pajak Kliring Kripto 20%' sebesar Rp 3.700.000 ke rekening bendahara trading. Begitu pajak dibayar, total Rp 22.200.000 langsung cair sekaligus ke rekening lu!",
            time: "19:49",
          },
        ],
        choices: [
          {
            id: "c4_safe",
            label: "Sadar Saldo Dashboard Palsu & Berhenti",
            actionText:
              "Ini dia trik penipuan Pig Butchering! Angka Rp18.500.000 di web itu cuma simulasi angka bohongan yang bisa diketik siapa saja! Penarikan dana di bursa legal dipotong otomatis dari saldo, bukan malah meminta nasabah transfer uang pajak tambahan! Saya stop dan laporkan rekening Anda ke polisi!",
            riskLevel: "safe",
            nextStepId: "outcome_victory",
            tacticsRevealed: [
              "Mengenali Skema Pig Butchering",
              "Menolak Transfer Pajak Withdrawal Fiktif",
            ],
          },
          {
            id: "c4_fatal",
            label: "Transfer Uang Pajak Rp3.700.000 Demi Cair",
            actionText:
              "Wah 18 juta rupiah! Banyak banget cuannya! Oke bro Kevin saya transfer uang pajak Rp3.700.000 sekarang ke rekening bendahara biar uang 18 juta saya bisa langsung cair.",
            riskLevel: "fatal",
            nextStepId: "outcome_breach",
          },
        ],
      },
    },
    breachOutcome: {
      headline: "SIMULASI: TERJEBAK SKEMA PIG BUTCHERING & SELURUH MODAL AMBLAS",
      stolenOtp:
        "BUKTI TRANSFER: 'Transfer modal Rp 1.000.000 + Biaya Pajak WD Rp 3.700.000 ke rekening Kevin Pratama BERHASIL.'",
      drainAmount: "Rp 4.700.000",
      targetAccount: "Rekening Penampung Titip Dana Bodong (BCA / CIMB Niaga)",
      compromisedData: [
        "Modal awal Rp1.000.000 dan uang tebusan pajak pencairan Rp3.700.000 amblas ke kantong pelaku.",
        "Dashboard situs trading fiktif langsung menampilkan error 'Akun Disuspend karena Pelanggaran AML'.",
        "Pelaku menghapus seluruh riwayat chat Telegram dan nomor WhatsApp korban langsung diblokir.",
      ],
      lessonLearned:
        "TIDAK ADA investasi legal yang menjamin profit pasti harian tanpa risiko rugi. Bursa kripto resmi yang terdaftar di Bappebti (seperti Indodax, Tokocrypto, Pintu) TIDAK PERNAH mengumpulkan dana lewat titip dana rekening perorangan dan TIDAK PERNAH meminta transfer uang terpisah untuk membayar pajak penarikan saldo.",
      systemWarningText:
        "⚠️ [Investasi Kripto Ilegal Terdeteksi] Skema penipuan Pig Butchering dengan penguncian dana dan pemerasan biaya pajak pencairan!",
      drainNotificationText:
        "NOTIFIKASI BANK: Transfer keluar sebesar Rp 4.700.000 ke penipu titip dana kripto berhasil. Saldo modal dan profit fiktif lenyap tak berbekas!",
      scammerExitText:
        "(Akun Anda di situs trading dibekukan dan nomor WhatsApp Anda langsung diblokir permanen oleh pelaku).",
    },
    victoryOutcome: {
      headline: "SIMULASI BERHASIL: ANDA TANGKAL JEBAKAN INVESTASI KRIPTO BODONG!",
      score: 100,
      tacticsFoiled: [
        "Menolak klaim profit pasti 15% per hari tanpa risiko",
        "Mengetahui kewajiban legalitas Bappebti dan OJK bagi penyelenggara aset kripto",
        "Membongkar alibi broker offshore dan flexing gaya hidup mewah",
        "Mendeteksi skema penipuan Pig Butchering pada jebakan pajak pencairan dana (Withdrawal Tax)",
      ],
      keyInsight:
        "Kaidah emas investasi: Semakin tinggi janji keuntungan yang ditawarkan, semakin tinggi pula risikonya (High Risk, High Return). Jika ada pihak yang menjamin keuntungan tinggi TANPA RISIKO, dapat dipastikan 100% itu adalah investasi bodong.",
      scammerConcedeText:
        "Yaudah kalau lu mental miskin gamau diajarin kaya, jangan nyesel liat temen-temen lu sukses duluan!",
      defenseNotificationText:
        "🛡️ Upaya penipuan titip dana kripto bodong berhasil digagalkan. Tabungan Anda aman dari jeratan skema Ponzi.",
    },
    forensicSummary: {
      socialEngineeringTactic: "Flexing kekayaan fiktif dan menjanjikan keuntungan pasti 15%/hari tanpa risiko rugi (Pig Butchering Scam)",
      forensicTabTitle: "Analisis Forensik Investasi Bodong",
      targetLabel: "Platform Trading & Dompet Penampung",
      targetValue: "crypto-asset-global.xyz & Rekening BCA an Kevin Pratama",
      threatClassification: "Pig Butchering Crypto Scam & Illegal Investment (Tingkat Risiko: 97%)",
      indicatorLabel: "Ciri Investasi Ilegal",
      indicatorValue:
        "Janji Profit Pasti 15%/hari + Tuntutan Transfer Pajak Withdrawal Fiktif 20%",
      attackImpact:
        "Total modal korban hilang, angka saldo profit dimanipulasi secara fiktif di web penipu, dan rekening diblokir saat mencoba menarik dana",
      officialProcedure:
        "Hanya berinvestasi kripto pada Calon Pedagang Fisik Aset Kripto (CPFAK) yang resmi terdaftar di Bappebti (cek di bappebti.go.id) dan OJK",
      psychologicalPressure:
        "Keserakahan profit cepat, flexing kekayaan di media sosial, dan manipulasi rasa takut tertinggal peluang (Greed & Fear of Missing Out / FOMO)",
      decisionPointBreached:
        "Tergiur iming-iming profit tanpa risiko dan mentransfer modal ke rekening perorangan",
      decisionPointSafe:
        "Menegaskan kewajiban izin Bappebti/OJK, membongkar manipulasi angka profit fiktif, dan menolak mentransfer uang pajak pencairan",
    },
  },
};
