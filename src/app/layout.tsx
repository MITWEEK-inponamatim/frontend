import type { Metadata } from "next";
import { Montserrat, Agdasima } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const agdasima = Agdasima({
  subsets: ["latin"],
  variable: "--font-agdasima",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Anti-Scam Platform | Recognize, Learn, Act",
  description: "Advanced AI-powered Scam Detection Platform. Recognize threats in links, APKs, files, and images.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${agdasima.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-slate-900 selection:bg-red-100 selection:text-red-900">
        {children}
      </body>
    </html>
  );
}
