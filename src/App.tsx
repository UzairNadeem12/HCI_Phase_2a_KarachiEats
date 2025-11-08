import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppProvider } from "./contexts/AppContext";
import { AppSidebar } from "./components/AppSidebar";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import RestaurantDetail from "./pages/RestaurantDetail";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import OrderHistory from "./pages/OrderHistory";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <Routes>
                <Route path="/" element={<Onboarding />} />
                <Route
                  path="/*"
                  element={
                    <>
                      <AppSidebar />
                      <div className="flex-1 flex flex-col w-full">
                        <header className="h-12 flex items-center border-b bg-card sticky top-0 z-50">
                          <SidebarTrigger className="ml-2" />
                        </header>
                        <Routes>
                          <Route path="/home" element={<Home />} />
                          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route path="/tracking/:orderId" element={<OrderTracking />} />
                          <Route path="/order-history" element={<OrderHistory />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/auth" element={<Auth />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </div>
                    </>
                  }
                />
              </Routes>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
