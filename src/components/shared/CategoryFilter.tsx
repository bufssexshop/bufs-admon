import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES } from "@/types";
import { X } from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={!selectedCategory ? "default" : "outline"}
        size="sm"
        onClick={() => onCategoryChange('')}
      >
        Todas
      </Button>

      {PRODUCT_CATEGORIES.map((category) => (
        <Button
          key={category.value}
          variant={selectedCategory === category.value ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.value)}
        >
          {category.label}
          {selectedCategory === category.value && (
            <X className="ml-2 h-3 w-3" />
          )}
        </Button>
      ))}
    </div>
  );
}