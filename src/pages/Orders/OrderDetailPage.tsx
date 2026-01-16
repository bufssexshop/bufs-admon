import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Package, User, Mail, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ordersService } from "@/services/orders.service";
import { ORDER_STATUS } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-handler";

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersService.getById(id!),
    enabled: !!id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => ordersService.updateStatus(id!, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['all-orders'] });
      toast.success('Estado actualizado correctamente');
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
    },
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-600">Cargando pedido...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Package className="h-24 w-24 text-slate-300" />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Pedido no encontrado
          </h2>
          <p className="mt-2 text-slate-600">
            El pedido que buscas no existe o fue eliminado
          </p>
        </div>
        <Button onClick={() => navigate(-1)}>
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Pedido {order.orderNumber}
            </h1>
            <p className="mt-1 text-slate-600">
              Creado el {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <Badge className={ORDER_STATUS[order.status].color}>
          {ORDER_STATUS[order.status].label}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Información del pedido */}
        <div className="lg:col-span-2 space-y-6">
          {/* Productos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Productos ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 pb-4 border-b border-slate-200 last:border-0 last:pb-0"
                  >
                    {/* Imagen */}
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="h-16 w-16 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded bg-slate-100">
                        <span className="text-sm font-medium text-slate-600">
                          {item.productName.charAt(0)}
                        </span>
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Código: {item.productCode}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="mt-6 space-y-2 border-t border-slate-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-slate-900">Total</span>
                  <span className="text-slate-900">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notas */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notas del cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-wrap">
                  {order.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Información del cliente y estado */}
        <div className="space-y-6">
          {/* Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-slate-500 mt-1" />
                <div>
                  <p className="text-sm text-slate-600">Nombre</p>
                  <p className="font-medium text-slate-900">
                    {order.userName}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-slate-500 mt-1" />
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="font-medium text-slate-900">
                    {order.userEmail}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-slate-500 mt-1" />
                <div>
                  <p className="text-sm text-slate-600">Fecha del pedido</p>
                  <p className="font-medium text-slate-900">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cambiar estado (solo admin) */}
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Cambiar Estado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  value={order.status}
                  onValueChange={(value) => updateStatusMutation.mutate(value)}
                  disabled={updateStatusMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="processing">En Proceso</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-slate-500">
                  El cliente podrá ver el cambio de estado en tiempo real
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}