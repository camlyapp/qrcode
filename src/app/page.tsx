import { Header } from "@/components/header";
import { QrickApp } from "@/components/qrick-app";
import { SeoContent } from "@/components/seo-content";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center p-4">
        <QrickApp />
      </main>
      <SeoContent />
      <Footer />
    </>
  );
}
