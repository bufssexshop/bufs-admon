import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, Users, Settings, LogOut, ShoppingBag, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import type { NavItem } from "@/types";

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const isAdmin = user?.role === 'admin';

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Productos",
      href: "/productos",
      icon: Package,
    },
    ...(!isAdmin ? [{
      title: "Mis Pedidos",
      href: "/mis-pedidos",
      icon: ShoppingBag,
    }] : []),
    ...(isAdmin ? [
      {
        title: "Pedidos",
        href: "/pedidos",
        icon: ClipboardList,
      },
      {
        title: "Usuarios",
        href: "/usuarios",
        icon: Users,
      }
    ] : []),
    {
      title: "Perfil",
      href: "/perfil",
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="flex h-full flex-col bg-slate-900">
      {/* Logo Section */}
      <div className="flex h-16 items-center gap-3 px-6">
        <img
          src="/logo.png"
          alt="Logo"
          className="h-10 w-10 object-contain"
        />
        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
      </div>

      <Separator className="bg-slate-800" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                )
              }
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </NavLink>
          );
        })}
      </nav>

      <Separator className="bg-slate-800" />

      {/* User Section */}
      <div className="p-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-3 rounded-lg bg-slate-800 px-3 py-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-slate-700 text-white">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white">{user?.name || 'Usuario'}</p>
              <p className="truncate text-xs text-slate-400">
                {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:bg-slate-700 hover:text-white"
              onClick={handleLogout}
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => window.location.href = '/login'}
            className="w-full"
            variant="outline"
          >
            Iniciar Sesión
          </Button>
        )}
      </div>
    </div>
  );
}