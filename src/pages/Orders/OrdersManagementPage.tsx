import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Package, Eye, Filter } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ordersService } from "@/services/orders.service";
import { ORDER_STATUS } from "@/types";

export function OrdersManagementPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['all-orders', statusFilter],
    queryFn: () => ordersService.getAllOrders(statusFilter === 'all' ? undefined : statusFilter),
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-600">Cargando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Gestión de Pedidos
          </h1>
          <p className="mt-2 text-slate-600">
            Administra todos los pedidos de los clientes
          </p>
        </div>

        {/* Filtro por estado */}
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-slate-500" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="processing">En Proceso</SelectItem>
              <SelectItem value="completed">Completados</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-sm font-medium text-slate-600">Total</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {orders.length}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-sm font-medium text-slate-600">Pendientes</div>
          <div className="mt-2 text-2xl font-bold text-yellow-600">
            {orders.filter(o => o.status === 'pending').length}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-sm font-medium text-slate-600">En Proceso</div>
          <div className="mt-2 text-2xl font-bold text-blue-600">
            {orders.filter(o => o.status === 'processing').length}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-sm font-medium text-slate-600">Completados</div>
          <div className="mt-2 text-2xl font-bold text-green-600">
            {orders.filter(o => o.status === 'completed').length}
          </div>
        </div>
      </div>

      {/* Tabla de pedidos */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <Package className="h-24 w-24 text-slate-300" />
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">
              No hay pedidos
            </h2>
            <p className="mt-2 text-slate-600">
              {statusFilter
                ? 'No hay pedidos con este estado'
                : 'Aún no se han creado pedidos'
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
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
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-900">
                        {order.userName}
                      </p>
                      <p className="text-sm text-slate-500">
                        {order.userEmail}
                      </p>
                    </div>
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
                      onClick={() => navigate(`/pedidos/${order._id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}