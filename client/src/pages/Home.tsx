import { SentimentAnalysisForm } from "@/components/SentimentAnalysisForm";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-light-bg">
      <Header />
      <main className="container mx-auto flex-grow p-4 sm:p-6">
        <SentimentAnalysisForm />
      </main>
      <Footer />
    </div>
  );
}
