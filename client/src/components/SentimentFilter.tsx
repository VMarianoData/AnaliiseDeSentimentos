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
    <div className="mb-8 bg-card/50 border rounded-xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-5">
        <h3 className="text-base font-semibold">Filtrar Análises</h3>
        <div>
          <Select
            value={filters.period}
            onValueChange={(value) => onPeriodChange(value as "all" | "today" | "week" | "month")}
          >
            <SelectTrigger className="w-full sm:w-[180px] gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                <line x1="16" x2="16" y1="2" y2="6"></line>
                <line x1="8" x2="8" y1="2" y2="6"></line>
                <line x1="3" x2="21" y1="10" y2="10"></line>
              </svg>
              <SelectValue placeholder="Selecione um período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as análises</SelectItem>
              <SelectItem value="today">Apenas hoje</SelectItem>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mês</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-100 p-3 rounded-lg">
          <Checkbox
            id="filter-positive"
            checked={filters.positive}
            onCheckedChange={(checked) => onFilterChange("positive", checked as boolean)}
          />
          <Label htmlFor="filter-positive" className="flex items-center gap-2 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
            <span className="text-emerald-950 font-medium">Positivos</span>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 bg-rose-50 border border-rose-100 p-3 rounded-lg">
          <Checkbox
            id="filter-negative"
            checked={filters.negative}
            onCheckedChange={(checked) => onFilterChange("negative", checked as boolean)}
          />
          <Label htmlFor="filter-negative" className="flex items-center gap-2 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-600">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="15" x2="16" y2="15"></line>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
            <span className="text-rose-950 font-medium">Negativos</span>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 bg-amber-50 border border-amber-100 p-3 rounded-lg">
          <Checkbox
            id="filter-neutral"
            checked={filters.neutral}
            onCheckedChange={(checked) => onFilterChange("neutral", checked as boolean)}
          />
          <Label htmlFor="filter-neutral" className="flex items-center gap-2 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="12" x2="16" y2="12"></line>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
            <span className="text-amber-950 font-medium">Neutros</span>
          </Label>
        </div>
      </div>
    </div>
  );
}
