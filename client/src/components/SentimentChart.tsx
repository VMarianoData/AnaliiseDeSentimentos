import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { SentimentStats } from "@shared/schema";

interface SentimentChartProps {
  stats: SentimentStats;
}

export function SentimentChart({ stats }: SentimentChartProps) {
  // Preparar os dados para o gráfico com cores modernas
  const data = [
    { name: "Positivo", value: stats.positive, color: "#10b981" },
    { name: "Negativo", value: stats.negative, color: "#e11d48" },
    { name: "Neutro", value: stats.neutral, color: "#f59e0b" }
  ].filter(item => item.value > 0);

  // Se não houver dados, mostrar mensagem
  if (data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-muted-foreground gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <p>Nenhum dado disponível</p>
        <p className="text-xs">Realize novas análises para visualizar o gráfico</p>
      </div>
    );
  }

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
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

  // Customização da Legenda
  const CustomizedLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <div className="flex justify-center gap-4 text-xs mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-1" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground font-medium">{entry.value}: </span>
            <span className="font-semibold ml-1">{data.find(item => item.name === entry.value)?.value}</span>
          </div>
        ))}
      </div>
    );
  };

  // Customização do Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border shadow-sm rounded-md text-xs">
          <p className="font-medium">{data.name}</p>
          <p className="text-muted-foreground">
            <span className="font-semibold">{data.value}</span> análises
          </p>
        </div>
      );
    }
    return null;
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
            innerRadius={30}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                stroke="none"
                className="focus:opacity-80 hover:opacity-80 transition-opacity"
              />
            ))}
          </Pie>
          <Legend content={<CustomizedLegend />} />
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
