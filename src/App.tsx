import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import SendEmail from "./pages/SendEmail";
import EmailLogs from "./pages/EmailLogs";
import ApiKeys from "./pages/ApiKeys";
import Settings from "./pages/Settings";
import Infrastructure from "./pages/Infrastructure";
import Analytics from "./pages/Analytics";
import Enterprise from "./pages/Enterprise";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Contacts from "./pages/Contacts";
import Campaigns from "./pages/Campaigns";
import { UserOnboarding } from "./components/onboarding/UserOnboarding";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/welcome" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Onboarding route */}
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <UserOnboarding />
              </ProtectedRoute>
            } />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/send" element={
              <ProtectedRoute>
                <Layout>
                  <SendEmail />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/infrastructure" element={
              <ProtectedRoute>
                <Layout>
                  <Infrastructure />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Layout>
                  <Analytics />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/enterprise" element={
              <ProtectedRoute>
                <Layout>
                  <Enterprise />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/logs" element={
              <ProtectedRoute>
                <Layout>
                  <EmailLogs />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/api-keys" element={
              <ProtectedRoute>
                <Layout>
                  <ApiKeys />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/contacts" element={
              <ProtectedRoute>
                <Layout>
                  <Contacts />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/campaigns" element={
              <ProtectedRoute>
                <Layout>
                  <Campaigns />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
