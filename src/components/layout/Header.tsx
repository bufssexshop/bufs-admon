import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Breadcrumbs dinámicos */}
      <Breadcrumbs />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right section - Placeholder */}
      <div className="flex items-center gap-2">
        {/* Aquí irán notificaciones, user menu, etc en el futuro */}
      </div>
    </header>
  );
}