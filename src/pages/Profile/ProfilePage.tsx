import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserForm } from "@/components/shared/UserForm";
import { usersService } from "@/services/users.service";
import { getErrorMessage } from "@/lib/error-handler";
import { useAuth } from "@/contexts/AuthContext";
import type { UserFormData } from "@/types";

export function ProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: authUser } = useAuth();

  // Fetch datos del usuario actual
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['current-user', authUser?.id],
    queryFn: () => usersService.getCurrentUser(),
    enabled: !!authUser?.id,
  });

  // Mutation para actualizar perfil
  const updateMutation = useMutation({
    mutationFn: (userData: any) => usersService.updateOwnProfile(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      toast.success('Perfil actualizado correctamente');
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
    },
  });

  const handleSubmit = (data: UserFormData) => {
    const userData = {
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
    };

    // Solo incluir password si se proporcionó uno nuevo
    if (data.password && data.password.trim()) {
      (userData as any).password = data.password;
    }

    updateMutation.mutate(userData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-600">Cargando perfil...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-600">Error al cargar perfil</p>
      </div>
    );
  }

  const initialData: UserFormData = {
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    secondLastname: currentUser.secondLastname,
    documentId: String(currentUser.documentId),
    age: String(currentUser.age),
    address: currentUser.address,
    department: currentUser.department,
    city: currentUser.city,
    phone: String(currentUser.phone),
    email: currentUser.email,
    role: currentUser.role,
    active: currentUser.active,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Mi Perfil</h1>
        <p className="mt-2 text-slate-600">
          Actualiza tu información personal
        </p>
      </div>

      <UserForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/')}
        isLoading={updateMutation.isPending}
        isOwnProfile={true}
      />
    </div>
  );
}