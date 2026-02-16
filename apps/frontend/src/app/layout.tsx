import type { Metadata } from "next";
import Script from 'next/script';
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { UsersProvider } from "@/context/UsersContext";
import { ConversationsProvider } from "@/context/ConversationsContext";
import { ThemeProvider } from "@/components/providers/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const lora = Lora({ subsets: ["latin"], variable: "--font-heading" });

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://webelong.world'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Webelong — You belong. Even here.',
    template: '%s — Webelong',
  },
  description:
    'Webelong is a belonging-first social platform designed for emotional safety, honest expression, and human connection.',
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
    title: 'Webelong — You belong. Even here.',
    description:
      'A belonging-first social platform for emotional safety and real human connection.',
    url: BASE_URL,
    siteName: 'Webelong',
    images: [
      {
        url: '/og',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Webelong — You belong. Even here.',
    description:
      'A belonging-first social platform for emotional safety and human connection.',
    images: ['/og'],
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${lora.variable} font-body`}>
        <AuthProvider>
          <UsersProvider>
            <ConversationsProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
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
