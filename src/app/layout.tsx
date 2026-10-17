import Footer from "@/app/_components/footer";
import {
  PAGE_NAME,
  HOME_OG_IMAGE_URL,
  SITE_URL,
  SITE_TITLE,
  SITE_DESCRIPTION,
} from "@/lib/constants";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${PAGE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: PAGE_NAME,
    locale: "sk_SK",
    images: [HOME_OG_IMAGE_URL],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk">
      <head>
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="theme-color" content="#000" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen">{children}</div>
        <Analytics />
        <Footer />
      </body>
    </html>
  );
}
