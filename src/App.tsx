
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./components/auth/AuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Reservation from "./pages/Reservation";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import History from "./pages/History";
import Admin from "./pages/Admin";
import AdminReservations from "./pages/AdminReservations";
import AdminPurchases from "./pages/AdminPurchases";
import AdminMenu from "./pages/AdminMenu";
import AdminCategories from "./pages/AdminCategories";
import AdminSettings from "./pages/AdminSettings";
import AdminMenuAnalytics from "./pages/AdminMenuAnalytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/reservation" element={<Reservation />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment" element={<Payment />} />
              <Route 
                path="/history" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <History />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/reservations" 
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <AdminReservations />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/purchases" 
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <AdminPurchases />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/menu" 
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <AdminMenu />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/categories" 
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <AdminCategories />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <AdminSettings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/menu-analytics" 
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <AdminMenuAnalytics />
                  </ProtectedRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
