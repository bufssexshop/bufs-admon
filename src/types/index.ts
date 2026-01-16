export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

// ============================================
// USERS
// ============================================

export interface User {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  secondLastname: string;
  documentId: number;
  age: number;
  address: string;
  department: string;
  city: string;
  phone: number;
  email: string;
  role: 'admin' | 'client';
  active: boolean;
  termsAndConditions: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  secondLastname: string;
  documentId: string;
  age: string;
  address: string;
  department: string;
  city: string;
  phone: string;
  email: string;
  password?: string;
  role: 'admin' | 'client';
  active: boolean;
}

export const USER_ROLES = [
  { value: 'admin', label: 'Administrador' },
  { value: 'client', label: 'Cliente' },
] as const;

// ============================================
// PRODUCTS
// ============================================

export interface Product {
  _id: string;
  code: string;
  name: string;
  price: number;
  creditPrice: number;
  promotion: boolean;
  promotionValue: number;
  details: string;
  category: string;
  subcategory: string;
  secondaryCategory?: string;
  secondarySubcategory?: string;
  available: boolean;
  image: string;
  image2?: string;
  pictureId: string;
  pictureId2?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  code: string;
  name: string;
  price: string;
  creditPrice: string;
  details: string;
  category: string;
  subcategory: string;
  secondaryCategory?: string;
  secondarySubcategory?: string;
  available: boolean;
  image?: File;
  image2?: File;
}

export interface ProductsResponse {
  products: Product[];
  totalProducts: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ============================================
// CATEGORIES & SUBCATEGORIES
// ============================================

export const PRODUCT_CATEGORIES = [
  { value: 'juguetes', label: 'Juguetes' },
  { value: 'lubricantes', label: 'Lubricantes' },
  { value: 'lenceria', label: 'Lencería' },
  { value: 'fetiche', label: 'Fetiche' },
  { value: 'higiene', label: 'Higiene & protección' },
  { value: 'accesorios', label: 'Accesorios' },
  { value: 'potenciadores', label: 'Potenciadores' },
] as const;

export const SUBCATEGORIES_MAP: Record<string, { value: string; label: string }[]> = {
  juguetes: [
    { value: 'vibradores', label: 'Vibradores' },
    { value: 'masculinos', label: 'Masculinos' },
    { value: 'femeninos', label: 'Femeninos' },
    { value: 'anal', label: 'Anal' },
    { value: 'consoladores', label: 'Consoladores' },
    { value: 'anillos', label: 'Anillos vibradores' },
    { value: 'controlRemoto', label: 'Control remoto' },
    { value: 'interactivos', label: 'Interactivos' },
    { value: 'juegosMesa', label: 'Juegos de mesa' },
    { value: 'huevosBalas', label: 'Huevos/Balas vibradores' },
  ],
  lubricantes: [
    { value: 'estrechantes', label: 'Estrechantes' },
    { value: 'multiorgasmos', label: 'Multiorgasmos' },
    { value: 'masajes', label: 'Masajes' },
    { value: 'retardantes', label: 'Retardantes' },
    { value: 'anales', label: 'Anales' },
    { value: 'conSabor', label: 'Con sabor' },
    { value: 'sinSabor', label: 'Sin sabor' },
    { value: 'sexoOral', label: 'Sexo oral' },
    { value: 'aPruebaDeAgua', label: 'A prueba de agua' },
    { value: 'kitsDeLubricacion', label: 'Kits de lubricación' },
    { value: 'lubricantesEspeciales', label: 'Lubricantes especiales' },
  ],
  lenceria: [
    { value: 'disfraces', label: 'Disfraces' },
    { value: 'lenceria', label: 'Lencería' },
    { value: 'fetiche', label: 'Fetiche' },
    { value: 'calzado', label: 'Calzado' },
    { value: 'bodys', label: 'Bodys' },
    { value: 'conjuntos', label: 'Conjuntos' },
    { value: 'babydoll', label: 'Babydoll' },
    { value: 'medias', label: 'Medias' },
    { value: 'pantys', label: 'Pantys' },
    { value: 'pijamas', label: 'Pijamas' },
    { value: 'enterizos', label: 'Enterizos' },
  ],
  fetiche: [
    { value: 'juguetesParaPezones', label: 'Juguetes para pezones' },
    { value: 'mascaras', label: 'Máscaras' },
    { value: 'mordazas', label: 'Mordazas' },
    { value: 'esposas', label: 'Esposas' },
    { value: 'arnes', label: 'Arnés' },
    { value: 'nalguear', label: 'Nalguear' },
    { value: 'latigosYfustas', label: 'Látigos y fustas' },
    { value: 'collares', label: 'Collares' },
    { value: 'columpios', label: 'Columpios' },
    { value: 'antifaz', label: 'Antifaz' },
    { value: 'velas', label: 'Velas' },
    { value: 'plumas', label: 'Plumas' },
    { value: 'kitFetichista', label: 'Kit fetichista' },
  ],
  higiene: [
    { value: 'condones', label: 'Condones' },
    { value: 'aseoPersonal', label: 'Aseo personal' },
  ],
  accesorios: [
    { value: 'general', label: 'General' },
  ],
  potenciadores: [
    { value: 'masculinos', label: 'Masculinos' },
    { value: 'femeninos', label: 'Femeninos' },
  ],
};

// ============================================
// DASHBOARD
// ============================================

export interface DashboardMetrics {
  totalProducts: number;
  totalUsers: number;
  activeProducts: number;
  productsChangeWeek: number;
  usersChangeMonth: number;
}

// ============================================
// AUTH
// ============================================

export interface AuthUser {
  id: string;
  name: string;
  role: 'admin' | 'client';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
}

// ============================================
// FILTERS & PAGINATION
// ============================================

export interface ProductFilters {
  search: string;
  category: string;
  status: 'all' | 'active' | 'inactive';
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

// ============================================
// ORDERS
// ============================================
export interface OrderItem {
  productId: string;
  productName: string;
  productCode: string;
  productImage?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  notes: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  subtotal: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  notes?: string;
}

export const ORDER_STATUS = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
  processing: { label: 'En Proceso', color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completado', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-700' },
} as const;
