import { MetadataRoute } from 'next'

const barcodeFormats = ["CODE128", "CODE128A", "CODE128B", "CODE128C", "EAN13", "EAN8", "EAN5", "EAN2", "UPC", "UPCE", "CODE39", "ITF14", "ITF", "MSI", "MSI10", "MSI11", "MSI1010", "MSI1110", "pharmacode", "codabar"];
const qrDataTypes = ['text', 'wifi', 'sms', 'phone', 'email', 'vcard', 'geolocation', 'event', 'whatsapp', 'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok'];
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://qrick.vercel.app';

  const mainRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  const barcodeRoutes = barcodeFormats.map(format => ({
    url: `${baseUrl}/?type=barcode&format=${format.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.7,
  }));

  const qrCodeRoutes = qrDataTypes.map(type => ({
    url: `${baseUrl}/?type=qr-code&format=${type}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...mainRoutes, ...barcodeRoutes, ...qrCodeRoutes];
}
