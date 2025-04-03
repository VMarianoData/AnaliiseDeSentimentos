import { SentimentAnalysisForm } from "@/components/SentimentAnalysisForm";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container-custom flex-grow py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="gradient-heading mb-4">
              Análise de Sentimentos da EcoBit
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubra as emoções presentes em seus textos utilizando inteligência artificial otimizada para a língua portuguesa.
            </p>
          </div>
          
          <div className="bg-card shadow-lg rounded-xl p-6 border">
            <SentimentAnalysisForm />
          </div>
          
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg border card-hover">
              <div className="mb-3 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><path d="M2 12h10"></path><path d="M9 4v16"></path><path d="M14 9l3 3-3 3"></path><path d="M17 9l3 3-3 3"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Processamento Rápido</h3>
              <p className="text-muted-foreground">Análise instantânea do sentimento do seu texto com tecnologia de IA avançada.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border card-hover">
              <div className="mb-3 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path><path d="m14.5 9-5 5"></path><path d="m9.5 9 5 5"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Otimizado para Português</h3>
              <p className="text-muted-foreground">Prompts e modelos especialmente ajustados para textos em língua portuguesa.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border card-hover">
              <div className="mb-3 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><path d="M8.4 10.6a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2Z"></path><path d="M18.9 17.1a2.1 2.1 0 1 0 0-4.2 2.1 2.1 0 0 0 0 4.2Z"></path><path d="M10.3 15.1a2.1 2.1 0 1 0-4.2 0 2.1 2.1 0 0 0 4.2 0Z"></path><path d="m7.5 12.4-3.7-2.1"></path><path d="m16.3 9.7 5.1-3"></path><path d="m11.6 14.7 5.1 3"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Estatísticas Detalhadas</h3>
              <p className="text-muted-foreground">Visualize e explore os resultados das análises com gráficos e filtros interativos.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
