import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UsersTableHeader } from "@/components/shared/UsersTableHeader";
import { UsersFilters } from "@/components/shared/UsersFilters";
import { UsersTable } from "@/components/shared/UsersTable";
import { UsersTableSkeleton } from "@/components/shared/UsersTableSkeleton";
import { DeleteUserDialog } from "@/components/shared/DeleteUserDialog";
import { usersService } from "@/services/users.service";
import { getErrorMessage } from "@/lib/error-handler";
import type { User } from "@/types";

export function UsersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersService.getAll(),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => usersService.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Estado del usuario actualizado');
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
    },
  });

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateUser = () => {
    navigate('/usuarios/nuevo');
  };

  const handleEditUser = (user: User) => {
    navigate(`/usuarios/${user._id}/editar`);
  };

  const handleDeleteUser = () => {
    if (userToDelete) {
      toggleStatusMutation.mutate(userToDelete._id);
      setUserToDelete(null);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600">Error al cargar usuarios</p>
          <p className="text-sm text-slate-600 mt-2">
            {getErrorMessage(error)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UsersTableHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateClick={handleCreateUser}
      />

      <UsersFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {isLoading ? (
        <UsersTableSkeleton rows={8} />
      ) : (
        <UsersTable
          users={filteredUsers}
          onEdit={handleEditUser}
          onDelete={setUserToDelete}
        />
      )}

      <DeleteUserDialog
        user={userToDelete}
        open={!!userToDelete}
        onOpenChange={(open) => !open && setUserToDelete(null)}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
}