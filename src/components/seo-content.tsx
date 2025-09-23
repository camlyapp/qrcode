import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QrCode, Barcode, Palette, Download, Share2, CreditCard, Link as LinkIcon, Wifi, User, Calendar } from "lucide-react";
import Link from "next/link";

export function SeoContent() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 border-t bg-muted/20">
      <div className="container mx-auto px-4 md:px-6 space-y-12">
        <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Your All-in-One QR Code and Barcode Solution
            </h2>
            <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
              QRick is a powerful and free tool for generating custom QR codes and barcodes. Create dynamic, professional codes for your business, events, or personal use. Our platform is designed for simplicity and power, giving you full control over your designs. Explore our <Link href="/features" className="text-primary underline">features</Link> to see everything we offer.
            </p>
        </div>
          
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="bg-primary text-primary-foreground rounded-full p-3">
                    <QrCode className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold">
                  <Link href="/?type=qr-code" className="hover:underline">Advanced QR Codes</Link>
                </h3>
            </div>
            <p className="text-muted-foreground">
                Go beyond simple black and white squares. With QRick, you can generate QR codes with custom colors, beautiful gradients, and unique shapes. Embed your brand's logo to increase scan rates and brand recognition. Create codes for <Link href="/?type=qr-code&format=wifi" className="text-primary hover:underline">Wi-Fi access</Link>, <Link href="/?type=qr-code&format=vcard" className="text-primary hover:underline">vCards</Link>, social media profiles, and much more.
            </p>
          </div>
           <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="bg-primary text-primary-foreground rounded-full p-3">
                    <Barcode className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold">
                  <Link href="/?type=barcode" className="hover:underline">Versatile Barcodes</Link>
                </h3>
            </div>
            <p className="text-muted-foreground">
                Need a barcode for your retail product, inventory system, or shipping? We support a vast range of industry-standard formats, including <Link href="/?type=barcode&format=code128" className="text-primary hover:underline">CODE128</Link>, EAN, UPC, ITF-14, and Codabar. Customize dimensions, colors, and text to fit your exact needs.
            </p>
          </div>
           <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="bg-primary text-primary-foreground rounded-full p-3">
                    <CreditCard className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold">
                  Business Card Designer
                </h3>
            </div>
            <p className="text-muted-foreground">
                Design professional business cards or event tickets directly in our app. Seamlessly embed a QR code or barcode, add text and logos, and arrange elements with our easy-to-use drag-and-drop editor. Download a print-ready design in seconds. It's never been easier to create a lasting impression.
            </p>
          </div>
        </div>

        <div className="text-center bg-primary/10 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-primary">Why Choose QRick?</h3>
            <p className="max-w-[700px] mx-auto text-muted-foreground mt-2">
                Our mission is to provide a high-quality, free, and accessible tool for everyone. No sign-ups, no tracking, just a powerful generator at your fingertips. Download your creations in high-resolution PNG, JPEG, or scalable SVG formats, perfect for both digital and print applications.
            </p>
            <div className="mt-6">
                <Link href="/" className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                    Start Creating Now
                </Link>
            </div>
        </div>
      </div>
    </section>
  );
}
