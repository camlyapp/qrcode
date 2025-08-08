import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { QrickApp } from "@/components/qrick-app";
import { SeoContent } from "@/components/seo-content";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <main className="flex flex-1 w-full flex-col items-center justify-center p-4">
        <QrickApp />
      </main>
      <SeoContent />
      <Footer />
    </>
  );
}
