import { Suspense } from 'react';
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { QrickApp } from "@/components/qrick-app";
import { Footer } from "@/components/footer";
import { SeoContent } from '@/components/seo-content';

function QrickAppFallback() {
  return <div>Loading...</div>;
}

export default function Home() {
  return (
    <div className="relative">
      <Header />
      <div className="absolute top-0 left-0 w-full h-screen bg-gradient-to-br from-rose-100 via-white to-sky-100 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 -z-10" />
      <HeroSection />
      <main className="flex flex-1 w-full flex-col items-center justify-center p-4">
        <Suspense fallback={<QrickAppFallback />}>
          <QrickApp />
        </Suspense>
      </main>
      <SeoContent />
      <Footer />
    </div>
  );
}
