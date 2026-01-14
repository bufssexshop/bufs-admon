import { Package, Users, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { MetricCard } from "@/components/shared/MetricCard";
import { MetricCardSkeleton } from "@/components/shared/MetricCardSkeleton";
import { RecentProducts } from "@/components/shared/RecentProducts";
import { productsService } from "@/services/products.service";
import { useAuth } from "@/contexts/AuthContext";
import type { Product } from "@/types";

export function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const { data: allProductsData, isLoading: metricsLoading } = useQuery({
    queryKey: ['all-products-metrics'],
    queryFn: () => productsService.getAll({ limit: 1000, page: 1 }),
    enabled: isAdmin, // Solo cargar si es admin
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['recent-products'],
    queryFn: () => productsService.getAll({ limit: 5, page: 1 }),
  });

  const metrics = allProductsData ? {
    totalProducts: allProductsData.totalProducts || 0,
    activeProducts: allProductsData.products.filter(p => p.available).length,
    inactiveProducts: allProductsData.products.filter(p => !p.available).length,
    totalUsers: 0,
  } : null;

  const recentProducts: Product[] = productsData?.products.map(p => ({
    ...p,
    id: p._id,
    category: p.category,
    price: p.price,
    createdAt: new Date(p.createdAt),
    status: p.available ? 'active' as const : 'inactive' as const,
  })) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">
          {isAdmin
            ? 'Bienvenido al panel de administración'
            : 'Bienvenido, explora nuestro catálogo de productos'
          }
        </p>
      </div>

      {/* Métricas - Solo para admin */}
      {isAdmin && (
        metricsLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </div>
        ) : metrics ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              title="Total Productos"
              value={metrics.totalProducts}
              icon={Package}
              change={{
                value: 0,
                label: `${metrics.totalProducts} en catálogo`,
              }}
              href="/productos"
            />

            <MetricCard
              title="Productos Activos"
              value={metrics.activeProducts}
              icon={CheckCircle}
              change={{
                value: 0,
                label: `${Math.round(
                  (metrics.activeProducts / metrics.totalProducts) * 100
                )}% del total`,
              }}
            />

            <MetricCard
              title="Total Usuarios"
              value={metrics.totalUsers}
              icon={Users}
              change={{
                value: 0,
                label: 'Requiere autenticación',
              }}
              href="/usuarios"
            />
          </div>
        ) : null
      )}

      {/* Productos Recientes */}
      {productsLoading ? (
        <div className="h-64 animate-pulse rounded-lg bg-slate-200" />
      ) : (
        <RecentProducts products={recentProducts} />
      )}
    </div>
  );
}