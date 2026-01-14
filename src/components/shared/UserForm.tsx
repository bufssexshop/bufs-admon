import { useState } from "react";
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
import type { UserFormData } from "@/types";
import { USER_ROLES } from "@/types";

interface UserFormProps {
  initialData?: UserFormData;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isOwnProfile?: boolean;
}

const defaultFormData: UserFormData = {
  firstName: '',
  lastName: '',
  secondLastname: '',
  documentId: '',
  age: '',
  address: '',
  department: '',
  city: '',
  phone: '',
  email: '',
  password: '',
  role: 'client',
  active: true,
};

export function UserForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isOwnProfile = false,
}: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    ...defaultFormData,
    ...initialData,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es obligatorio';
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es obligatorio';
    if (!formData.secondLastname.trim()) newErrors.secondLastname = 'El segundo apellido es obligatorio';

    if (!formData.documentId.trim()) {
      newErrors.documentId = 'El documento es obligatorio';
    } else if (isNaN(Number(formData.documentId))) {
      newErrors.documentId = 'El documento debe ser numérico';
    }

    if (!formData.age.trim()) {
      newErrors.age = 'La edad es obligatoria';
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 18) {
      newErrors.age = 'Debe ser mayor de 18 años';
    }

    if (!formData.address.trim()) newErrors.address = 'La dirección es obligatoria';
    if (!formData.department.trim()) newErrors.department = 'El departamento es obligatorio';
    if (!formData.city.trim()) newErrors.city = 'La ciudad es obligatoria';

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    } else if (isNaN(Number(formData.phone))) {
      newErrors.phone = 'El teléfono debe ser numérico';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    // Password es obligatorio solo en creación
    if (!initialData && !formData.password?.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!formData.role) newErrors.role = 'El rol es obligatorio';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información Personal */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="text-lg font-semibold text-slate-900">
              Información Personal
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  Nombre <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => {
                    setFormData({ ...formData, firstName: e.target.value });
                    if (errors.firstName) setErrors({ ...errors, firstName: undefined });
                  }}
                  placeholder="Ej: Juan"
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
              </div>

              {/* Apellido */}
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Apellido <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => {
                    setFormData({ ...formData, lastName: e.target.value });
                    if (errors.lastName) setErrors({ ...errors, lastName: undefined });
                  }}
                  placeholder="Ej: Pérez"
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
              </div>

              {/* Segundo Apellido */}
              <div className="space-y-2">
                <Label htmlFor="secondLastname">
                  Segundo Apellido <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="secondLastname"
                  value={formData.secondLastname}
                  onChange={(e) => {
                    setFormData({ ...formData, secondLastname: e.target.value });
                    if (errors.secondLastname) setErrors({ ...errors, secondLastname: undefined });
                  }}
                  placeholder="Ej: García"
                  className={errors.secondLastname ? 'border-red-500' : ''}
                />
                {errors.secondLastname && <p className="text-sm text-red-500">{errors.secondLastname}</p>}
              </div>

              {/* Documento */}
              <div className="space-y-2">
                <Label htmlFor="documentId">
                  Documento de Identidad <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="documentId"
                  value={formData.documentId}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({ ...formData, documentId: value });
                    if (errors.documentId) setErrors({ ...errors, documentId: undefined });
                  }}
                  placeholder="123456789"
                  className={errors.documentId ? 'border-red-500' : ''}
                />
                {errors.documentId && <p className="text-sm text-red-500">{errors.documentId}</p>}
              </div>

              {/* Edad */}
              <div className="space-y-2">
                <Label htmlFor="age">
                  Edad <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="age"
                  value={formData.age}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({ ...formData, age: value });
                    if (errors.age) setErrors({ ...errors, age: undefined });
                  }}
                  placeholder="18"
                  className={errors.age ? 'border-red-500' : ''}
                />
                {errors.age && <p className="text-sm text-red-500">{errors.age}</p>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ubicación */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="text-lg font-semibold text-slate-900">Ubicación</div>

            {/* Dirección */}
            <div className="space-y-2">
              <Label htmlFor="address">
                Dirección <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => {
                  setFormData({ ...formData, address: e.target.value });
                  if (errors.address) setErrors({ ...errors, address: undefined });
                }}
                placeholder="Calle 123 #45-67"
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Departamento */}
              <div className="space-y-2">
                <Label htmlFor="department">
                  Departamento <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => {
                    setFormData({ ...formData, department: e.target.value });
                    if (errors.department) setErrors({ ...errors, department: undefined });
                  }}
                  placeholder="Ej: Quindío"
                  className={errors.department ? 'border-red-500' : ''}
                />
                {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
              </div>

              {/* Ciudad */}
              <div className="space-y-2">
                <Label htmlFor="city">
                  Ciudad <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => {
                    setFormData({ ...formData, city: e.target.value });
                    if (errors.city) setErrors({ ...errors, city: undefined });
                  }}
                  placeholder="Ej: Armenia"
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacto y Acceso */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="text-lg font-semibold text-slate-900">
              Contacto y Acceso
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Teléfono */}
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Teléfono <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({ ...formData, phone: value });
                    if (errors.phone) setErrors({ ...errors, phone: undefined });
                  }}
                  placeholder="3001234567"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="usuario@example.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  Contraseña {!initialData && <span className="text-red-500">*</span>}
                  {initialData && <span className="text-sm text-slate-500"> (dejar vacío para mantener)</span>}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  placeholder="••••••••"
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              {/* Rol */}
              {!isOwnProfile && (
                <div className="space-y-2">
                  <Label htmlFor="role">
                    Rol <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: 'admin' | 'client') => {
                      setFormData({ ...formData, role: value });
                      if (errors.role) setErrors({ ...errors, role: undefined });
                    }}
                  >
                    <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_ROLES.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                </div>
              )}

              {/* Estado - Solo mostrar si NO es perfil propio */}
              {!isOwnProfile && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="text-lg font-semibold text-slate-900">Estado</div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="active">Usuario Activo</Label>
                          <p className="text-sm text-slate-500">
                            Los usuarios activos pueden acceder al sistema
                          </p>
                        </div>
                        <Switch
                          id="active"
                          checked={formData.active}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, active: checked })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3 pb-0">
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
            : 'Crear Usuario'}
        </Button>
      </div>
    </form>
  );
}