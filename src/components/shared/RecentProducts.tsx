import { Package, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

interface RecentProductsProps {
  products: Product[];
}

export function RecentProducts({ products }: RecentProductsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(price);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'hace unos minutos';
    if (hours < 24) return `hace ${hours}h`;
    if (days === 1) return 'ayer';
    if (days < 7) return `hace ${days}d`;
    return date.toLocaleDateString('es-CO');
  };

  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Últimos Productos Creados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-slate-300" />
            <p className="mt-4 text-sm text-slate-600">
              Aún no hay productos
            </p>
            <Button className="mt-4" size="sm">
              Crear primer producto
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <CardTitle>Últimos Productos Creados</CardTitle>
          <a
            href="/productos"
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver todos →
          </a>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-slate-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <Package className="h-5 w-5 text-slate-400" />
              </div>

              <div className="flex-1 overflow-hidden">
                <p className="font-medium text-slate-900 truncate">
                  {product.name}
                </p>
                <p className="text-sm text-slate-500">
                  {product.category} • {formatPrice(product.price)}
                </p>
              </div>

              <p className="hidden sm:block text-sm text-slate-500">
                {formatDate(product.createdAt)}
              </p>

              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}