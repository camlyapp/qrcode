import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'QRick - Free QR Code & Barcode Generator',
  description: 'Create, customize, and download high-quality QR codes and barcodes for free. Supports various data types including URLs, vCards, Wi-Fi, and social media links.',
  keywords: ['QR code generator', 'barcode generator', 'free qr code', 'custom qr code', 'vcard qr code', 'wifi qr code'],
  openGraph: {
    title: 'QRick - Free QR Code & Barcode Generator',
    description: 'Design professional, custom QR codes and barcodes in seconds. Easy to use, free to download, and ready for anything.',
    url: 'https://qrick.io', // replace with your actual domain
    siteName: 'QRick',
    images: [
      {
        url: 'https://qrick.io/og-image.png', // replace with your actual og image url
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
   twitter: {
    card: 'summary_large_image',
    title: 'QRick - Free QR Code & Barcode Generator',
    description: 'Design professional, custom QR codes and barcodes in seconds. Easy to use, free to download, and ready for anything.',
    images: ['https://qrick.io/og-image.png'], // replace with your actual og image url
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground flex flex-col min-h-screen">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
