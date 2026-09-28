import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { CompareProvider } from "@/contexts/CompareContext";
import Index from "./pages/Index";
import TestPackages from "./pages/TestPackages";
import BookTest from "./pages/BookTest";
import Reports from "./pages/Reports";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminBookings from "./pages/admin/Bookings";
import AdminLogin from "./pages/admin/Login";
import AdminTests from "./pages/admin/Tests";
import AdminPopular from "./pages/admin/Popular";
import AdminReports from "./pages/admin/Reports";
import AdminPatients from "./pages/admin/Patients";
import AdminBlog from "./pages/admin/Blog";
import AdminSettings from "./pages/admin/Settings";
import NotFound from "./pages/NotFound";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import HealthAssistant from "./components/HealthAssistant";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <CompareProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tests" element={<TestPackages />} />
            <Route path="/book-test" element={<BookTest />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/tests" element={<AdminTests />} />
            <Route path="/admin/popular" element={<AdminPopular />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/patients" element={<AdminPatients />} />
            <Route path="/admin/blog" element={<AdminBlog />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FloatingWhatsApp />
          <HealthAssistant />
        </BrowserRouter>
        </TooltipProvider>
      </CompareProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
