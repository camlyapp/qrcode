import type { Metadata } from 'next';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { QrCode, Barcode, Palette, Download, Share2, CreditCard, Wifi, User, Calendar, MessageSquare, Text, Phone, Mail, MapPin, Instagram, Facebook, Linkedin, Twitter, Youtube, Rss } from "lucide-react";
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const appUrl = 'https://qrick.vercel.app';

export const metadata: Metadata = {
    title: 'Features - QRick | Advanced QR Code & Barcode Generator',
    description: 'Explore the powerful features of QRick. Create custom QR codes for Wi-Fi, vCards, events, and social media. Generate various barcode formats like EAN, UPC, and CODE128. Design and download for free.',
    keywords: ['QR code features', 'barcode types', 'custom QR codes', 'Wi-Fi QR code', 'vCard QR code', 'EAN-13 barcode', 'CODE128 generator', 'free barcode tool'],
    alternates: {
        canonical: `${appUrl}/features`,
    },
    openGraph: {
        title: 'Features - QRick | Advanced QR Code & Barcode Generator',
        description: 'Discover the extensive capabilities of QRick for all your code generation needs.',
        url: `${appUrl}/features`,
    },
    twitter: {
        title: 'Features - QRick | Advanced QR Code & Barcode Generator',
        description: 'Discover the extensive capabilities of QRick for all your code generation needs.',
    }
};

const featureList = [
  { icon: <Text className="h-6 w-6" />, title: 'Text & URLs', description: 'Create QR codes that link to any website or display plain text.' },
  { icon: <Wifi className="h-6 w-6" />, title: 'Wi-Fi Access', description: 'Generate QR codes for instant Wi-Fi network connections without typing passwords.' },
  { icon: <User className="h-6 w-6" />, title: 'vCards', description: 'Share your contact details seamlessly with a vCard QR code.' },
  { icon: <Calendar className="h-6 w-6" />, title: 'Events', description: 'Create calendar events that users can add with a single scan.' },
  { icon: <MessageSquare className="h-6 w-6" />, title: 'SMS & WhatsApp', description: 'Pre-fill SMS or WhatsApp messages for quick communication.' },
  { icon: <Phone className="h-6 w-6" />, title: 'Phone Calls', description: 'Initiate a phone call by scanning a QR code.' },
  { icon: <Mail className="h-6 w-6" />, title: 'Emails', description: 'Compose an email with a pre-filled recipient, subject, and body.' },
  { icon: <MapPin className="h-6 w-6" />, title: 'Geolocation', description: 'Link to a specific location on a map.' },
];

const socialList = [
  { icon: <Facebook className="h-6 w-6" />, title: 'Facebook', description: 'Link directly to a Facebook profile or page.' },
  { icon: <Instagram className="h-6 w-6" />, title: 'Instagram', description: 'Share your Instagram profile instantly.' },
  { icon: <Twitter className="h-6 w-6" />, title: 'Twitter / X', description: 'Link to a Twitter profile.' },
  { icon: <Linkedin className="h-6 w-6" />, title: 'LinkedIn', description: 'Connect professionally by sharing your LinkedIn profile.' },
  { icon: <Youtube className="h-6 w-6" />, title: 'YouTube', description: 'Direct users to a YouTube channel or video.' },
  { icon: <Rss className="h-6 w-6" />, title: 'TikTok', description: 'Grow your audience by linking to your TikTok profile.' },
];

const barcodeList = [
    { format: "CODE128", description: "A versatile high-density code used in logistics and transportation." },
    { format: "EAN-13", description: "The standard barcode for retail products in Europe and other regions." },
    { format: "UPC-A", description: "The primary barcode used for retail products in North America." },
    { format: "CODE39", description: "A general-purpose code used for name badges, inventory, and industrial applications." },
    { format: "ITF-14", description: "Ideal for printing on corrugated materials and used for packaging." },
    { format: "Codabar", description: "Used by libraries, blood banks, and airbills." },
];

export default function FeaturesPage() {
  return (
    <>
      <Header />
      <div className="bg-background">
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-rose-50 to-sky-50 dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto text-center px-4 md:px-6">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary">
                        Powerful Features for Everyone
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                        From simple text links to complex business cards and a wide array of barcode formats, QRick provides a comprehensive suite of tools to meet all your code generation needs.
                    </p>
                </div>
            </div>
        </section>
        
        <section className="w-full py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-3 mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Advanced QR Code Customization</h2>
                <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl">
                    Take full control of your QR code's appearance. Our powerful editor allows you to customize everything from colors and gradients to shapes and logos, ensuring your code perfectly matches your brand identity.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col items-start space-y-2 rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-primary text-primary-foreground rounded-full p-3">
                    <Palette className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Full Styling Control</h3>
                <p className="text-sm text-muted-foreground">Choose colors for the foreground and background, apply linear or radial gradients, and select from multiple module styles like dots, rounded squares, and more.</p>
              </div>
              <div className="flex flex-col items-start space-y-2 rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-primary text-primary-foreground rounded-full p-3">
                    <QrCode className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Embed Your Logo</h3>
                <p className="text-sm text-muted-foreground">Easily upload your brand's logo to be placed in the center of your QR code, with options to clear the space behind it for optimal scannability.</p>
              </div>
              <div className="flex flex-col items-start space-y-2 rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-primary text-primary-foreground rounded-full p-3">
                    <Download className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">High-Quality Exports</h3>
                <p className="text-sm text-muted-foreground">Download your finished designs as high-resolution PNG, JPEG, or scalable SVG files, perfect for both digital use and high-quality printing.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16 lg:py-20 bg-muted/40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-3 mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Diverse QR Code Data Types</h2>
                <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl">
                    QRick supports a wide variety of data types to make your QR codes more interactive and functional.
                </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {featureList.map(feature => (
                <div key={feature.title} className="flex flex-col items-center text-center gap-2">
                  <div className="bg-primary text-primary-foreground rounded-full p-3">{feature.icon}</div>
                  <h3 className="font-bold">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
             <div className="mt-12 text-center space-y-3">
                <h3 className="text-2xl font-bold tracking-tighter">Social Media Integration</h3>
                 <p className="max-w-[900px] mx-auto text-muted-foreground">Effortlessly link to your social media profiles.</p>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-8 mt-8">
                {socialList.map(social => (
                    <div key={social.title} className="flex flex-col items-center text-center gap-2">
                        <div className="text-primary">{social.icon}</div>
                        <h4 className="text-sm font-semibold">{social.title}</h4>
                    </div>
                ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-3 mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Comprehensive Barcode Support</h2>
                <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl">
                    In addition to QR codes, QRick is a powerful barcode generator supporting numerous industry-standard formats.
                </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                {barcodeList.map(barcode => (
                    <div key={barcode.format} className="border rounded-lg p-4 text-center shadow-sm">
                        <h3 className="font-bold text-primary">{barcode.format}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{barcode.description}</p>
                    </div>
                ))}
            </div>
             <div className="text-center mt-12">
                <p className="text-muted-foreground">And many more, including EAN-8, UPC-E, MSI, and Pharmacode.</p>
            </div>
          </div>
        </section>

         <section className="w-full py-12 md:py-16 lg:py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Create?</h2>
            <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl mt-4">
              Start designing your custom QR codes and barcodes now. It's fast, easy, and completely free.
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/">Get Started Now</Link>
              </Button>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}