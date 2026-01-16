import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProductsTableHeader } from "@/components/shared/ProductsTableHeader";
import { ProductsFilters } from "@/components/shared/ProductsFilters";
import { ProductsTable } from "@/components/shared/ProductsTable";
import { ProductsTableSkeleton } from "@/components/shared/ProductsTableSkeleton";
import { DeleteProductDialog } from "@/components/shared/DeleteProductDialog";
import { Pagination } from "@/components/shared/Pagination";
import { productsService } from "@/services/products.service";
import { getErrorMessage } from "@/lib/error-handler";
import type { Product } from "@/types";
import { CategoryFilter } from "@/components/shared/CategoryFilter";

export function ProductsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const { data, isLoading, error } = useQuery({
  queryKey: ['products', searchQuery, currentPage, selectedCategory],
  queryFn: () => productsService.getAll({
    search: searchQuery || undefined,
    category: selectedCategory || undefined,
    limit: itemsPerPage,
    page: currentPage,
  }),
});

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto eliminado correctamente');
      setProductToDelete(null);
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
    },
  });

  // Handlers
  const handleCreateProduct = () => {
    navigate('/productos/nuevo');
  };

  const handleEditProduct = (product: Product) => {
    navigate(`/productos/${product._id}/editar`);
  };

  const handleViewProduct = (product: Product) => {
    navigate(`/productos/${product._id}`);
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete._id);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600">Error al cargar productos</p>
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['products'] })}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      <ProductsTableHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onCreateClick={handleCreateProduct}
      />

      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <ProductsFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {isLoading ? (
        <ProductsTableSkeleton rows={10} />
      ) : (
        <>
          <ProductsTable
            products={products}
            onEdit={handleEditProduct}
            onDelete={setProductToDelete}
            onView={handleViewProduct}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      <DeleteProductDialog
        product={productToDelete}
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
        onConfirm={handleDeleteProduct}
      />
    </div>
  );
}