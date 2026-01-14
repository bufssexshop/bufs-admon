import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProductForm } from "@/components/shared/ProductForm";
import { productsService } from "@/services/products.service";
import type { ProductFormData } from "@/types";
import { getErrorMessage } from "@/lib/error-handler";

export function EditProductPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  // Fetch producto a editar
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsService.getById(id!),
    enabled: !!id,
  });

  // Mutation para actualizar
  const updateMutation = useMutation({
    mutationFn: (formData: FormData) => productsService.update(id!, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      toast.success('Producto actualizado correctamente');
      navigate('/productos');
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
    },
  });

  const handleSubmit = (data: ProductFormData) => {
    const formData = new FormData();

    // Campos obligatorios
    formData.append('code', data.code);
    formData.append('name', data.name);
    formData.append('price', data.price);
    formData.append('creditPrice', data.creditPrice);
    formData.append('details', data.details);
    formData.append('category', data.category);
    formData.append('subcategory', data.subcategory);
    formData.append('available', String(data.available));

    // Campos opcionales
    if (data.secondaryCategory) {
      formData.append('secondaryCategory', data.secondaryCategory);
    }
    if (data.secondarySubcategory) {
      formData.append('secondarySubcategory', data.secondarySubcategory);
    }

    // Imágenes solo si fueron cambiadas
    if (data.image) {
      formData.append('image', data.image);
    }
    if (data.image2) {
      formData.append('image2', data.image2);
    }

    updateMutation.mutate(formData);
  };

  const handleCancel = () => {
    navigate('/productos');
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
      <div className="flex items-center justify-center h-96">
        <p className="text-red-600">Producto no encontrado</p>
      </div>
    );
  }

  const initialData: Partial<ProductFormData> = {
    code: product.code,
    name: product.name,
    price: String(product.price),
    creditPrice: String(product.creditPrice),
    details: product.details,
    category: product.category,
    subcategory: product.subcategory,
    // Solo incluir si tienen valor Y no son "none"
    ...(product.secondaryCategory && product.secondaryCategory !== 'none' && {
      secondaryCategory: product.secondaryCategory
    }),
    ...(product.secondarySubcategory && product.secondarySubcategory !== 'none' && {
      secondarySubcategory: product.secondarySubcategory
    }),
    available: product.available,
    ...({ image: product.image } as any),
    ...({ image2: product.image2 } as any),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Editar Producto</h1>
        <p className="mt-2 text-slate-600">
          Modifica la información del producto
        </p>
      </div>

      <ProductForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}