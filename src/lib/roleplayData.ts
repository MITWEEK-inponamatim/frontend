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
  },
};
