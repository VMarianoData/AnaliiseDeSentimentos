import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getSentimentAnalyses } from "@/lib/api";
import { apiRequest } from "@/lib/queryClient";

export function ExportSection() {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      const data = await getSentimentAnalyses();
      
      // Criar blob e baixar arquivo
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analises-sentimento-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Exportação concluída",
        description: "Dados exportados com sucesso no formato JSON",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      // Usar a API do backend para gerar o CSV diretamente
      const response = await fetch("/api/export/csv", {
        method: "GET",
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao exportar: ${response.status} ${response.statusText}`);
      }
      
      // Obter o blob dos dados
      const blob = await response.blob();
      
      // Criar URL e baixar
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analises-sentimento-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Exportação concluída",
        description: "Dados exportados com sucesso no formato CSV",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="mb-8">
      <Card className="bg-white">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-dark mb-4">Exportar Dados</h2>
          <p className="mb-4 text-gray-600">Exporte os resultados das análises para uso em outras ferramentas.</p>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              className="px-4 py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 transition flex items-center"
              onClick={handleExportJSON}
              disabled={isExporting}
            >
              <span className="material-icons mr-2 text-sm">file_download</span>
              Exportar como JSON
            </Button>
            <Button
              variant="outline"
              className="px-4 py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 transition flex items-center"
              onClick={handleExportCSV}
              disabled={isExporting}
            >
              <span className="material-icons mr-2 text-sm">file_download</span>
              Exportar como CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
