import { Header } from "@/components/header";
import { QrickApp } from "@/components/qrick-app";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center p-4">
        <QrickApp />
      </main>
    </>
  );
}
