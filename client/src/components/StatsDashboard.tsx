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
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          ),
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          textColor: "text-emerald-600",
          label: "Positivo"
        };
      case SentimentType.NEGATIVE:
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="15" x2="16" y2="15"></line>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          ),
          bgColor: "bg-rose-50",
          borderColor: "border-rose-200",
          textColor: "text-rose-600",
          label: "Negativo"
        };
      default:
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="12" x2="16" y2="12"></line>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          ),
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          textColor: "text-amber-600",
          label: "Neutro"
        };
    }
  };

  return (
    <section id="statistics" className="mb-12">
      <Card className="shadow-md border">
        <CardContent className="p-6 sm:p-8">
          {/* Filtros */}
          <SentimentFilter 
            filters={filters} 
            onFilterChange={handleFilterChange}
            onPeriodChange={handlePeriodChange}
          />
          
          {/* Stats Summary Cards */}
          {!statsLoading && stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <div className="bg-card border rounded-xl p-5 card-hover">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-50 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                      <line x1="9" y1="9" x2="9.01" y2="9"></line>
                      <line x1="15" y1="9" x2="15.01" y2="9"></line>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-muted-foreground">Análises Positivas</h3>
                    <div className="flex items-end gap-2">
                      <p className="text-3xl font-bold text-emerald-600">{stats.positive}</p>
                      {stats.total > 0 && (
                        <p className="text-sm text-muted-foreground mb-1">
                          ({((stats.positive / stats.total) * 100).toFixed(0)}%)
                        </p>
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="bg-muted h-1.5 w-full rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full" 
                          style={{ width: `${stats.total ? ((stats.positive / stats.total) * 100) : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-5 card-hover">
                <div className="flex items-start gap-4">
                  <div className="bg-rose-50 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-600">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="8" y1="15" x2="16" y2="15"></line>
                      <line x1="9" y1="9" x2="9.01" y2="9"></line>
                      <line x1="15" y1="9" x2="15.01" y2="9"></line>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-muted-foreground">Análises Negativas</h3>
                    <div className="flex items-end gap-2">
                      <p className="text-3xl font-bold text-rose-600">{stats.negative}</p>
                      {stats.total > 0 && (
                        <p className="text-sm text-muted-foreground mb-1">
                          ({((stats.negative / stats.total) * 100).toFixed(0)}%)
                        </p>
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="bg-muted h-1.5 w-full rounded-full overflow-hidden">
                        <div 
                          className="bg-rose-500 h-full rounded-full" 
                          style={{ width: `${stats.total ? ((stats.negative / stats.total) * 100) : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-5 card-hover">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-50 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                      <line x1="9" y1="9" x2="9.01" y2="9"></line>
                      <line x1="15" y1="9" x2="15.01" y2="9"></line>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-muted-foreground">Análises Neutras</h3>
                    <div className="flex items-end gap-2">
                      <p className="text-3xl font-bold text-amber-600">{stats.neutral}</p>
                      {stats.total > 0 && (
                        <p className="text-sm text-muted-foreground mb-1">
                          ({((stats.neutral / stats.total) * 100).toFixed(0)}%)
                        </p>
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="bg-muted h-1.5 w-full rounded-full overflow-hidden">
                        <div 
                          className="bg-amber-500 h-full rounded-full" 
                          style={{ width: `${stats.total ? ((stats.neutral / stats.total) * 100) : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Exibir indicador de carregamento para estatísticas */}
          {statsLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
              <span className="ml-3 text-muted-foreground">Carregando estatísticas...</span>
            </div>
          )}
          
          {/* Chart and Table */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Chart */}
            <div className="lg:col-span-2 bg-card/50 rounded-xl p-5 border">
              <h3 className="font-medium mb-4 text-base">Distribuição de Sentimentos</h3>
              {!statsLoading && stats && <SentimentChart stats={stats} />}
              {statsLoading && (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                </div>
              )}
            </div>
            
            {/* Table */}
            <div className="lg:col-span-3">
              <div className="bg-card/50 rounded-xl p-5 border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-base">Análises Recentes</h3>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                    Total: {analyses?.length || 0}
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground">Data</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground">Texto</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground">Sentimento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!analysesLoading && currentItems.length > 0 ? (
                        currentItems.map((analysis) => {
                          const sentimentInfo = getSentimentInfo(analysis.sentiment);
                          return (
                            <tr key={analysis.id} className="border-b last:border-0 hover:bg-muted/50">
                              <td className="py-3 px-4 text-sm whitespace-nowrap">{formatDate(analysis.createdAt)}</td>
                              <td className="py-3 px-4 text-sm">
                                <p className="truncate max-w-[200px]">{analysis.text}</p>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${sentimentInfo.bgColor} ${sentimentInfo.textColor} border ${sentimentInfo.borderColor}`}>
                                  <span className={`${sentimentInfo.textColor}`}>
                                    {sentimentInfo.icon}
                                  </span>
                                  {sentimentInfo.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      ) : analysesLoading ? (
                        <tr>
                          <td colSpan={3} className="py-8 text-center">
                            <div className="flex justify-center items-center gap-2">
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                              <span className="text-muted-foreground">Carregando análises...</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan={3} className="py-8 text-center text-muted-foreground">
                            <div className="flex flex-col items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" x2="12" y1="5" y2="19"></line>
                                <line x1="5" x2="19" y1="12" y2="12"></line>
                              </svg>
                              <p>Nenhuma análise encontrada</p>
                              <p className="text-xs">Experimente mudar os filtros ou adicionar uma nova análise</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Paginação */}
                {analyses && analyses.length > 0 && (
                  <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="text-xs text-muted-foreground order-2 sm:order-1">
                      Mostrando {(page - 1) * itemsPerPage + 1} a {Math.min(page * itemsPerPage, analyses.length)} de {analyses.length} resultados
                    </div>
                    <div className="flex space-x-2 order-1 sm:order-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPreviousPage}
                        disabled={page === 1}
                      >
                        Anterior
                      </Button>
                      <Button
                        size="sm"
                        onClick={goToNextPage}
                        disabled={page >= totalPages}
                        className="gap-1"
                      >
                        Próximo
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
