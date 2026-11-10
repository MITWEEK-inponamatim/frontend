import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const ppNeueMontreal = localFont({
  src: [
    {
      path: "../../public/font/ppneuemontreal-thin.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/font/ppneuemontreal-book.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/font/ppneuemontreal-medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/font/ppneuemontreal-bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/font/ppneuemontreal-italic.woff",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/font/ppneuemontreal-semibolditalic.woff",
      weight: "600",
      style: "italic",
    },
  ],
  variable: "--font-pp-neue-montreal",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ThreatLens - Platform AI Anti-Scam",
    template: "%s | ThreatLens",
  },
  description: "Platform deteksi dan mitigasi penipuan digital berbasis kecerdasan buatan. Kenali ancaman pada tautan, file APK, dan nomor telepon.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${ppNeueMontreal.variable} h-full antialiased`}>
      <body className={`${ppNeueMontreal.className} min-h-full flex flex-col bg-white text-slate-900 selection:bg-red-100 selection:text-red-900 font-sans`}>
        {children}
      </body>
    </html>
  );
}
