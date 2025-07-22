import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { getSEOTitle, getSEODescription, BRAND } from "@/lib/brand";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: getSEOTitle(),
  description: getSEODescription(),
  keywords: "luxury travel, tours, destinations, vacation packages, travel booking",
  authors: [{ name: BRAND.name }],
  creator: BRAND.name,
  publisher: BRAND.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(BRAND.siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BRAND.siteUrl,
    title: getSEOTitle(),
    description: getSEODescription(),
    siteName: BRAND.name,
    images: [
      {
        url: BRAND.defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${BRAND.name} - ${BRAND.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: getSEOTitle(),
    description: getSEODescription(),
    images: [BRAND.defaultOgImage],
    creator: "@traveladdict",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
