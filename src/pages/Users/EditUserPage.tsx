import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserForm } from "@/components/shared/UserForm";
import { usersService } from "@/services/users.service";
import type { UserFormData } from "@/types";
import { getErrorMessage } from "@/lib/error-handler";

export function EditUserPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  // Fetch usuario a editar
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersService.getAll(),
  });

  const user = users.find(u => u._id === id);

  // Mutation para actualizar
  const updateMutation = useMutation({
    mutationFn: (userData: any) => usersService.update(id!, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario actualizado correctamente');
      navigate('/usuarios');
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
    },
  });

  const handleSubmit = (data: UserFormData) => {
    const userData: any = {
      firstName: data.firstName,
      lastName: data.lastName,
      secondLastname: data.secondLastname,
      documentId: Number(data.documentId),
      age: Number(data.age),
      address: data.address,
      department: data.department,
      city: data.city,
      phone: Number(data.phone),
      email: data.email,
      role: data.role,
      active: data.active,
    };

    // Solo incluir password si se proporcionó uno nuevo
    if (data.password && data.password.trim()) {
      userData.password = data.password;
    }

    updateMutation.mutate(userData);
  };

  const handleCancel = () => {
    navigate('/usuarios');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-600">Cargando usuario...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-600">Usuario no encontrado</p>
      </div>
    );
  }

  // Convertir usuario de API a formato de formulario
  const initialData: UserFormData = {
    firstName: user.firstName,
    lastName: user.lastName,
    secondLastname: user.secondLastname,
    documentId: String(user.documentId),
    age: String(user.age),
    address: user.address,
    department: user.department,
    city: user.city,
    phone: String(user.phone),
    email: user.email,
    role: user.role,
    active: user.active,
    // No incluimos password en edición
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Editar Usuario</h1>
        <p className="mt-2 text-slate-600">
          Modifica la información del usuario
        </p>
      </div>

      <UserForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}