import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProductsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function ProductsFilters({
  searchQuery,
  onSearchChange,
}: ProductsFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Buscar por nombre o Código..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
}