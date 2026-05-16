import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Playfair_Display, Poppins } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});


export const metadata: Metadata = {
  metadataBase: new URL('https://garasicetak.com'),
  title: "Garasi Cetak",
  description: "Platform pembuatan undangan digital terbaik untuk Pernikahan, Khitanan, Ulang Tahun, dan Aqiqah. Desain eksklusif, fitur lengkap, dan sebar tanpa batas.",
  keywords: ["undangan digital", "undangan online", "undangan pernikahan", "wedding website", "garasi cetak", "undangan khitanan digital", "undangan aqiqah", "buat undangan digital"],
  authors: [{ name: "Garasi Cetak" }],
  openGraph: {
    title: "Garasi Cetak | Undangan Digital Premium",
    description: "Buat momen spesialmu lebih berkesan dengan undangan digital elegan dari Garasi Cetak. Praktis, cantik, dan sebar tanpa batas.",
    url: "https://garasicetak.com",
    siteName: "Garasi Cetak",
    images: [
      {
        url: "/images/mockup.png",
        width: 1200,
        height: 630,
        alt: "Katalog Undangan Digital Garasi Cetak",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  icons: {
    icon: [
      { url: '/images/logo.png' },
      { url: '/images/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: ['/images/logo.png'],
    apple: [
      { url: '/images/logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};


export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import TopProgressBar from "@/components/TopProgressBar";
import { Suspense } from "react";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
          <Suspense fallback={null}>
            <TopProgressBar />
          </Suspense>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "url": "https://garasicetak.com",
                "logo": "https://garasicetak.com/images/logo.png"
              })
            }}
          />
          {children}
          <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
