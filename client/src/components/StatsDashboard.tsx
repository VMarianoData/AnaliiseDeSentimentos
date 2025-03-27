import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { SentimentFilter } from "./SentimentFilter";
import { SentimentChart } from "./SentimentChart";
import { SentimentFilters, SentimentType, SentimentResponse, SentimentStats } from "@shared/schema";
import { getSentimentAnalyses, getSentimentStats } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function StatsDashboard() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [filters, setFilters] = useState<SentimentFilters>({
    positive: true,
    negative: true,
    neutral: true,
    period: "all"
  });

  // Consulta das análises com filtros
  const {
    data: analyses,
    isLoading: analysesLoading,
    isError: analysesError,
    refetch: refetchAnalyses
  } = useQuery({
    queryKey: ["/api/analyses", filters],
    queryFn: async () => {
      try {
        const data = await getSentimentAnalyses(filters);
        return data;
      } catch (error) {
        toast({
          title: "Erro ao buscar análises",
          description: (error as Error).message,
          variant: "destructive"
        });
        return [];
      }
    }
  });

  // Consulta das estatísticas
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: async () => {
      try {
        return await getSentimentStats();
      } catch (error) {
        toast({
          title: "Erro ao buscar estatísticas",
          description: (error as Error).message,
          variant: "destructive"
        });
        return {
          positive: 0,
          negative: 0,
          neutral: 0,
          total: 0
        } as SentimentStats;
      }
    }
  });

  // Manipuladores para alteração de filtros
  const handleFilterChange = (key: keyof Omit<SentimentFilters, "period">, value: boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset pagination
  };

  const handlePeriodChange = (value: "all" | "today" | "week" | "month") => {
    setFilters(prev => ({ ...prev, period: value }));
    setPage(1); // Reset pagination
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

  // Calcular total de páginas
  const totalPages = analyses ? Math.ceil(analyses.length / itemsPerPage) : 0;
  
  // Obter itens da página atual
  const currentItems = analyses ? analyses.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  ) : [];

  // Navegação entre páginas
  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // Obter informações de sentimento
  const getSentimentInfo = (sentiment: string) => {
    switch (sentiment) {
      case SentimentType.POSITIVE:
        return {
          icon: "sentiment_very_satisfied",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          label: "Positivo"
        };
      case SentimentType.NEGATIVE:
        return {
          icon: "sentiment_very_dissatisfied",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          label: "Negativo"
        };
      default:
        return {
          icon: "sentiment_neutral",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          label: "Neutro"
        };
    }
  };

  return (
    <section id="statistics" className="mb-12">
      <Card className="bg-white">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-dark mb-6">Estatísticas de Análises</h2>
          
          {/* Filtros */}
          <SentimentFilter 
            filters={filters} 
            onFilterChange={handleFilterChange}
            onPeriodChange={handlePeriodChange}
          />
          
          {/* Stats Summary Cards */}
          {!statsLoading && stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Análises Positivas</h3>
                    <p className="text-2xl font-bold text-positive">{stats.positive}</p>
                  </div>
                  <span className="material-icons text-positive text-2xl">sentiment_very_satisfied</span>
                </div>
                <div className="mt-2 text-sm">
                  <span className="text-green-600 font-medium flex items-center">
                    {stats.positive > 0 ? (
                      <>
                        <span className="material-icons text-xs mr-1">check_circle</span>
                        {((stats.positive / stats.total) * 100).toFixed(0)}% do total
                      </>
                    ) : (
                      "Nenhuma análise"
                    )}
                  </span>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Análises Negativas</h3>
                    <p className="text-2xl font-bold text-negative">{stats.negative}</p>
                  </div>
                  <span className="material-icons text-negative text-2xl">sentiment_very_dissatisfied</span>
                </div>
                <div className="mt-2 text-sm">
                  <span className="text-red-600 font-medium flex items-center">
                    {stats.negative > 0 ? (
                      <>
                        <span className="material-icons text-xs mr-1">check_circle</span>
                        {((stats.negative / stats.total) * 100).toFixed(0)}% do total
                      </>
                    ) : (
                      "Nenhuma análise"
                    )}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Análises Neutras</h3>
                    <p className="text-2xl font-bold text-neutral">{stats.neutral}</p>
                  </div>
                  <span className="material-icons text-neutral text-2xl">sentiment_neutral</span>
                </div>
                <div className="mt-2 text-sm">
                  <span className="text-gray-600 font-medium flex items-center">
                    {stats.neutral > 0 ? (
                      <>
                        <span className="material-icons text-xs mr-1">check_circle</span>
                        {((stats.neutral / stats.total) * 100).toFixed(0)}% do total
                      </>
                    ) : (
                      "Nenhuma análise"
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Exibir indicador de carregamento para estatísticas */}
          {statsLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Carregando estatísticas...</span>
            </div>
          )}
          
          {/* Chart and Table */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Chart */}
            <div className="lg:col-span-2 bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium mb-4">Distribuição de Sentimentos</h3>
              {!statsLoading && stats && <SentimentChart stats={stats} />}
              {statsLoading && (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
            
            {/* Table */}
            <div className="lg:col-span-3">
              <h3 className="font-medium mb-4">Últimas Análises</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Texto</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentimento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {!analysesLoading && currentItems.length > 0 ? (
                      currentItems.map((analysis) => {
                        const sentimentInfo = getSentimentInfo(analysis.sentiment);
                        return (
                          <tr key={analysis.id} className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm">{formatDate(analysis.createdAt)}</td>
                            <td className="py-3 px-4 text-sm">
                              <p className="truncate max-w-xs">{analysis.text}</p>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sentimentInfo.bgColor} ${sentimentInfo.textColor}`}>
                                <span className="material-icons text-xs mr-1">{sentimentInfo.icon}</span>
                                {sentimentInfo.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : analysesLoading ? (
                      <tr>
                        <td colSpan={3} className="py-8 text-center">
                          <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <span className="ml-2">Carregando análises...</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-gray-500">
                          Nenhuma análise encontrada
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Paginação */}
              {analyses && analyses.length > 0 && (
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Mostrando {(page - 1) * itemsPerPage + 1} a {Math.min(page * itemsPerPage, analyses.length)} de {analyses.length} registros
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={goToPreviousPage}
                      disabled={page === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      onClick={goToNextPage}
                      disabled={page >= totalPages}
                    >
                      Próximo
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
