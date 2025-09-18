import type {Metadata, Viewport} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { PWAInstaller } from '@/components/pwa-installer';

const appUrl = 'https://qrick.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'QRick - Free QR Code & Barcode Generator',
  description: 'Create, customize, and download high-quality QR codes and barcodes for free. Supports various data types including URLs, vCards, Wi-Fi, and social media links.',
  keywords: ['QR code generator', 'barcode generator', 'free qr code', 'custom qr code', 'vcard qr code', 'wifi qr code', 'barcode maker', 'online qr code'],
  applicationName: 'QRick',
  authors: [{ name: 'Camly', url: appUrl }],
  creator: 'Camly',
  publisher: 'Vercel',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: appUrl,
  },
  openGraph: {
    title: 'QRick - Free QR Code & Barcode Generator',
    description: 'Design professional, custom QR codes and barcodes in seconds. Easy to use, free to download, and ready for anything.',
    url: appUrl,
    siteName: 'QRick',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'QRick Promotional Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
   twitter: {
    card: 'summary_large_image',
    title: 'QRick - Free QR Code & Barcode Generator',
    description: 'Design professional, custom QR codes and barcodes in seconds. Easy to use, free to download, and ready for anything.',
    images: [`${appUrl}/og-image.png`],
    creator: '@vercel',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  'name': 'QRick',
  'operatingSystem': 'WEB',
  'applicationCategory': 'Utilities',
  'aggregateRating': {
    '@type': 'AggregateRating',
    'ratingValue': '4.9',
    'ratingCount': '8864',
  },
  'offers': {
    '@type': 'Offer',
    'price': '0',
    'priceCurrency': 'USD',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <head>
      <meta name="google-site-verification" content="vAXaQAf1AwfzrK402zrQbne-DlogUKuiHaQAWg7P09A" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground flex flex-col min-h-screen">
        <PWAInstaller />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
