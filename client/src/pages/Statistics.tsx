import { StatsDashboard } from "@/components/StatsDashboard";
import { ExportSection } from "@/components/ExportSection";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Statistics() {
  return (
    <div className="flex flex-col min-h-screen bg-light-bg">
      <Header />
      <main className="container mx-auto flex-grow p-4 sm:p-6">
        <StatsDashboard />
        <ExportSection />
      </main>
      <Footer />
    </div>
  );
}
