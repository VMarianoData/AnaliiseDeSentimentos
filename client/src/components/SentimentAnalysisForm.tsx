import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { analysisFormSchema, type AnalysisForm, type SentimentResponse } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useMutation } from "@tanstack/react-query";
import { analyzeSentiment } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function SentimentAnalysisForm() {
  const [analysisResult, setAnalysisResult] = useState<SentimentResponse | null>(null);
  const { toast } = useToast();
  
  const form = useForm<AnalysisForm>({
    resolver: zodResolver(analysisFormSchema),
    defaultValues: {
      text: ""
    }
  });
  
  // Mutação para análise usando a API de IA (Gemini/OpenAI)
  const analysisMutation = useMutation({
    mutationFn: (data: AnalysisForm) => analyzeSentiment(data.text),
    onSuccess: (data) => {
      setAnalysisResult(data);
      toast({
        title: "Análise concluída",
        description: "O texto foi analisado com sucesso usando inteligência artificial.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro na análise",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  });
  
  // Função de envio do formulário
  const onSubmit = (data: AnalysisForm) => {
    analysisMutation.mutate(data);
  };
  
  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  
  // Obter ícone e cor com base no sentimento
  const getSentimentInfo = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          ),
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          label: "Positivo",
          description: "O texto demonstra uma opinião predominantemente positiva."
        };
      case "negative":
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="15" x2="16" y2="15"></line>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          ),
          color: "text-rose-600",
          bgColor: "bg-rose-50",
          borderColor: "border-rose-200",
          label: "Negativo",
          description: "O texto demonstra uma opinião predominantemente negativa."
        };
      default:
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="12" x2="16" y2="12"></line>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          ),
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          label: "Neutro",
          description: "O texto demonstra uma opinião neutra ou equilibrada."
        };
    }
  };
  
  return (
    <section id="analysis" className="mb-12">
      <Card className="shadow-md border">
        <CardContent className="p-6 sm:p-8">
          <h2 className="text-2xl font-heading font-semibold mb-6">Análise de Sentimento</h2>
          
          <div className="mb-6">
            <div className="text-sm text-muted-foreground mb-4 p-4 bg-muted/40 rounded-md border">
              <div className="flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-0.5">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                </svg>
                <div>
                  <p>Análise de sentimento com inteligência artificial para textos em português.</p>
                  <p className="mt-1">O serviço usa <span className="font-medium">Google Gemini</span> ou <span className="font-medium">OpenAI</span>, dependendo da configuração do ambiente.</p>
                </div>
              </div>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-6">
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Texto para análise</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Digite ou cole aqui o texto que deseja analisar..."
                          className="resize-y min-h-[120px]"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        Para melhores resultados, insira textos com pelo menos 10 caracteres
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={analysisMutation.isPending}
                  className="gap-2"
                  size="lg"
                >
                  Analisar Sentimento
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </Button>
              </div>
            </form>
          </Form>
          
          {/* Loading state */}
          {analysisMutation.isPending && (
            <div className="mt-8 p-6 rounded-md border bg-background animate-pulse">
              <div className="flex justify-center items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                <span className="text-muted-foreground font-medium">
                  Processando análise com inteligência artificial...
                </span>
              </div>
            </div>
          )}
          
          {/* Result state */}
          {analysisResult && !analysisMutation.isPending && (
            <div className="mt-8 rounded-lg border bg-card/50 overflow-hidden">
              <div className="border-b bg-muted/30 px-6 py-3 flex items-center justify-between">
                <h3 className="font-medium">Resultado da Análise</h3>
                <span className="text-xs text-muted-foreground">{formatDate(analysisResult.createdAt)}</span>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className={`flex-1 rounded-md p-5 ${getSentimentInfo(analysisResult.sentiment).bgColor} border ${getSentimentInfo(analysisResult.sentiment).borderColor}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`${getSentimentInfo(analysisResult.sentiment).color}`}>
                        {getSentimentInfo(analysisResult.sentiment).icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Sentimento Detectado</h4>
                        <p className={`text-xl font-semibold ${getSentimentInfo(analysisResult.sentiment).color}`}>
                          {getSentimentInfo(analysisResult.sentiment).label}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm mt-2">{getSentimentInfo(analysisResult.sentiment).description}</p>
                  </div>
                  
                  <div className="flex-1 rounded-md p-5 bg-primary/5 border">
                    <h4 className="font-medium text-sm mb-3">Pontuação de Confiança</h4>
                    <div className="mb-3">
                      <Progress 
                        value={analysisResult.confidence} 
                        className="h-3 w-full" 
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span className="font-medium text-sm text-foreground">{analysisResult.confidence}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-5 flex items-center text-xs text-muted-foreground gap-4">
                  <div className="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <span>ID: <span className="font-mono">{analysisResult.id}</span></span>
                  </div>
                  
                  {analysisResult.source && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-primary/5 rounded-full border text-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                      <span>Via API</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-5 text-sm">
                  <div className="p-3 bg-muted/30 rounded-md border text-muted-foreground">
                    <p className="italic">{analysisResult.text}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
