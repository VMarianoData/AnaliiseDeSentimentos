import fs from 'fs';
import path from 'path';
import { users, type User, type InsertUser, type SentimentAnalysis, type InsertSentiment, SentimentType } from "@shared/schema";

// Defina o caminho para o arquivo JSON
const DATA_DIR = path.join(process.cwd(), 'data');
const SENTIMENT_DATA_FILE = path.join(DATA_DIR, 'sentiment_data.json');

// Tipo para os filtros de período
type PeriodFilter = 'all' | 'today' | 'week' | 'month';

// Interface para as estatísticas
interface SentimentStats {
  positive: number;
  negative: number;
  neutral: number;
  total: number;
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  // Métodos para análise de sentimento
  saveSentimentAnalysis(analysis: InsertSentiment): Promise<SentimentAnalysis>;
  getSentimentAnalyses(): Promise<SentimentAnalysis[]>;
  getSentimentAnalysisById(id: number): Promise<SentimentAnalysis | undefined>;
  getSentimentStats(): Promise<SentimentStats>;
  getFilteredSentimentAnalyses(
    includeSentiments: { positive: boolean; negative: boolean; neutral: boolean },
    period: PeriodFilter
  ): Promise<SentimentAnalysis[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private sentimentAnalyses: SentimentAnalysis[];
  currentId: number;
  currentSentimentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    
    // Inicializa análises de sentimento do arquivo se existir
    this.sentimentAnalyses = [];
    this.currentSentimentId = 1;
    this.loadSentimentDataFromFile();
  }

  private loadSentimentDataFromFile() {
    try {
      // Verifica se o diretório de dados existe
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
        console.log(`Diretório de dados criado em: ${DATA_DIR}`);
      }
      
      // Verifica se o arquivo existe
      if (fs.existsSync(SENTIMENT_DATA_FILE)) {
        const data = fs.readFileSync(SENTIMENT_DATA_FILE, 'utf8');
        const parsedData = JSON.parse(data);
        
        if (Array.isArray(parsedData)) {
          this.sentimentAnalyses = parsedData;
          
          // Encontrar o maior ID para definir o próximo ID
          if (this.sentimentAnalyses.length > 0) {
            const maxId = Math.max(...this.sentimentAnalyses.map(item => item.id));
            this.currentSentimentId = maxId + 1;
          }
        }
      } else {
        console.log(`Arquivo de dados será criado em: ${SENTIMENT_DATA_FILE}`);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do arquivo JSON:', error);
      // Inicia com array vazio em caso de erro
      this.sentimentAnalyses = [];
    }
  }

  private saveSentimentDataToFile() {
    try {
      // Verifica se o diretório de dados existe, senão cria
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      
      fs.writeFileSync(SENTIMENT_DATA_FILE, JSON.stringify(this.sentimentAnalyses, null, 2), 'utf8');
    } catch (error) {
      console.error('Erro ao salvar dados no arquivo JSON:', error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveSentimentAnalysis(analysis: InsertSentiment): Promise<SentimentAnalysis> {
    const id = this.currentSentimentId++;
    const now = new Date();
    
    const newAnalysis: SentimentAnalysis = {
      ...analysis,
      id,
      createdAt: now
    };
    
    this.sentimentAnalyses.push(newAnalysis);
    this.saveSentimentDataToFile();
    
    return newAnalysis;
  }

  async getSentimentAnalyses(): Promise<SentimentAnalysis[]> {
    return [...this.sentimentAnalyses].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async getSentimentAnalysisById(id: number): Promise<SentimentAnalysis | undefined> {
    return this.sentimentAnalyses.find(analysis => analysis.id === id);
  }

  async getSentimentStats(): Promise<SentimentStats> {
    const stats: SentimentStats = {
      positive: 0,
      negative: 0,
      neutral: 0,
      total: this.sentimentAnalyses.length
    };
    
    this.sentimentAnalyses.forEach(analysis => {
      if (analysis.sentiment === SentimentType.POSITIVE) {
        stats.positive += 1;
      } else if (analysis.sentiment === SentimentType.NEGATIVE) {
        stats.negative += 1;
      } else if (analysis.sentiment === SentimentType.NEUTRAL) {
        stats.neutral += 1;
      }
    });
    
    return stats;
  }

  async getFilteredSentimentAnalyses(
    includeSentiments: { positive: boolean; negative: boolean; neutral: boolean },
    period: PeriodFilter
  ): Promise<SentimentAnalysis[]> {
    // Definir a data de início com base no período
    const startDate = new Date();
    
    if (period === 'today') {
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else {
      // 'all' - definir para uma data antiga
      startDate.setFullYear(1970);
    }
    
    return this.sentimentAnalyses.filter(analysis => {
      // Filtrar por sentimento
      const sentimentMatches =
        (includeSentiments.positive && analysis.sentiment === SentimentType.POSITIVE) ||
        (includeSentiments.negative && analysis.sentiment === SentimentType.NEGATIVE) ||
        (includeSentiments.neutral && analysis.sentiment === SentimentType.NEUTRAL);
      
      // Filtrar por período
      const dateMatches = new Date(analysis.createdAt) >= startDate;
      
      return sentimentMatches && dateMatches;
    }).sort((a, b) => {
      // Ordenar por data - mais recentes primeiro
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }
}

export const storage = new MemStorage();
