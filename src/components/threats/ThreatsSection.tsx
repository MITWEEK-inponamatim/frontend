import React from "react";
import { Icon } from "@/components/ui/Icon";

interface ThreatItem {
  icon: string;
  title: string;
  description: string;
  actionText: string;
}

const THREATS: ThreatItem[] = [
  {
    icon: "solar:letter-unread-bold-duotone",
    title: "APK Sniffer & Undangan",
    description:
      "Aplikasi manipulatif berkedok undangan, paket, atau surat tilang yang menyadap izin SMS untuk mencuri kode OTP.",
    actionText: "Pelajari Ciri",
  },
  {
    icon: "solar:link-circle-bold-duotone",
    title: "Phishing Tautan Bank",
    description:
      "Halaman tiruan antarmuka resmi perbankan yang dirancang untuk mengelabui korban agar menginput PIN & password akun.",
    actionText: "Cek Domain",
  },
  {
    icon: "solar:shield-warning-bold-duotone",
    title: "Social Engineering OTP",
    description:
      "Panggilan darurat atau pesan intimidasi dari penipu yang menyamar sebagai otoritas resmi untuk mendesak transfer dana.",
    actionText: "SOP Pencegahan",
  },
  {
    icon: "solar:bill-list-bold-duotone",
    title: "Struk Transfer Fiktif",
    description:
      "Bukti bayar digital atau mutasi rekening hasil suntingan grafis untuk menipu pedagang dan merchant online.",
    actionText: "Verifikasi Mutasi",
  },
];

export function ThreatsSection() {
  return (
    <section className="w-full bg-white text-slate-900 border-t border-gray-100 py-16 sm:py-24 px-4 sm:px-8 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-0">
          {/* Left Column: Heading & Description (Persis Layout Foto 1) */}
          <div className="lg:col-span-4 lg:pr-12 flex flex-col justify-start text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-4">
              Modus Penipuan
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              Pelajari pola kejahatan siber yang paling sering menargetkan korban melalui pesan instan dan manipulasi psikologis.
            </p>
          </div>

          {/* Right Columns: 2x2 Grid dengan Hairline Borders (Persis Layout Foto 1) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 border-t sm:border-t-0 sm:border-l border-gray-100">
            {THREATS.map((item, idx) => {
              // Menyesuaikan garis pembatas grid 2x2
              const borderRight = idx % 2 === 0 ? "sm:border-r border-gray-100" : "";
              const borderBottom = idx < 2 ? "border-b border-gray-100" : "max-sm:border-b border-gray-100";

              return (
                <div
                  key={idx}
                  className={`p-6 sm:p-8 flex flex-col justify-between text-left ${borderRight} ${borderBottom}`}
                >
                  <div>
                    {/* Circular Lime Accent Icon */}
                    <div className="w-9 h-9 rounded-full bg-[#d9f94a] text-slate-950 flex items-center justify-center mb-5 shrink-0">
                      <Icon icon={item.icon} className="w-5 h-5" />
                    </div>

                    <h3 className="text-base sm:text-lg font-medium text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed mb-6">
                      {item.description}
                    </p>
                  </div>

                  {/* Clean Pill Button */}
                  <div>
                    <span className="inline-block text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-1.5 rounded-full font-normal transition-colors cursor-pointer">
                      {item.actionText}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
