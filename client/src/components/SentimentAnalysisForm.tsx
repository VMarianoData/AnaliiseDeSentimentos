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
  
  const analysisMutation = useMutation({
    mutationFn: (data: AnalysisForm) => analyzeSentiment(data.text),
    onSuccess: (data) => {
      setAnalysisResult(data);
      toast({
        title: "Análise concluída",
        description: "O texto foi analisado com sucesso.",
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
          icon: "sentiment_very_satisfied",
          color: "text-positive",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          label: "Positivo",
          description: "O texto demonstra uma opinião predominantemente positiva."
        };
      case "negative":
        return {
          icon: "sentiment_very_dissatisfied",
          color: "text-negative",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          label: "Negativo",
          description: "O texto demonstra uma opinião predominantemente negativa."
        };
      default:
        return {
          icon: "sentiment_neutral",
          color: "text-neutral",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          label: "Neutro",
          description: "O texto demonstra uma opinião neutra ou equilibrada."
        };
    }
  };
  
  return (
    <section id="analysis" className="mb-12">
      <Card className="bg-white">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-dark mb-4">Nova Análise de Sentimento</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-6">
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Digite o texto para análise:</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Escreva aqui o texto que deseja analisar..."
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                          rows={6}
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500 mt-1">Mínimo de 10 caracteres para análise precisa.</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={analysisMutation.isPending}
                  className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-600 transition flex items-center"
                >
                  <span className="mr-2">Analisar Sentimento</span>
                  <span className="material-icons text-sm">send</span>
                </Button>
              </div>
            </form>
          </Form>
          
          {/* Loading state */}
          {analysisMutation.isPending && (
            <div className="mt-8 rounded-md p-4 border border-gray-200">
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Analisando texto...</span>
              </div>
            </div>
          )}
          
          {/* Result state */}
          {analysisResult && !analysisMutation.isPending && (
            <div className="mt-8 rounded-md p-6 border border-gray-200">
              <h3 className="font-semibold text-lg mb-4">Resultado da Análise</h3>
              <div className="flex flex-col md:flex-row gap-4">
                <div className={`flex-1 rounded-md p-4 ${getSentimentInfo(analysisResult.sentiment).bgColor} border ${getSentimentInfo(analysisResult.sentiment).borderColor}`}>
                  <div className="flex items-center">
                    <span className={`material-icons ${getSentimentInfo(analysisResult.sentiment).color} mr-2`}>
                      {getSentimentInfo(analysisResult.sentiment).icon}
                    </span>
                    <h4 className="font-medium">Sentimento Detectado:</h4>
                  </div>
                  <p className={`text-xl font-bold ${getSentimentInfo(analysisResult.sentiment).color} mt-2`}>
                    {getSentimentInfo(analysisResult.sentiment).label}
                  </p>
                  <p className="text-sm mt-2">{getSentimentInfo(analysisResult.sentiment).description}</p>
                </div>
                <div className="flex-1 rounded-md p-4 bg-blue-50 border border-blue-200">
                  <h4 className="font-medium mb-2">Pontuação de Confiança:</h4>
                  <Progress value={analysisResult.confidence} className="w-full h-4" />
                  <div className="flex justify-between mt-1 text-xs">
                    <span>0%</span>
                    <span>{analysisResult.confidence}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <p>Análise realizada em: <span className="font-medium">{formatDate(analysisResult.createdAt)}</span></p>
                <p>ID da análise: <span className="font-mono">{analysisResult.id}</span></p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
