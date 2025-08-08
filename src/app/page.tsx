import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { QrickApp } from "@/components/qrick-app";
import { SeoContent } from "@/components/seo-content";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="relative">
      <Header />
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-br from-background to-muted/40 -z-10" />
      <HeroSection />
      <main className="flex flex-1 w-full flex-col items-center justify-center p-4">
        <QrickApp />
      </main>
      <SeoContent />
      <Footer />
    </div>
  );
}
