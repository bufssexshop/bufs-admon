import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProductForm } from "@/components/shared/ProductForm";
import { productsService } from "@/services/products.service";
import type { ProductFormData } from "@/types";
import { getErrorMessage } from "@/lib/error-handler";

export function CreateProductPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => productsService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto creado correctamente');
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

    // Campos opcionales - solo agregar si existen
    if (data.secondaryCategory) {
      formData.append('secondaryCategory', data.secondaryCategory);
    }
    if (data.secondarySubcategory) {
      formData.append('secondarySubcategory', data.secondarySubcategory);
    }

    // Imágenes
    if (data.image) {
      formData.append('image', data.image);
    }
    if (data.image2) {
      formData.append('image2', data.image2);
    }

    createMutation.mutate(formData);
  };

  const handleCancel = () => {
    navigate('/productos');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Crear Producto</h1>
        <p className="mt-2 text-slate-600">
          Agrega un nuevo producto al catálogo
        </p>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}