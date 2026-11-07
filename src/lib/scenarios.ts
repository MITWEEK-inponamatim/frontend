export type RoleplayScenario = {
  id: string;
  code: string;
  title: string;
  personaName: string;
  personaRole: string;
  categoryBadge: string;
  headerTint: string;
  avatarColor: string;
  avatarInitial: string;
  avatarUrl?: string | null;
  description: string;
  duration: string;
  threatTarget: string;
};

export const ROLEPLAY_SCENARIOS: RoleplayScenario[] = [
  {
    id: "resi-paket-apk",
    code: "SKENARIO 01",
    title: "Percakapan dengan Kurir J&T Palsu",
    personaName: "Rudi Kurniawan",
    personaRole: "Kurir Lapangan Gadungan",
    categoryBadge: "SNIFFER SMS APK",
    headerTint: "bg-[#fff1f2]",
    avatarColor: "bg-rose-100 text-rose-800",
    avatarInitial: "RK",
    avatarUrl: "/avatars/rudi.jpg",
    description:
      "Penipu mendesak Anda memeriksa resi foto yang sebenarnya file APK sniffer untuk menyadap SMS OTP perbankan.",
    duration: "3 Menit",
    threatTarget: "Penyadapan SMS OTP Perbankan",
  },
  {
    id: "tarif-bank-phishing",
    code: "SKENARIO 02",
    title: "Panggilan CS Bank BCA Palsu",
    personaName: "Sari Wulandari",
    personaRole: "Customer Service Priority Palsu",
    categoryBadge: "PHISHING BANK",
    headerTint: "bg-[#fffbeb]",
    avatarColor: "bg-amber-100 text-amber-800",
    avatarInitial: "SW",
    avatarUrl: "/avatars/sari.jpg",
    description:
      "Penipu mengancam pemotongan biaya Rp150.000/bulan jika Anda tidak segera mengisi formulir pembatalan di link palsu.",
    duration: "4 Menit",
    threatTarget: "Kredensial & PIN Mobile Banking",
  },
  {
    id: "undangan-nikah-digital",
    code: "SKENARIO 03",
    title: "Undangan Pernikahan Teman Lama",
    personaName: "Rian Pratama",
    personaRole: "Akun WhatsApp Dibajak",
    categoryBadge: "REKAYASA SOSIAL",
    headerTint: "bg-[#f0fdf4]",
    avatarColor: "bg-emerald-100 text-emerald-800",
    avatarInitial: "RP",
    avatarUrl: "/avatars/rian.jpg",
    description:
      "Akun kenalan mengirimkan surat undangan digital berkedok APK yang meminta izin akses penuh ke perangkat Anda.",
    duration: "2 Menit",
    threatTarget: "Aksesibilitas & Izin Trojan",
  },
  {
    id: "salah-transfer-pinjol",
    code: "SKENARIO 04",
    title: "Teror Salah Transfer Pinjol Ilegal",
    personaName: "Hendro Wijaya",
    personaRole: "Penagih Dana Eksternal",
    categoryBadge: "PEMERASAN DANA",
    headerTint: "bg-[#f8fafc]",
    avatarColor: "bg-slate-200 text-slate-800",
    avatarInitial: "HW",
    avatarUrl: "/avatars/hendro.jpg",
    description:
      "Penipu mengaku salah transfer Rp2.500.000 dan mengintimidasi Anda membayar bunga pemerasan sebesar 30% hari ini.",
    duration: "5 Menit",
    threatTarget: "Pemerasan Berkedok Pinjol",
  },
  {
    id: "surat-tilang-etle",
    code: "SKENARIO 05",
    title: "Pemberitahuan Surat Tilang ETLE",
    personaName: "Bripka Anton",
    personaRole: "Petugas Tilang Siber Palsu",
    categoryBadge: "MALWARE ETLE",
    headerTint: "bg-[#f0f4ff]",
    avatarColor: "bg-blue-100 text-blue-800",
    avatarInitial: "BA",
    avatarUrl: "/avatars/anton.jpg",
    description:
      "Mengirimkan dokumen konfirmasi tilang elektronik palsu dalam format APK berkedok surat pelanggaran lalu lintas.",
    duration: "3 Menit",
    threatTarget: "Penyusupan Trojan Remote Access",
  },
  {
    id: "freelance-job-bodong",
    code: "SKENARIO 06",
    title: "Wawancara Kerja Freelance Bodong",
    personaName: "Jessica Tan",
    personaRole: "Talent Acquisition Global",
    categoryBadge: "LOWONGAN FIKTIF",
    headerTint: "bg-[#faf5ff]",
    avatarColor: "bg-purple-100 text-purple-800",
    avatarInitial: "JT",
    avatarUrl: "/avatars/jessica.jpg",
    description:
      "Menawarkan komisi mudah like & subscribe video, namun meminta deposit saldo bertingkat yang tidak dapat ditarik kembali.",
    duration: "4 Menit",
    threatTarget: "Skema Deposit Bertingkat (Ponzi)",
  },
  {
    id: "giveaway-marketplace",
    code: "SKENARIO 07",
    title: "Pemenang Undian Belanja Marketplace",
    personaName: "Admin Hadiah",
    personaRole: "Layanan Promo Berkah",
    categoryBadge: "GIVEAWAY PALSU",
    headerTint: "bg-[#fff7ed]",
    avatarColor: "bg-orange-100 text-orange-800",
    avatarInitial: "AH",
    avatarUrl: "/avatars/admin_hadiah.jpg",
    description:
      "Menyatakan Anda memenangkan hadiah iPhone 16 gratis dan meminta transfer biaya asuransi pengiriman terlebih dahulu.",
    duration: "3 Menit",
    threatTarget: "Biaya Tebusan Hadiah Fiktif",
  },
  {
    id: "titip-dana-kripto",
    code: "SKENARIO 08",
    title: "Titip Dana Trading Kripto Bodong",
    personaName: "Kevin Pratama",
    personaRole: "Trader Kripto Independen",
    categoryBadge: "INVESTASI ILEGAL",
    headerTint: "bg-[#ecfeff]",
    avatarColor: "bg-cyan-100 text-cyan-800",
    avatarInitial: "KP",
    avatarUrl: "/avatars/kevin.jpg",
    description:
      "Menjanjikan profit harian 15% tanpa risiko melalui grup Telegram privat dan aplikasi investasi tidak berizin OJK.",
    duration: "5 Menit",
    threatTarget: "Investasi Ilegal Tanpa Izin OJK",
  },
];
