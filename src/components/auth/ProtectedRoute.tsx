import { Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { usersService } from '@/services/users.service';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user: authUser, isLoading: authLoading } = useAuth();
  const location = useLocation();

  const { data: currentUser, isLoading: userLoading, error } = useQuery({
    queryKey: ['current-user', authUser?.id],
    queryFn: () => usersService.getCurrentUser(),
    enabled: isAuthenticated && !!authUser?.id && !authLoading,
    retry: false,
  });

  // Esperar a que termine de cargar el auth del localStorage
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Mientras carga datos del usuario
  if (userLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-slate-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si hay error al cargar usuario (opcional: manejar el error)
  if (error) {
    console.error('Error al verificar usuario:', error);
  }

  // Si no aceptó términos, redirigir a página de términos
  if (currentUser && !currentUser.termsAndConditions && location.pathname !== '/terms') {
    return <Navigate to="/terms" replace />;
  }

  // Si está en la página de términos pero ya los aceptó, redirigir al dashboard
  if (currentUser?.termsAndConditions && location.pathname === '/terms') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}