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
};

export type VictoryData = {
  headline: string;
  score: number;
  tacticsFoiled: string[];
  keyInsight: string;
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
    },
  },
};

