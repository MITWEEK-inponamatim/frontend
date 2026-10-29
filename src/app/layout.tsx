import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anti-Scam AI Platform | Recognize, Learn, Act",
  description: "Advanced AI-powered Scam Detection Platform. Recognize threats in links, APKs, files, and images.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://db.onlinewebfonts.com/c/4366ceae6f7564999a0f0c3e8698a4ad?family=Neue+Montreal"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-slate-900 selection:bg-red-100 selection:text-red-900">
        {children}
      </body>
    </html>
  );
}
