import type { Metadata } from "next";
import Script from 'next/script';
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { UsersProvider } from "@/context/UsersContext";
import { ConversationsProvider } from "@/context/ConversationsContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", weight: ["400", "500", "600"] });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-serif", weight: ["300", "400", "500", "600"] });

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://webelong.world'

export const metadata: Metadata = {
  metadataBase: new URL('https://webelong.world'),
  title: {
    default: 'Webelong',
    template: '%s — Webelong',
  },
  description:
    'You belong, even here!',
  keywords: [
    'mental health',
    'belonging',
    'emotional support',
    'safe social platform',
    'anonymous support',
    'human connection',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Webelong',
    description:
      'You belong, even here!',
    url: BASE_URL,
    siteName: 'Webelong',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Webelong',
    description:
      'You belong, even here!',
    images: ['/og.png'],
  },
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fraunces.variable} font-sans bg-[#F7F5F2] text-webelong-text antialiased`}>
        <AuthProvider>
          <UsersProvider>
            <ConversationsProvider>
              {children}
            </ConversationsProvider>
          </UsersProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  anonymize_ip: true,
                });
              `}
            </Script>
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Webelong",
              "url": "https://webelong.world",
              "logo": "https://webelong.world/icon",
              "sameAs": []
            })
          }}
        />
      </body>
    </html>
  );
}
