import { useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsService } from '@/services/products.service';
import { usersService } from '@/services/users.service';

interface Breadcrumb {
  label: string;
  href?: string;
}

export function useBreadcrumbs(): Breadcrumb[] {
  const location = useLocation();
  const params = useParams();

  // Fetch producto si estamos en ruta de producto
  const { data: product } = useQuery({
    queryKey: ['product', params.id],
    queryFn: () => productsService.getById(params.id!),
    enabled: !!params.id && location.pathname.includes('productos'),
  });

  // Fetch usuario si estamos en ruta de usuario (solo para admin)
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersService.getAll(),
    enabled: !!params.id && location.pathname.includes('usuarios'),
  });

  const user = users?.find(u => u._id === params.id);

  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbs: Breadcrumb[] = [
    { label: 'Inicio', href: '/' }
  ];

  pathnames.forEach((pathname, index) => {
    const href = `/${pathnames.slice(0, index + 1).join('/')}`;

    // Mapeo de rutas a labels
    const labelMap: Record<string, string> = {
      'productos': 'Productos',
      'usuarios': 'Usuarios',
      'nuevo': 'Nuevo',
      'editar': 'Editar',
      'configuracion': 'Configuración',
    };

    // Si es un ID de MongoDB (24 caracteres hexadecimales)
    if (pathname.match(/^[0-9a-fA-F]{24}$/)) {
      // Si es producto, mostrar nombre
      if (location.pathname.includes('productos') && product) {
        breadcrumbs.push({
          label: product.name,
        });
      }
      // Si es usuario, mostrar nombre
      else if (location.pathname.includes('usuarios') && user) {
        breadcrumbs.push({
          label: `${user.firstName} ${user.lastName}`,
        });
      }
      // Fallback: mostrar ID acortado
      else {
        breadcrumbs.push({
          label: `${pathname.slice(0, 8)}...`,
        });
      }
    } else {
      breadcrumbs.push({
        label: labelMap[pathname] || pathname,
        href: index < pathnames.length - 1 ? href : undefined
      });
    }
  });

  return breadcrumbs;
}