import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { ordersService } from "@/services/orders.service";
import { getErrorMessage } from "@/lib/error-handler";
import { toast } from "sonner";

export function CartPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { items, removeItem, updateQuantity, clearCart, getSubtotal } = useCart();
  const [notes, setNotes] = useState("");

  const createOrderMutation = useMutation({
    mutationFn: () => ordersService.create({ items, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      clearCart();
      toast.success('¡Pedido creado exitosamente!', {
        description: 'Puedes ver el estado en "Mis Pedidos"',
      });
      navigate('/mis-pedidos');
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
    },
  });

  const handleCreateOrder = () => {
    if (items.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }
    createOrderMutation.mutate();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <ShoppingCart className="h-24 w-24 text-slate-300" />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Tu carrito está vacío</h2>
          <p className="mt-2 text-slate-600">
            Agrega productos desde el catálogo para crear un pedido
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
        <h1 className="text-3xl font-bold text-slate-900">Mi Carrito</h1>
        <p className="mt-2 text-slate-600">
          Revisa los productos antes de crear tu pedido
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Lista de productos */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.productId}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Imagen */}
                  <div className="flex-shrink-0">
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="h-20 w-20 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded bg-slate-100">
                        <span className="text-sm font-medium text-slate-600">
                          {item.productName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {item.productName}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Código: {item.productCode}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Controles de cantidad */}
                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeItem(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="text-sm font-semibold text-slate-900">
                      {formatPrice(item.subtotal)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Notas */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notas del pedido (opcional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Agrega cualquier observación o instrucción especial..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Resumen del Pedido
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Productos</span>
                  <span className="font-medium">{items.length}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Unidades</span>
                  <span className="font-medium">
                    {items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-900">Total</span>
                    <span className="text-xl font-bold text-slate-900">
                      {formatPrice(getSubtotal())}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full mt-6 gap-2"
                onClick={handleCreateOrder}
                disabled={createOrderMutation.isPending}
              >
                {createOrderMutation.isPending ? (
                  'Creando pedido...'
                ) : (
                  <>
                    Crear Pedido
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={clearCart}
                disabled={createOrderMutation.isPending}
              >
                Vaciar Carrito
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}