import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getSentimentAnalyses } from "@/lib/api";
import { PDFPreview } from "@/components/PDFPreview";

// Importe ícones de maneira segura
import { 
  FileJson, 
  Download,
  File 
} from "lucide-react";

export function ExportSection() {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleExportJSON = async () => {
    setIsExporting('json');
    try {
      const data = await getSentimentAnalyses();
      
      // Criar blob e baixar arquivo
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ecobit-analises-${new Date().toISOString().slice(0, 10)}.json`;
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
      setIsExporting(null);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting('csv');
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
      a.download = `ecobit-analises-${new Date().toISOString().slice(0, 10)}.csv`;
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
      setIsExporting(null);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting('pdf');
    try {
      // Gerar PDF através da API
      const response = await fetch("/api/export/pdf", {
        method: "GET",
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao gerar PDF: ${response.status} ${response.statusText}`);
      }
      
      // Obter o blob dos dados
      const blob = await response.blob();
      
      // Criar URL para visualização
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
      
      toast({
        title: "PDF gerado com sucesso",
        description: "O relatório em PDF foi gerado e está pronto para visualização",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar PDF",
        description: (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <section className="mb-8 space-y-6">
      <Card className="bg-white">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Exportar Dados</h2>
          <p className="mb-4 text-gray-600">Exporte os resultados das análises para uso em outras ferramentas.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Botão JSON */}
            <Button
              variant="outline"
              className="py-6 bg-gradient-to-br from-green-50 to-green-100 hover:bg-green-200 border-green-200 text-green-800 transition flex flex-col items-center gap-2 h-auto"
              onClick={handleExportJSON}
              disabled={isExporting !== null}
            >
              <FileJson className="h-8 w-8 text-green-600" />
              <span className="font-medium">Exportar como JSON</span>
              <span className="text-xs text-gray-500">Dados estruturados para aplicações</span>
            </Button>
            
            {/* Botão CSV */}
            <Button
              variant="outline"
              className="py-6 bg-gradient-to-br from-green-50 to-green-100 hover:bg-green-200 border-green-200 text-green-800 transition flex flex-col items-center gap-2 h-auto"
              onClick={handleExportCSV}
              disabled={isExporting !== null}
            >
              <svg 
                className="h-8 w-8 text-green-600" 
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <line x1="15" y1="3" x2="15" y2="21" />
              </svg>
              <span className="font-medium">Exportar como CSV</span>
              <span className="text-xs text-gray-500">Para uso em planilhas Excel/Google</span>
            </Button>
            
            {/* Botão PDF */}
            <Button
              variant="outline"
              className="py-6 bg-gradient-to-br from-green-50 to-green-100 hover:bg-green-200 border-green-200 text-green-800 transition flex flex-col items-center gap-2 h-auto"
              onClick={handleExportPDF}
              disabled={isExporting !== null}
            >
              <svg 
                className="h-8 w-8 text-green-600" 
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M9 13h6" />
                <path d="M9 17h3" />
                <path d="M9 9h1" />
              </svg>
              <span className="font-medium">Exportar como PDF</span>
              <span className="text-xs text-gray-500">Relatório formatado para impressão</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Adicionando a pré-visualização do PDF */}
      {(pdfUrl || isExporting === 'pdf') && (
        <PDFPreview 
          pdfUrl={pdfUrl} 
          title="Relatório de Análises de Sentimento" 
          isLoading={isExporting === 'pdf'}
        />
      )}
    </section>
  );
}
