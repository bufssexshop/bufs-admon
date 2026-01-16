import { useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import type { ProductFormData } from "@/types";
import { PRODUCT_CATEGORIES, SUBCATEGORIES_MAP } from "@/types";
import { RichTextEditor } from "./RichTextEditor";

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FormErrors {
  code?: string;
  name?: string;
  price?: string;
  creditPrice?: string;
  details?: string;
  category?: string;
  subcategory?: string;
  image?: string;
}

const defaultFormData: ProductFormData = {
  code: '',
  name: '',
  price: '',
  creditPrice: '',
  details: '',
  category: '',
  subcategory: '',
  available: true,
};

export function ProductForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    ...defaultFormData,
    ...initialData,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [image2Preview, setImage2Preview] = useState<string | null>(null);

  const [hasSecondaryCategory, setHasSecondaryCategory] = useState(
  !!(initialData?.secondaryCategory && initialData.secondaryCategory !== 'none')
);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.code.trim()) newErrors.code = 'El código es obligatorio';
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';

    // Precio normal
    if (!formData.price || Number(formData.price) < 0) {
      newErrors.price = 'El precio debe ser mayor o igual a 0';
    }

    // Precio a crédito - PERMITIR 0
    if (formData.creditPrice === '' || formData.creditPrice === undefined) {
      newErrors.creditPrice = 'El precio a crédito es obligatorio';
    } else if (Number(formData.creditPrice) < 0) {
      newErrors.creditPrice = 'El precio a crédito debe ser mayor o igual a 0';
    }

    if (!formData.details.trim()) newErrors.details = 'Los detalles son obligatorios';
    if (!formData.category) newErrors.category = 'La categoría es obligatoria';
    if (!formData.subcategory) newErrors.subcategory = 'La subcategoría es obligatoria';

    // Imagen obligatoria solo en creación
    if (!initialData && !formData.image) {
      newErrors.image = 'La imagen es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'image2') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, [field]: file });

      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === 'image') {
          setImagePreview(reader.result as string);
        } else {
          setImage2Preview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);

      // Limpiar error
      if (errors[field]) {
        setErrors({ ...errors, [field]: undefined });
      }
    }
  };

  const handleRemoveImage = (field: 'image' | 'image2') => {
    setFormData({ ...formData, [field]: undefined });
    if (field === 'image') {
      setImagePreview(null);
    } else {
      setImage2Preview(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información Básica */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="text-lg font-semibold text-slate-900">
              Información Básica
            </div>

            {/* Código */}
            <div className="space-y-2">
              <Label htmlFor="code">
                Código <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => {
                  setFormData({ ...formData, code: e.target.value });
                  if (errors.code) setErrors({ ...errors, code: undefined });
                }}
                placeholder="Ej: PROD-001"
                className={errors.code ? 'border-red-500' : ''}
              />
              {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
            </div>

            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Nombre del Producto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                placeholder='Ej: Vibrador Pro'
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Categoría Principal */}
            <div className="text-lg font-semibold text-slate-900">
              Categorías
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Categoría */}
              <div className="space-y-2">
                <Label htmlFor="category">
                  Categoría <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => {
                    setFormData({ ...formData, category: value, subcategory: '' });
                    if (errors.category) setErrors({ ...errors, category: undefined });
                  }}
                >
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
              </div>

              {/* Subcategoría */}
              <div className="space-y-2">
                <Label htmlFor="subcategory">
                  Subcategoría <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.subcategory}
                  onValueChange={(value) => {
                    setFormData({ ...formData, subcategory: value });
                    if (errors.subcategory) setErrors({ ...errors, subcategory: undefined });
                  }}
                  disabled={!formData.category}
                >
                  <SelectTrigger className={errors.subcategory ? 'border-red-500' : ''}>
                    <SelectValue placeholder={formData.category ? "Selecciona subcategoría" : "Primero elige categoría"} />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.category && SUBCATEGORIES_MAP[formData.category]?.map((sub) => (
                      <SelectItem key={sub.value} value={sub.value}>
                        {sub.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subcategory && <p className="text-sm text-red-500">{errors.subcategory}</p>}
              </div>
            </div>

            {/* Switch para habilitar categoría secundaria */}
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="space-y-0.5">
                <Label htmlFor="hasSecondary">Agregar categoría secundaria</Label>
                <p className="text-sm text-slate-500">
                  Permite clasificar el producto en una categoría adicional
                </p>
              </div>
              <Switch
                id="hasSecondary"
                checked={hasSecondaryCategory}
                onCheckedChange={(checked) => {
                  setHasSecondaryCategory(checked);
                  if (!checked) {
                    setFormData({
                      ...formData,
                      secondaryCategory: '',
                      secondarySubcategory: '',
                    });
                  }
                }}
              />
            </div>

            {/* Categorías Secundarias (solo si está habilitado) */}
            {hasSecondaryCategory && (
              <div className="grid gap-4 sm:grid-cols-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
                {/* Categoría Secundaria */}
                <div className="space-y-2">
                  <Label htmlFor="secondaryCategory">
                    Categoría Secundaria
                  </Label>
                  <Select
                    value={formData.secondaryCategory || ''}
                    onValueChange={(value) => {
                      setFormData({
                        ...formData,
                        secondaryCategory: value,
                        secondarySubcategory: '',
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subcategoría Secundaria */}
                <div className="space-y-2">
                  <Label htmlFor="secondarySubcategory">
                    Subcategoría Secundaria
                  </Label>
                  <Select
                    value={formData.secondarySubcategory || ''}
                    onValueChange={(value) => {
                      setFormData({ ...formData, secondarySubcategory: value });
                    }}
                    disabled={!formData.secondaryCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.secondaryCategory ? "Selecciona subcategoría" : "Primero elige categoría"} />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.secondaryCategory && SUBCATEGORIES_MAP[formData.secondaryCategory]?.map((sub) => (
                        <SelectItem key={sub.value} value={sub.value}>
                          {sub.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="details">
                Detalles <span className="text-red-500">*</span>
              </Label>
              <RichTextEditor
                content={formData.details}
                onChange={(html) => {
                  setFormData({ ...formData, details: html });
                  if (errors.details) setErrors({ ...errors, details: undefined });
                }}
                placeholder="Descripción detallada del producto..."
                className={errors.details ? 'border-red-500' : ''}
              />
              {errors.details && <p className="text-sm text-red-500">{errors.details}</p>}
              <p className="text-xs text-slate-500">
                Usa el editor para dar formato al texto
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Precios */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="text-lg font-semibold text-slate-900">Precios</div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Precio de contado */}
              <div className="space-y-2">
                <Label htmlFor="price">
                  Precio de Contado (COP) <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    $
                  </span>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setFormData({ ...formData, price: value });
                      if (errors.price) setErrors({ ...errors, price: undefined });
                    }}
                    placeholder="0"
                    className={`pl-7 ${errors.price ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                {formData.price && !errors.price && (
                  <p className="text-sm text-slate-500">
                    {new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                    }).format(Number(formData.price))}
                  </p>
                )}
              </div>

              {/* Precio a crédito */}
              <div className="space-y-2">
                <Label htmlFor="creditPrice">
                  Precio a Crédito (COP) <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    $
                  </span>
                  <Input
                    id="creditPrice"
                    value={formData.creditPrice}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setFormData({ ...formData, creditPrice: value });
                      if (errors.creditPrice) setErrors({ ...errors, creditPrice: undefined });
                    }}
                    placeholder="0"
                    className={`pl-7 ${errors.creditPrice ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.creditPrice && <p className="text-sm text-red-500">{errors.creditPrice}</p>}
                {formData.creditPrice && !errors.creditPrice && (
                  <p className="text-sm text-slate-500">
                    {new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                    }).format(Number(formData.creditPrice))}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Imágenes */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="text-lg font-semibold text-slate-900">Imágenes</div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Imagen principal */}
              <div className="space-y-2">
                <Label htmlFor="image">
                  Imagen Principal <span className="text-red-500">*</span>
                </Label>
                {imagePreview || (initialData as any)?.image ? (
                  <div className="relative">
                    <img
                      src={imagePreview || (initialData as any)?.image}
                      alt="Preview"
                      className="h-48 w-full rounded-lg object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2"
                      onClick={() => handleRemoveImage('image')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="image"
                    className={`flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors hover:bg-slate-50 ${
                      errors.image ? 'border-red-500' : 'border-slate-300'
                    }`}
                  >
                    <Upload className="h-8 w-8 text-slate-400" />
                    <p className="mt-2 text-sm text-slate-600">
                      Click para subir imagen
                    </p>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(e, 'image')}
                    />
                  </label>
                )}
                {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
              </div>

              {/* Imagen secundaria */}
              <div className="space-y-2">
                <Label htmlFor="image2">Imagen Secundaria (Opcional)</Label>
                {image2Preview || (initialData as any)?.image2 ? (
                  <div className="relative">
                    <img
                      src={image2Preview || (initialData as any)?.image2}
                      alt="Preview 2"
                      className="h-48 w-full rounded-lg object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2"
                      onClick={() => handleRemoveImage('image2')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="image2"
                    className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 transition-colors hover:bg-slate-50"
                  >
                    <Upload className="h-8 w-8 text-slate-400" />
                    <p className="mt-2 text-sm text-slate-600">
                      Click para subir imagen
                    </p>
                    <Input
                      id="image2"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(e, 'image2')}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estado */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="text-lg font-semibold text-slate-900">Estado</div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="available">Producto Disponible</Label>
                <p className="text-sm text-slate-500">
                  Los productos disponibles son visibles en el catálogo
                </p>
              </div>
              <Switch
                id="available"
                checked={formData.available}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, available: checked })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? 'Guardando...'
            : initialData
            ? 'Actualizar'
            : 'Crear Producto'}
        </Button>
      </div>
    </form>
  );
}