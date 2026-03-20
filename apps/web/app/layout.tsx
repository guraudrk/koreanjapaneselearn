import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/components/providers/LocaleProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LinguaBridge — Learn Korean & Japanese Together",
  description: "The only platform where you learn Korean and Japanese simultaneously. Compare, contrast, and master both languages with AI-powered guidance.",
  openGraph: {
    title: "LinguaBridge — Learn Korean & Japanese Together",
    description: "Master Korean and Japanese at once with smart comparison learning.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
