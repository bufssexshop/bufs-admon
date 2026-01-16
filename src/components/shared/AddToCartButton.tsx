import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import type { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product;
  size?: "sm" | "default" | "lg";
  fullWidth?: boolean;
}

export function AddToCartButton({
  product,
  size = "default",
  fullWidth = false
}: AddToCartButtonProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      productName: product.name,
      productCode: product.code,
      productImage: product.image,
      price: product.price,
    });

    toast.success('Producto agregado al carrito', {
      description: product.name,
    });
  };

  return (
    <Button
      onClick={handleAddToCart}
      size={size}
      className={fullWidth ? 'w-full gap-2' : 'gap-2'}
    >
      <ShoppingCart className="h-4 w-4" />
      Agregar
    </Button>
  );
}