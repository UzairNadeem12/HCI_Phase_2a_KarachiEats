import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppProvider } from "./contexts/AppContext";
import { VoiceProvider } from "./contexts/VoiceContext";
import { AppSidebar } from "./components/AppSidebar";
import { initializeClarity } from "./services/clarityService";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import RestaurantDetail from "./pages/RestaurantDetail";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import OrderHistory from "./pages/OrderHistory";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import VerifyOTP from "./pages/VerifyOTP";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize Clarity on app mount
    initializeClarity();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <VoiceProvider>
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
                            <header className="h-14 flex items-center gap-3 border-b bg-card sticky top-0 z-50 px-4">
                              <SidebarTrigger />
                            </header>
                            <Routes>
                              <Route path="/home" element={<Home />} />
                              <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                              <Route path="/checkout" element={<Checkout />} />
                              <Route path="/tracking/:orderId" element={<OrderTracking />} />
                              <Route path="/order-history" element={<OrderHistory />} />
                              <Route path="/profile" element={<Profile />} />
                              <Route path="/auth" element={<Auth />} />
                              <Route path="/verify-otp" element={<VerifyOTP />} />
                              <Route path="/settings" element={<Settings />} />
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
          </VoiceProvider>
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
