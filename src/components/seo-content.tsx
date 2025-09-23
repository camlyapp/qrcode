import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QrCode, Barcode, Palette, Download, Share2, CreditCard } from "lucide-react";
import Link from "next/link";

export function SeoContent() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 border-t bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Your All-in-One QR Code and Barcode Solution
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              QRick is a powerful and free tool for generating custom QR codes and barcodes. Create dynamic, professional codes for your business, events, or personal use. Our platform is designed for simplicity and power, giving you full control over your designs. Explore our <Link href="/features" className="text-primary underline">features</Link> to see everything we offer.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-start space-y-2 rounded-lg border p-4">
                <div className="bg-primary text-primary-foreground rounded-full p-2">
                    <QrCode className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">
                  <Link href="/?type=qr-code" className="hover:underline">Custom QR Codes</Link>
                </h3>
                <p className="text-sm text-muted-foreground">Generate QR codes with custom colors, styles, gradients, and even embed your own logo.</p>
              </div>
              <div className="flex flex-col items-start space-y-2 rounded-lg border p-4">
                <div className="bg-primary text-primary-foreground rounded-full p-2">
                    <Barcode className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">
                  <Link href="/?type=barcode" className="hover:underline">Versatile Barcodes</Link>
                </h3>
                <p className="text-sm text-muted-foreground">Support for a wide range of barcode formats including CODE128, EAN, UPC, and more.</p>
              </div>
              <div className="flex flex-col items-start space-y-2 rounded-lg border p-4">
                 <div className="bg-primary text-primary-foreground rounded-full p-2">
                    <CreditCard className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">Business Card Designer</h3>
                <p className="text-sm text-muted-foreground">Create and design professional business cards or event tickets with embedded barcodes.</p>
              </div>
              <div className="flex flex-col items-start space-y-2 rounded-lg border p-4">
                 <div className="bg-primary text-primary-foreground rounded-full p-2">
                    <Download className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">High-Quality Downloads</h3>
                <p className="text-sm text-muted-foreground">Export your codes in high-resolution PNG, JPEG, or scalable SVG formats for print and web.</p>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}
