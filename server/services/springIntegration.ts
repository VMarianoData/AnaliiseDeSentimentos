import axios from 'axios';
import { SentimentType } from '../../shared/schema';

interface SpringSentimentRequest {
  text: string;
}

interface SpringSentimentResponse {
  id?: number;
  text: string;
  sentiment: SentimentType;
  confidence: number;
  createdAt?: string;
}

/**
 * URL do servidor Spring Boot
 * Observação: esta URL pode precisar ser configurada via variável de ambiente
 * dependendo do ambiente de implantação
 */
const SPRING_API_URL = process.env.SPRING_API_URL || 'http://localhost:8080';

/**
 * Envia um texto para o servidor Spring Boot para análise de sentimento
 * e retorna o resultado processado
 * 
 * @param text Texto a ser analisado
 * @returns Resultado da análise de sentimento
 */
export async function sendToSpringForAnalysis(text: string): Promise<SpringSentimentResponse> {
  try {
    const request: SpringSentimentRequest = { text };
    const response = await axios.post(`${SPRING_API_URL}/api/sentiment`, request);
    
    return {
      id: response.data.id,
      text: response.data.text,
      sentiment: mapSpringResponseToSentimentType(response.data.sentiment),
      confidence: response.data.confidenceScore || 0.5,
      createdAt: response.data.timestamp
    };
  } catch (error) {
    console.error('Erro ao se comunicar com o servidor Spring:', error);
    throw new Error('Falha ao processar análise de sentimento no servidor Spring');
  }
}

/**
 * Mapeia os valores de sentimento do Spring para nosso formato
 */
function mapSpringResponseToSentimentType(springSentiment: string): SentimentType {
  const sentiment = springSentiment.toLowerCase();
  if (sentiment === 'positive' || sentiment === 'positivo') {
    return SentimentType.POSITIVE;
  }
  if (sentiment === 'negative' || sentiment === 'negativo') {
    return SentimentType.NEGATIVE;
  }
  return SentimentType.NEUTRAL;
}