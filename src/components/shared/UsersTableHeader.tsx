import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UsersTableHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
}

export function UsersTableHeader({
  searchQuery,
  onSearchChange,
  onCreateClick,
}: UsersTableHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Usuarios</h1>
        <p className="mt-2 text-slate-600">
          Gestiona los usuarios del sistema
        </p>
      </div>

      <Button onClick={onCreateClick} className="sm:w-auto">
        <Plus className="mr-2 h-4 w-4" />
        Nuevo Usuario
      </Button>
    </div>
  );
}