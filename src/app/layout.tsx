import type { Metadata, Viewport } from "next";
import { Geist_Mono, Noto_Sans_Thai, Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const notoThai = Noto_Sans_Thai({
  variable: "--font-thai",
  subsets: ["thai"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "English — Learn • Practice • Improve",
  description: "Practice English vocabulary with quizzes and flash cards.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${notoThai.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans text-slate-800">
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  );
}
