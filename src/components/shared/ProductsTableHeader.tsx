import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface ProductsTableHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
}

export function ProductsTableHeader({
  searchQuery,
  onSearchChange,
  onCreateClick,
}: ProductsTableHeaderProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Productos</h1>
        <p className="mt-2 text-slate-600">
          {isAdmin
            ? 'Administra el catálogo de productos'
            : 'Explora el catálogo de productos'
          }
        </p>
      </div>
      {isAdmin && (
        <Button onClick={onCreateClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Crear Producto
        </Button>
      )}
    </div>
  );
}