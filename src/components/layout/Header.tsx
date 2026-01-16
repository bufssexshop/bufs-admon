import { Menu, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs } from "../shared/Breadcrumbs";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { getTotalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const totalItems = getTotalItems();
  const isClient = user?.role === 'client';

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Menu button para mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Breadcrumbs */}
      <div className="hidden lg:block">
        <Breadcrumbs />
      </div>

      {/* Carrito (solo para clientes) */}
      {isClient && (
        <Button
          variant="outline"
          className="gap-2 relative"
          onClick={() => navigate('/carrito')}
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="hidden sm:inline">Carrito</span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
              {totalItems}
            </span>
          )}
        </Button>
      )}
    </header>
  );
}