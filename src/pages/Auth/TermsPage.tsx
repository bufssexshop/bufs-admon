import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { getErrorMessage } from '@/lib/error-handler';
import { usersService } from '@/services/users.service';

export function TermsPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [accepted, setAccepted] = useState(false);

  const acceptTermsMutation = useMutation({
    mutationFn: () => usersService.acceptTerms(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      toast.success('Términos aceptados correctamente');
      navigate('/');
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
    },
  });

  const handleAccept = () => {
    if (!accepted) {
      toast.error('Debes aceptar los términos y condiciones');
      return;
    }
    acceptTermsMutation.mutate();
  };

  const handleDecline = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Términos y Condiciones</CardTitle>
          <CardDescription className="text-center">
            Por favor lee y acepta nuestros términos antes de continuar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contenido de términos con scroll */}
          <div className="max-h-[400px] overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-6">
            <div className="prose prose-sm max-w-none">
              <h3 className="font-semibold text-slate-900">1. Aceptación de Términos</h3>
              <p className="text-slate-600">
                Al acceder y utilizar este sistema de administración, aceptas estar sujeto a estos
                términos y condiciones de uso, todas las leyes y regulaciones aplicables.
              </p>

              <h3 className="font-semibold text-slate-900 mt-4">2. Uso del Sistema</h3>
              <p className="text-slate-600">
                Este sistema está diseñado exclusivamente para uso administrativo interno. El acceso
                está restringido a personal autorizado.
              </p>

              <h3 className="font-semibold text-slate-900 mt-4">3. Confidencialidad</h3>
              <p className="text-slate-600">
                Toda la información a la que tengas acceso a través de este sistema es confidencial.
                No debes compartir, copiar o distribuir información sin autorización explícita.
              </p>

              <h3 className="font-semibold text-slate-900 mt-4">4. Responsabilidades del Usuario</h3>
              <ul className="text-slate-600">
                <li>Mantener la confidencialidad de tus credenciales de acceso</li>
                <li>Notificar inmediatamente cualquier uso no autorizado de tu cuenta</li>
                <li>Usar el sistema únicamente para fines autorizados</li>
                <li>No intentar acceder a áreas o funciones no autorizadas</li>
              </ul>

              <h3 className="font-semibold text-slate-900 mt-4">5. Protección de Datos</h3>
              <p className="text-slate-600">
                Nos comprometemos a proteger la información personal de acuerdo con las leyes de
                protección de datos aplicables. Los datos recopilados se utilizan únicamente para
                fines administrativos.
              </p>

              <h3 className="font-semibold text-slate-900 mt-4">6. Modificaciones</h3>
              <p className="text-slate-600">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Los
                cambios entrarán en vigor inmediatamente después de su publicación.
              </p>
            </div>
          </div>

          {/* Checkbox de aceptación */}
          <div className="flex items-start space-x-3 rounded-lg border border-slate-200 bg-white p-4">
            <Checkbox
              id="terms"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked === true)}
            />
            <div className="flex-1">
              <Label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                He leído y acepto los términos y condiciones
              </Label>
              <p className="text-sm text-slate-500 mt-1">
                Al aceptar, confirmas que has leído y comprendido nuestros términos
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleDecline}
              disabled={acceptTermsMutation.isPending}
            >
              Rechazar y Salir
            </Button>
            <Button
              className="flex-1"
              onClick={handleAccept}
              disabled={!accepted || acceptTermsMutation.isPending}
            >
              {acceptTermsMutation.isPending ? (
                'Procesando...'
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Aceptar y Continuar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}