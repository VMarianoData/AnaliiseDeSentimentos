import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Tipos de sentimento
export enum SentimentType {
  POSITIVE = "positive",
  NEGATIVE = "negative",
  NEUTRAL = "neutral"
}

// Schema para análise de sentimento
export const sentimentAnalysis = pgTable("sentiment_analysis", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  sentiment: text("sentiment").notNull(),
  confidence: integer("confidence").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertSentimentSchema = createInsertSchema(sentimentAnalysis).pick({
  text: true,
  sentiment: true,
  confidence: true
});

export type InsertSentiment = z.infer<typeof insertSentimentSchema>;
export type SentimentAnalysis = typeof sentimentAnalysis.$inferSelect;

// Schema para o formulário de análise
export const analysisFormSchema = z.object({
  text: z.string().min(10, { message: "O texto deve ter pelo menos 10 caracteres." })
});

export type AnalysisForm = z.infer<typeof analysisFormSchema>;

// Modelo para resposta da API
export interface SentimentResponse {
  id: number;
  text: string;
  sentiment: SentimentType;
  confidence: number;
  createdAt: string;
  source?: string; // Identificador opcional do serviço que realizou a análise ("spring" ou "local")
}

// Modelo para estatísticas
export interface SentimentStats {
  positive: number;
  negative: number;
  neutral: number;
  total: number;
}

// Filtros para estatísticas
export interface SentimentFilters {
  positive: boolean;
  negative: boolean;
  neutral: boolean;
  period: "all" | "today" | "week" | "month";
}
