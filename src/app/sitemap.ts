import { MetadataRoute } from 'next'

const barcodeFormats = ["CODE128", "CODE128A", "CODE128B", "CODE128C", "EAN13", "EAN8", "EAN5", "EAN2", "UPC", "UPCE", "CODE39", "ITF14", "ITF", "MSI", "MSI10", "MSI11", "MSI1010", "MSI1110", "pharmacode", "codabar"];
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://qrick.vercel.app';

  const mainRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/#qr-code`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
     {
      url: `${baseUrl}/#barcode`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];

  const barcodeRoutes = barcodeFormats.map(format => ({
    url: `${baseUrl}/#barcode/${format.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.7,
  }));

  return [...mainRoutes, ...barcodeRoutes];
}
