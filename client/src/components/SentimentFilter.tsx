import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SentimentFilters } from "@shared/schema";

interface SentimentFilterProps {
  filters: SentimentFilters;
  onFilterChange: (key: keyof Omit<SentimentFilters, "period">, value: boolean) => void;
  onPeriodChange: (value: "all" | "today" | "week" | "month") => void;
}

export function SentimentFilter({ filters, onFilterChange, onPeriodChange }: SentimentFilterProps) {
  return (
    <div className="mb-8 p-4 bg-light-bg rounded-md">
      <h3 className="font-medium mb-3">Filtros</h3>
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center">
          <Checkbox
            id="filter-positive"
            checked={filters.positive}
            onCheckedChange={(checked) => onFilterChange("positive", checked as boolean)}
            className="text-positive focus:ring-positive"
          />
          <Label htmlFor="filter-positive" className="ml-2 flex items-center">
            <span className="material-icons text-positive mr-1 text-base">sentiment_very_satisfied</span>
            Positivos
          </Label>
        </div>
        
        <div className="flex items-center">
          <Checkbox
            id="filter-negative"
            checked={filters.negative}
            onCheckedChange={(checked) => onFilterChange("negative", checked as boolean)}
            className="text-negative focus:ring-negative"
          />
          <Label htmlFor="filter-negative" className="ml-2 flex items-center">
            <span className="material-icons text-negative mr-1 text-base">sentiment_very_dissatisfied</span>
            Negativos
          </Label>
        </div>
        
        <div className="flex items-center">
          <Checkbox
            id="filter-neutral"
            checked={filters.neutral}
            onCheckedChange={(checked) => onFilterChange("neutral", checked as boolean)}
            className="text-neutral focus:ring-neutral"
          />
          <Label htmlFor="filter-neutral" className="ml-2 flex items-center">
            <span className="material-icons text-neutral mr-1 text-base">sentiment_neutral</span>
            Neutros
          </Label>
        </div>
        
        <div className="ml-auto">
          <Label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Período:
          </Label>
          <Select
            value={filters.period}
            onValueChange={(value) => onPeriodChange(value as "all" | "today" | "week" | "month")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione um período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mês</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
