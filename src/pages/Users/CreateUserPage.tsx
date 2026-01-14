import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserForm } from "@/components/shared/UserForm";
import { usersService } from "@/services/users.service";
import { getErrorMessage } from "@/lib/error-handler";
import type { UserFormData } from "@/types";

export function CreateUserPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (userData: any) => usersService.create(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario creado correctamente');
      navigate('/usuarios');
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
    },
  });

  const handleSubmit = (data: UserFormData) => {
    const userData = {
      firstName: data.firstName,
      middleName: '', // Campo opcional
      lastName: data.lastName,
      secondLastname: data.secondLastname,
      documentId: Number(data.documentId),
      age: Number(data.age),
      address: data.address,
      department: data.department,
      city: data.city,
      phone: Number(data.phone),
      email: data.email,
      password: data.password,
      role: data.role,
      active: data.active,
      termsAndConditions: false,
    };

    createMutation.mutate(userData);
  };

  const handleCancel = () => {
    navigate('/usuarios');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Crear Usuario</h1>
        <p className="mt-2 text-slate-600">
          Agrega un nuevo usuario al sistema
        </p>
      </div>

      <UserForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}