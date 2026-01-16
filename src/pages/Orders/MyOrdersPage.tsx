import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Package, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ordersService } from "@/services/orders.service";
import { ORDER_STATUS } from "@/types";

export function MyOrdersPage() {
  const navigate = useNavigate();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => ordersService.getMyOrders(),
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-600">Cargando pedidos...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Package className="h-24 w-24 text-slate-300" />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            No tienes pedidos aún
          </h2>
          <p className="mt-2 text-slate-600">
            Crea tu primer pedido desde el catálogo de productos
          </p>
        </div>
        <Button onClick={() => navigate('/productos')}>
          Ver Productos
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Mis Pedidos</h1>
        <p className="mt-2 text-slate-600">
          Consulta el estado de tus pedidos
        </p>
      </div>

      {/* Tabla */}
      <div className="rounded-lg border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-mono font-medium">
                  {order.orderNumber}
                </TableCell>
                <TableCell className="text-slate-600">
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell className="text-slate-600">
                  {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                </TableCell>
                <TableCell className="font-semibold">
                  {formatPrice(order.total)}
                </TableCell>
                <TableCell>
                  <Badge className={ORDER_STATUS[order.status].color}>
                    {ORDER_STATUS[order.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => navigate(`/mis-pedidos/${order._id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}