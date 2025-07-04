
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { CartProvider } from "@/context/CartContext";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { MediaManager } from "@/components/ui/MediaManager";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Reservation from "./pages/Reservation";
import History from "./pages/History";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdminMenu from "./pages/AdminMenu";
import AdminCategories from "./pages/AdminCategories";
import AdminReservations from "./pages/AdminReservations";
import AdminPurchases from "./pages/AdminPurchases";
import AdminMenuAnalytics from "./pages/AdminMenuAnalytics";
import AdminSettings from "./pages/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes('4')) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <MediaManager />
              <Toaster />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/payment/:purchaseId" element={<Payment />} />
                  <Route path="/reservation" element={<Reservation />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/menu" element={<AdminMenu />} />
                  <Route path="/admin/categories" element={<AdminCategories />} />
                  <Route path="/admin/reservations" element={<AdminReservations />} />
                  <Route path="/admin/purchases" element={<AdminPurchases />} />
                  <Route path="/admin/analytics" element={<AdminMenuAnalytics />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
