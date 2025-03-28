import { apiRequest } from "./queryClient";
import type { SentimentResponse, SentimentStats, SentimentFilters, AnalysisForm } from "@shared/schema";

/**
 * Envia texto para análise de sentimento usando o serviço de AI (Gemini/OpenAI)
 */
export async function analyzeSentiment(text: string): Promise<SentimentResponse> {
  const res = await apiRequest("POST", "/api/analyze", { text });
  return await res.json();
}

/**
 * Obtém as análises de sentimento com filtros opcionais
 */
export async function getSentimentAnalyses(filters?: SentimentFilters): Promise<SentimentResponse[]> {
  const params = new URLSearchParams();
  
  if (filters) {
    params.append("positive", filters.positive.toString());
    params.append("negative", filters.negative.toString());
    params.append("neutral", filters.neutral.toString());
    params.append("period", filters.period);
  }
  
  const queryString = params.toString() ? `?${params.toString()}` : "";
  const res = await fetch(`/api/analyses${queryString}`, {
    credentials: "include"
  });
  
  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${await res.text()}`);
  }
  
  return await res.json();
}

/**
 * Obtém estatísticas das análises de sentimento
 */
export async function getSentimentStats(): Promise<SentimentStats> {
  const res = await fetch("/api/stats", {
    credentials: "include"
  });
  
  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${await res.text()}`);
  }
  
  return await res.json();
}

/**
 * Obtém uma análise específica por ID
 */
export async function getSentimentAnalysisById(id: number): Promise<SentimentResponse> {
  const res = await fetch(`/api/analyses/${id}`, {
    credentials: "include"
  });
  
  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${await res.text()}`);
  }
  
  return await res.json();
}
