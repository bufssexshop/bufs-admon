import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Shield, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usersService } from "@/services/users.service";

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersService.getAll(),
  });

  const user = users?.find(u => u._id === id);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <User className="h-24 w-24 text-slate-300" />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Usuario no encontrado
          </h2>
          <p className="mt-2 text-slate-600">
            El usuario que buscas no existe
          </p>
        </div>
        <Button onClick={() => navigate('/usuarios')}>
          Volver a Usuarios
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/usuarios')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {user.firstName} {user.lastName}
            </h1>
            <p className="mt-1 text-slate-600">
              Detalles del usuario
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={user.active ? "default" : "secondary"}>
            {user.active ? (
              <>
                <CheckCircle className="mr-1 h-3 w-3" />
                Activo
              </>
            ) : (
              <>
                <XCircle className="mr-1 h-3 w-3" />
                Inactivo
              </>
            )}
          </Badge>
          <Button onClick={() => navigate(`/usuarios/${id}/editar`)}>
            Editar Usuario
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Información Personal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-600">Nombre Completo</p>
              <p className="mt-1 text-slate-900">
                {user.firstName} {user.lastName} {user.secondLastname}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-600">Documento de Identidad</p>
              <p className="mt-1 text-slate-900">{user.documentId}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-600">Edad</p>
              <p className="mt-1 text-slate-900">{user.age} años</p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-600">Rol</p>
              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                <Shield className="mr-1 h-3 w-3" />
                {user.role === 'admin' ? 'Administrador' : 'Cliente'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Información de Contacto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-slate-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-slate-600">Email</p>
                <p className="mt-1 text-slate-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-slate-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-slate-600">Teléfono</p>
                <p className="mt-1 text-slate-900">{user.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-slate-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-slate-600">Dirección</p>
                <p className="mt-1 text-slate-900">{user.address}</p>
                <p className="text-sm text-slate-600">
                  {user.city}, {user.department}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información del Sistema */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Información del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-slate-600">Fecha de Registro</p>
              <p className="mt-1 text-slate-900">{formatDate(user.createdAt)}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-600">Última Actualización</p>
              <p className="mt-1 text-slate-900">{formatDate(user.updatedAt)}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-600">Términos y Condiciones</p>
              <Badge variant={user.termsAndConditions ? "default" : "secondary"}>
                {user.termsAndConditions ? (
                  <>
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Aceptados
                  </>
                ) : (
                  <>
                    <XCircle className="mr-1 h-3 w-3" />
                    No aceptados
                  </>
                )}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}