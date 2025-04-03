import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Eye, Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PDFPreviewProps {
  pdfUrl: string | null;
  title: string;
  isLoading: boolean;
  className?: string;
}

export function PDFPreview({ pdfUrl, title, isLoading, className }: PDFPreviewProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Abre o PDF em uma nova janela
  const openPdf = React.useCallback(() => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  }, [pdfUrl]);

  // Faz o download do PDF
  const downloadPdf = React.useCallback(() => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `ecobit-relatorio-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [pdfUrl]);

  return (
    <Card className={cn("w-full overflow-hidden border-2 border-green-100", className)}>
      <div className="bg-gradient-to-r from-emerald-700 to-green-600 p-3 flex justify-between items-center">
        <h3 className="text-white font-medium">{title}</h3>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            className="gap-1 bg-white/90 hover:bg-white text-green-800"
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={!pdfUrl}
          >
            <Eye className="h-4 w-4" />
            {isExpanded ? 'Ocultar' : 'Visualizar'}
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            className="gap-1 bg-white/90 hover:bg-white text-green-800"
            onClick={downloadPdf}
            disabled={!pdfUrl || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Baixar
          </Button>
        </div>
      </div>
      
      {isExpanded && (
        <CardContent className="p-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : pdfUrl ? (
            <div className="flex flex-col items-center">
              <div className="w-full max-h-96 overflow-hidden mb-4 rounded border shadow">
                <img 
                  src="/attached_assets/image_1743682823210.png" 
                  alt="Prévia do PDF" 
                  className="w-full object-contain"
                  onError={(e) => {
                    // Fallback caso a imagem não seja encontrada
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' text-anchor='middle' dominant-baseline='middle' fill='%23666'%3EPrévia do PDF%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <Button 
                onClick={openPdf} 
                variant="outline" 
                className="border-green-500 text-green-700 hover:bg-green-50"
              >
                Abrir PDF Completo
              </Button>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">
              Nenhuma prévia disponível
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}