import { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { SentimentStats } from "@shared/schema";

interface SentimentChartProps {
  stats: SentimentStats;
}

export function SentimentChart({ stats }: SentimentChartProps) {
  // Preparar os dados para o gráfico
  const data = [
    { name: "Positivo", value: stats.positive, color: "#10b981" },
    { name: "Negativo", value: stats.negative, color: "#ef4444" },
    { name: "Neutro", value: stats.neutral, color: "#6b7280" }
  ].filter(item => item.value > 0);

  // Se não houver dados, mostrar mensagem
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        Nenhum dado disponível para exibir
      </div>
    );
  }

  const COLORS = ["#10b981", "#ef4444", "#6b7280"];
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <div className="h-64 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" height={36} />
          <Tooltip formatter={(value) => [`${value} análises`, ""]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
