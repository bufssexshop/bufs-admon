import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardPage } from "@/pages/Dashboard/DashboardPage";
import { ProductsPage } from "@/pages/Products/ProductsPage";
import { CreateProductPage } from "@/pages/Products/CreateProductPage";
import { EditProductPage } from "@/pages/Products/EditProductPage";
import { UsersPage } from "@/pages/Users/UsersPage";
import { CreateUserPage } from "@/pages/Users/CreateUserPage";
import { EditUserPage } from "@/pages/Users/EditUserPage";
import { LoginPage } from "@/pages/Auth/LoginPage";
import { TermsPage } from "@/pages/Auth/TermsPage";
import { NotFoundPage } from "@/pages/NotFound";
import { ProfilePage } from "./pages/Profile/ProfilePage";
import { CartProvider } from "./contexts/CartContext";
import { CartPage } from "./pages/Cart/CartPage";
import { MyOrdersPage } from "./pages/Orders/MyOrdersPage";
import { OrdersManagementPage } from "./pages/Orders/OrdersManagementPage";
import { OrderDetailPage } from "./pages/Orders/OrderDetailPage";
import { ProductDetailPage } from "./pages/Products/ProductDetailPage";
import { UserDetailPage } from "./pages/Users/UserDetailPage";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Ruta pública de login */}
            <Route path="/login" element={<LoginPage />} />

            {/* Ruta de términos (requiere auth pero no términos aceptados) */}
            <Route
              path="/terms"
              element={
                <ProtectedRoute>
                  <TermsPage />
                </ProtectedRoute>
              }
            />

            {/* Rutas protegidas con layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {/* Rutas accesibles para todos los usuarios autenticados */}
              <Route index element={<DashboardPage />} />
              <Route path="productos" element={<ProductsPage />} />
              <Route path="productos/:id" element={<ProductDetailPage />} />
              <Route path="perfil" element={<ProfilePage />} />

              {/* Rutas para clientes */}
              <Route path="carrito" element={<CartPage />} />
              <Route path="mis-pedidos" element={<MyOrdersPage />} />

              {/* Rutas solo para ADMIN */}
              <Route
                path="pedidos"
                element={
                  <AdminRoute>
                    <OrdersManagementPage />
                  </AdminRoute>
                }
              />
              <Route
                path="pedidos/:id"
                element={
                  <AdminRoute>
                    <OrderDetailPage />
                  </AdminRoute>
                }
              />

              <Route
                path="productos/nuevo"
                element={
                  <AdminRoute>
                    <CreateProductPage />
                  </AdminRoute>
                }
              />
              <Route
                path="productos/:id/editar"
                element={
                  <AdminRoute>
                    <EditProductPage />
                  </AdminRoute>
                }
              />
              <Route
                path="usuarios"
                element={
                  <AdminRoute>
                    <UsersPage />
                  </AdminRoute>
                }
              />
              <Route
                path="usuarios/:id"
                element={
                  <AdminRoute>
                    <UserDetailPage />
                  </AdminRoute>
                }
              />
              <Route
                path="usuarios/nuevo"
                element={
                  <AdminRoute>
                    <CreateUserPage />
                  </AdminRoute>
                }
              />
              <Route
                path="usuarios/:id/editar"
                element={
                  <AdminRoute>
                    <EditUserPage />
                  </AdminRoute>
                }
              />
            </Route>

            {/* Ruta 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;