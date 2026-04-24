import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const notoSerifTC = Noto_Serif_TC({
  variable: "--font-noto-serif-tc",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "AIRDA | 人工智慧與機器人發展協會",
  description:
    "人工智慧與機器人發展協會 — 推動 AI 與機器人技術的創新、教育與產學合作。Artificial Intelligence and Robotics Development Association.",
  keywords: [
    "AIRDA",
    "人工智慧",
    "機器人",
    "AI 教育",
    "機器人競賽",
    "Matrix Mini R4",
    "STEM",
    "產學合作",
    "教案產生器",
  ],
  openGraph: {
    title: "AIRDA | 人工智慧與機器人發展協會",
    description: "推動 AI 與機器人技術的創新、教育與產學合作",
    siteName: "AIRDA",
    locale: "zh_TW",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIRDA | 人工智慧與機器人發展協會",
    description: "推動 AI 與機器人技術的創新、教育與產學合作",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hant"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansTC.variable} ${notoSerifTC.variable} antialiased`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
