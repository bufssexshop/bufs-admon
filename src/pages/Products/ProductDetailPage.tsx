import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Package, DollarSign, Tag, CheckCircle, XCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddToCartButton } from "@/components/shared/AddToCartButton";
import { productsService } from "@/services/products.service";
import { useAuth } from "@/contexts/AuthContext";
import { PRODUCT_CATEGORIES, SUBCATEGORIES_MAP } from "@/types";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsService.getById(id!),
    enabled: !!id,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryLabel = (value: string) => {
    return PRODUCT_CATEGORIES.find(c => c.value === value)?.label || value;
  };

  const getSubcategoryLabel = (category: string, value: string) => {
    return SUBCATEGORIES_MAP[category]?.find(s => s.value === value)?.label || value;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-600">Cargando producto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Package className="h-24 w-24 text-slate-300" />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Producto no encontrado
          </h2>
          <p className="mt-2 text-slate-600">
            El producto que buscas no existe
          </p>
        </div>
        <Button onClick={() => navigate('/productos')}>
          Volver a Productos
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
            onClick={() => navigate('/productos')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {product.name}
            </h1>
            <p className="mt-1 text-slate-600">
              Código: {product.code}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={product.available ? "default" : "secondary"}>
            {product.available ? (
              <>
                <CheckCircle className="mr-1 h-3 w-3" />
                Disponible
              </>
            ) : (
              <>
                <XCircle className="mr-1 h-3 w-3" />
                No disponible
              </>
            )}
          </Badge>
          {isAdmin ? (
            <Button onClick={() => navigate(`/productos/${id}/editar`)}>
              Editar Producto
            </Button>
          ) : (
            <AddToCartButton product={product} />
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Imágenes */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardContent className="p-4">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-lg bg-slate-100">
                  <Package className="h-24 w-24 text-slate-300" />
                </div>
              )}
            </CardContent>
          </Card>

          {product.image2 && (
            <Card>
              <CardContent className="p-4">
                <img
                  src={product.image2}
                  alt={`${product.name} - Imagen 2`}
                  className="w-full rounded-lg object-cover"
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Información del producto */}
        <div className="lg:col-span-2 space-y-6">
          {/* Precios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Precios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-sm font-medium text-slate-600">Precio de Contado</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {formatPrice(product.price)}
                  </p>
                </div>

                {product.creditPrice > 0 && (
                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-sm font-medium text-slate-600">Precio a Crédito</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {formatPrice(product.creditPrice)}
                    </p>
                  </div>
                )}
              </div>

              {product.promotion && (
                <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <Sparkles className="h-5 w-5" />
                    <p className="font-semibold">¡En Promoción!</p>
                  </div>
                  {product.promotionValue > 0 && (
                    <p className="mt-1 text-sm text-yellow-700">
                      Descuento: {product.promotionValue}%
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Categorías */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Categorías
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Categoría Principal</p>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    {getCategoryLabel(product.category)}
                  </Badge>
                  <Badge variant="secondary">
                    {getSubcategoryLabel(product.category, product.subcategory)}
                  </Badge>
                </div>
              </div>

              {product.secondaryCategory && product.secondaryCategory !== 'none' && (
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Categoría Secundaria</p>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {getCategoryLabel(product.secondaryCategory)}
                    </Badge>
                    {product.secondarySubcategory && product.secondarySubcategory !== 'none' && (
                      <Badge variant="secondary">
                        {getSubcategoryLabel(product.secondaryCategory, product.secondarySubcategory)}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Descripción */}
          <Card>
            <CardHeader>
              <CardTitle>Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: product.details }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}