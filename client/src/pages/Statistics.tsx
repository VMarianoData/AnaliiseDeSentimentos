import { StatsDashboard } from "@/components/StatsDashboard";
import { ExportSection } from "@/components/ExportSection";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Statistics() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container-custom flex-grow py-8 md:py-12">
        <div className="mb-10 text-center">
          <h1 className="gradient-heading mb-4">
            Estatísticas de Sentimentos
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Visualize e explore os resultados das análises com gráficos interativos e filtros personalizados.
          </p>
        </div>
        
        <StatsDashboard />
        <ExportSection />
      </main>
      <Footer />
    </div>
  );
}
